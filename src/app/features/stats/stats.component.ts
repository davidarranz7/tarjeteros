import { ChangeDetectionStrategy,Component,computed,inject,signal } from '@angular/core';
import { CARDS, MODULES } from '../../core/catalog';
import { ProgressService } from '../../core/progress.service';
import { HeaderComponent } from '../../shared/header.component';
import { IconComponent } from '../../shared/icon.component';
@Component({selector:'app-stats',standalone:true,imports:[HeaderComponent,IconComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./stats.component.html'})
export class StatsComponent {
 readonly progress=inject(ProgressService);readonly period=signal<7|30|0>(30);readonly moduleId=signal('all');readonly modules=MODULES.filter(m=>m.available);
 readonly events=computed(()=>{const now=Date.now();return this.progress.data().events.filter(e=> (this.moduleId()==='all'||e.moduleId===this.moduleId()) && (!this.period()||now-new Date(e.at).getTime() <= this.period()*86400000));});
 readonly stats=computed(()=>{const v=this.events();return {total:v.length,good:v.filter(e=>e.grade==='good').length,medium:v.filter(e=>e.grade==='medium').length,bad:v.filter(e=>e.grade==='bad').length};});
 readonly accuracy=computed(()=>this.stats().total?Math.round(this.stats().good/this.stats().total*100):0);
 readonly recentBars=computed(()=>{const v=this.events(); const dates=Array.from({length:14},(_,i)=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(13-i));return d.toDateString();});const counts=dates.map(key=>v.filter(e=>new Date(e.at).toDateString()===key).length);
   const max=Math.max(1,...counts);return counts.map((count,i)=>({count,height:count?Math.max(5,Math.round(count/max*100)):0,today:i===13}));
 });
 readonly weakTopics=computed(()=>{const values=new Map<string,number>();for(const c of CARDS){if(this.moduleId()!=='all'&&c.moduleId!==this.moduleId())continue;
   const g=this.progress.get(c.id).lastGrade;if(g==='bad'||g==='medium')values.set(c.topicId,(values.get(c.topicId)??0)+1);}return [...values.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5);});
 topicName(id:string){return this.modules.flatMap(m=>m.topics??[]).find(t=>t.id===id)?.name??id;}
 onModule(event:Event){this.moduleId.set((event.target as HTMLSelectElement).value);}
}

import { ChangeDetectionStrategy,Component,computed,inject } from '@angular/core';
import { Router } from '@angular/router';
import { CARDS,ACTIVE_MODULE } from '../../core/catalog';
import { PreferencesService } from '../../core/preferences.service';
import { ProgressService } from '../../core/progress.service';
import { StudyService } from '../../core/study.service';
import { StudyLauncherService } from '../../core/study-launcher.service';
import { IconComponent } from '../../shared/icon.component';
@Component({selector:'app-home',standalone:true,imports:[IconComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./home.component.html'})
export class HomeComponent {
 readonly router=inject(Router);readonly progress=inject(ProgressService);readonly study=inject(StudyService);readonly launcher=inject(StudyLauncherService);readonly prefs=inject(PreferencesService);
 readonly module=ACTIVE_MODULE;readonly total=CARDS.length;
 readonly seen=computed(()=>CARDS.filter(c=>this.progress.get(c.id).seen>0).length);
 readonly today=computed(()=>{const stamp=new Date().toDateString();return this.progress.data().events.filter(e=>new Date(e.at).toDateString()===stamp).length;});
 readonly todayGood=computed(()=>{const stamp=new Date().toDateString();return this.progress.data().events.filter(e=>new Date(e.at).toDateString()===stamp&&e.grade==='good').length;});
 readonly weeklyPrecision=computed(()=>{const arr=this.progress.recentEvents();return arr.length?Math.round(arr.filter(e=>e.grade==='good').length/arr.length*100):0;});
 readonly sessionCount=computed(()=>this.study.session()?.queue.length??0);
 readonly sessionPointer=computed(()=>Math.min((this.study.session()?.pointer??0)+1,this.study.session()?.queue.length??0));
 readonly seenPct=computed(()=>Math.round(this.seen()/Math.max(1,this.total)*100));
 readonly ring=computed(()=>`${Math.min(this.today()/this.prefs.values().goal,1)*360}deg`);
 readonly greeting=computed(()=>{const h=new Date().getHours();return h<12?'Buenos días':h<20?'Buenas tardes':'Buenas noches';});
 continue(){const state=this.study.session();if(state && state.pointer<state.queue.length){this.study.resume();this.router.navigateByUrl('/estudiar');}else{this.launcher.open('01','all');}}
 openModule(){this.router.navigateByUrl('/modulos/01/temas');}
}

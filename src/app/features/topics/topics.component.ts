import { ChangeDetectionStrategy,Component,computed,inject } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ACTIVE_MODULE,CARDS,MODULES,topicsForModule } from '../../core/catalog';
import { ProgressService } from '../../core/progress.service';
import { StudyLauncherService } from '../../core/study-launcher.service';
import { HeaderComponent } from '../../shared/header.component';
import { IconComponent } from '../../shared/icon.component';
@Component({selector:'app-topics',standalone:true,imports:[HeaderComponent,IconComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./topics.component.html'})
export class TopicsComponent {
 readonly router=inject(Router); readonly route=inject(ActivatedRoute);readonly progress=inject(ProgressService);readonly launcher=inject(StudyLauncherService);
 readonly id=this.route.snapshot.paramMap.get('id')??'01';readonly all=this.id==='all';
 readonly module=MODULES.find(m=>m.id===this.id)??ACTIVE_MODULE;
 readonly cards=CARDS.filter(c=>this.all||c.moduleId===this.id);readonly topics=topicsForModule(this.id);
 readonly seen=computed(()=>this.cards.filter(c=>this.progress.get(c.id).seen>0).length);
 readonly percent=computed(()=>Math.round(this.seen()*100/Math.max(1,this.cards.length)));
 count(topicId:string){return this.cards.filter(c=>c.topicId===topicId).length;}
 seenTopic(topicId:string){return this.cards.filter(c=>c.topicId===topicId&&this.progress.get(c.id).seen>0).length;}
 open(topicId='all',mode:'progressive'|'weak'='progressive'){this.launcher.open(this.all?'all':this.id,topicId,mode);}
}

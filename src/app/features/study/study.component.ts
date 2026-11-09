import { ChangeDetectionStrategy,Component,computed,inject,signal } from '@angular/core';
import { Router } from '@angular/router';
import { DIFFICULTY_LABEL, GRADE_LABEL, Grade } from '../../core/models';
import { ProgressService } from '../../core/progress.service';
import { StudyService } from '../../core/study.service';
import { StudyLauncherService } from '../../core/study-launcher.service';
import { CodeViewerComponent } from '../../shared/code-viewer.component';
import { IconComponent } from '../../shared/icon.component';
import { TopicLabelPipe } from '../../shared/topic-label.pipe';
@Component({selector:'app-study',standalone:true,imports:[IconComponent,CodeViewerComponent,TopicLabelPipe],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./study.component.html'})
export class StudyComponent {
 readonly router=inject(Router);readonly study=inject(StudyService);readonly progress=inject(ProgressService);readonly launcher=inject(StudyLauncherService);
 readonly level=DIFFICULTY_LABEL;readonly showDraft=signal(false);
 readonly position=computed(()=>Math.min((this.study.session()?.pointer??0)+1,this.study.session()?.queue.length??0));
 readonly total=computed(()=>this.study.session()?.queue.length??0);
 readonly progressPct=computed(()=>Math.round(this.position()*100/Math.max(1,this.total())));
 readonly paused=computed(()=>!!this.study.session()?.paused);
 rate(g:Grade){this.study.rate(g);this.showDraft.set(false);}
 home(){this.study.pause();this.router.navigateByUrl('/inicio');}
 end(){this.study.clear();this.router.navigateByUrl('/progreso');}
 newSession(){this.study.clear();this.router.navigateByUrl('/modulos');}
 changeDraft(event:Event){this.study.setDraft((event.target as HTMLTextAreaElement).value);}
}

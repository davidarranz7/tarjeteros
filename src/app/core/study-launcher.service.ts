import { Injectable,signal,inject } from '@angular/core';
import { Router } from '@angular/router';
import { StudyFilters,StudyMode } from './models';
import { StudyService } from './study.service';
@Injectable({providedIn:'root'}) export class StudyLauncherService {
 private readonly router=inject(Router);private readonly study=inject(StudyService);
 readonly opened=signal(false); readonly moduleId=signal('01');readonly topicId=signal('all');readonly size=signal(10);
 readonly mode=signal<StudyMode>('progressive'); readonly difficulty=signal<StudyFilters['difficulty']>('all');readonly error=signal('');
 open(moduleId='01',topicId='all',mode:StudyMode='progressive'){
  this.moduleId.set(moduleId);this.topicId.set(topicId);this.mode.set(mode);this.error.set('');this.opened.set(true);
 }
 close(){this.opened.set(false);}
 start(){const filters:StudyFilters={moduleId:this.moduleId(),topicId:this.topicId(),count:this.size(),mode:this.mode(),kind:'all',difficulty:this.difficulty()};
  const count=this.study.start(filters);if(!count){this.error.set('No hay preguntas para esos filtros. Prueba otra selección.');return;}
  this.close();this.router.navigateByUrl('/estudiar');
 }
}

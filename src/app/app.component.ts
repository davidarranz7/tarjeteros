import { ChangeDetectionStrategy,Component,computed,inject } from '@angular/core';
import { NavigationEnd,Router,RouterLink,RouterLinkActive,RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter,map,startWith } from 'rxjs';
import { MODULES,TOPICS } from './core/catalog';
import { ProgressService } from './core/progress.service';
import { StudyLauncherService } from './core/study-launcher.service';
import { IconComponent,IconName } from './shared/icon.component';
@Component({selector:'app-root',standalone:true,imports:[RouterLink,RouterLinkActive,RouterOutlet,IconComponent],changeDetection:ChangeDetectionStrategy.OnPush,
 templateUrl:'./app.component.html'})
export class AppComponent {
 readonly router=inject(Router);readonly progress=inject(ProgressService);readonly launcher=inject(StudyLauncherService);
 readonly modules=MODULES.filter(m=>m.available);readonly topics=TOPICS;
 readonly navItems:{url:string;label:string;icon:IconName}[]=[{url:'/inicio',label:'Inicio',icon:'home'},{url:'/modulos',label:'Módulos',icon:'layers'},{url:'/progreso',label:'Progreso',icon:'chart'},{url:'/ajustes',label:'Ajustes',icon:'settings'}];
 readonly currentPath=toSignal(this.router.events.pipe(filter((event:unknown):event is NavigationEnd => event instanceof NavigationEnd),map((event:NavigationEnd)=>event.urlAfterRedirects),startWith(this.router.url)),{initialValue:this.router.url});
 readonly studyScreen=computed(()=>this.currentPath().startsWith('/estudiar'));
 setModule(id:string){this.launcher.moduleId.set(id);this.launcher.topicId.set('all');}
}

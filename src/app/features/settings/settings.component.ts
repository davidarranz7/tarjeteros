import { ChangeDetectionStrategy,Component,inject,signal } from '@angular/core';
import { PreferencesService } from '../../core/preferences.service';
import { ProgressService } from '../../core/progress.service';
import { StudyService } from '../../core/study.service';
import { HeaderComponent } from '../../shared/header.component';
import { IconComponent } from '../../shared/icon.component';
@Component({selector:'app-settings',standalone:true,imports:[HeaderComponent,IconComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./settings.component.html'})
export class SettingsComponent {
 readonly progress=inject(ProgressService);readonly study=inject(StudyService);readonly prefs=inject(PreferencesService);readonly notice=signal('');
 setGoal(event:Event){this.prefs.setGoal(Number((event.target as HTMLSelectElement).value));}
 reset(){if(!confirm('¿Seguro que quieres borrar todas las respuestas y estadísticas de este navegador?'))return;
   this.progress.reset();this.study.clear();this.notice.set('Progreso reiniciado.');}
 async import(event:Event){const input=event.target as HTMLInputElement;const file=input.files?.[0];if(!file)return;
  try{await this.progress.importFile(file);this.notice.set('Progreso importado correctamente.');}
  catch(e){this.notice.set(e instanceof Error?e.message:'No se pudo importar.');}finally{input.value='';}}
}

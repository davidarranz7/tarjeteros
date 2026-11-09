import { ChangeDetectionStrategy,Component,inject } from '@angular/core';
import { Router } from '@angular/router';
import { MODULES } from '../../core/catalog';
import { IconComponent } from '../../shared/icon.component';
import { HeaderComponent } from '../../shared/header.component';
@Component({selector:'app-modules',standalone:true,imports:[IconComponent,HeaderComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./modules.component.html'})
export class ModulesComponent { readonly router=inject(Router);readonly modules=MODULES;
 open(id:string){this.router.navigateByUrl('/modulos/'+id+'/temas');}
}

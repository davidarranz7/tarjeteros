import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from './icon.component';
@Component({selector:'app-header',standalone:true,imports:[IconComponent],changeDetection:ChangeDetectionStrategy.OnPush,
 template:`<header class="topbar"><div class="topbar-side">
 @if(back){<button type="button" class="icon-button" (click)="goBack()" aria-label="Volver"><app-icon name="arrow"/></button>}
 </div><h1>{{title}}</h1><div class="topbar-side right"></div></header>`})
export class HeaderComponent { @Input({required:true}) title!:string;@Input() back='';private readonly router=inject(Router);goBack(){this.router.navigateByUrl(this.back || '/inicio');} }

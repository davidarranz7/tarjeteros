import { Routes } from '@angular/router';
export const routes: Routes = [
  {path:'', pathMatch:'full',redirectTo:'inicio'},
  {path:'inicio', title:'Inicio · Plexus Backend Trainer', loadComponent:()=>import('./features/home/home.component').then(m=>m.HomeComponent)},
  {path:'modulos', title:'Módulos · Plexus Backend Trainer', loadComponent:()=>import('./features/modules/modules.component').then(m=>m.ModulesComponent)},
  {path:'modulos/:id/temas', title:'Temas · Plexus Backend Trainer', loadComponent:()=>import('./features/topics/topics.component').then(m=>m.TopicsComponent)},
  {path:'estudiar', title:'Estudiar · Plexus Backend Trainer', loadComponent:()=>import('./features/study/study.component').then(m=>m.StudyComponent)},
  {path:'progreso', title:'Progreso · Plexus Backend Trainer', loadComponent:()=>import('./features/stats/stats.component').then(m=>m.StatsComponent)},
  {path:'ajustes', title:'Ajustes · Plexus Backend Trainer', loadComponent:()=>import('./features/settings/settings.component').then(m=>m.SettingsComponent)},
  {path:'**',redirectTo:'inicio'}
];

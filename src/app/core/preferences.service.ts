import { Injectable,signal,effect } from '@angular/core';
interface Preferences { goal: number; priority: boolean; }
function read():Preferences { try { const value=JSON.parse(localStorage.getItem('plexus-figma-preferences:v1')||'{}');return {goal:[5,10,20].includes(value.goal)?value.goal:10,priority:value.priority!==false}; }catch{return {goal:10,priority:true};} }
@Injectable({providedIn:'root'}) export class PreferencesService {
 readonly values=signal<Preferences>(read());
 constructor(){effect(()=>{try{localStorage.setItem('plexus-figma-preferences:v1',JSON.stringify(this.values()));}catch{}});}
 setGoal(goal:number){if([5,10,20].includes(goal))this.values.update(v=>({...v,goal}));}
 setPriority(priority:boolean){this.values.update(v=>({...v,priority}));}
}

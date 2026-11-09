// Tooling-only shim for offline syntax/type smoke tests when Angular packages cannot be fetched.
// Not part of the shipped application and never used by Angular builds.
declare module '@angular/core' {
  export type Signal<T> = (()=>T);
  export type WritableSignal<T> = Signal<T> & { set(v:T):void; update(fn:(v:T)=>T):void };
  export function signal<T>(v:T):WritableSignal<T>;
  export class DestroyRef {onDestroy(fn:()=>void):void}
  export function computed<T>(fn:()=>T):Signal<T>;
  export function inject<T>(token:{new(...args:any[]):T}):T;
  export function Component(v:any):ClassDecorator;
  export function Input(v?:any):PropertyDecorator;
  export function Injectable(v:any):ClassDecorator;
  export function Pipe(v:any):ClassDecorator;
  export interface PipeTransform { transform(...args:any[]):any; }
  export function effect(fn:()=>void):void;
  export enum ChangeDetectionStrategy { OnPush }
  export interface ApplicationConfig {providers:any[]}
  export function isDevMode(): boolean;
  export function provideZonelessChangeDetection(): any;
}
declare module '@angular/platform-browser' { export function bootstrapApplication(root:any,config:any):Promise<any>; }
declare module '@angular/router' {
 export class Router {url:string; events:any; navigateByUrl(url:string):Promise<boolean>}
 export class NavigationEnd {urlAfterRedirects:string;}
 export class ActivatedRoute { snapshot: {queryParamMap:{get(key:string):string|null},paramMap:{get(key:string):string|null}}}
 export const RouterLink:any;export const RouterLinkActive:any;export const RouterOutlet:any;
 export type Routes=any[];
 export function provideRouter(routes:any,settings?:any):any;
 export function withInMemoryScrolling(value:any):any;
}
declare module '@angular/service-worker' {export function provideServiceWorker(name:string,options:any):any;}

declare module '@angular/core/rxjs-interop' { export function toSignal<T>(stream:any,opts:{initialValue:T}):()=>T; }
declare module 'rxjs' { export function filter<T>(f:(v:T)=>boolean):any; export function map<T>(f:(v:T)=>any):any; export function startWith(v:any):any; }

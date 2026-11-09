import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type IconName = 'home'|'layers'|'chart'|'settings'|'chevron'|'arrow'|'play'|'pause'|'lock'|'check'|'code'|'git'|'moon'|'sun'|'refresh'|'trash'|'close';
@Component({selector:'app-icon',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,
  template:`<svg [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  @switch(name){
    @case('home'){<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/>}
    @case('layers'){<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>}
    @case('chart'){<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>}
    @case('settings'){<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>}
    @case('chevron'){<path d="m9 18 6-6-6-6"/>}
    @case('arrow'){<path d="m15 18-6-6 6-6"/><path d="M9 12h12"/>}
    @case('play'){<path d="m8 5 11 7-11 7V5Z"/>}
    @case('pause'){<path d="M9 5v14"/><path d="M15 5v14"/>}
    @case('lock'){<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>}
    @case('check'){<path d="m5 12 4 4L19 6"/>}
    @case('code'){<path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 5-4 14"/>}
    @case('git'){<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><path d="M6 8v8"/><path d="M8 6h8"/><path d="M18 8c0 5-4 5-8 5H6"/>}
    @case('moon'){<path d="M20.5 14.2A8 8 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/>}
    @case('sun'){<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>}
    @case('refresh'){<path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M6.1 8a7 7 0 0 1 11.7-2L20 8"/><path d="m4 16 2.2 2a7 7 0 0 0 11.7-2"/>}
    @case('trash'){<path d="M4 7h16"/><path d="M9 3h6l1 4H8l1-4Z"/><path d="m6 7 1 14h10l1-14"/><path d="M10 11v6M14 11v6"/>}
    @case('close'){<path d="m6 6 12 12"/><path d="m18 6-12 12"/>}
  }
</svg>`})
export class IconComponent { @Input({required:true}) name!:IconName; @Input() size=21; }

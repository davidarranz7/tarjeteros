import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { highlightCode } from './syntax-highlight';
@Component({selector:'app-code-viewer',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,template:`
<section class="code-viewer" aria-label="Fragmento de código">
  <div class="code-toolbar"><span>{{language === 'bash' ? 'Terminal / Git' : language === 'text' ? 'Salida' : 'Java'}}</span>
  <button type="button" (click)="copy()">{{copied() ? 'Copiado' : 'Copiar'}}</button></div>
  <pre><code [innerHTML]="highlighted"></code></pre>
</section>`})
export class CodeViewerComponent {
 @Input() code=''; @Input() language:'java'|'bash'|'text'='java'; readonly copied=signal(false);
 get highlighted(){return highlightCode(this.code,this.language)}
 async copy(){try{await navigator.clipboard.writeText(this.code);this.copied.set(true)}catch{this.copied.set(false)}}
}

import { Pipe,PipeTransform } from '@angular/core';
import { topicName } from '../core/catalog';
@Pipe({name:'topicLabel',standalone:true,pure:true}) export class TopicLabelPipe implements PipeTransform{transform(id:string){return topicName(id);}}

import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'resumir',
    standalone: false
})
export class ResumirPipe implements PipeTransform{

    transform(valor: string, args?:any){
        if(!valor){
            return null;
        }

        return valor.substr(0,125)+'.';

    }
}
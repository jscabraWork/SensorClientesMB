import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'resumir2',
    standalone: true
})
export class ResumirPipe2 implements PipeTransform{

    transform(valor: string, args?:any){
        if(!valor){
            return null;
        }

        return valor.substr(0,71);

    }
}
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'resumir4'
})
export class ResumirPipe4 implements PipeTransform{

    transform(valor: string, args?:any){
        if(!valor){
            return null;
        }

        return valor.substr(0,128)+'.';

    }
}
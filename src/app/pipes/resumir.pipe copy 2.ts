import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'resumir3'
})
export class ResumirPipe3 implements PipeTransform{

    transform(valor: string, args?:any){
        if(!valor){
            return null;
        }

        return valor.substr(0,128)+'.';

    }
}
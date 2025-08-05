import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'booleans'
})
export class BooleanPipe implements PipeTransform{

    transform(valor: boolean, args?:any){
        if(!valor){
            return 'No'
        }
        if(valor){
            return 'Si'
        }

        

    }
}
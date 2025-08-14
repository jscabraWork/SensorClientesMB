import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'horas2',
    standalone: true
})
export class HoraPipe2 implements PipeTransform{

    transform(valor: string, args?:any){
  
        
        if(valor){
            if(valor.slice(0,2)=='12'){
                return '12' +':' +valor.slice(3,5) +' PM';
            }
            if(valor.slice(0,2)=='13'){
                return '1' +':' +valor.slice(3,5) +' PM';
            }
            if(valor.slice(0,2)=='14'){
                return '2' +':' +valor.slice(3,5) +' PM';
            }
            if(valor.slice(0,2)=='15'){
                return '3' +':' +valor.slice(3,5) +' PM';
            }
            if(valor.slice(0,2)=='16'){
                return '4' +':' +valor.slice(3,5) +' PM';
            }
            if(valor.slice(0,2)=='17'){
                return '5' +':' +valor.slice(3,5) +' PM';
            }
            if(valor.slice(0,2)=='18'){
                return '6' +':' +valor.slice(3,5) +' PM';
            }
            if(valor.slice(0,2)=='19'){
                return '7' +':' +valor.slice(3,5) +' PM';
            }
            if(valor.slice(0,2)=='20'){
                return '8' +':' +valor.slice(3,5) +' PM';
            }
            if(valor.slice(0,2)=='21'){
                return '9' +':' +valor.slice(3,5) +' PM';
            }
            if(valor.slice(0,2)=='22'){
                return '10' +':' +valor.slice(3,5) +' PM';
            }
            if(valor.slice(0,2)=='23'){
                return '11' +':' +valor.slice(3,5) +' PM';
            }
            if(valor.slice(0,2)=='00'){
                return '12' +':' +valor.slice(3,5) +' AM';
            }
    
            if(valor.slice(0,2)=='01'){
                return '1' +':' +valor.slice(3,5) +' AM';
            }
    
            if(valor.slice(0,2)=='02'){
                return '2' +':' +valor.slice(3,5) +' AM';
            }
            if(valor.slice(0,2)=='03'){
                return '3' +':' +valor.slice(3,5) +' AM';
            }
            if(valor.slice(0,2)=='04'){
                return '4' +':' +valor.slice(3,5) +' AM';
            }
            if(valor.slice(0,2)=='05'){
                return '5' +':' +valor.slice(3,5) +' AM';
            }
            if(valor.slice(0,2)=='06'){
                return '6' +':' +valor.slice(3,5) +' AM';
            }
            if(valor.slice(0,2)=='07'){
                return '7' +':' +valor.slice(3,5) +' AM';
            }
            if(valor.slice(0,2)=='08'){
                return '8' +':' +valor.slice(3,5) +' AM';
            }
            if(valor.slice(0,2)=='09'){
                return '9' +':' +valor.slice(3,5) +' AM';
            }
            if(valor.slice(0,2)=='10'){
                return '10' +':' +valor.slice(3,5) +' AM';
            }
            if(valor.slice(0,2)=='11'){
                return '11' +':' +valor.slice(3,5) +' AM';
            }
            if(valor=='Por confirmar'){
                return valor
            }
            return valor; // valor por defecto si no coincide con ningún caso
        }
        else
        {
            return 'Por confirmar'
        }
        
        

    }
}
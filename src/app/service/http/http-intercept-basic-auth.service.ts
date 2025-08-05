import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptBasicAuthService implements HttpInterceptor{

  constructor() { }



  intercept(request: HttpRequest<any>, next: HttpHandler){

    let Username ='29954a58112bdcf4b08fc169523ad4b6';
    let Password ='b282c95144f8093af698996bf0927ebe';
    let basicAuthHeaderString ='Basic ' + window.btoa(Username + ':' + Password);
    request =request.clone(
     { setHeaders:
      {
        Authorization:basicAuthHeaderString
      }
    })

    return next.handle(request);
    
  }
}

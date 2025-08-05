import { HardcodedAutheticationService } from './hardcoded-authetication.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardUsuarioService {

  constructor(private autenticador: HardcodedAutheticationService, private route:Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if(this.autenticador.usuarioLoggin()){
      return true;
    }
    else{
      this.route.navigate(['login']);
      return false;
    }
    
  }
}

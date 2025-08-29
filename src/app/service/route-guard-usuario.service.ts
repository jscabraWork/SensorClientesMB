import { HardcodedAutheticationService } from './hardcoded-authetication.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './seguridad/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardUsuarioService {

  constructor(private autenticador: HardcodedAutheticationService, private route:Router, private authService: AuthService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if(this.autenticador.usuarioLoggin()){
      return true;
    }
    else{
      // Guardar la URL actual antes de redirigir al login
      this.authService.setRedirectUrl(state.url);
      this.route.navigate(['login']);
      return false;
    }
    
  }
}

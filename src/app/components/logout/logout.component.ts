import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HardcodedAutheticationService } from '../../service/hardcoded-authetication.service';
import { AuthService } from '../../service/seguridad/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {

  constructor(
    private autenticacion: HardcodedAutheticationService, 
    public auth: AuthService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.autenticacion.logout();
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}

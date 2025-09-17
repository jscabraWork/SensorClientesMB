import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { WhatsappButtonComponent } from './shared/whatsapp-button/whatsapp-button.component';
import { GoogleAuthHandlerService } from './service/google-auth-handler.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent, FooterComponent, WhatsappButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  visibleMenuResponsive: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private googleOAuthHandler: GoogleAuthHandlerService
  ) { }

  ngOnInit(): void {
    // Detectar tokens de Google OAuth desde cualquier URL
    this.googleOAuthHandler.handleOAuthTokensFromUrl(this.route);
  }
  
  actualizarValor(evento: boolean) {
    this.visibleMenuResponsive = evento;
  }

}

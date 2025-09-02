import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { WhatsappButtonComponent } from './shared/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent, FooterComponent, WhatsappButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  visibleMenuResponsive: boolean = false;

  actualizarValor(evento: boolean) {
    this.visibleMenuResponsive = evento;
  }

  @HostListener('window:scroll', ['$event'])
  onScrollEvent(event: any) {
    if (this.visibleMenuResponsive && window.innerWidth < 920) {
      window.scrollTo(0, 0); // Deshabilitar scroll cuando el menú está activo
    }
  }
}

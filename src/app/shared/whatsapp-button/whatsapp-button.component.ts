import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-button.component.html',
  styleUrl: './whatsapp-button.component.scss'
})
export class WhatsappButtonComponent {
  
  whatsappUrl = 'https://api.whatsapp.com/send/?phone=%2B573219187944&text&type=phone_number&app_absent=0';

  openWhatsApp(): void {
    window.open(this.whatsappUrl, '_blank');
  }
}

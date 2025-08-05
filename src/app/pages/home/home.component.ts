import { Component } from '@angular/core';
import { EventosComponent } from '../../components/eventos/eventos.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [EventosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}

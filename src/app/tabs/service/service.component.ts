import { Component } from '@angular/core';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {
  openWhatsApp(): void {
    window.open('https://wa.me/9943465863', '_self');
  }
}

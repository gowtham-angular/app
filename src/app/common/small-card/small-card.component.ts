import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-small-card',
  templateUrl: './small-card.component.html',
  styleUrl: './small-card.component.scss'
})
export class SmallCardComponent {
  @Input() imageUrl!: string;
  @Input() title!: string;
  @Input() backgroundColor!: string;
}

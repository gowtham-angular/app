import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-title-header',
  templateUrl: './title-header.component.html',
  styleUrl: './title-header.component.scss'
})
export class TitleHeaderComponent {
  @Input() title!: string;
  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }
}

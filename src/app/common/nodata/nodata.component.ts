import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nodata',
  templateUrl: './nodata.component.html',
  styleUrl: './nodata.component.scss'
})
export class NodataComponent {
  @Input() imageUrl!: string;
  @Input() title!: string;
}

import { Component, Input } from '@angular/core';
import { UtilsService } from '../../service/utils.service';

@Component({
  selector: 'app-price-card',
  templateUrl: './price-card.component.html',
  styleUrl: './price-card.component.scss'
})
export class PriceCardComponent {
  @Input() user!: any;
  count!: number;
  profit!: number;
  constructor(private utilService: UtilsService) {

    this.utilService.taskCount.subscribe((data: number) => {
      this.count = data;
    });
  }
}

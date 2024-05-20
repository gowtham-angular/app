import { Component, Input } from '@angular/core';
import { UtilsService } from '../../service/utils.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-price-card',
  templateUrl: './price-card.component.html',
  styleUrl: './price-card.component.scss'
})
export class PriceCardComponent {
  @Input() user!: any;
  count!: number;
  profit!: number;
  constructor(private utilService: UtilsService, private router: Router) {

    this.utilService.taskCount.subscribe((data: number) => {
      this.count = data;
    });
  }

  withdraw() {
    console.log("asd");
    this.router.navigate(['/withdrawAmount'])
  }
}

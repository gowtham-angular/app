import { Component, Input } from '@angular/core';
import { UtilsService } from '../../service/utils.service';

@Component({
  selector: 'app-mission-card',
  templateUrl: './mission-card.component.html',
  styleUrl: './mission-card.component.scss'
})
export class MissionCardComponent {
  @Input() user!: any;
  count!: number;
  profit!: number;
  constructor(private utilService: UtilsService) {

    this.utilService.taskCount.subscribe((data: number) => {
      this.count = data;
    });
  }
}

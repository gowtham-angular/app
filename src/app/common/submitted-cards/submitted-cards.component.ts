import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-submitted-cards',
  templateUrl: './submitted-cards.component.html',
  styleUrl: './submitted-cards.component.scss'
})
export class SubmittedCardsComponent {
@Input() user:any;
@Input() submittedData: any;
}

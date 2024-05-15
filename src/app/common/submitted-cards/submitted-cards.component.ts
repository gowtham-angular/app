import { Component, Input } from '@angular/core';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-submitted-cards',
  templateUrl: './submitted-cards.component.html',
  styleUrl: './submitted-cards.component.scss'
})
export class SubmittedCardsComponent {
  @Input() user: any;
  @Input() submittedData: any;

  constructor(private fireStore: AngularFirestore){}

  
  }

 

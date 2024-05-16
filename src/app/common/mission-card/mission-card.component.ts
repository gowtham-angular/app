import { Component, Input } from '@angular/core';
import { UtilsService } from '../../service/utils.service';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-mission-card',
  templateUrl: './mission-card.component.html',
  styleUrl: './mission-card.component.scss'
})
export class MissionCardComponent {
  @Input() user!: any;
  count!: number;
  prfit!: number;
  isMissionComplete!: boolean;
  constructor(private utilService: UtilsService,
    private userService: UserService,
    private auth: AngularFireAuth
  ) {
    this.userService.getUserData().subscribe((users: any) => {
      this.getAuthenticatedUser(users);
    })

    this.utilService.isMissionComplete.subscribe((flag: boolean) => {
      this.isMissionComplete = flag;
    })
  }

  getAuthenticatedUser(users: any) {
    try {
      this.auth.user.subscribe((user: any) => {
        if (user) {
          const email = user.email;
          const filteredUser = this.userService.filterUsersByEmail(users, email);
          this.user = filteredUser[0];
          this.utilService.getCount(this.user?.id).subscribe((data: any) => {
            if (data) {
              this.count = data.count;
            }
          })
        }
      });

    } catch (error) {
    }
  }

  
}

import { Component, Input } from '@angular/core';
import { UtilsService } from '../../service/utils.service';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input() user!: any;
  count!: number;
  profit!: number;
  constructor(private utilService: UtilsService,
    private userService: UserService,
    private auth: AngularFireAuth
  ) {
    this.userService.getUserData().subscribe((users: any) => {
      this.getAuthenticatedUser(users);
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

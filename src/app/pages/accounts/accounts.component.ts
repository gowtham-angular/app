import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {
  user: any;
  constructor( private userService: UserService, private auth: AngularFireAuth) {

    this.userService.getUserData().subscribe((users: any) => {
      this.getAuthenticatedUser(users);
    });
  }


  getAuthenticatedUser(users: any) {
    try {
      this.auth.user.subscribe((user: any) => {
        console.log('dataasas', user);
        if (user) {
          const email = user.email;
          const filteredUser = this.userService.filterUsersByEmail(users, email);
          console.log(filteredUser);
          this.user = filteredUser[0];
        }
      });

    } catch (error) {

    }

  }

  logout() {
    this.userService.signout();
  }
}

import { Component } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { Observable, take } from 'rxjs';
import { DataLayerService } from '../../data-layer.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilsService } from '../../service/utils.service';
import { DataStorageService } from '../../data-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  firstRow: any = [];
  secondRow: any = [];
  products: any = [];
  user: any;
  count: any;

  cards = [
    { imageUrl: '../../../assets/reading.png', title: 'Reading Mall', backgroundColor: '#0f3cc9', link: '/orders' },
    { imageUrl: '../../../assets/invite.png', title: 'Invite Friends', backgroundColor: '#005028', link: '/service' },
  ];

  banner = { imageUrl: '../../../assets/apple-iphone.jpg', title: ' ', backgroundColor: '#004fac' };
  subscription = { imageUrl: '../../../assets/dollar-coins.png', title: 'Subscription Membership', backgroundColor: '#122caf' };


  constructor(
    private _productService: ProductsService,
    private dataLayerService: DataLayerService,
    private auth: AngularFireAuth,
    private utilService: UtilsService,
    private dataStorageService: DataStorageService
  ) {
console.log("---construtore");
    this.dataLayerService.getUserData().subscribe((users: any) => {
      console.log("---construtore", users);
      this.getAuthenticatedUser(users);
    })
    this.firstRow = [
      {
        img: '../../../assets/faq-chat.png',
        title: 'Faq',
        subTitle: '',
        link: '/faq'
      },
      {
        img: '../../../assets/megaphone.png',
        title: 'Announcement',
        subTitle: '',
        link: '/announcement'
      },
      {
        img: '../../../assets/money-bag.png',
        title: 'Deposit',
        subTitle: '',
        link: '/deposit'
      },
      {
        img: '../../../assets/suitcase-with-cash.png',
        title: 'Withdraw',
        subTitle: '',
        link: '/withdraw'
      },
    ];

    this.secondRow = [
      {
        img: '../../../assets/about_us.png',
        title: 'About us',
        subTitle: 'Experienced',
        link: '/aboutus'
      },
      {
        img: '../../../assets/partner.png',
        title: 'Partners',
        subTitle: 'Welcome',
        link: '/partners'
      },
      {
        img: '../../../assets/terms.png',
        title: 'Terms',
        subTitle: 'Supervision',
        link: '/terms'
      },
      {
        img: '../../../assets/orders.png',
        title: 'Agreement',
        subTitle: 'Protect rights',
        link: '/agreement'
      },
    ]
    this.getProducts();
  }
  getProducts() {
    this._productService.getAllProducts().subscribe((data: any) => {
      if (data) {
        this.products = data.filter((item: any) => item.level === 'products');
      }
    })
  }

  getAuthenticatedUser(users: any) {
    console.log("asdasdasdasdasdasd", users)
    try {
      this.auth.user.subscribe((user: any) => {
        if (user) {
          const email = user.email;
          const filteredUser = this.dataLayerService.filterUsersByEmail(users, email);
          this.user = filteredUser[0];
          this.utilService.getCount(this.user?.id).subscribe((data: any) => {
            if (data) {
              this.count = data.count | 0;
              // localStorage.clear();
              // localStorage.setItem('user', JSON.stringify(this.user));
              // localStorage.setItem('count', this.count);
              // this.dataStorageService.eraseCookie("user");
              // this.dataStorageService.eraseCookie("count");
              console.log(this.user);
              console.log(this.user);
              this.dataStorageService.setCookie("user", JSON.stringify(this.user), 60);
              this.dataStorageService.setCookie("count", this.count, 60);
              console.log("cookie tested");
            }
          })
        }
      });
    } catch (error) {
    }
  }


}

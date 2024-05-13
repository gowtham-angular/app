import { Component } from '@angular/core';
import { ProductsService } from '../../service/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  firstRow: any = [];
  secondRow: any = [];
  products: any = [];

  cards = [
    { imageUrl: '../../../assets/reading.png', title: 'Reading Mall', backgroundColor: '#007bff', link: '/orders' },
    { imageUrl: '../../../assets/invite.png', title: 'Invite Friends', backgroundColor: '#28a745', link: '/orders' },
  ];

  banner = { imageUrl: '../../../assets/money-bag.png', title: 'Recharge Benefits', backgroundColor: '#004fac' };
  subscription = { imageUrl: '../../../assets/dollar-coins.png', title: 'Subscription Membership', backgroundColor: '#122caf' };

 
  constructor(private _productService: ProductsService) {
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
      this.products = data;
    })
  }
}

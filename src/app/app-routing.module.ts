import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from './pages/signin/signin.component';
import { authGuard } from './auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { FaqComponent } from './pages/faq/faq.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';
import { AboutsComponent } from './pages/abouts/abouts.component';
import { PartnersComponent } from './pages/partners/partners.component';
import { TermsComponent } from './pages/terms/terms.component';
import { AgreementComponent } from './pages/agreement/agreement.component';
import { AnnouncementComponent } from './pages/announcement/announcement.component';
import { ServiceComponent } from './tabs/service/service.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { AccountsComponent } from './pages/accounts/accounts.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent, canActivate: [authGuard] },
  { path: 'signin', component: SigninComponent },
  { path: 'layout', component: LayoutComponent },
  { path: 'home', component: HomeComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'announcement', component: AnnouncementComponent },
  { path: 'deposit', component: DepositComponent },
  { path: 'withdraw', component: WithdrawComponent },
  { path: 'aboutus', component: AboutsComponent },
  { path: 'partners', component: PartnersComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'agreement', component: AgreementComponent },
  { path: '', redirectTo: '/signup', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

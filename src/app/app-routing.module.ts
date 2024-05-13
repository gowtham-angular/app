import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from './pages/signin/signin.component';
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
import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
  { path: 'signup', component: SignupComponent, },
  { path: 'signin', component: SigninComponent },
  { path: 'layout', component: LayoutComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'service', component: ServiceComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
  { path: 'faq', component: FaqComponent, canActivate: [AuthGuard] },
  { path: 'announcement', component: AnnouncementComponent, canActivate: [AuthGuard] },
  { path: 'deposit', component: DepositComponent, canActivate: [AuthGuard] },
  { path: 'withdraw', component: WithdrawComponent, canActivate: [AuthGuard] },
  { path: 'aboutus', component: AboutsComponent, canActivate: [AuthGuard] },
  { path: 'partners', component: PartnersComponent, canActivate: [AuthGuard] },
  { path: 'terms', component: TermsComponent, canActivate: [AuthGuard] },
  { path: 'agreement', component: AgreementComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/signup', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

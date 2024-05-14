import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { MaterialModule } from '../material/material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AppComponent } from './app.component';
import { environment } from '../../environment.prod';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from './pages/signin/signin.component';
import { HomeComponent } from './pages/home/home.component';
import { TabsComponent } from './tabs/tabs.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpsInterceptor } from './service/https.interceptor';
import { LayoutComponent } from './pages/layout/layout.component';
import { CarouselComponent } from './common/carousel/carousel.component';
import { CardsComponent } from './common/cards/cards.component';
import { FaqComponent } from './pages/faq/faq.component';
import { TitleHeaderComponent } from './common/title-header/title-header.component';
import { AnnouncementComponent } from './pages/announcement/announcement.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';
import { AboutsComponent } from './pages/abouts/abouts.component';
import { PartnersComponent } from './pages/partners/partners.component';
import { TermsComponent } from './pages/terms/terms.component';
import { AgreementComponent } from './pages/agreement/agreement.component';
import { ServiceComponent } from './tabs/service/service.component';
import { SmallCardComponent } from './common/small-card/small-card.component';
import { BannerComponent } from './common/banner/banner.component';
import { ProductsComponent } from './common/products/products.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { NodataComponent } from './common/nodata/nodata.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { ProfileCardComponent } from './common/profile-card/profile-card.component';
import { PriceCardComponent } from './common/price-card/price-card.component';
import { MissionCardComponent } from './common/mission-card/mission-card.component';
import { PlayComponent } from './pages/play/play.component';
import { BalanceCardComponent } from './common/balance-card/balance-card.component';
import { DetailsDialogComponent } from './common/details-dialog/details-dialog.component';
import { RankingComponent } from './common/ranking/ranking.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    HomeComponent,
    TabsComponent,
    LayoutComponent,
    CarouselComponent,
    CardsComponent,
    FaqComponent,
    TitleHeaderComponent,
    AnnouncementComponent,
    DepositComponent,
    WithdrawComponent,
    AboutsComponent,
    PartnersComponent,
    TermsComponent,
    AgreementComponent,
    ServiceComponent,
    SmallCardComponent,
    BannerComponent,
    ProductsComponent,
    OrdersComponent,
    NodataComponent,
    AccountsComponent,
    ProfileCardComponent,
    PriceCardComponent,
    MissionCardComponent,
    PlayComponent,
    BalanceCardComponent,
    DetailsDialogComponent,
    RankingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpsInterceptor, multi: true },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

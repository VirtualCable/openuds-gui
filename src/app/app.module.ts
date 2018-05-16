import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { TranslateDirective } from './translate.directive';

// Service providers
import { UdsApiService } from './uds-api.service';
import { LoginComponent } from './login/login.component';
import { ClientDownloadComponent } from './client-download/client-download.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TranslateDirective,
    LoginComponent,
    ClientDownloadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [UdsApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }

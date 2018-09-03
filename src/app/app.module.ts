import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { TranslateDirective } from './translate.directive';

// Service providers
import { UdsApiService } from './uds-api.service';
import { LoginComponent } from './login/login.component';
import { ClientDownloadComponent } from './client-download/client-download.component';
import { ServicesComponent } from './services/services.component';
import { ModalComponent } from './gui/modal/modal.component';
import { SafeHtmlPipe } from './gui/safe-html.pipe';
import { GuiService } from './gui/gui.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TranslateDirective,
    LoginComponent,
    ClientDownloadComponent,
    ServicesComponent,
    ModalComponent,
    SafeHtmlPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [
    UdsApiService,
    GuiService,
    NgbActiveModal
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalComponent
  ]
})
export class AppModule { }

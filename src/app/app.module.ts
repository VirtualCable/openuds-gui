import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './/app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NavbarComponent } from './gui/navbar/navbar.component';
import { TranslateDirective } from './translate.directive';

import { LoginComponent } from './pages/login/login.component';
import { ClientDownloadComponent } from './pages/client-download/client-download.component';
import { ServicesComponent } from './pages/services/services.component';
import { ModalComponent } from './gui/modal/modal.component';
import { SafeHtmlPipe } from './gui/safe-html.pipe';


// Service providers
import { UdsApiService } from './uds-api.service';
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
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    AppMaterialModule,
    FlexLayoutModule,
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

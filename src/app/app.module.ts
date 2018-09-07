import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './modules/app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './modules/app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';

import { NavbarComponent } from './gui/navbar/navbar.component';
import { TranslateDirective } from './translate.directive';

import { LoginComponent } from './pages/login/login.component';
import { ClientDownloadComponent } from './pages/client-download/client-download.component';
import { ServicesComponent } from './pages/services/services.component';
import { ModalComponent } from './gui/modal/modal.component';
import { SafeHtmlPipe } from './gui/safe-html.pipe';

// Gui components
import { ServiceComponent } from './gui/components/service/service.component';
import { ServicesGroupComponent } from './gui/components/services-group/services-group.component';

// Pages

// Service providers
import { UDSApiService } from './uds-api.service';
import { UDSGuiService } from './gui/uds-gui.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TranslateDirective,
    LoginComponent,
    ClientDownloadComponent,
    ServicesComponent,
    ServiceComponent,
    ServicesGroupComponent,
    ModalComponent,
    SafeHtmlPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FlexLayoutModule,
  ],
  providers: [
    UDSApiService,
    UDSGuiService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalComponent
  ]
})
export class AppModule { }

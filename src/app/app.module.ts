import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './modules/app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './modules/app-material.module';

import { AppComponent } from './app.component';

// api
import { TranslateDirective } from './translate.directive';

// Service providers
import { UDSApiService } from './uds-api.service';
import { UDSGuiService } from './gui/uds-gui.service';

// Pages
import { LoginComponent } from './pages/login/login.component';
import { MfaComponent } from './pages/mfa/mfa.component';
import { ClientDownloadComponent } from './pages/client-download/client-download.component';
import { ServicesComponent } from './pages/services/services.component';
import { ErrorComponent } from './pages/error/error.component';

// Gui components
import { NavbarComponent } from './gui/navbar/navbar.component';
import { FooterComponent } from './gui/footer/footer.component';

import { ServiceComponent } from './gui/components/service/service.component';
import { ServicesGroupComponent } from './gui/components/services-group/services-group.component';

import { StaffInfoComponent } from './gui/components/staff-info/staff-info.component';

import { ModalComponent } from './gui/modal/modal.component';
import { SafeHtmlPipe } from './gui/safe-html.pipe';
import { AboutComponent } from './pages/about/about.component';
import { DownloadsComponent } from './pages/downloads/downloads.component';
import { LauncherComponent } from './pages/launcher/launcher.component';
import { FilterComponent } from './gui/components/filter/filter.component';
import { CredentialsModalComponent } from './gui/credentials-modal/credentials-modal.component';


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
    CredentialsModalComponent,
    SafeHtmlPipe,
    FooterComponent,
    ErrorComponent,
    AboutComponent,
    DownloadsComponent,
    LauncherComponent,
    StaffInfoComponent,
    FilterComponent,
    MfaComponent,
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
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

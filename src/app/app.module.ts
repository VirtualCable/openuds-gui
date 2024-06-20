import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './modules/app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './modules/app-material.module';

import { AppComponent } from './app.component';

// api
import { TranslateDirective } from './helpers/translate.directive';

// Service providers
import { UDSApiService } from './services/uds-api.service';
import { UDSGuiService } from './services/uds-gui.service';

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
import { SafeHtmlPipe } from './helpers/safe-html.pipe';
import { AboutComponent } from './pages/about/about.component';
import { DownloadsComponent } from './pages/downloads/downloads.component';
import { LauncherComponent } from './pages/launcher/launcher.component';
import { FilterComponent } from './gui/components/filter/filter.component';
import { CredentialsModalComponent } from './gui/credentials-modal/credentials-modal.component';


@NgModule({ declarations: [
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
    bootstrap: [AppComponent], imports: [BrowserModule,
        LayoutModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AppMaterialModule], providers: [
        UDSApiService,
        UDSGuiService,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }

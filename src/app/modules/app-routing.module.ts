import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../pages/login/login.component';
import { ClientDownloadComponent } from '../pages/client-download/client-download.component';
import { DownloadsComponent } from '../pages/downloads/downloads.component';
import { ServicesComponent } from '../pages/services/services.component';
import { ErrorComponent } from '../pages/error/error.component';
import { AboutComponent } from '../pages/about/about.component';

const routes: Routes = [
  { path: '', redirectTo: 'services', pathMatch: 'full' },
  { path: 'services', component: ServicesComponent },

  { path: 'login', component: LoginComponent },
  { path: 'login/:id', component: LoginComponent },

  { path: 'client-download', component: ClientDownloadComponent },
  { path: 'downloads', component: DownloadsComponent },

  { path: 'error/:id', component: ErrorComponent },
  { path: 'about', component: AboutComponent },

  // Placeholder, maybe we change it to "page not found"
  { path: '**', redirectTo: 'services' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

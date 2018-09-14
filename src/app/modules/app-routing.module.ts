import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../pages/login/login.component';
import { ClientDownloadComponent } from '../pages/client-download/client-download.component';
import { ServicesComponent } from '../pages/services/services.component';
import { ErrorComponent } from '../pages/error/error.component';


const routes: Routes = [
  { path: '', redirectTo: 'services', pathMatch: 'full' },
  { path: 'services', component: ServicesComponent },

  { path: 'login', component: LoginComponent },
  { path: 'login/:id', component: LoginComponent },

  { path: 'client-download', component: ClientDownloadComponent },
  { path: 'error/:id', component: ErrorComponent },
  { path: 'about', component: ServicesComponent },

  // Placeholder, maybe we change it to "page not found"
  { path: '**', redirectTo: 'services' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

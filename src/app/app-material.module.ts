import { NgModule } from '@angular/core';
import {MatToolbarModule, MatButtonModule, MatMenuModule } from '@angular/material';

@NgModule({
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule
  ]
})
export class AppMaterialModule { }

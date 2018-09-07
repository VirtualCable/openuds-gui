import { NgModule } from '@angular/core';
import {MatToolbarModule, MatButtonModule, MatMenuModule, MatTooltipModule, MatExpansionModule } from '@angular/material';

@NgModule({
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatExpansionModule,
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatExpansionModule,
  ]
})
export class AppMaterialModule { }

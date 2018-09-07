import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatButtonModule,
  MatMenuModule,
  MatTooltipModule,
  MatExpansionModule,
  MatDialogModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDialogModule,
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDialogModule,
  ]
})
export class AppMaterialModule { }

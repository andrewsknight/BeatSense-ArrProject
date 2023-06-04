import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EcgDetailPageRoutingModule } from './ecg-detail-routing.module';

import { EcgDetailPage } from './ecg-detail.page';

import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EcgDetailPageRoutingModule,
    NgChartsModule
  ],
  declarations: [EcgDetailPage]
})
export class EcgDetailPageModule {}

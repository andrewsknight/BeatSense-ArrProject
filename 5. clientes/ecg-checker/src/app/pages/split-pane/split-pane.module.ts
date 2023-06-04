import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SplitPanePageRoutingModule } from './split-pane-routing.module';

import { SplitPanePage } from './split-pane.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplitPanePageRoutingModule
  ],
  declarations: [SplitPanePage]
})
export class SplitPanePageModule {}

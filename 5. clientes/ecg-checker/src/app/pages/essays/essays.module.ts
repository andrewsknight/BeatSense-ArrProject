import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EssaysPageRoutingModule } from './essays-routing.module';

import { EssaysPage } from './essays.page';

import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EssaysPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EssaysPage],
})
export class EssaysPageModule {}

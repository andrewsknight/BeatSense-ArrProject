import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EcgStoragePageRoutingModule } from './ecg-storage-routing.module';

import { EcgStoragePage } from './ecg-storage.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EcgStoragePageRoutingModule,
        ComponentsModule
    ],
  declarations: [EcgStoragePage]
})
export class EcgStoragePageModule {}

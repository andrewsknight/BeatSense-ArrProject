import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EcgStoragePage } from './ecg-storage.page';

const routes: Routes = [
  {
    path: '',
    component: EcgStoragePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EcgStoragePageRoutingModule {}

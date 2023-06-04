import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EcgDetailPage } from './ecg-detail.page';

const routes: Routes = [
  {
    path: '',
    component: EcgDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EcgDetailPageRoutingModule {}

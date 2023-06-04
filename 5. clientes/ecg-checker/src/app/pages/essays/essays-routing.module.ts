import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EssaysPage } from './essays.page';

const routes: Routes = [
  {
    path: '',
    component: EssaysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EssaysPageRoutingModule {}

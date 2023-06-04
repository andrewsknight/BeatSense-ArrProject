import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultDetailsPage } from './result-details.page';

const routes: Routes = [
  {
    path: '',
    component: ResultDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultDetailsPageRoutingModule {}

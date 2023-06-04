import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplitPanePage } from './split-pane.page';

const routes: Routes = [
  {
    path: '',
    component: SplitPanePage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'ecg-storage',
        loadChildren: () => import('../ecg-storage/ecg-storage.module').then(m => m.EcgStoragePageModule)
      },
      {
        path: 'essays',
        loadChildren: () => import('../essays/essays.module').then(m => m.EssaysPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplitPanePageRoutingModule {}

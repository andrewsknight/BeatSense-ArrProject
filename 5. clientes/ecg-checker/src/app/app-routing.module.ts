import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  /*{
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },*/
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'split-pane',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/split-pane/split-pane.module').then(m => m.SplitPanePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'ecg-storage',
    loadChildren: () => import('./pages/ecg-storage/ecg-storage.module').then(m => m.EcgStoragePageModule)
  },
  {
    path: 'ecg-detail',
    loadChildren: () => import('./pages/ecg-detail/ecg-detail.module').then(m => m.EcgDetailPageModule)
  },
  {
    path: 'essays',
    loadChildren: () => import('./pages/essays/essays.module').then(m => m.EssaysPageModule)
  },
  {
    path: 'result-details',
    loadChildren: () => import('./pages/result-details/result-details.module').then(m => m.ResultDetailsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

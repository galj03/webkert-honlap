import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'posts',
    loadChildren: () => import('./pages/posts/posts.module').then(m => m.PostsModule)
  },
  // { 
  //   path: 'login',
  //   loadChildren: () => import('./pages/login-page/login-page.module').then(m => m.LoginPageModule) 
  // },
  // { 
  //   path: 'admin', 
  //   loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule) ,
  //   canActivate: [adminGuard]
  // },
  { 
    path: 'profile', 
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule), 
    //canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  { 
    path: 'not-found',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule) 
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

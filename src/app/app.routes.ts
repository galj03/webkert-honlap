import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PostsComponent } from './pages/posts/posts.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    {
        path: 'home', component: HomeComponent
      },
      {
        path: 'posts', component: PostsComponent
      },
      // TODO: ha van valami, aminek nem akaruk megvarni a betolteset, akkor lazy loaddal tolti a dolgokat kozben (kinda)
      // { 
      //   path: 'login',
      //   loadChildren: () => import('./pages/login-page/login-page.component').then(m => m.LoginPageComponent) 
      // },
      // { 
      //   path: 'admin', 
      //   loadChildren: () => import('./pages/admin/admin.component').then(m => m.AdminComponent) ,
      //   canActivate: [adminGuard]
      // },
      { 
        path: 'profile', component: ProfileComponent
        //canActivate: [authGuard]
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      { 
        path: 'not-found' , component: NotFoundComponent
      },
      {
        path: '**',
        redirectTo: 'not-found',
        pathMatch: 'full'
      }
];

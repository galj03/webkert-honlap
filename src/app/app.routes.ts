import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TourComponent } from './pages/tour/tour.component';

export const routes: Routes = [
    {
        path: 'home', component: HomeComponent
      },
      {
        path: 'tour', component: TourComponent
      },
      // TODO: ha van valami, aminek nem akaruk megvarni a betolteset, akkor lazy loaddal tolti a dolgokat kozben (kinda)
      // { 
      //   path: 'login',
      //   loadChildren: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
      // },
      { 
        path: 'login', component: LoginComponent
      },
      { 
        path: 'signup', component: SignupComponent
      },
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

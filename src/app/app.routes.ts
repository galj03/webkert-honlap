import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TourComponent } from './pages/tour/tour.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { publicGuard } from './shared/guards/public.guard';
import { EditPostComponent } from './pages/edit-post/edit-post.component';
import { EditConcertComponent } from './pages/edit-concert/edit-concert.component';
import { authGuard } from './shared/guards/auth.guard';

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
        path: 'login', component: LoginComponent,
        canActivate: [publicGuard]
      },
      { 
        path: 'signup', component: SignupComponent,
        canActivate: [publicGuard]
      },
      { 
        path: 'edit-concert/:id', component: EditConcertComponent,
        canActivate: [authGuard]
      },
      { 
        path: 'edit-post/:id', component: EditPostComponent,
        canActivate: [authGuard]
      },
      // { 
      //   path: 'admin', 
      //   loadChildren: () => import('./pages/admin/admin.component').then(m => m.AdminComponent) ,
      //   canActivate: [adminGuard]
      // },
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

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { take, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  return authService.currentUser.pipe(
    take(1),
    map(user => {
      if (!user) {
        return true;
      }
      
      console.log('Already authenticated, redirecting to home');
      router.navigate(['/home']);
      return false;
    })
  );
};

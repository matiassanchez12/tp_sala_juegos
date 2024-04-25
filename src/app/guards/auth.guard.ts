import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, take, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  authService = inject(AuthService);
  protected protectedRoutes = ['games', 'chat'];

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if(!this.protectedRoutes.includes(route.url[0].path)){
      return of(true);
    }
    
    return this.authService.getCurrentUser().pipe(
      take(1), // Completa el observable después de recibir la primera emisión
      map(user => {
        if (user) {
          return true; // Usuario autenticado, permite acceder a la ruta
        } else {
          // Usuario no autenticado, redirige a la página de inicio de sesión con la URL original como parámetro
          this.router.navigate(['/home']);
          return false;
        }
      })
    );
  }
}
import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/autenticacion/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'historial-clinico',
        loadComponent: () => import('./components/registros-medicos/historial-clinico/historial-clinico.component').then(m => m.HistorialClinicoComponent)
      },
      {
        path: 'signos-vitales',
        loadComponent: () => import('./components/registros-medicos/signos-vitales/signos-vitales.component').then(m => m.SignosVitalesComponent)
      },
      {
        path: 'sugerencias-cuidado',
        loadComponent: () => import('./components/registros-medicos/sugerencias-cuidado/sugerencias-cuidado.component').then(m => m.SugerenciasCuidadoComponent)
      }
    ]
  }
]; 
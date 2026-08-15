import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login').then((m) => m.Login) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'tecnologias',
        loadComponent: () =>
          import('./features/tecnologias/tecnologias').then((m) => m.Tecnologias),
      },
      {
        path: 'conteudos',
        loadComponent: () => import('./features/conteudos/conteudos').then((m) => m.Conteudos),
      },
      {
        path: 'planos',
        loadComponent: () => import('./features/planos/planos').then((m) => m.Planos),
      },
      {
        path: 'registros',
        loadComponent: () => import('./features/registros/registros').then((m) => m.Registros),
      },
      {
        path: 'projetos',
        loadComponent: () => import('./features/projetos/projetos').then((m) => m.Projetos),
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: '' },
];

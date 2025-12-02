import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.Register)
  },
  {
    path: 'user-dashboard',
    loadComponent: () => import('./features/user-dashboard/user-dashboard').then(m => m.UserDashboard),
    canActivate: [authGuard]
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./features/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [authGuard, roleGuard],
    data: { role: 'ROLE_ADMIN' },
   children: [
  {
    path: '',
    loadComponent: () => import('./features/admin-dashboard/stats-overview/stats-overview').then(m => m.StatsOverview)
  },
      {
      path: 'manage-posts',
      loadComponent: () => import('./features/admin-dashboard/manage-posts/manage-posts').then(m => m.ManagePosts)
    },
  {    path: 'approved-post',
    loadComponent: () => import('./features/admin-dashboard/approved-post/approved-post').then(m => m.ApprovedPost)
  },
  {
  path: 'users',
  loadComponent: () => import('./features/admin-dashboard/admin-user/admin-user').then(m => m.UsersComponent)
}


  

]

  },
  { path: '**', redirectTo: '/login' }
];

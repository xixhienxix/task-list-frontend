import { Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/auth/auth.component').then((m) => m.AuthComponent)
    },
    {
        path: 'dashboard',
        canActivate:[AuthGuardService],
        loadComponent: () =>
            import('./pages/tasks/task.component').then((m) => m.TaskPageComponent)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];

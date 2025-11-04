import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/user-list/user-list').then((m) => m.UserList),
    },
    {
        path: 'user/:id',
        loadComponent: () =>
            import('./pages/user-detail/user-detail').then((m) => m.UserDetail),
    },
];

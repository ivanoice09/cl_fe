import { Routes } from '@angular/router';
import { CardsContainer } from './features/product/cards-container/cards-container';
import { Detail } from './features/product/cards-container/card/detail/detail';
import { Login } from './features/auth/login/login';
import { Home } from './features/home/home';
import { Profile } from './features/profile/profile';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { OrderDetailComponent } from './features/orders/order-detail/order-detail';
import { Register } from './features/auth/register/register';
import { Addresses } from './features/profile/addresses/addresses';

export const routes: Routes = [
  { path: '', component: CardsContainer },
  { path: 'product/:id', component: Detail },
  { path: 'login', component: Login, data: { hideNavbar: true } },
  { path: 'reset-password', component: ResetPassword, data: { hideNavbar: true } },
  { path: 'register', component: Register, data: {hideNavbar: true }},
  { path: 'home', component: Home },
  { path: 'profile', component: Profile },
  { path: "orders/:orderId", component: OrderDetailComponent },
  { path: 'products/:mainCategory', component: CardsContainer },

  { 
    path: 'profile', 
    component: Profile,
    children: [
      {
        path: 'addresses', // Questa ora corrisponde a /profile/addresses
        loadComponent: () =>
          import('./features/profile/addresses/addresses').then(m => m.Addresses)
      },
      // Qui potresti aggiungere altre rotte figlie del profilo
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Ad esempio, reindirizzare a una dashboard di default
    ]
  }

  //{ path: 'reset-password', component: ResetPassword, data: { hideNavbar: true } }
  
];

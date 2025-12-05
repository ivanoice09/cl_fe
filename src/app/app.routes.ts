import { Routes } from '@angular/router';
import { CardsContainer } from './features/product/cards-container/cards-container';
import { Detail } from './features/product/cards-container/card/detail/detail';
import { Login } from './features/auth/login/login';
import { Home } from './features/home/home';
import { Profile } from './features/profile/profile';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { OrderDetailComponent } from './features/orders/order-detail/order-detail';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
  { path: 'products', component: CardsContainer },
  { path: 'product/:id', component: Detail },
  { path: 'login', component: Login, data: { hideNavbar: true } },
  { path: 'reset-password', component: ResetPassword, data: { hideNavbar: true } },
  { path: 'register', component: Register, data: {hideNavbar: true }},
  { path: 'home', component: Home },
  { path: 'profile', component: Profile },
  { path: "orders/:orderId", component: OrderDetailComponent },
  { path: 'reset-password', component: ResetPassword, data: { hideNavbar: true } }
  
];

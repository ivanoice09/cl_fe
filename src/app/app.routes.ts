import { Routes } from '@angular/router';
import { CardsContainer } from './features/product/cards-container/cards-container';
import { Detail } from './features/product/cards-container/card/detail/detail';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
  { path: '', component: CardsContainer },
  { path: 'product/:id', component: Detail },
  { path: 'login', component: Login, data: { hideNavbar: true } },
];

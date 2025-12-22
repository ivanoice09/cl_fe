import { Routes } from '@angular/router';
import { CardsContainer } from './features/product/cards-container/cards-container';
import { Detail } from './features/product/cards-container/card/detail/detail';
import { Login } from './features/auth/login/login';
import { Home } from './features/home/home';
import { Profile } from './features/profile/profile';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { OrderDetailComponent } from './features/orders/order-detail/order-detail';
import { Register } from './features/auth/register/register';
import { NotFound } from './pages/not-found/not-found';
import { Products } from './features/admin/products/products';
import { EditCreateForm } from './features/admin/products/edit-form/edit-form';
import { ProductFormResolver } from './shared/services/admin/product-form-resolver';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'products', component: CardsContainer },
  { path: 'product/:id', component: Detail },
  
  { path: 'login', component: Login, data: { hideNavbar: true } },
  { path: 'reset-password', component: ResetPassword, data: { hideNavbar: true } },
  { path: 'register', component: Register, data: {hideNavbar: true }},
  { path: 'home', component: Home },
  { path: 'profile', component: Profile },
  { path: "orders/:orderId", component: OrderDetailComponent },
  { path: 'products/:mainCategory', component: CardsContainer },

  // Admin routes:
  { path: 'admin/products', component: Products },
  { path: 'admin/products/edit/:id', component: EditCreateForm, resolve: { data: ProductFormResolver} },
  { path: 'admin/products/create', component: EditCreateForm, resolve: { data: ProductFormResolver} },

  { 
    path: 'profile', 
    component: Profile,
    children: [
      {
        path: 'addresses', 
        loadComponent: () => import('./features/profile/addresses/addresses').then(m => m.Addresses)
      }
    ]
  },

  { path: '404', component: NotFound }, 
  { path: '**', component: NotFound }
];

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');

          if (token) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }

          return next(req);
        }
      ])
    ),
    provideRouter(routes)
  ]
}).catch((err) => console.error(err));

import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {AuthServiceLocal} from '../app/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfigService} from './config.service';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  private apiReq: HttpRequest<any>;

  constructor(private authService: AuthServiceLocal, private snackBar: MatSnackBar) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.isLoggedIn) {
      const accessToken = this.authService.getAccessToken();
      req = req.clone({
        setHeaders: {
          // Authorization: `JWT $[accessToken}`
          Authorization: accessToken
        }
      });
    }

    if (environment.production) {
      this.apiReq = req.clone({url: `https://olympo.ge/api/${req.url}`});
    } else {
      this.apiReq = req.clone({url: `http://localhost:3000/api/${req.url}`});
    }

    // @ts-ignore
    return next.handle(this.apiReq).subscribe(
      ignore => { }
      , error => {
        if (error.status === 401) {
          this.authService.logout();
        }
        this.snackBar.open('An error has occurred. Please try again later.', 'Ok', {duration: 5000});
      }
    );
  }
}


import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../environments/environment';
import {AuthServiceLocal} from '../app/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError} from 'rxjs/operators';

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
    return next.handle(this.apiReq).pipe(
      catchError(error => {
        if (error.status === 401 || error.status === 403) {
          this.authService.logout();
        }
        let defaultErr = 'An error has occurred. Please try again later';
        if (error.error.message){
          defaultErr = error.error.message;
        }
        this.snackBar.open(defaultErr, 'Ok', {duration: 5000});
        return throwError(error);
      })
    );
  }
}


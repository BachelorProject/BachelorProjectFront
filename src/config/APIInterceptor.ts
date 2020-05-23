import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  private apiReq: HttpRequest<any>;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if ( environment.production ){
      this.apiReq = req.clone({url: `https://olympo.ge/api/${req.url}`});
    }else{
      this.apiReq = req.clone({url: `http://localhost:3000/api/${req.url}`});
    }
    return next.handle(this.apiReq);
  }
}

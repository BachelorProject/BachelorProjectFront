import { Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {AuthService} from 'angularx-social-login';
import {FacebookLoginProvider, GoogleLoginProvider} from 'angularx-social-login';
import {ConfigService} from '../config/config.service';

@Injectable({
  providedIn: 'root'
})

export class AuthServiceLocal {
  API_URL = 'http://localhost:4000';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient, public router: Router,
              private configService: ConfigService, private authService: AuthService){}

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null);
  }

  signInWithGoogle() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(r => {
      console.log('GoogleLoginProvider  THEN: ', r);

      const userInfo = {
        first_name: r.firstName,
        last_name: r.lastName,
        google_id: r.id,
        google_email: r.email,
        photo_url: r.photoUrl
      };
      console.log('userInfo  THEN: ', userInfo);

      this.configService.signInGoogle(userInfo).subscribe(
        value => {
          console.log('logging value', value);
          localStorage.setItem('access_token', value.token);
        }
        , error => {
          // this.snackBar.open('დაფიქსირდა ხარვეზი, სცადეთ მოგვიანებით.', 'კარგი', {duration: 5000});
          // this.isFetching = false;
          console.log('error in subscribe');
        }
      );
    });
  }

  signInWithFB() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(r => {
      console.log( 'authtoken' , r.authToken, r.email, r.name);

      const userInfo = {
        first_name: r.firstName,
        last_name: r.lastName,
        facebook_id: r.id,
        facebook_name: r.name,
        facebook_email: r.email,
      };
      this.configService.signInFacebook(userInfo).subscribe(
        value => {
          console.log('logging value', value);
          localStorage.setItem('access_token', value.token);
        }
        , error => {
          // this.snackBar.open('დაფიქსირდა ხარვეზი, სცადეთ მოგვიანებით.', 'კარგი', {duration: 5000});
          // this.isFetching = false;
          console.log('error in subscribe');
        }
      );
    });
  }


  signUp(email, password){
    this.configService.signUp(email, password).subscribe(
      value => {
        console.log(value);
        localStorage.setItem('access_token', value.token);
      }
      , error => {
        // this.snackBar.open('დაფიქსირდა ხარვეზი, სცადეთ მოგვიანებით.', 'კარგი', {duration: 5000});
        // this.isFetching = false;
        console.log('error in subscribe');
      }
    );
  }

  signIn(email, password){
    this.configService.signIn(email, password).subscribe(
      value => {
        console.log(value);
        localStorage.setItem('access_token', value.token);
      }
      , error => {
        // this.snackBar.open('დაფიქსირდა ხარვეზი, სცადეთ მოგვიანებით.', 'კარგი', {duration: 5000});
        // this.isFetching = false;
        console.log('error in subscribe');
      }
    );
  }

  changePassword(email, password, accessToken){
    localStorage.setItem('access_token', accessToken);
    this.configService.changePassword(email, password).subscribe(
      value => {
        console.log(value);
        localStorage.setItem('access_token', value.token);
      }
      , error => {
        console.log(error);
        // this.snackBar.open('დაფიქსირდა ხარვეზი, სცადეთ მოგვიანებით.', 'კარგი', {duration: 5000});
        // this.isFetching = false;
        console.log('error in subscribe');
      }
    );
  }

  getUserProfile(id): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/users/profile/${id}`, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    let msg;
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  // todo
  logout() {
    localStorage.removeItem('access_token');
    window.location.href = '/';
    // if (localStorage.removeItem('access_token') == null) {
    //   this.router.navigate(['users/login']);
    // }
  }
  signOut(){
    this.authService.signOut();
  }


  recoverPassword(email: string){
    this.configService.recoverPassword(email).subscribe(
      value => {
        console.log(value);
      }
      , error => {
        // this.snackBar.open('დაფიქსირდა ხარვეზი, სცადეთ მოგვიანებით.', 'კარგი', {duration: 5000});
        // this.isFetching = false;
        console.log('error in subscribe');
      });
  }
}
  /// ?????????

  // private user: SocialUser;
  // private loggedIn: boolean;
  //
  // ngOnInit() {
  //   this.createForm();
  //   // this.authService.authState.subscribe((user) => {
  //   //   this.user = user;
  //   //   this.loggedIn = (user != null);
  //   // });
  // }

  // register(user: User): Observable<any> {
  //   return this.httpClient.post(`${this.API_URL}/users/register`, user).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // login(user: User) {
  //   return this.httpClient.post<any>(`${this.API_URL}/users/login`, user)
  //     .subscribe((res: any) => {
  //       localStorage.setItem('access_token', res.token);
  //       this.getUserProfile(res._id).subscribe((res) => {
  //         this.currentUser = res;
  //         this.router.navigate(['users/profile/' + res.msg._id]);
  //       });
  //     });
  // }


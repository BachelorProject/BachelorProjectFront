import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthResponse, Tournament} from './config.service.model';

@Injectable()
export class ConfigService {

  constructor(private http: HttpClient) {

  }

  getTournamentList(fromNum: number, toNum: number, searchString: string, categories: string[], fromDate: number, toDate: number) {
    const params = new HttpParams({
      fromObject: {
        fromNum: fromNum.toString(),
        toNum: toNum.toString(),
        searchString,
        categories,
        fromDate: fromDate.toString(),
        toDate: toDate.toString()
      }
    });
    return this.http.get<Tournament[]>('tournament/list', {params});
  }

  signUp(email, password){
    return  this.http.post<AuthResponse>('signup', {email, password});
  }

  signIn(email, password){
    return this.http.post<AuthResponse>('signin', {email, password});
  }

  signInFacebook(userInfo) {
    return this.http.post<AuthResponse>('signin/facebook', userInfo);
  }

  signInGoogle(userInfo: { google_email: string; google_id: string; last_name: string; photo_url: string; first_name: string }) {
    return this.http.post<AuthResponse>('signin/google', userInfo);
  }

  changePassword(email: any, password: any) {
    return this.http.post<AuthResponse>('change_password', {email, password});
  }


  recoverPassword(email: string) {
    return this.http.post<AuthResponse>('recover_password_by_email', {email});
  }
}

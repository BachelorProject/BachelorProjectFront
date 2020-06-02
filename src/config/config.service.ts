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
    return this.http.get<Tournament>('tournament/list', {params});
  }

  signUp(email, password){
    const res =  this.http.post<AuthResponse>('signup', {email, password});
    console.log(res);
    return res;
  }

  signIn(email, password){
    const res =  this.http.post<AuthResponse>('signin', {email, password});
    console.log(res);
    return res;
  }

  signInFacebook(userInfo) {
    console.log('HERE signInFacebook  ');
    const res = this.http.post<AuthResponse>('signin/facebook', userInfo);
    return res;
  }

  signInGoogle(userInfo: { google_email: string; google_id: string; last_name: string; photo_url: string; first_name: string }) {
    const res = this.http.post<AuthResponse>('signin/google', userInfo);
    console.log(res);
    return res;
  }
}

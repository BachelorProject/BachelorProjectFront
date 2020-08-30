import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  AuthResponse,
  Contest,
  LeaderBoardMetaModel,
  LeaderBoardPlaceModel,
  Subject,
  Tournament
} from './config.service.model';
import {of} from 'rxjs';

@Injectable()
export class ConfigService {

  constructor(private http: HttpClient) {}

  uploadMedia(id: number, type: string, file: File) {
    const formData: FormData = new FormData();
    formData.append('id', id.toString());
    formData.append('type', type);
    formData.append('file', file);
    return this.http.post<any>('upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  requestContest(mode: string, id: number) {
    // return of({
    //   id: 5324,
    //   title: '',
    //   body: '',
    //   imageUrl: 'https://avatarfiles.alphacoders.com/218/thumb-218543.png',
    //   registrationEnd: null,
    //   subjects: [],
    //   status: 'UNPUBLISHED',
    //   rounds: [],
    // }).pipe(delay(2000));
    return this.http.post<Contest>('contest', {mode, id}); // id -1 mean create new one. mode = 'edit', 'view'
  }

  fetchCategories() {
    return of([
      {
        id: 1,
        name: 'მათემატიკა',
        color_id: 1
      },
      {
        id: 2,
        name: 'Physics',
        color_id: 2
      },
      {
        id: 3,
        name: 'Chemistry',
        color_id: 3
      }
    ]);
    return this.http.get<Subject[]>('subjects');
  }

  getLeaderBoard(from: number, count: number, contestId: number, roundNumber: number) {
    const params = new HttpParams({
      fromObject: {
        from: from.toString(),
        count: count.toString(),
        contestId: contestId.toString(),
        roundNumber: roundNumber.toString()
      }
    });
    return this.http.get<LeaderBoardPlaceModel[]>('leaderboard', {params});
  }

  getLeaderBoardMeta(contestId: number, roundNumber: number) {
    const params = new HttpParams({
      fromObject: {
        contestId: contestId.toString(),
        roundNumber: roundNumber.toString()
      }
    });
    return this.http.get<LeaderBoardMetaModel>('leaderboardmeta', {params});
  }

  getTournamentList(from: number, to: number, myContests: boolean, pastContests: boolean, searchString: string, subjectIds: number[]) {
    const subjectIdStr: string[] = subjectIds.map(value => value.toString());
    const params = new HttpParams({
      fromObject: {
        from: from.toString(),
        to: to.toString(),
        myContests: myContests.toString(),
        pastContests: pastContests.toString(),
        subjectIds: subjectIdStr
      }
    });

    if (searchString.length > 0) {
      params[searchString] = searchString;
    }
    return this.http.get<Tournament[]>('tournament/board_list', {params});
  }

  getMyTournamentList() {
    return this.http.get<Tournament[]>('tournament/mylist');
  }

  signUp(email, password) {
    return this.http.post<AuthResponse>('signup', {email, password});
  }

  signIn(email, password) {
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

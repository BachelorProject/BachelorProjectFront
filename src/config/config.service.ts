import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  AuthResponse,
  Contest,
  ContestQuestion,
  LeaderBoardMetaModel,
  LeaderBoardPlaceModel,
  PastContest,
  Subject,
  Tournament,
  UserInformation
} from './config.service.model';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';

@Injectable()
export class ConfigService {

  currUser: UserInformation = {
    userId: 1,
    firstName: 'Dima',
    lastName: 'Rogava',
    gender: 'male',
    birthDay: 1598986873144, // timestamp
    education: 'Freeuni',
    username: 'Rogavactive',
    profileImageUrl: 'https://avatarfiles.alphacoders.com/218/thumb-218543.png',
    email: 'droga16@freeuni.edu.ge',
    subjects: [{
      subjectId: 1,
      subjectStats: [{
        timestamp: 15699685410000,
        score: 1241
      },
        {
          timestamp: 15752389410000,
          score: 4231
        },
        {
          timestamp: 15857797410000,
          score: 5431
        },
        {
          timestamp: 15910501410000,
          score: 3931
        }
      ]
    },
      {
        subjectId: 2,
        subjectStats: [{
          timestamp: 15699685410000,
          score: 4441
        },
          {
            timestamp: 15752389410000,
            score: 4231
          },
          {
            timestamp: 15857797410000,
            score: 3431
          },
          {
            timestamp: 15910501410000,
            score: 4131
          },
          {
            timestamp: 15963205410000,
            score: 3931
          }
        ]
      }],
  };

  constructor(private http: HttpClient) {
  }

  getNearestUpcomingTournament() {
    return of(1243).pipe(delay(2000));
    return this.http.get<number>('upcoming_tournament');
  }

  getPastContests(userId: number) {
    const params = new HttpParams({
      fromObject: {
        userId: userId.toString()
      }
    });
    const data: PastContest[] = [
      {
        imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
        title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
        subjectIds: [1, 2, 3],
        contestId: 1,
      },
      {
        imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
        title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
        subjectIds: [1, 2, 3],
        contestId: 1,
      },
      {
        imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
        title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
        subjectIds: [1, 2, 3],
        contestId: 1,
      }
      , {
        imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
        title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
        subjectIds: [1, 2, 3],
        contestId: 1,
      }, {
        imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
        title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
        subjectIds: [1, 2, 3],
        contestId: 1,
      }, {
        imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
        title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
        subjectIds: [1, 2, 3],
        contestId: 1,
      }, {
        imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
        title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
        subjectIds: [1, 2, 3],
        contestId: 1,
      }
    ];
    return of(data);
    return this.http.get<PastContest[]>('past_contests', {params});
  }

  getUserInfo(userId: number) {
    const params = new HttpParams({
      fromObject: {
        userId: userId.toString()
      }
    });
    return this.http.get<UserInformation>('profile', {params});
  }

  updateUserInfo(info: UserInformation) {
    return this.http.post<any>('contest', JSON.stringify(info));
  }

  updateQuestions(questions: ContestQuestion[], contestId: number, roundId: number) {
    return this.http.post<any>('contest', JSON.stringify({questions, contestId, roundId}));
  }

  getQuestions(contest: number, round: number) {
    const data: ContestQuestion[] = [];
    for (let i = 0; i < 11; i++) {
      data.push({
        question: 'ragaca kitxva',
        options: ['pasuxi1', 'pasuxi2', 'pasuxi3'],
        score: null,
        type: 'MULTIPLE CHOICE',
        correctAnswer: [2],
      });
    }
    return of(data).pipe(delay(300));
    const params = new HttpParams({
      fromObject: {
        contest: contest.toString(),
        round: round.toString()
      }
    });
    return this.http.get<ContestQuestion[]>('questions', {params});
  }

  uploadMedia(id: number, type: string, file: File) {
    const formData: FormData = new FormData();
    formData.append('id', id.toString());
    formData.append('avatar', file);

    if (type === 'profileAvatar') {
      return this.http.post<any>('set_profile_picture', formData, {
        reportProgress: true,
        observe: 'events'
      });
    } else if (type === 'contestAvatar') {
      return this.http.post<any>('set_contest_picture', formData, {
        reportProgress: true,
        observe: 'events'
      });
    }
  }

  updateContest(contest: Contest) {
    return this.http.post<any>('contest', JSON.stringify(contest));
  }

  registerToContest(contestId: number) {
    return this.http.post<any>('register_contest', {contestId});
  }

  requestContest(mode: string, id: number) {
    // const data: Contest = {
    //   id: 5324,
    //   title: '',
    //   body: '',
    //   imageUrl: 'https://avatarfiles.alphacoders.com/218/thumb-218543.png',
    //   registrationEnd: null,
    //   subjectIds: [1, 2, 3],
    //   status: 'UNPUBLISHED',
    //   rounds: [],
    // };
    // return of(data).pipe(delay(2000));
    //
    const params = new HttpParams({
      fromObject: {
        mode,
        id: id.toString()
      }
    });
    return this.http.get<Contest>('contest', {params});
  }

  fetchCategories() {
    return this.http.get<Subject[]>('subjects');
  }

  getLeaderBoard(from: number, count: number, roundNumber: number) {
    const data: LeaderBoardPlaceModel[] = [];
    for (let i = from; i < from + count; i++) {
      data.push({
        rank: i,
        imageUrl: 'https://avatarfiles.alphacoders.com/218/thumb-218543.png',
        username: `dzimka ${i}`,
        score: roundNumber,
        userId: i,
        time: 100 + 3 * i
      });
    }
    return of(data).pipe(delay(1000));
    const params = new HttpParams({
      fromObject: {
        from: from.toString(),
        count: count.toString(),
        roundNumber: roundNumber.toString()
      }
    });
    return this.http.get<LeaderBoardPlaceModel[]>('leaderboard', {params});
  }

  getLeaderBoardMeta(roundNumber: number) {
    const data: LeaderBoardMetaModel = {
      contestants: 92,
      myPlace: {
        rank: 37,
        imageUrl: 'https://avatarfiles.alphacoders.com/218/thumb-218543.png',
        username: `dzimka ${37}`,
        score: roundNumber,
        userId: 37,
        time: 100 + 3 * 37
      },
      title: 'King\'s'
    };
    return of(data).pipe(delay(1000));
    const params = new HttpParams({
      fromObject: {
        roundNumber: roundNumber.toString()
      }
    });
    return this.http.get<LeaderBoardMetaModel>('leader_board_meta', {params});
  }

  getTournamentList(from: number, to: number, myContests: boolean, pastContests: boolean, searchString: string, subjectIds: number[]) {
    const data: Tournament[] = [];
    for (let i = from; i < to; i++) {
      data.push({
        id: i,
        title: `asdasd ${i}`,
        body: `some body once told me  ${i}`,
        imageUrl: 'https://avatarfiles.alphacoders.com/218/thumb-218543.png',
        registrationEnd: new Date().getTime() + 1000000,
        nextContestStart: new Date().getTime(),
        nextContestDuration: i * 10,
        subjects: [],
        registeredCount: 1000 - 15 * i
      });
    }
    return of(data).pipe(delay(1000));

    const subjectIdStr: string[] = subjectIds.map(value => value.toString());

    let params = new HttpParams({
      fromObject: {
        from: from.toString(),
        to: to.toString(),
        myContests: myContests.toString(),
        pastContests: pastContests.toString(),
        subjectIds: subjectIdStr.join(',')
      }
    });
    if (searchString.length > 0) {
      params = new HttpParams({
        fromObject: {
          from: from.toString(),
          to: to.toString(),
          myContests: myContests.toString(),
          pastContests: pastContests.toString(),
          subjectIds: subjectIdStr.join(','),
          searchString
        }
      });
    }
    return this.http.get<Tournament[]>('tournament/board_list', {params});
  }

  getMyTournamentList() {
    const data: Tournament[] = [{
      id: 3,
      title: 'asdasd',
      body: 'some body once told me',
      imageUrl: 'https://avatarfiles.alphacoders.com/218/thumb-218543.png',
      registrationEnd: new Date().getTime(),
      nextContestStart: new Date().getTime(),
      nextContestDuration: 180,
      subjects: [],
      registeredCount: 3321
    }];
    return of(data).pipe(delay(1000));
    return this.http.get<Tournament[]>('tournament/registered_list');
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

  changePassword(password: any) {
    return this.http.post<AuthResponse>('change_password', {password});
  }

  updatePassword(oldPassword: string, newPassword: string) {
    return this.http.post<string>('update_password', {oldPassword, newPassword});
  }


  recoverPassword(email: string) {
    return this.http.post<AuthResponse>('recover_password_by_email', {email});
  }

  confirmEmail() {
    return this.http.get<AuthResponse>('confirm_email');
  }
}

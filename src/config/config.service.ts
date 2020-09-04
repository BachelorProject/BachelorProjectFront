import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  AuthResponse,
  Contest,
  ContestLiveQuestionModel,
  ContestQuestion,
  ContestRound,
  CurrentUserInformation,
  LeaderBoardMetaModel,
  LeaderBoardPlaceModel,
  PastContest,
  Subject,
  Tournament,
  UpcomingTournament,
  UserInformation
} from './config.service.model';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';

@Injectable()
export class ConfigService {

  currUser: CurrentUserInformation = {
    userId: -1,
    profileImageUrl: ''
  };

  constructor(private http: HttpClient) {
    // if (localStorage.getItem('access_token')) {
    //   this.updateUserMetaInfo();
    // }
  }

  updateUserMetaInfo() {
    if (this.currUser.userId !== -1) {
      return ;
    }
    // const data: CurrentUserInformation = {
    //   profileImageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
    //   userId: 23
    // };
    // return of(data).pipe(delay(2000)).subscribe(value => {
    //   this.currUser = value;
    // });
    this.http.get<CurrentUserInformation>('get_user_metadata')
      .subscribe(value => {
        this.currUser = value;
      });
  }

  getNearestUpcomingTournament() {
    // const data: UpcomingTournament = {
    //   timestamp: new Date().getTime() + 5000,
    //   contestId: 1243
    // };
    // return of(data).pipe(delay(2000));
    return this.http.get<UpcomingTournament>('upcoming_tournament');
  }

  getPastContests(userId: number) {
    const params = new HttpParams({
      fromObject: {
        userId: userId.toString()
      }
    });
    // const data: PastContest[] = [
    //   {
    //     imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
    //     title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
    //     subjectIds: [1, 2, 3],
    //     contestId: 1,
    //   },
    //   {
    //     imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
    //     title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
    //     subjectIds: [1, 2, 3],
    //     contestId: 1,
    //   },
    //   {
    //     imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
    //     title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
    //     subjectIds: [1, 2, 3],
    //     contestId: 1,
    //   }
    //   , {
    //     imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
    //     title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
    //     subjectIds: [1, 2, 3],
    //     contestId: 1,
    //   }, {
    //     imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
    //     title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
    //     subjectIds: [1, 2, 3],
    //     contestId: 1,
    //   }, {
    //     imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
    //     title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
    //     subjectIds: [1, 2, 3],
    //     contestId: 1,
    //   }, {
    //     imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
    //     title: 'asdDFADFD df SDF ASDF SADFV ASDF XFV ASDGA DG ASDG ASDG ASD ASDF ASSDFasdf df adsf asadsf adf asdf asdf a',
    //     subjectIds: [1, 2, 3],
    //     contestId: 1,
    //   }
    // ];
    // return of(data);
    return this.http.get<PastContest[]>('past_contests', {params});
  }

  saveRounds(rounds: ContestRound[]) {
    // return this.http.post<any>('save_rounds',  JSON.stringify(rounds));
    return this.http.post<any>('save_rounds',  rounds);
  }

  addRound(contestId: number) {
    // const data: ContestRound = {
    //   id: 1231,
    //   password: '',
    //   isClosed: false,
    //   duration: null,
    //   placeToPass: null,
    //   pointsToPass: null,
    //   status: 'ACTIVE', //   'ACTIVE', 'ONGOING', 'CANCELLED', 'COMPLETED'
    //   startTime: null
    // };
    // return of(data).pipe(delay(1000));
    return this.http.post<ContestRound>('add_round', {contestId});
  }

  getUserInfo(userId: number) {
    const params = new HttpParams({
      fromObject: {
        userId: userId.toString()
      }
    });
    return this.http.get<UserInformation>('user_info', {params});
  }

  updateUserInfo(info: UserInformation) {
    return this.http.post<any>('contest', info);
  }

  updateQuestions(questions: ContestQuestion[], roundId: number) {
    return this.http.post<any>('update_questions', {questions, roundId});
  }

  submitResult(questions: ContestLiveQuestionModel, roundId: number) {
    return this.http.post<any>('submit_result', {questions, roundId});
  }

  getLiveQuestions(password: string, round: number) {

    // const data: ContestLiveQuestionModel = {
    //   questions: [
    //     {
    //       question: 'asdasdada',
    //       options: [{
    //         value: 'aaaaa',
    //         id: 2
    //       }, {
    //         value: 'aaaaa',
    //         id: 1
    //       }, {
    //         value: 'aaaaa',
    //         id: 3
    //       }],
    //       score: 2,
    //       type: 'MULTIPLE CHOICE',
    //       answeredAnswers: []
    //     },
    //     {
    //       question: 'asdasdada2',
    //       options: [{
    //         value: 'aaaaa',
    //         id: 2
    //       }, {
    //         value: 'aaaaa',
    //         id: 1
    //       }, {
    //         value: 'aaaaa',
    //         id: 3
    //       }],
    //       score: 3,
    //       type: 'MULTIPLE CHOICE',
    //       answeredAnswers: []
    //     }
    //   ],
    //   timeLeft: 300
    // };
    // return of(data).pipe(delay(300));
    const params = new HttpParams({
      fromObject: {
        password,
        round: round.toString()
      }
    });
    return this.http.get<ContestLiveQuestionModel>('live_questions', {params});
  }

  getQuestions(round: number) {
    // const data: ContestQuestion[] = [];
    // for (let i = 0; i < 11; i++) {
    //   data.push({
    //     question: 'ragaca kitxva',
    //     options: ['pasuxi1', 'pasuxi2', 'pasuxi3'],
    //     score: null,
    //     type: 'MULTIPLE CHOICE',
    //     correctAnswer: [2],
    //   });
    // }
    // return of(data).pipe(delay(300));
    const params = new HttpParams({
      fromObject: {
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
    return this.http.post<any>('update_contest', contest);
  }

  registerToContest(contestId: number) {
    return this.http.post<any>('register_contest', {contestId});
  }

  getRounds(id: number) {

    // const data: ContestRound[] = [{
    //   id: 1231,
    //   password: '',
    //   duration: null,
    //   placeToPass: null,
    //   pointsToPass: null,
    //   status: 'COMPLETED', //   'ACTIVE', 'ONGOING', 'CANCELLED', 'COMPLETED'
    //   startTime: null,
    //   isClosed: false
    // }];
    // return of(data).pipe(delay(1000));
    const params = new HttpParams({
      fromObject: {
        contestId: id.toString()
      }
    });
    return this.http.get<ContestRound[]>('contest_rounds', {params});
  }

  requestContest(id: number) {
    // const data: Contest = {
    //   id,
    //   title: 'The best contest eva',
    //   body: 'Wohoooooooooo contest\n awesome body\n foo\n bar\n bla <h2> u drunk m8? </h2>',
    //   imageUrl: 'https://avatarfiles.alphacoders.com/218/thumb-218543.png',
    //   registrationEnd: null,
    //   subjectIds: [1, 2, 3],
    //   status: 'UNPUBLISHED',
    //   isRegistered: false,
    //   createUser: 1
    // };
    // return of(data).pipe(delay(2000));

    const params = new HttpParams({
      fromObject: {
        id: id.toString()
      }
    });
    return this.http.get<Contest>('contest', {params});
  }

  fetchCategories() {
    // const data: Subject[] = [{
    //   id: 1,
    //   name: 'Mathematics',
    //   colorId: 1
    // },
    //   {
    //     id: 2,
    //     name: 'Physics',
    //     colorId: 2
    //   },
    //   {
    //     id: 3,
    //     name: 'Chemistry',
    //     colorId: 3
    //   }];
    // return of(data).pipe(delay(1000));
    return this.http.get<Subject[]>('subjects');
  }

  getLeaderBoard(from: number, count: number, roundNumber: number) {
    // const data: LeaderBoardPlaceModel[] = [];
    // for (let i = from; i < from + count; i++) {
    //   data.push({
    //     rank: i,
    //     imageUrl: 'https://avatarfiles.alphacoders.com/218/thumb-218543.png',
    //     username: `dzimka ${i}`,
    //     score: roundNumber,
    //     userId: i,
    //     time: 100 + 3 * i
    //   });
    // }
    // return of(data).pipe(delay(1000));
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
    // const data: LeaderBoardMetaModel = {
    //   contestants: 92,
    //   myPlace: {
    //     rank: 37,
    //     imageUrl: 'https://avatarfiles.alphacoders.com/218/thumb-218543.png',
    //     username: `dzimka ${37}`,
    //     score: roundNumber,
    //     userId: 37,
    //     time: 100 + 3 * 37
    //   },
    //   title: 'King\'s'
    // };
    // return of(data).pipe(delay(1000));
    const params = new HttpParams({
      fromObject: {
        roundNumber: roundNumber.toString()
      }
    });
    return this.http.get<LeaderBoardMetaModel>('leader_board_meta', {params});
  }

  getTournamentList(from: number, to: number, myContests: boolean, pastContests: boolean, searchString: string, subjectIds: number[]) {
    // const data: Tournament[] = [];
    // for (let i = from; i < to; i++) {
    //   data.push({
    //     id: i,
    //     title: `asdasd ${i}`,
    //     body: `some body once told me  ${i}`,
    //     imageUrl: 'https://avatarfiles.alphacoders.com/218/thumb-218543.png',
    //     registrationEnd: new Date().getTime() + 1000000,
    //     nextContestStart: new Date().getTime(),
    //     nextContestDuration: i * 10,
    //     subjects: [],
    //     registeredCount: 1000 - 15 * i
    //   });
    // }
    // return of(data).pipe(delay(1000));

    const subjectIdStr: string[] = subjectIds.map(value => value.toString());

    let params = new HttpParams({
      fromObject: {
        from: from.toString(),
        to: to.toString(),
        myContests: myContests.toString(),
        registrationIsOn: pastContests.toString(),
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
    // const data: Tournament[] = [{
    //   id: 3,
    //   title: 'asdasd',
    //   body: 'some body once told me',
    //   imageUrl: 'https://avatarfiles.alphacoders.com/218/thumb-218543.png',
    //   registrationEnd: new Date().getTime(),
    //   nextContestStart: new Date().getTime(),
    //   nextContestDuration: 180,
    //   subjects: [],
    //   registeredCount: 3321
    // }];
    // return of(data).pipe(delay(1000));
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

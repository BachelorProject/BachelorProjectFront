import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {LeaderBoardPlaceModel, UpcomingTournament} from './config.service.model';
import {Observable, of, Subject} from 'rxjs';


@Injectable()
export class UpcomingTournamentService {
  contest: UpcomingTournament;
  catId = new Subject<number>();

  constructor(private configService: ConfigService) {
  }

  public getNearest() {
    if (this.contest !== undefined && this.contest.timestamp < new Date().getTime()) {
      return;
    }
    this.configService.getNearestUpcomingTournament()
      .subscribe(value => {
        this.contest = value;
        setTimeout( () => {
          this.catId.next(value.contestId);
        }, value.timestamp - new Date().getTime() );
      }, error => {
      });
  }

}

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

  public getNearest(userId) {
    this.configService.getNearestUpcomingTournament(userId)
      .subscribe(value => {
        this.contest = value;
        console.log(value.timestamp - new Date().getTime());
        setTimeout( () => {
          alert('sheicvala');
          this.catId.next(value.contestId);
        }, value.timestamp - new Date().getTime() );
      }, error => {
      });
  }

}

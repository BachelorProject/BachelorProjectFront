import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';


@Injectable()
export class UpcomingTournamentService {
  catId = -1;

  constructor(private configService: ConfigService) {
    this.getNearest();
    setInterval(
      () => {
        this.getNearest();
      }, 3600000
    );
  }

  private getNearest() {
    this.configService.getNearestUpcomingTournament()
      .subscribe(value => {
        this.catId = value;
      }, error => {
      });
  }

}

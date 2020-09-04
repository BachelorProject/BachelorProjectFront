import {Component, Input, OnInit} from '@angular/core';
import {ConfigService} from '../../../config/config.service';
import {Router} from '@angular/router';
import {AuthServiceLocal} from '../../auth.service';
import {UpcomingTournamentService} from '../../../config/UpcomingTournamentService';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() direction = 'vertical';

  upcomingContestId = -1;

  constructor(public configService: ConfigService,
              public router: Router,
              private authService: AuthServiceLocal,
              public upcomingTournament: UpcomingTournamentService
  ) {
    upcomingTournament.catId.subscribe(value => {
      this.upcomingContestId = value;
    });
  }

  ngOnInit(): void {
  }

  getUpcomingOrBoard() {
    if (this.upcomingContestId !== -1) {
      this.router.navigate(['/contest'], {queryParams: {contestId: this.upcomingTournament.contest.contestId}});
    } else {
      this.router.navigateByUrl('/');
    }
  }

  logout() {
    this.authService.logout();
  }

}

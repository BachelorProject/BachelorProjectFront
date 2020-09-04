import {Component, Injector, Input, OnInit} from '@angular/core';
import {ConfigService} from '../../../config/config.service';
import {Router} from '@angular/router';
import {AuthServiceLocal} from '../../auth.service';
import {UpcomingTournamentService} from '../../../config/UpcomingTournamentService';
import {MatSnackBar} from '@angular/material/snack-bar';

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
              public injector: Injector,
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
    const AuthService = this.injector.get(AuthServiceLocal);
    AuthService.logout();
  }

}

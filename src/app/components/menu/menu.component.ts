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

  constructor(public configService: ConfigService,
              public router: Router,
              private authService: AuthServiceLocal,
              private upcomingTournament: UpcomingTournamentService
  ) {
  }

  ngOnInit(): void {
  }

  getUpcomingOrBoard() {
    if (this.upcomingTournament.catId !== -1) {
      this.router.navigate(['/contest'], {queryParams: {contestId: this.upcomingTournament.catId}});
    } else {
      this.router.navigateByUrl('/');
    }
  }

  logout() {
    this.authService.logout();
  }

}

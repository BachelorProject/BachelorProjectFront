import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FabControllerService} from '../config/FabControllerService';
import {ConfigService} from '../config/config.service';
import {UpcomingTournamentService} from '../config/UpcomingTournamentService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Olympo';
  isScreenSmall = false;
  showHeader = true;

  constructor(public router: Router, public activatedRoute: ActivatedRoute, public fab: FabControllerService,
              private configService: ConfigService,
              private upcomingTournamentService: UpcomingTournamentService) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.configService.updateUserMetaInfo();
        this.upcomingTournamentService.getNearest();
        this.activatedRoute.queryParams.subscribe(params => {
          const urlTree = this.router.parseUrl(this.router.url);
          if (urlTree.root.children.primary) {
            this.showHeader = urlTree.root.children.primary && urlTree.root.children.primary.segments[0].path !== 'auth';
          } else {
            this.showHeader = true;
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.isScreenSmall = document.body.offsetWidth < 1000;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isScreenSmall = document.body.offsetWidth < 1000;
  }
}

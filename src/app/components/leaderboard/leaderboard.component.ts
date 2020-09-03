import {Component, HostListener, OnInit} from '@angular/core';
import {LeaderBoardMetaModel, LeaderBoardPlaceModel} from '../../../config/config.service.model';
import {Observable, of} from 'rxjs';
import {ConfigService} from '../../../config/config.service';
import {tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  roundId: number;
  itemsPerPage = 10;
  page = 1;
  leaderBoard: Observable<LeaderBoardPlaceModel[]> = of([]);
  total: number;
  loading = false;
  metaInformation: LeaderBoardMetaModel;
  isScreenSmall = false;

  constructor(private configService: ConfigService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.isScreenSmall = document.body.offsetWidth < 1000;
    this.route
      .queryParams
      .subscribe(params => {
        this.roundId = params.id || -1;
        if (this.roundId === -1) {
          this.router.navigate(['**']);
        } else {
          this.configService.getLeaderBoardMeta(this.roundId)
            .subscribe(res => {
              this.metaInformation = res;
              this.reloadPage();
            });
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isScreenSmall = document.body.offsetWidth < 1000;
  }

  getFormattedTime(seconds: number) {
    return `${Math.floor(seconds / 3600)}:${Math.floor(seconds / 60) % 60}:${seconds % 60}`;
  }

  reloadPage() {
    this.loading = true;
    this.leaderBoard = this.configService.getLeaderBoard(
      (this.page - 1) * this.itemsPerPage, this.itemsPerPage, this.roundId)
      .pipe(tap(() => {
        this.loading = false;
      }));
  }

  changePageCount(itemsPerPage: number) {
    if (itemsPerPage === this.itemsPerPage || this.loading) {
      return;
    }
    this.itemsPerPage = itemsPerPage;
    this.reloadPage();
  }

  changePage(page: number) {
    if (this.page === page || this.loading) {
      return;
    }
    this.page = page;
    this.reloadPage();
  }

}

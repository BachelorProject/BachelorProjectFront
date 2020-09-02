import {Component, HostListener, OnInit} from '@angular/core';
import {LeaderBoardMetaModel, LeaderBoardPlaceModel} from '../../../config/config.service.model';
import {Observable} from 'rxjs';
import {ConfigService} from '../../../config/config.service';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  contestId: number;
  roundNumber: number;
  itemsPerPage = 10;
  page = 1;
  leaderBoard: Observable<LeaderBoardPlaceModel[]>;
  total: number;
  loading = false;
  metaInformation: LeaderBoardMetaModel;
  isScreenSmall = false;

  constructor(private configService: ConfigService) {
  }

  ngOnInit(): void {
    this.isScreenSmall = document.body.offsetWidth < 1000;
    this.contestId = 1;
    this.roundNumber = 7; // TODO: set this values here from route params
    this.configService.getLeaderBoardMeta(this.contestId, this.roundNumber)
      .subscribe(res => {
        this.metaInformation = res;
        this.reloadPage();
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreenSmall = document.body.offsetWidth < 1000;
  }

  getFormattedTime(seconds: number) {
    return `${Math.floor(seconds / 3600)}:${Math.floor(seconds / 60) % 60}:${seconds % 60}`;
  }

  reloadPage() {
    this.loading = true;
    this.leaderBoard = this.configService.getLeaderBoard(
      (this.page - 1) * this.itemsPerPage, this.itemsPerPage, this.contestId, this.roundNumber)
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

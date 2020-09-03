import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {PastContest, SubjectStat, UserInformation} from '../../../config/config.service.model';
import {ConfigService} from '../../../config/config.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FabControllerService} from '../../../config/FabControllerService';
import {ImageUploaderComponent} from '../image-uploader/image-uploader.component';
import {MatDialog} from '@angular/material/dialog';
import {Utils} from '../../../config/utils';
import {CategoryService} from '../../../config/CategoryService';
import * as moment from 'moment';
import {ChangePasswordComponent} from '../change-password/change-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  data: UserInformation = {
    userId: -1,
    firstName: '',
    lastName: '',
    gender: '',
    birthDay: 0, // timestamp
    education: '',
    username: '',
    profileImageUrl: '',
    email: '',
    subjects: [],
  };
  currSubjectIndex = 0;
  currentSubjectId = 0;
  userId: number;
  currentStats: SubjectStat;
  pastContests: PastContest[];

  chartType = 'line';
  chartData = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };
  chartOptions = {
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          suggestedMin: 0,
          suggestedMax: 1000
        },
      }]
    },
    responsive: true,
    maintainAspectRatio: true
  };

  constructor(
    private configService: ConfigService,
    public router: Router,
    public ref: ChangeDetectorRef,
    public fab: FabControllerService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public categoryService: CategoryService) {
    this.route
      .queryParams
      .subscribe(params => {
        this.userId = params.userId || -1;
        if (this.userId === -1) {
          this.getInfo(this.configService.currUser.userId);
        } else {
          this.getInfo(this.userId);
        }
      });

    fab.icon = '../../../assets/images/ic-metro-profile.svg';
    fab.onClickListener.subscribe(() => {
      this.switchFilter();
    });
  }

  isFetching = false;
  isSmallScreen = false;
  isFilterOpen = false;
  viewingInfo = false;
  inEditMode = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isSmallScreen = document.body.offsetWidth < 1200;
    if (!this.isSmallScreen) {
      this.isFilterOpen = false;
      this.viewingInfo = false;
      this.inEditMode = false;
    }
    this.fab.isHidden = !this.isSmallScreen;
  }

  ngOnInit(): void {
    this.isSmallScreen = document.body.offsetWidth < 1200;
    this.fab.isHidden = !this.isSmallScreen;
  }

  switchFilter() {
    this.isFilterOpen = !this.isFilterOpen;
    setTimeout(() => {
      this.ref.markForCheck();
    }, 100);
  }

  openAvatarChange() {
    const dialogRef = this.dialog.open(ImageUploaderComponent, {
      data: {imageUrl: this.data.profileImageUrl, id: this.userId, type: 'profileAvatar'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.data.profileImageUrl = result;
        this.configService.currUser.profileImageUrl = result;
      }
    });
  }

  getSubjectColor() {
    if (this.categoryService.categories.length === 0) {
      return Utils.subjectColor(99);
    }
    return Utils.subjectColor(this.categoryService.getCategoryById(this.currentSubjectId).colorId);
  }

  getCurrentSubjectPoints() {
    let res = 0;
    if (this.data === undefined || this.data.subjects.length === 0) {
      return res;
    }
    const stats = this.data.subjects[this.currSubjectIndex].subjectStats;
    if (stats.length > 0) {
      res = stats[stats.length - 1].score;
    }
    return res;
  }

  updateChart() {
    const chartLabels = this.currentStats.subjectStats.map(elem => {
      return moment(elem.timestamp).format('DD MMM');
    });
    chartLabels.unshift('');
    chartLabels.push('');

    const chartData = this.currentStats.subjectStats.map(elem => {
      return elem.score;
    });
    chartData.unshift(null);
    chartData.push(null);
    const chartBgColor = Utils.subjectColor(this.categoryService.getCategoryById(this.currentStats.subjectId).colorId) + 'aa';
    this.chartData = {
      labels: chartLabels,
      datasets: [
        {
          data: chartData,
          // @ts-ignore
          backgroundColor: chartBgColor
        }
      ]
    };
  }

  getSubjectsFromContest(ids: number[]) {
    return ids.map(elem => this.categoryService.getCategoryById(elem));
  }

  viewInfoClick() {
    this.viewingInfo = !this.viewingInfo;
    if (this.isSmallScreen) {
      this.isFilterOpen = true;
    }
  }

  getDate(time: number): Date {
    return new Date(time);
  }

  getInfo(userId: number) {
    this.isFetching = true;
    this.configService.getUserInfo(userId)
      .subscribe(value => {
        this.data = value;
        this.currSubjectIndex = 0;
        this.currentSubjectId = this.data.subjects[this.currSubjectIndex].subjectId;
        this.userId = value.userId;
        this.configService.getPastContests(this.userId)
          .subscribe(pastContests => {
            this.pastContests = pastContests;
            this.isFetching = false;
          }, () => {
          });
      }, () => {
      });
  }

  editInfoClick() {
    if (this.inEditMode) {
      this.configService.updateUserInfo(this.data);
    }
    this.inEditMode = !this.inEditMode;
  }

  updatePass() {
    this.dialog.open(ChangePasswordComponent);
  }


}

import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ConfigService} from '../../../config/config.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FabControllerService} from '../../../config/FabControllerService';
import {CategoryService} from '../../../config/CategoryService';
import {Utils} from '../../../config/utils';
import {Contest, ContestRound} from '../../../config/config.service.model';
import {ImageUploaderComponent} from '../image-uploader/image-uploader.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent implements OnInit {

  contest: Contest;
  rounds: ContestRound[] = [];
  hide = true;
  openedContestState = 'view';
  @ViewChild('saveBtn') saveBtnElem: ElementRef;
  @ViewChild('saveRounds') saveRoundsBtnElem: ElementRef;

  constructor(
    public configService: ConfigService,
    public router: Router,
    public ref: ChangeDetectorRef,
    public fab: FabControllerService,
    public categoryService: CategoryService,
    public dialog: MatDialog,
    public route: ActivatedRoute) {
    if (!this.isFetching) {
      this.isFetching = true;
    }
    this.route
      .queryParams
      .subscribe(params => {
        const contestId = params.id || -1;
        this.getContestService(contestId);
      });

    fab.icon = '../../../assets/images/ic-metro-trophy.svg';
    fab.onClickListener.subscribe(() => {
      this.switchFilter();
    });
  }

  isFetching = false;
  isSmallScreen = false;
  isFilterOpen = false;
  defaultToolbar = [
    'heading', '|', 'bold', 'italic', 'fontBackgroundColor', 'fontColor', 'fontSize', 'fontFamily', 'link', 'bulletedList', 'numberedList', '|', 'strikethrough', 'horizontalLine', 'highLight', 'mathType', 'chemType', 'subscript', 'superscript', 'underline', '|', 'indent', 'outdent', 'alignment', '|', 'imageUpload', 'mediaEmbed', 'blockQuote', 'insertTable', 'code', 'codeBlock', 'specialCharacters', 'undo', 'redo'
  ];
  smallToolbar = [
    'bold', 'italic', 'fontColor', 'fontSize', 'fontFamily', 'bulletedList', 'numberedList', '|', 'strikethrough', 'subscript', 'superscript', 'underline'
  ];

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isSmallScreen = document.body.offsetWidth < 1200;
    if (!this.isSmallScreen) {
      this.isFilterOpen = false;
    }
    this.fab.isHidden = !this.isSmallScreen;
  }

  ngOnInit(): void {
    this.isSmallScreen = document.body.offsetWidth < 1200;
    this.fab.isHidden = !this.isSmallScreen;
  }

  getContestService(contestId: number) {
    this.configService.requestContest(contestId)
      .subscribe(value => {
        this.contest = value;
        this.isFetching = false;
        this.setOpenedContestState();
      }, error => {
        this.router.navigate(['**']);
      });
  }

  getColor(colorId: number) {
    return Utils.subjectColor(colorId);
  }

  switchFilter() {
    this.isFilterOpen = !this.isFilterOpen;
    setTimeout(() => {
      this.ref.markForCheck();
    }, 100);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  onPlaceSwitchChange(value, roundId) {
    if (value === 'true') {
      console.log(value);
      this.rounds[roundId].placeToPass = 0;
    } else {
      console.log(value);
      this.rounds[roundId].placeToPass = undefined;
    }
  }

  onPassSwitchChange(value, roundId) {
    this.rounds[roundId].password = '';
  }

  onPointsSwitchChange(value, roundId) {
    console.log(value === 'true');
    if (value) {
      this.rounds[roundId].pointsToPass = 0;
    } else {
      this.rounds[roundId].pointsToPass = undefined;
    }
  }

  addEmptyRound() {
    if (!this.contest) {
      return;
    }
    this.configService.addRound(this.contest.id)
      .subscribe(value => {
        this.rounds.push(value);
      });
  }

  saveRound() {
    if (!this.contest) {
      return;
    }
    console.log(this.rounds);
    this.configService.saveRounds(this.rounds).subscribe(value => {
      this.saveRoundsBtnElem.nativeElement.animate([
        // keyframes
        {backgroundColor: '#6EEB83'},
        {backgroundColor: '#6EEB83'},
        {backgroundColor: '#fff'}
      ], {
        duration: 5000,
        easing: 'linear'
      });
    }, error => {
      this.saveRoundsBtnElem.nativeElement.animate([
        // keyframes
        {backgroundColor: '#EF6351'},
        {backgroundColor: '#EF6351'},
        {backgroundColor: '#fff'}
      ], {
        duration: 5000,
        easing: 'linear'
      });
    });
  }

  getOrDefault(value, onDefault, defaultValue) {
    return value !== onDefault ? value : defaultValue;
  }

  getIsEqual(arg0, arg1) {
    return arg0 === arg1;
  }

  setStartTime(idx, evt) {
    console.log(evt.value.valueOf());
    this.rounds[idx].startTime = evt.value.valueOf();
  }

  getStartDate(index) {
    if (this.rounds[index].startTime) {
      return new Date(this.rounds[index].startTime);
    } else {
      return '';
    }
  }

  openAvatarChange() {
    const dialogRef = this.dialog.open(ImageUploaderComponent, {
      data: {imageUrl: this.contest.imageUrl, id: this.contest.id, type: 'contestAvatar'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.contest.imageUrl = result;
      }
    });
  }

  getMoreSubjects() {
    if (this.contest && this.contest.subjectIds && this.categoryService.categories) {
      return this.contest.subjectIds.slice(2).map((id) => {
        return this.categoryService.getCategoryById(id);
      });
    } else {
      return [];
    }
  }

  getFirstSubjects() {
    return this.contest && this.contest.subjectIds ? this.contest.subjectIds.slice(0, 2) : [];
  }

  getStatusColor() {
    if (this.contest) {
      switch (this.contest.status) {
        case 'UNPUBLISHED':
          return '#1BE7FF';
        case 'REGISTRATION ON':
          return '#6EEB83';
        case 'REGISTRATION OVER':
          return '#E4FF1A';
        case 'ONGOING':
          return '#E8AA14';
        case 'CANCELLED':
          return '#EF6351';
        case 'COMPLETED':
          return '#375063';
      }
    } else {
      return '#1BE7FF';
    }
  }

  getMainBtnStatusColor() {
    if (this.contest) {
      switch (this.contest.status) {
        case 'UNPUBLISHED':
          return '#6EEB83';
        case 'REGISTRATION ON':
          return '#6C63FF';
      }
    } else {
      return '#6C63FF';
    }
  }

  getMainBtnStatusText() {
    if (this.contest) {
      switch (this.contest.status) {
        case 'UNPUBLISHED':
          return 'Publish';
        case 'REGISTRATION ON':
        case 'REGISTRATION OVER':
        case 'ONGOING':
          return 'Register';
      }
    } else {
      return 'Update';
    }
  }

  saveContest() {
    this.configService.updateContest(this.contest)
      .subscribe(value => {
        this.saveBtnElem.nativeElement.animate([
          // keyframes
          {backgroundColor: '#6EEB83'},
          {backgroundColor: '#6EEB83'},
          {backgroundColor: '#fff'}
        ], {
          duration: 5000,
          easing: 'linear'
        });
      }, error => {
        this.saveBtnElem.nativeElement.animate([
          // keyframes
          {backgroundColor: '#EF6351'},
          {backgroundColor: '#EF6351'},
          {backgroundColor: '#fff'}
        ], {
          duration: 5000,
          easing: 'linear'
        });
      });
  }

  cancelContest() {
    const oldStatus = this.contest.status;
    this.contest.status = 'CANCELLED';
    this.configService.updateContest(this.contest)
      .subscribe(() => {
      }, () => {
        this.contest.status = oldStatus;
        this.setOpenedContestState();
      });
    this.setOpenedContestState();
  }

  mainAction() {
    const oldStatus = this.contest.status;
    if (this.contest.status === 'UNPUBLISHED') {
      if (this.checkPublishStatus()) {
        this.contest.status = 'REGISTRATION ON';
        this.configService.updateContest(this.contest)
          .subscribe(() => {
            this.setOpenedContestState();
          }, () => {
            this.contest.status = oldStatus;
            this.setOpenedContestState();
          });
      }
    } else if (this.contest.status === 'REGISTRATION ON') {
      this.configService.registerToContest(this.contest.id)
        .subscribe(() => {
          this.contest.isRegistered = true;
          this.setOpenedContestState();
        }, () => {
          this.contest.status = oldStatus;
          this.setOpenedContestState();
        });
    }
    this.setOpenedContestState();
  }

  setRegisterDate(date) {
    if (this.contest) {
      this.contest.registrationEnd = date;
    }
  }

  setOpenedContestState() {
    switch (this.contest.status) {
      case 'UNPUBLISHED':
        if (this.contest.createUser === this.configService.currUser.userId) {
          this.openedContestState = 'edit';
        } else {
          this.router.navigate(['**']);
        }
        break;
      case 'REGISTRATION ON':
        if (this.contest.createUser !== this.configService.currUser.userId && !this.contest.isRegistered) {
          this.openedContestState = 'register';
        } else {
          this.openedContestState = 'view';
        }
        break;
      case 'REGISTRATION OVER':
      case 'ONGOING':
      case 'COMPLETED':
        this.openedContestState = 'view';
        break;
      case 'CANCELLED':
        if (this.contest.createUser === this.configService.currUser.userId) {
          this.openedContestState = 'view';
        } else {
          this.router.navigate(['**']);
        }
    }
  }

  private checkPublishStatus() {
    let result = true;
    if (this.contest.title.length === 0) {
      result = false;
    }
    if (this.contest.registrationEnd === null || this.contest.registrationEnd === undefined) {
      result = false;
    }
    if (this.contest.subjectIds.length === 0) {
      result = false;
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.rounds.length; i++) {
      if (this.rounds[i].startTime === null || this.rounds[i].startTime === undefined) {
        result = false;
      }
      if (this.rounds[i].duration === null || this.rounds[i].duration === undefined) {
        result = false;
      }
    }
    return result;
  }
}

import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ConfigService} from '../../../config/config.service';
import {Router} from '@angular/router';
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
  @ViewChild('pointsInput') pointsElem: ElementRef;
  @ViewChild('placeInput') placeElem: ElementRef;
  @ViewChild('saveBtn') saveBtnElem: ElementRef;

  constructor(
    private configService: ConfigService,
    public router: Router,
    public ref: ChangeDetectorRef,
    public fab: FabControllerService,
    public categoryService: CategoryService,
    public dialog: MatDialog) {
    if (!this.isFetching) {
      this.isFetching = true;
    }
    configService.requestContest(-1)
      .subscribe(value => {
        this.contest = value;
        this.isFetching = false;
      }, error => {
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
    const placeVal = this.placeElem.nativeElement.value;
    this.rounds[roundId].placeToPass = !value ? -1 : placeVal.length > 0 ? placeVal : -1;
  }

  onPointsSwitchChange(value, roundId) {
    const pointsVal = this.pointsElem.nativeElement.value;
    this.rounds[roundId].pointsToPass = !value ? -1 : pointsVal.length > 0 ? pointsVal : -1;
  }

  addEmptyRound() {
    this.rounds.push({
      roundNo: -1,
      strictMode: false,
      isOpen: false,
      duration: -1,
      placeToPass: -1,
      pointsToPass: -1,
      status: 'ACTIVE',
      startTime: -1
    });
  }

  getOrDefault(value, onDefault, defaultValue) {
    return value !== onDefault ? value : defaultValue;
  }

  getIsEqual(arg0, arg1) {
    return arg0 === arg1;
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
        case 'REGISTRATION OVER':
        case 'ONGOING':
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
          return 'Update';
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
          { backgroundColor: '#6EEB83' },
          { backgroundColor: '#6EEB83' },
          { backgroundColor: '#fff' }
        ], {
          duration: 1000,
          easing: 'linear'
        });
      }, error => {
        this.saveBtnElem.nativeElement.animate([
          // keyframes
          { backgroundColor: '#EF6351' },
          { backgroundColor: '#EF6351' },
          { backgroundColor: '#fff' }
        ], {
          duration: 1000,
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
      });
  }

  mainAction() {
    const oldStatus = this.contest.status;
    if (this.contest.status === 'UNPUBLISHED') {
      this.contest.status = 'REGISTRATION ON';
      this.configService.updateContest(this.contest)
        .subscribe(() => {
        }, () => {
          this.contest.status = oldStatus;
        });
    } else if (this.contest.status === 'REGISTRATION ON') {
      this.configService.registerToContest(this.contest.id)
        .subscribe(() => {
          this.contest.isRegistered = true;
        }, () => {
          this.contest.status = oldStatus;
        });
    }
  }

  setRegisterDate(date) {
    if (this.contest) {
      this.contest.registrationEnd = date;
    }
  }

}

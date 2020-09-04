import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {ContestLiveQuestionModel, ContestQuestion} from '../../../../config/config.service.model';
import {ConfigService} from '../../../../config/config.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FabControllerService} from '../../../../config/FabControllerService';
import {MatDialog} from '@angular/material/dialog';
import {EnterPasswordComponent} from './enter-password/enter-password.component';

@Component({
  selector: 'app-live-contest',
  templateUrl: './live-contest.component.html',
  styleUrls: ['./live-contest.component.css']
})
export class LiveContestComponent implements OnInit {

  data: ContestLiveQuestionModel;
  curr = 0;
  newAnswer = '';
  contestId: number;
  roundId: number;
  isClosed: false;
  timeLeft = 99999;

  constructor(
    private configService: ConfigService,
    public router: Router,
    public ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public fab: FabControllerService) {
    if (!this.isFetching) {
      this.isFetching = true;
    }
    fab.icon = '../../../assets/images/ic-material-list.svg';
    fab.onClickListener.subscribe(() => {
      this.switchFilter();
    });

    this.route
      .queryParams
      .subscribe(params => {
        this.roundId = params.id || -1;
        this.isClosed = params.closed || false;
        if (this.roundId === -1) {
          this.router.navigate(['**']);
        } else {
          if (this.isClosed.toString() === 'true') {
            this.openPassQuestion();
          } else {
            this.getQuestions('', this.roundId);
          }
        }
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

  getQuestions(password, roundId) {
    this.configService.getLiveQuestions(password, roundId)
      .subscribe(value => {
        this.data = value;
        this.timeLeft = this.data.timeLeft;
        this.isFetching = false;
      }, () => {
        this.openPassQuestion();
      });
  }

  openPassQuestion() {
    const dialogRef = this.dialog.open(EnterPasswordComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log(result);
        this.getQuestions(result, this.roundId);
      }
    });
  }

  switchFilter() {
    this.isFilterOpen = !this.isFilterOpen;
    setTimeout(() => {
      this.ref.markForCheck();
    }, 100);
  }

  clickCorrect(i) {
    switch (this.data.questions[this.curr].type) {
      case 'MULTIPLE CHOICE':
        const indexOfCorrect = this.data.questions[this.curr].answeredAnswers.indexOf(i);
        if (indexOfCorrect === -1) {
          this.data.questions[this.curr].answeredAnswers.push(i);
        } else {
          this.data.questions[this.curr].answeredAnswers.splice(indexOfCorrect, 1);
        }
        this.data.questions[this.curr].answeredAnswers.sort((a, b) => {
          return a - b;
        });
        break;
      case 'ONE CHOICE':
        this.data.questions[this.curr].answeredAnswers = [i];
        break;
    }
  }

  trackByFn(index, item) {
    return index;
  }

  saveQuestions() {
    this.configService.submitResult(this.data, this.contestId)
      .subscribe(value => {
        this.router.navigate(['/']);
      });
  }


}

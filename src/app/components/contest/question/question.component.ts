import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {ContestQuestion} from '../../../../config/config.service.model';
import {ConfigService} from '../../../../config/config.service';
import {Router} from '@angular/router';
import {FabControllerService} from '../../../../config/FabControllerService';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  data: ContestQuestion[] = [];
  curr = 0;
  newAnswer = '';
  contestId: number;
  roundId: number;

  constructor(
    private configService: ConfigService,
    public router: Router,
    public ref: ChangeDetectorRef,
    public fab: FabControllerService) {
    if (!this.isFetching) {
      this.isFetching = true;
    }
    fab.icon = '../../../assets/images/ic-material-list.svg';
    fab.onClickListener.subscribe(() => {
      this.switchFilter();
    });

    // TODO: get params later from url
    this.contestId = 1;
    this.roundId = 1;
    this.configService.getQuestions(this.contestId, this.roundId)
      .subscribe(value => {
        this.data = value;
        if (this.data.length === 0) {
          this.appendQuestion();
        }
        this.isFetching = false;
      }, () => {
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

  switchFilter() {
    this.isFilterOpen = !this.isFilterOpen;
    setTimeout(() => {
      this.ref.markForCheck();
    }, 100);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  clickCorrect(i) {
    console.log(i);
    console.log(this.data);
    console.log(this.data[this.curr].type);
    switch (this.data[this.curr].type) {
      case 'MULTIPLE CHOICE':
        const indexOfCorrect = this.data[this.curr].correctAnswer.indexOf(i);
        if (indexOfCorrect === -1) {
          this.data[this.curr].correctAnswer.push(i);
        } else {
          this.data[this.curr].correctAnswer.splice(indexOfCorrect, 1);
        }
        this.data[this.curr].correctAnswer.sort((a, b) => {
          return a - b;
        });
        break;
      case 'ONE CHOICE':
        this.data[this.curr].correctAnswer = [i];
        break;
    }
  }

  trackByFn(index, item) {
    return index;
  }

  addAnswer() {
    this.data[this.curr].options.push(this.newAnswer);
    this.newAnswer = '';
  }

  removeOption(index) {
    this.data[this.curr].options.splice(index, 1);
    const indexOfCorrect = this.data[this.curr].correctAnswer.indexOf(index);
    if (indexOfCorrect !== -1) {
      this.data[this.curr].correctAnswer.splice(indexOfCorrect, 1);
    }
    if (this.data[this.curr].options.length === 0) {
      const oldCurr = this.curr;
      this.curr = Math.max(0, this.curr - 1);
      if (this.data.length > 1) {
        this.data.splice(oldCurr, 1);
      }
    }
  }

  appendQuestion() {
    this.data.push({
      question: '',
      options: ['', ''],
      score: null,
      type: 'ONE CHOICE',
      correctAnswer: []
    });
  }

  saveQuestions() {
    this.configService.updateQuestions(this.data, this.contestId, this.roundId); // TODO: subscribe and show updating status
  }

}

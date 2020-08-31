import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {ContestQuestion} from '../../../../config/config.service.model';
import {ConfigService} from '../../../../config/config.service';
import {Router} from '@angular/router';
import {FabControllerService} from '../../../../config/FabControllerService';
import {Utils} from '../../../../config/utils';
import {ImageUploaderComponent} from '../../image-uploader/image-uploader.component';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  data: ContestQuestion[];

  constructor(
    private configService: ConfigService,
    public router: Router,
    public ref: ChangeDetectorRef,
    public fab: FabControllerService) {
    if (!this.isFetching) {
      this.isFetching = true;
    }
    fab.icon = '../../../assets/images/ic-metro-trophy.svg';
    fab.onClickListener.subscribe(() => {
      this.switchFilter();
    });

    // TODO: get params later from url
    const contestId = 2;
    const roundId = 1;
    this.configService.getQuestions(contestId, roundId)
      .subscribe(value => {
        this.data = value;
        if (this.data.length === 0) {
          this.data.push({
            question: '',
            options: [],
            score: -1,
            type: '',
            correctAnswer: []
          });
        }
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

}

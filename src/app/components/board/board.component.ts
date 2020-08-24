import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {Tournament} from '../../../config/config.service.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfigService} from '../../../config/config.service';
import {Utils} from '../../../config/utils';
import {CalendarDateFormatter, CalendarEvent, CalendarView} from 'angular-calendar';
import {isSameDay, isSameMonth} from 'date-fns';
import {Subject} from 'rxjs';
import {CustomDateFormatter} from './custom-date-formatter.provider';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {FabControllerService} from '../../../config/FabControllerService';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit {

  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    public router: Router,
    public ref: ChangeDetectorRef,
    public fab: FabControllerService) {
    fab.icon = '../../../assets/images/ic-material-filter-list.svg';
    fab.onClickListener.subscribe(() => {
      this.switchFilter();
    });
  }

  tournaments: Tournament[] = [];
  FETCH_SIZE = 10;
  isFetching = false;
  isSmallScreen = false;
  isFilterOpen = false;
  categoryList =
    [{
      color_id: 1,
      id: 1,
      name: 'Mathematics'
    }, {
      color_id: 2,
      id: 2,
      name: 'Phsyics'
    }, {
      color_id: 3,
      id: 3,
      name: 'Geography'
    }, {
      color_id: 4,
      id: 4,
      name: 'Biology'
    }, {
      color_id: 5,
      id: 5,
      name: 'Chemistry'
    }];

  filterFormGroup: FormGroup;


  @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen = false;
  private searchTimeout = undefined;

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isSmallScreen = document.body.offsetWidth < 1200;
    if (!this.isSmallScreen) {
      this.isFilterOpen = false;
    }
    this.fab.isHidden = !this.isSmallScreen;
  }

  ngOnInit(): void {
    this.isSmallScreen = document.body.offsetWidth < 1200;
    this.fab.isHidden = !this.isSmallScreen;
    this.filterFormGroup = this.formBuilder.group({
      search: [null, []],
      categories: [null, []],
      myContests: [null, []],
      pastContests: [null, []]
    });

    this.filterFormGroup.patchValue({
      search: '',
      categories: [],
      myContests: false,
      pastContests: false
    });

    if (!this.isFetching) {
      this.isFetching = true;
      this.fetchTournaments(this.tournaments.length, this.tournaments.length + this.FETCH_SIZE);
    }
  }

  formValueChanged() {
    console.log('called it');
    if (this.searchTimeout !== undefined) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      if (!this.isFetching) {
        this.isFetching = true;
        this.tournaments = [];
        this.fetchTournaments(this.tournaments.length, this.tournaments.length + this.FETCH_SIZE);
      }
    }, 1000);
  }

  fetchTournaments(from: number, to: number) {

    this.configService.getTournamentList(
      from,
      to,
      this.filterFormGroup.value.myContests,
      this.filterFormGroup.value.pastContests,
      this.filterFormGroup.value.search,
      this.filterFormGroup.value.categories,
    ).subscribe(
      value => {
        for (const elem of value) {
          this.tournaments.push(elem);
          this.events.push({
            start: new Date(elem.nextContestStart),
            end: new Date(elem.nextContestStart + elem.nextContestDuration * 60 * 1000),
            title: `${elem.title}. - ${moment(elem.nextContestStart).format('hh:mm')}`,
            color: {
              primary: this.getDefaultColor(elem.subjects),
              secondary: this.getDefaultColor(elem.subjects),
            },
            actions: null, // TODO: ???
            allDay: false,
            resizable: {
              beforeStart: false,
              afterEnd: false,
            },
            draggable: false,
            meta: elem
          });
        }
        this.isFetching = false;
      }
      , error => {
        this.isFetching = false;
      }
    );

    // TEST //
    for (let i = from; i < to; i++) {
      const elem = {
        id: 1,
        title: 'This is a test contest lol This is a test contest lol This is a test contest lol This is a test contest lol This is a test contest lol',
        body: 'we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.',
        imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
        registrationStart: 1590160650706,
        registrationEnd: 1599999504638,
        nextContestStart: 1590161299909,
        nextContestDuration: 180,
        subjects: this.categoryList,
        registeredCount: 3423
      };
      this.events.push({
        start: new Date(elem.nextContestStart),
        end: new Date(elem.nextContestStart + elem.nextContestDuration * 60 * 1000),
        title: `${elem.title}. - ${moment(elem.nextContestStart).format('hh:mm')}`,
        color: {
          primary: this.getDefaultColor(elem.subjects),
          secondary: this.getDefaultColor(elem.subjects),
        },
        actions: null, // TODO: ???
        allDay: false,
        resizable: {
          beforeStart: false,
          afterEnd: false,
        },
        draggable: false,
        meta: elem
      });
      this.tournaments.push(elem);
    }
    // TEST //
    this.refresh.next();
    const thisClass = this;
    setTimeout(() => {
      thisClass.isFetching = false;
    }, 500);
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    const scrollPos = this.getScrollPosition();
    if (scrollPos > 88.0 + 12.0 * (1 - 50 / (this.tournaments.length + 50))) {

      if (!this.isFetching && !this.isFilterOpen) {
        this.isFetching = true;
        this.fetchTournaments(this.tournaments.length, this.tournaments.length + this.FETCH_SIZE);
      }
    }
  }

  getScrollPosition() {
    const h = document.documentElement;
    const b = document.body;
    const st = 'scrollTop';
    const sh = 'scrollHeight';
    return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  getColor(colorId: number) {
    return Utils.subjectColor(colorId);
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0);
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = {event, action};
    this.router.navigate(['/contest', {id: event.meta.id}]);
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  getDefaultColor(subjects: any[]) {
    if (subjects.length === 0) {
      return '#000000';
    } else if (subjects.length === 1) {
      return this.getColor(subjects[0]);
    } else {
      return '#E8AA14';
    }
  }

  getFormattedDateTime(timestamp: number) {
    return moment(timestamp).format('DD MMM YYYY, hh:mm');
  }

  switchFilter() {
    this.isFilterOpen = !this.isFilterOpen;
    setTimeout(() => {
      this.ref.markForCheck();

    }, 100);
  }

}

import {AfterViewInit, ChangeDetectionStrategy, Component, HostListener, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Tournament} from '../../../config/config.service.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfigService} from '../../../config/config.service';
import {Utils} from '../../../config/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CalendarDateFormatter, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';
import {Subject} from 'rxjs';
import {CustomDateFormatter} from './custom-date-formatter.provider';
import * as moment from 'moment';
import {Router} from '@angular/router';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

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

  constructor(private formBuilder: FormBuilder, private configService: ConfigService, public router: Router) {
  }

  tournaments: Tournament[] = [];
  FETCH_SIZE = 10;
  isFetching = false;
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

  // filter
  searchString = '';
  categories = [];
  fromDate = new Date().getTime();
  toDate = 19999999999999;
  filterForm: FormGroup;


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

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      searchString: [null, []],
      categories: [null, []],
      fromDate: [null, []],
      toDate: [null, []]
    });

    if (!this.isFetching) {
      this.isFetching = true;
      this.fetchTournaments(this.tournaments.length, this.tournaments.length + this.FETCH_SIZE);
    }
  }

  fetchTournaments(from: number, to: number) {

    this.configService.getTournamentList(from, to, this.searchString, this.categories, this.fromDate, this.toDate).subscribe(
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
            meta: elem.id
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
        meta: elem.id
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

      if (!this.isFetching) {
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

  filterWithParams(params) {
    if (!this.filterForm.valid) {
      return;
    }
    this.categories = params.categories != null ? params.categories : this.categoryList;
    this.searchString = params.searchString != null ? params.searchString : '';
    this.fromDate = params.fromDate != null ? new Date(params.fromDate).getTime() : new Date().getTime();
    this.toDate = params.toDate != null ? new Date(params.toDate).getTime() : 19999999999999;
    this.tournaments = [];

    if (!this.isFetching) {
      this.isFetching = true;
      this.fetchTournaments(this.tournaments.length, this.tournaments.length + this.FETCH_SIZE);
    }
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
    this.router.navigate(['/contest', { id: event.meta }]);
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
}

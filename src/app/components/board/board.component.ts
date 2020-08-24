import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
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
import {CategoryService} from '../../../config/CategoryService';

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
    public fab: FabControllerService,
    public categoryService: CategoryService) {
    fab.icon = '../../../assets/images/ic-material-filter-list.svg';
    fab.onClickListener.subscribe(() => {
      this.switchFilter();
    });
  }

  events: CalendarEvent[] = [];
  tournaments: Tournament[] = [];
  filterFormGroup: FormGroup;

  FETCH_SIZE = 10;
  isFetching = false;
  isSmallScreen = false;
  isFilterOpen = false;
  private searchTimeout = undefined;

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  activeDayIsOpen = false;

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

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
    this.configService.getMyTournamentList()
      .subscribe(
        value => {
          this.events = [];
          for (const elem of value) {
            this.events.push({
              start: new Date(elem.nextContestStart),
              end: new Date(elem.nextContestStart + elem.nextContestDuration * 60 * 1000),
              title: elem.title,
              actions: null,
              allDay: false,
              resizable: {
                beforeStart: false,
                afterEnd: false,
              },
              draggable: false,
              meta: elem
            });
          }

          this.refresh.next();
        }
      );
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
        }
        this.isFetching = false;
      }
      , () => {
        this.isFetching = false;
      }
    );

    const thisClass = this;
    setTimeout(() => {
      thisClass.isFetching = false;
    }, 500);
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll() {
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
    this.router.navigate(['/contest', {id: event.meta.id}]).then(() => {
    });
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
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

import {Component, HostListener, OnInit} from '@angular/core';
import {Tournament} from '../../../config/config.service.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfigService} from '../../../config/config.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  tournaments: Tournament[] = [];
  FETCH_SIZE = 10;
  isFetching = false;
  categoryList = ['მათემატიკა', 'ფიზიკა', 'ქიმია', 'ბიოლოგია'];

  // filter
  searchString = '';
  categories = this.categoryList;
  fromDate = new Date().getTime();
  toDate = 19999999999999;
  filterForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private configService: ConfigService) {
  }

  fetchTournaments(from: number, to: number) {

    this.configService.getTournamentList(from, to, this.searchString, this.categories, this.fromDate, this.toDate).subscribe(
      value => {
        for (const elem of value) {
          this.tournaments.push(elem);
        }
        this.isFetching = false;
      }
      , error => {
        this.isFetching = false;
      }
    );

    for (let i = from; i < to; i++) {
      this.tournaments.push({
        id: 1,
        title: 'This is a test contest lol This is a test contest lol This is a test contest lol This is a test contest lol This is a test contest lol',
        body: 'we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.we are happy to inform you that this is a test header.',
        imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
        registrationStart: 1590160650706,
        registrationEnd: 1599999504638,
        nextContestStart: 1590161299909,
        nextContestDuration: 180,
        subjects: [{
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
        }],
        registeredCount: 3423
      });
    }
    const thisClass = this;
    setTimeout(() => {
      thisClass.isFetching = false;
    }, 500);
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

}

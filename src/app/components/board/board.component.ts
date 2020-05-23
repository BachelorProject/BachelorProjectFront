import {Component, HostListener, OnInit} from '@angular/core';
import {Tournament} from '../../../config/config.service.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfigService} from '../../../config/config.service';
import {MatSnackBar} from '@angular/material/snack-bar';

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

  constructor(private formBuilder: FormBuilder, private configService: ConfigService, private snackBar: MatSnackBar) {
  }

  fetchTournaments(from: number, to: number) {

    this.configService.getTournamentList(from, to, this.searchString, this.categories, this.fromDate, this.toDate).subscribe(
      value => {
        // @ts-ignore
        for ( const elem of value){// we know that value should be a list so we ignore error.
          this.tournaments.push(elem);
        }
        this.isFetching = false;
      }
      , error => {
        this.snackBar.open('Something went wrong', 'Dismiss', {duration: 5000});
        this.isFetching = false;
      }
    );

    // for (let i = from; i < to; i++) {
    //   this.tournaments.push({
    //     id: 1,
    //     title: 'This is a test contest lol',
    //     body: '<h2>Happy feast of winter veil!</h2><p>&nbsp; &nbsp; we are happy to inform you that fuck you:</p><ol><li>fuck you</li><li>fuck you</li><li>fuck you</li><li>fuck you</li><li>fuck you</li><li>t</li><li>t</li><li>w</li><li>e</li><li>e</li></ol><p>asdasdasdasd</p><p><strong>sadaasd &nbsp;sad asd asd asd asd a.</strong> dasda :</p><ul><li>asdasdasd <strong>asd </strong>asdads</li><li>asdasd asd.</li></ul><blockquote><p>asdasdasd</p></blockquote>',
    //     imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
    //     registrationStart: 1590160650706,
    //     registrationEnd: 1590160850706,
    //     nextContestStart: 1590161250706,
    //     nextContestDuration: 180,
    //     category: 'მათემატიკა'
    //   });
    // }
    // const thisClass = this;
    // setTimeout(() => {
    //   thisClass.isFetching = false;
    // }, 500);
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
    if (scrollPos > 88.0) {

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

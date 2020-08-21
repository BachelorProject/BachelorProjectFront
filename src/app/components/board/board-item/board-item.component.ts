import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Tournament} from '../../../../config/config.service.model';
import * as moment from 'moment';

@Component({
  selector: 'app-board-item',
  templateUrl: './board-item.component.html',
  styleUrls: ['./board-item.component.css']
})
export class BoardItemComponent implements OnInit {
  @Input() data: Tournament;
  isRegistered = false;
  timeLeft = 5;

  constructor() {
  }

  ngOnInit(): void {
    this.timeLeft = Math.round((this.data.registrationEnd - new Date().getTime()) / 1000);
    console.log(this.timeLeft);
  }

  floor(num: number) {
    return Math.floor(num);
  }

  register(evt) {
    evt.stopPropagation();
    if (this.isRegistered) {
      return;
    }
    // do some logic and on response call this bellow
    const registerButton = evt.currentTarget;
    registerButton.classList = ['registered'];
    registerButton.innerText = 'registered';
    this.isRegistered = true;
  }

  getFormattedDateTime(timestamp: number) {
    return moment(timestamp).format('DD MMM YYYY, hh:mm');
  }

}

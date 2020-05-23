import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Tournament} from '../../../../config/config.service.model';
import {Utils} from '../../../../config/utils';

@Component({
  selector: 'app-board-item',
  templateUrl: './board-item.component.html',
  styleUrls: ['./board-item.component.css']
})
export class BoardItemComponent implements OnInit, AfterViewInit {
  @Input() data: Tournament;

  @ViewChild('contest') contestElem: ElementRef;
  @ViewChild('fade') fadeElem: ElementRef;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.contestElem.nativeElement.offsetHeight < 550){
      this.fadeElem.nativeElement.style.display = 'none';
    }
  }

  getFormatted(timestamp: number) {
    const date = new Date(timestamp);
    return date.getDate() + ' ' + Utils.numberToMonth(date.getMonth());
  }

}

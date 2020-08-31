import {Component, Input, OnInit} from '@angular/core';
import {Subject} from '../../../config/config.service.model';
import {Utils} from '../../../config/utils';

@Component({
  selector: 'app-subject-tag',
  templateUrl: './subject-tag.component.html',
  styleUrls: ['./subject-tag.component.css']
})
export class SubjectTagComponent implements OnInit {
  @Input() subject: Subject;
  color: string;
  @Input() isMoreTag = false;
  @Input() moreSubjects: Subject[] = [];
  @Input() mode = 'lg';
  moreTitle = 'non tits';

  constructor() {
  }


  ngOnInit(): void {
    this.moreTitle = '';
    for (const sub of this.moreSubjects) {
      this.moreTitle += sub.name + ',';
    }
    this.moreTitle = this.moreTitle.substr(0, this.moreTitle.length - 1);
    if (this.subject != null) {
      this.color = Utils.subjectColor(this.subject.colorId);
    }
  }

}

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
  constructor() {}


  ngOnInit(): void {
    console.log('subject   ' +  this.subject);
    this.color = Utils.subjectColor(this.subject.color_id);
  }

}

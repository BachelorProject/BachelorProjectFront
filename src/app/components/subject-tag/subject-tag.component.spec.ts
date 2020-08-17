import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectTagComponent } from './subject-tag.component';

describe('SubjectTagComponent', () => {
  let component: SubjectTagComponent;
  let fixture: ComponentFixture<SubjectTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

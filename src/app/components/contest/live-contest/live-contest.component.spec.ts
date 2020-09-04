import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveContestComponent } from './live-contest.component';

describe('LiveContestComponent', () => {
  let component: LiveContestComponent;
  let fixture: ComponentFixture<LiveContestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveContestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

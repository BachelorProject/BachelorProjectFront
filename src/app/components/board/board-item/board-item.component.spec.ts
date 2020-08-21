import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardItemComponent } from './board-item.component';

describe('BoardItemComponent', () => {
  let component: BoardItemComponent;
  let fixture: ComponentFixture<BoardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardItemComponent);
    component = fixture.componentInstance;
    component.data = {
      id: 1,
      title: 'This is a test contest lol',
      body: '<h2>I am dummy data header for dummy contest.</h2>',
      imageUrl: 'https://avatar.onlinesoccermanager.nl/03319541v1.png',
      registrationStart: 1590160650706,
      registrationEnd: 1590160850706,
      nextContestStart: 1590161250706,
      nextContestDuration: 180,
      subjects: [{
        color_id: 1,
        id: 1,
        name: 'Mathematics'
      }],
      registeredCount: 213
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

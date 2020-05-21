import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterOutlet} from '@angular/router';
import {MenuComponent} from './components/menu/menu.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MenuComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'BachelorProjectFront'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Olympo');
  });

});

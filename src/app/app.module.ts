import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

import {MenuComponent} from './components/menu/menu.component';
import {AppComponent} from './app.component';
import {ConfigService} from '../config/config.service';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {BoardComponent} from './components/board/board.component';
import {BoardItemComponent} from './components/board/board-item/board-item.component';
import {APIInterceptor} from '../config/APIInterceptor';
import {EditorComponent} from './components/editor/editor.component';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

import {AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {SubjectTagComponent} from './components/subject-tag/subject-tag.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {CountdownModule} from 'ngx-countdown';
import {NgSwitcheryModule} from 'angular-switchery-ios';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FlatpickrModule} from 'angularx-flatpickr';
import {FabControllerService} from '../config/FabControllerService';
import {CategoryService} from '../config/CategoryService';
import {LeaderboardComponent} from './components/leaderboard/leaderboard.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {ContestComponent} from './components/contest/contest.component';
import {ImageUploaderComponent} from './components/image-uploader/image-uploader.component';
import {MatDialogModule} from '@angular/material/dialog';
import {DragDropDirective} from './components/image-uploader/DragDropDirective';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { QuestionComponent } from './components/contest/question/question.component';

const appRoutes: Routes = [
  {path: 'auth', component: WelcomeComponent},
  {path: '', component: BoardComponent},
  {path: 'editor', component: EditorComponent},
  // {path: '**', component: PageNotFoundComponent},
  {path: 'leaderboard', component: LeaderboardComponent},
  {path: 'contest', component: ContestComponent}
];

const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('282612922769382')
  },
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('616971751002-usm5cqoimng46fake1g3qbslu3cgfcd1.apps.googleusercontent.com')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    MenuComponent,
    EditorComponent,
    MenuComponent,
    BoardComponent,
    BoardItemComponent,
    SubjectTagComponent,
    PageNotFoundComponent,
    LeaderboardComponent,
    ContestComponent,
    ImageUploaderComponent,
    DragDropDirective,
    QuestionComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true} // <-- debugging purposes only
    ),
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    CKEditorModule,
    SocialLoginModule,
    CountdownModule,
    NgSwitcheryModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModule,
    NgxPaginationModule,
    MatDialogModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule
  ],
  providers: [ConfigService,
    FabControllerService,
    CategoryService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true,
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }],
  bootstrap: [AppComponent],
  exports: [DragDropDirective]
})
export class AppModule {
}

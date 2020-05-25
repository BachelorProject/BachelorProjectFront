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
import {MatFormFieldModule} from '@angular/material/form-field';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

import { MenuComponent } from './components/menu/menu.component';
import {AppComponent} from './app.component';
import {ConfigService} from '../config/config.service';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { EditorComponent } from './components/editor/editor.component';
const appRoutes: Routes = [
  {path: '', component: WelcomeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    MenuComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true} // <-- debugging purposes only
    ),
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
    CKEditorModule
  ],
  providers: [ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FabControllerService} from '../config/FabControllerService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Olympo';
  isScreenSmall = false;
  showHeader = true;

  constructor(public router: Router, public activatedRoute: ActivatedRoute, public fab: FabControllerService) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.activatedRoute.queryParams.subscribe(params => {
          const urlTree = this.router.parseUrl(this.router.url);
          console.log(urlTree.root.children.primary.segments[0].path);
          this.showHeader = urlTree.root.children.primary.segments[0].path !== 'auth';
        });
      }
    });
  }

  ngOnInit(): void {
    this.isScreenSmall = document.body.offsetWidth < 1000;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isScreenSmall = document.body.offsetWidth < 1000;
  }
}

import {Injectable} from '@angular/core';
import {Subject} from './config.service.model';
import {ConfigService} from './config.service';

@Injectable()
export class CategoryService {
  categories: Subject[] = [];

  constructor(private configService: ConfigService) {
    configService.fetchCategories()
      .subscribe(value => {
        this.categories = value;
      }, error => {});
  }

  getCategoryById(catId: number) {
    const id = this.categories.map(elem => {
      return elem.id;
    }).indexOf(catId);
    if ( id === -1) {
      return undefined;
    } else {
      return this.categories[id];
    }
  }

}

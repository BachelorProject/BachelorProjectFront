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
      });
  }

}

import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class FabControllerService {
  onClickListener = new Subject();
  isHidden = true;
  icon: string;
}

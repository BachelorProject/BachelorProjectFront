import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Tournament} from './config.service.model';

@Injectable()
export class ConfigService {

  constructor(private http: HttpClient) {

  }

  getTournamentList(fromNum: number, toNum: number, searchString: string, categories: string[], fromDate: number, toDate: number) {
    const params = new HttpParams({
      fromObject: {
        fromNum: fromNum.toString(),
        toNum: toNum.toString(),
        searchString,
        categories,
        fromDate: fromDate.toString(),
        toDate: toDate.toString()
      }
    });
    return this.http.get<Tournament>('tournament/list', {params});
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IQuestion, IResponseGetCategories } from 'src/app/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreguntadosService {
  constructor(public http : HttpClient) {}

  getQuestions (topic: string) {
    return this.http.get(`https://8a9c9faf-5b71-4d35-b4b4-7e40b45651f5.mock.pstmn.io/${topic}`) as Observable<IQuestion[]>;
  }

  getCategories () {
    return this.http.get(`https://8a9c9faf-5b71-4d35-b4b4-7e40b45651f5.mock.pstmn.io/categories`) as Observable<IResponseGetCategories>;
  }
}

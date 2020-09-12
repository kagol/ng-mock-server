import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

let apiPrefix = 'v1';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  fetchCards() {
    return this.http.get(`${apiPrefix}/cards`);
  }

}

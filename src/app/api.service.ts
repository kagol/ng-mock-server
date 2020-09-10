import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_PREFIX = 'http://localhost:9090';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  fetchCards() {
    return this.http.get(`${API_PREFIX}/cards`);
  }

}

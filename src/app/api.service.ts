import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

let apiPrefix = 'http://localhost:9090';

if(environment.production) {
  apiPrefix = 'http://backend-url';
}

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

import { Component } from '@angular/core';
import { ApiService } from '@app/api.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-demo';

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit() {
    console.log('environment:', environment);
    this.apiService.fetchCards().subscribe(cards => {
      console.log('cards:', cards);
    });
  }
}

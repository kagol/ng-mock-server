import { Component } from '@angular/core';
import { ApiService } from '@app/api.service';
import { CardInterface } from './shared/types/card.interface';

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
    this.apiService.fetchCards().subscribe((cards: CardInterface) => {
      console.log('cards:', cards);
    });
  }
}

import { Component } from '@angular/core';
import { ExchangeRatesService } from './shared/services/exchange-rates.service';
import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private localStorageService: LocalStorageService,
    private exchangeRatesService: ExchangeRatesService
  ) {
    console.log('INITIALISE APP');
    if (localStorageService.loginData) {
      // update exchange rates if logged in
      this.exchangeRatesService
        .getAllExchangeRates()
        .subscribe((exchangeRates) => {
          localStorageService.loginData = { ... localStorageService.loginData, exchangeRates};
        });
    }
  }
}

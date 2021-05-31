import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private router: Router) {
  }

  checkFormActive(): boolean {
    const formRoutes = ['/tabs/bills/add'];
    return formRoutes.includes(this.router.url);
  }
}

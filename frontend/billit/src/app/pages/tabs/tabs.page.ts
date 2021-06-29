import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  formRoutes: string[];

  constructor(
    private router: Router,
    private sharedService: SharedService
  ) {
    this.formRoutes = ['/tabs/bills/add', '/tabs/bills/edit'];
    this.sharedService
      .getMyAccountEditCall()
      .subscribe((isEdit) => {
        if (isEdit) {
          this.formRoutes.push('/tabs/more/account');
        } else {
          this.formRoutes.pop();
        }
      });
  }

  checkFormActive(): boolean {
    return this.formRoutes.includes(this.router.url);
  }
}

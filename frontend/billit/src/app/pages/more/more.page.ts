import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {

  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}

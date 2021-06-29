import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
  }

  goToMyAccount() {
    this.router.navigate(['./account'], {relativeTo: this.route});
  }

  goToFAQ() {
    this.router.navigate(['./faq'], {relativeTo: this.route});
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}

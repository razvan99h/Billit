import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers = [
    ['carrefour.png', 'https://carrefour.ro/promotii-carrefour'],
    ['lidl.png', 'https://www.lidl.ro/cataloage'],
    ['penny.png', 'https://www.penny.ro/oferte'],
    ['kaufland.png', 'https://www.kaufland.ro/kaufland-card/promotii-saptamanale.html'],
    ['decathlon.png', 'https://www.decathlon.ro/'],
    ['hm.png', 'https://www2.hm.com/ro_ro/reduceri.html'],
    ['newyorker.jpeg', 'https://www.newyorker.de/ro/'],
    ['pullbear.png', 'https://www.pullandbear.com/ro/'],
  ];

  constructor() {
  }

  ngOnInit() {
  }

  openLink(index: number) {
    window.open(this.offers[index][1], '_system', 'location=yes');
  }
}

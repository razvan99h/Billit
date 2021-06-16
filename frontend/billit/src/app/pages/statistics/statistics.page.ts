import { Component, OnInit } from '@angular/core';
import { Statistics } from '../../shared/models/statistics.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { StatisticsService } from '../../shared/services/statistics.service';
import { ToastService } from '../../shared/services/toast.service';
import { StatisticsRequest, StatisticsRequestType } from '../../shared/models/api/statistics-api.models';
import { ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {

  currency: string;
  month: string;
  storesStatistics = Statistics.empty();
  categoriesStatistics = Statistics.empty();

  colors = ['#ff6356', '#ffd246', '#78d237', '#2d73f5', '#aa46be'];
  gray = '#afafaf';
  doughnutChartColors: Color[];
  barChartColors: Color[];
  doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  expandedStores = false;
  expandedCategories = false;

  constructor(
    private localStorageService: LocalStorageService,
    private statisticsService: StatisticsService,
    private toastService: ToastService,
  ) {
    this.month = new Date().toISOString();
    this.currency = localStorageService.loginData.currency;
    this.fetchStatistics();
    this.doughnutChartColors = [{
      backgroundColor: [...StatisticsPage.shuffle(this.colors), this.gray]
    }];
    this.barChartColors = [{
      backgroundColor: [...StatisticsPage.shuffle(this.colors), this.gray]
    }];
  }

  private static shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  ngOnInit() {
  }

  segmentChanged(event: any) {

  }

  private fetchStatistics() {
    const requestModel: StatisticsRequest = {
      currency: this.currency,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      month: new Date().toLocaleDateString('en-US'),
    };
    this.statisticsService
      .getStatistics(StatisticsRequestType.stores, requestModel)
      .subscribe(statistics => {
        this.storesStatistics = statistics;
        console.log(statistics);
      }, () => this.toastService.presentErrorToast('Could not load store statistics'));
    this.statisticsService
      .getStatistics(StatisticsRequestType.categories, requestModel)
      .subscribe(statistics => {
        this.categoriesStatistics = statistics;
        console.log(statistics);

      }, () => this.toastService.presentErrorToast('Could not load store statistics'));
  }
}

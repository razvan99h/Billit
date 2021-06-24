import { Component, OnInit } from '@angular/core';
import { Statistics } from '../../shared/models/statistics.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { StatisticsService } from '../../shared/services/statistics.service';
import { ToastService } from '../../shared/services/toast.service';
import { StatisticsRequest, StatisticsRequestType } from '../../shared/models/api/statistics-api.models';
import { ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { StatisticsTab } from '../../shared/models/enums/statistics.tab';

// @ts-ignore
import Moment from 'moment';
import { extendMoment } from 'moment-range';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  STATISTICS_TAB = StatisticsTab;
  tab = StatisticsTab.MONTH;
  currency: string;
  day: string;
  month: string;
  intervalStart: string;
  intervalEnd: string;
  storesStatistics = Statistics.empty();
  categoriesStatistics = Statistics.empty();
  moment;

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
    this.currency = localStorageService.loginData.currency;
    this.moment = extendMoment(Moment);
    this.moment.locale(window.navigator.language);

    this.doughnutChartColors = [{
      backgroundColor: [...StatisticsPage.shuffle(this.colors), this.gray]
    }];
    this.barChartColors = [{
      backgroundColor: [...StatisticsPage.shuffle(this.colors), this.gray]
    }];
    this.initializeDates();
    this.fetchStatistics();
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
    this.tab = event.detail.value;
    this.fetchStatistics();
  }

  fetchStatistics() {
    const dateFormat = 'yyyy-MM-DD HH:mm';
    let requestModel: StatisticsRequest = {
      currency: this.currency,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    if (this.tab === StatisticsTab.DAY) {
      requestModel = {
        ...requestModel,
        date: this.moment(this.day).format(dateFormat),
      };
    } else if (this.tab === StatisticsTab.MONTH) {
      requestModel = {
        ...requestModel,
        month: this.moment(this.month).format(dateFormat),
      };
    } else if (this.tab === StatisticsTab.INTERVAL) {
      requestModel = {
        ...requestModel,
        from: this.moment(this.intervalStart).format(dateFormat),
        to: this.moment(this.intervalEnd).format(dateFormat),
      };
    }
    this.statisticsService
      .getStatistics(StatisticsRequestType.stores, requestModel)
      .subscribe((statistics) => {
        this.storesStatistics = statistics;
      }, () => this.toastService.presentErrorToast('Could not load store statistics'));
    this.statisticsService
      .getStatistics(StatisticsRequestType.categories, requestModel)
      .subscribe((statistics) => {
        this.categoriesStatistics = statistics;
      }, () => this.toastService.presentErrorToast('Could not load categories statistics'));
  }

  private initializeDates() {
    const now = new Date();
    this.day = this.month = now.toISOString();
    this.intervalStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
    this.intervalEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 0).toISOString();
  }
}

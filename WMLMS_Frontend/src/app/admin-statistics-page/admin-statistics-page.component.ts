// Angular
import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {firstValueFrom} from 'rxjs';

// Highcharts
import Highcharts, {PointOptionsObject} from 'highcharts';
import {HighchartsChartModule} from 'highcharts-angular';

// Project
import {AdminServiceService} from '../admin-service.service';

@Component({
  selector: 'app-admin-statistics-page',
  imports: [
    HighchartsChartModule,
    MatButton,
    NgIf,
  ],
  templateUrl: './admin-statistics-page.component.html',
  standalone: true,
  styleUrl: './admin-statistics-page.component.css'
})
export class AdminStatisticsPageComponent {

  adminService: AdminServiceService = inject(AdminServiceService);

  isError : boolean = false;

  // KPI
  userCount : number = 0;
  artistCount : number = 0;
  playlistCount : number = 0;
  songCount : number = 0;
  forumCount : number = 0;
  commentCount : number = 0;

  // Charts
  topTenArtistsBarChart: typeof Highcharts = Highcharts;
  topTenArtistsBarData : (number | [string, number | null] | PointOptionsObject | null)[] = [];
  topTenArtistsBarOptions: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    xAxis: {
      type: 'category'
    },
    title: {
      text: 'Top 10 artists by followers'
    },
    subtitle: {
      text: ''
    },
    tooltip: {
      headerFormat: '',
      pointFormat:
        '<span style="color:{point.color}">\u25cf</span> ' +
        '{point.name}: <b>{point.percentage:.2f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        borderWidth: 2,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br>{point.percentage:.2f}%',
          distance: 20
        }
      }
    },
    series: [{
      type: 'column',
      name: '',
      data: []
    }]
  };

  explicitRepartitionChart: typeof Highcharts = Highcharts;
  explicitRepartitionData : (number | [string, number | null] | PointOptionsObject | null)[] = [];
  explicitRepartitionOptions: Highcharts.Options = {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Explicit tracks repartition'
    },
    subtitle: {
      text: ''
    },
    tooltip: {
      headerFormat: '',
      pointFormat:
        '<span style="color:{point.color}">\u25cf</span> ' +
        '{point.name}: <b>{point.percentage:.2f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        borderWidth: 2,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br>{point.percentage:.2f}%',
          distance: 20
        }
      }
    },
    series: [{
      type: 'pie',
      name: 'Share',
      data: []
    }]
  };

  updateFlag : boolean = false;

  // Reload charts with updated data
  onUpdateCharts() {

    this.updateFlag = false;

    // Reload pie chart
    if(this.explicitRepartitionOptions && this.explicitRepartitionOptions.series)
    {
      this.explicitRepartitionOptions.series = [{
        type: 'pie',
        name: 'Share',
        data: this.explicitRepartitionData
      }]
    }

    // Reload column chart
    if(this.topTenArtistsBarOptions && this.topTenArtistsBarOptions.series)
    {
      this.topTenArtistsBarOptions.series = [{
        type: 'column',
        name: 'Followers',
        data: this.topTenArtistsBarData
      }]
    }

    // Update charts using the update flag
    this.updateFlag = true;
  }

  // Convert backend data into chart-usable data
  convertQueryResultToData(data: any) : (number | [string, number | null] | PointOptionsObject | null)[]
  {
    // Check for errors
    let { message } = data;

    let isError = (message !== undefined);

    // Error message detected
    if(isError)
    {
      return [];
    }

    // Only two elements are expected
    if(data[1].length != 2)
    {
      return [];
    }

    // We get categorical values from the second element of the array
    let fields = [];

    for (let item of data[1]) {
      fields.push(item.field);
    }

    // We get the values from the first element of the array
    let result = [];

    for (let tuple of data[0]) {
      result.push({name: tuple[fields[0]], y: tuple[fields[1]] });
    }

    return result;
  }

  // Preload the values of both charts
  async getValues() {

    // Load the pie chart values
    this.explicitRepartitionData = this.convertQueryResultToData(await firstValueFrom(this.adminService.customQuery(
      "SELECT EXPLICIT, COUNT(*) FROM TRACKS GROUP BY EXPLICIT"
    )))

    // Load the column chart values
    this.topTenArtistsBarData =  this.convertQueryResultToData(await firstValueFrom(this.adminService.customQuery(
      "SELECT NAME, FOLLOWERS FROM ARTISTS ORDER BY FOLLOWERS DESC NULLS LAST FETCH FIRST 10 ROWS ONLY"
    )))

    // Update the charts
    this.onUpdateCharts()
  }

  async ngOnInit() {

    // Load and update charts with up-to-date values
    await this.getValues();

    // User count KPI
    this.adminService.customCount("SELECT COUNT(*) FROM USERS"
    ).subscribe({ next : data => {
      this.isError = false;
      this.userCount = data;
    }, error : err => {
        this.onError(err);
      }
    });

    // Artists count KPI
    this.adminService.customCount("SELECT COUNT(*) FROM ARTISTS"
    ).subscribe({ next : data => {
        this.isError = false;
        this.artistCount = data;
      }, error : err => {
        this.onError(err);
      }
    });

    // Tracks count KPI
    this.adminService.customCount("SELECT COUNT(*) FROM TRACKS"
    ).subscribe({ next : data => {
        this.isError = false;
        this.songCount = data;
    }, error : err => {
        this.onError(err);
      }
    });

    // Playlists count KPI
    this.adminService.customCount("SELECT COUNT(*) FROM Playlists"
    ).subscribe({ next : data => {
        this.isError = false;
        this.playlistCount = data;
    }, error : err => {
        this.onError(err);
      }
    });

    // Comments count KPI
    this.adminService.customCount("SELECT COUNT(*) FROM COMMENTS"
    ).subscribe({ next : data => {
        this.isError = false;
        this.commentCount = data;
    }, error : err => {
        this.onError(err);
      }
    });

    // Forums post count KPI
    this.adminService.customCount("SELECT COUNT(*) FROM FORUM_POSTS"
    ).subscribe({ next : data => {
        this.isError = false;
        this.commentCount = data;
    }, error : err => {
        this.onError(err);
      }
    });
  }

  // Error handling when loading KPI
  onError(error : string) {
    this.isError = true;
    console.log('Failed to load the data ! :', error);
  }
}

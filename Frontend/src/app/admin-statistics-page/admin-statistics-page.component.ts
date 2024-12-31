// Angular
import {Component, inject} from '@angular/core';
import {NgIf} from '@angular/common';
import {firstValueFrom} from 'rxjs';

// Highcharts
import Highcharts, {PointOptionsObject} from 'highcharts';
import {HighchartsChartModule} from 'highcharts-angular';

// Project
import {AdminService} from '../admin-service.service';

// Pie chart tutorial : https://www.highcharts.com/demo/highcharts/pie-chart
// Column chart tutorial : https://www.highcharts.com/demo/highcharts/column-basic

@Component({
  selector: 'app-admin-statistics-page',
  imports: [
    HighchartsChartModule,
    NgIf,
  ],
  templateUrl: './admin-statistics-page.component.html',
  standalone: true,
  styleUrl: './admin-statistics-page.component.css'
})
export class AdminStatisticsPageComponent {

  adminService: AdminService = inject(AdminService);

  isError : boolean = false;

  // KPI
  userCount : number = 0;
  artistCount : number = 0;
  playlistCount : number = 0;
  songCount : number = 0;
  albumCount : number = 0;
  playlistTrackCount : number = 0;

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
        '{point.name}: <b>{point.y}</b>'
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
  convertQueryResultToData(data: any[]) : (number | [string, number | null] | PointOptionsObject | null)[]
  {
    // Only two elements are expected
    if(data.length <= 0)
    {
      return [];
    }

    // We get categorical values from the second element of the array
    let fields = data.map(obj=> Object.keys(obj))[0];

    // We get the values from the first element of the array
    let result = [];

    for (let tuple of data) {
      result.push({name: String(tuple[fields[0]]), y: Number(tuple[fields[1]]) });
    }

    return result;
  }

  // Preload the values of both charts
  async getValues() {

    // Load the pie chart values
    this.explicitRepartitionData = this.convertQueryResultToData(await firstValueFrom(this.adminService.getTracksExplicitCount()));

    // Load the column chart values
    this.topTenArtistsBarData =  this.convertQueryResultToData(await firstValueFrom(this.adminService.getArtistsTopTen()));

    // Update the charts
    this.onUpdateCharts()
  }

  async ngOnInit() {

    // Load and update charts with up-to-date values
    await this.getValues();

    // User count KPI
    this.adminService.customCount("USERS"
    ).subscribe({ next : count => {
      this.isError = false;
      this.userCount = count;
    }, error : err => {
        this.onError(err);
      }
    });

    // Artists count KPI
    this.adminService.customCount("ARTISTS"
    ).subscribe({ next : count => {
        this.isError = false;
        this.artistCount = count;
      }, error : err => {
        this.onError(err);
      }
    });

    // Tracks count KPI
    this.adminService.customCount("TRACKS"
    ).subscribe({ next : count => {
        this.isError = false;
        this.songCount = count;
    }, error : err => {
        this.onError(err);
      }
    });

    // Playlists count KPI
    this.adminService.customCount("PLAYLISTS"
    ).subscribe({ next : count => {
        this.isError = false;
        this.playlistCount = count;
    }, error : err => {
        this.onError(err);
      }
    });

    // Comments count KPI
    this.adminService.customCount("ALBUMS"
    ).subscribe({ next : count => {
        this.isError = false;
        this.albumCount = count ;
    }, error : err => {
        this.onError(err);
      }
    });

    // Forums post count KPI
    this.adminService.customCount("PLAYLIST_TRACKS"
    ).subscribe({ next : count => {
        this.isError = false;
        this.playlistTrackCount = count;
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

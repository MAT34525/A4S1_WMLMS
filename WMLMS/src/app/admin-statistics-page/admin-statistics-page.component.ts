import {Component, inject} from '@angular/core';
import Highcharts, {PointOptionsObject} from 'highcharts';
import {HighchartsChartModule} from 'highcharts-angular';
import {AdminServiceService} from '../admin-service.service';
import genreRepartitionChart from 'highcharts';
import topTenArtistsBarChart from 'highcharts';
import {AgGridAngular} from 'ag-grid-angular';
import {MatButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {SplitAreaComponent, SplitComponent} from 'angular-split';

@Component({
  selector: 'app-admin-statistics-page',
  imports: [
    HighchartsChartModule,
    AgGridAngular,
    MatButton,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SplitAreaComponent,
    SplitComponent
  ],
  templateUrl: './admin-statistics-page.component.html',
  standalone: true,
  styleUrl: './admin-statistics-page.component.css'
})
export class AdminStatisticsPageComponent {

  updateFlag = false;

  isError : boolean = false;

  userCount : number = 0;
  artistCount : number = 0;
  playlistCount : number = 0;
  songCount : number = 0;
  forumCount : number = 0;
  commentCount : number = 0;

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

  genreRepartitionChart: typeof Highcharts = Highcharts;
  genreRepartitionData : (number | [string, number | null] | PointOptionsObject | null)[] = [];
  genreRepartitionOptions: Highcharts.Options = {
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

  adminService: AdminServiceService = inject(AdminServiceService);

  constructor() {

  }

  onUpdateCharts() {

    this.updateFlag = false;

    console.log(this.genreRepartitionData);
    console.log(this.topTenArtistsBarData);

    if(this.genreRepartitionOptions && this.genreRepartitionOptions.series)
    {
      this.genreRepartitionOptions.series = [{
        type: 'pie',
        name: 'Share',
        data: this.genreRepartitionData
      }]
    }

    if(this.topTenArtistsBarOptions && this.topTenArtistsBarOptions.series)
    {
      this.topTenArtistsBarOptions.series = [{
        type: 'column',
        name: 'Followers',
        data: this.topTenArtistsBarData
      }]
    }

    this.updateFlag = true;
  }

  convertQueryResultToData(data: any) : (number | [string, number | null] | PointOptionsObject | null)[]
  {
    let { message } = data;

    // Check if the response is valid
    let isError = (message !== undefined);

    if(isError)
    {
      return [];
    }

    // We must have only 2 columns
    if(data[1].length < 2)
    {
      return [];
    }

    // We assume the following : the first column is the name, the second is the value

    // We get the two fields :
    let fields = [];

    for (let item of data[1]) {
      fields.push(item.field);
    }

    console.log(fields);

    // We extract the two fields for each item in the data
    let result = [];

    for (let tuple of data[0]) {
      result.push({name: tuple[fields[0]], y: tuple[fields[1]] });
    }

    result[0] = {
      name: result[0].name,
      y: result[0].y
    }

    console.log(result);

    return result;
  }

  ngOnInit() {

    /*
    this.adminService.customQuery(
      "SELECT USERNAME, COUNT(*) " +
      "FROM USERS GROUP BY USERNAME"
    ).subscribe({ next : data => {
        this.topTenArtistsBarData = this.convertQueryResultToData(data);
        this.onUpdateCharts();
    }, error : err => {
      this.onError();
    }
    });
    */

    this.topTenArtistsBarData = [
      {
        name: 'Taylor Swift',
        y: 9500,
        sliced: true,
        selected: true
      },
      {
        name: 'Drake',
        y: 8700
      },
      {
        name: 'Ariana Grande',
        y: 8200
      },
      {
        name: 'Ed Sheeran',
        y: 7800
      },
      {
        name: 'Beyoncé',
        y: 7400
      },
      {
        name: 'Billie Eilish',
        y: 6900
      },
      {
        name: 'Post Malone',
        y: 6500
      },
      {
        name: 'The Weeknd',
        y: 6100
      },
      {
        name: 'Rihanna',
        y: 5700
      },
      {
        name: 'Justin Bieber',
        y: 5300
      }
    ];


    this.adminService.customQuery(
      "SELECT EXPLICIT, COUNT(*) FROM TRACKS GROUP BY EXPLICIT"
    ).subscribe({ next : data => {
      this.isError = false;
      this.genreRepartitionData = this.convertQueryResultToData(data);
      this.onUpdateCharts();
    }, error : err => {
        this.onError();
      }
    });

    this.adminService.customCount("SELECT COUNT(*) FROM USERS"
    ).subscribe({ next : data => {
      this.isError = false;
      this.userCount = data;
    }, error : err => {
        this.onError();
      }
    });

    this.adminService.customCount("SELECT COUNT(*) FROM ARTISTS"
    ).subscribe({ next : data => {
        this.isError = false;
        this.artistCount = data;
      }, error : err => {
        this.onError();
      }
    });

    this.adminService.customCount("SELECT COUNT(*) FROM TRACKS"
    ).subscribe({ next : data => {
        this.isError = false;
        this.songCount = data;
    }, error : err => {
        this.onError();
      }
    });

    this.adminService.customCount("SELECT COUNT(*) FROM Playlists"
    ).subscribe({ next : data => {
        this.isError = false;
        this.playlistCount = data;
    }, error : err => {
        this.onError();
      }
    });

    this.adminService.customCount("SELECT COUNT(*) FROM COMMENTS"
    ).subscribe({ next : data => {
        this.isError = false;
        this.commentCount = data;
    }, error : err => {
        this.onError();
      }
    });

    this.adminService.customCount("SELECT COUNT(*) FROM FORUM_POSTS"
    ).subscribe({ next : data => {
        this.isError = false;
        this.commentCount = data;
    }, error : err => {
        this.onError();
      }
    });
  }

  onError() {
    this.isError = true;
    console.log('Failed to load the data !');
  }

}


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
      text: 'Genre repartition among tracks'
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

    this.adminService.customQuery(
      "SELECT USERNAME, COUNT(*) " +
      "FROM USERS GROUP BY USERNAME"
    ).subscribe(data => {
      this.topTenArtistsBarData = this.convertQueryResultToData(data);
      this.onUpdateCharts();
    });

    this.adminService.customQuery(
      "SELECT a.genres, SUM(a.followers) AS total_followers\n" +
      "    FROM artists a\n" +
      "    GROUP BY a.genres\n" +
      "    ORDER BY total_followers DESC;"
    ).subscribe(data => {
      this.genreRepartitionData = this.convertQueryResultToData(data);
      this.onUpdateCharts();
    });

    this.adminService.customCount("SELECT COUNT(*) FROM USERS"
    ).subscribe(data => {
      this.userCount = data;
    });

    this.adminService.customCount("SELECT COUNT(*) FROM ARTISTS"
    ).subscribe(data => {
      this.artistCount = data;
    });

    this.adminService.customCount("SELECT COUNT(*) FROM TRACKS"
    ).subscribe(data => {
      this.songCount = data;
    });

    this.adminService.customCount("SELECT COUNT(*) FROM Playlists"
    ).subscribe(data => {
      this.playlistCount = data;
    });

    this.adminService.customCount("SELECT COUNT(*) FROM COMMENTS"
    ).subscribe(data => {
      this.commentCount = data;
    });

    this.adminService.customCount("SELECT COUNT(*) FROM FORUM_POSTS"
    ).subscribe(data => {
      this.forumCount = data;
    });

    // KPI ==========================
    // Artists number

    // User number

    // Comments number

    // Forums number

    // Songs number

    // Playlists number

    // Graphs =======================

    // Genres repartition

    /*
    SELECT a.genres, SUM(a.followers) AS total_followers
    FROM artists a
    GROUP BY a.genres
    ORDER BY total_followers DESC;
     */

    // Top 10 rank of artists per followers

    // Get data for
    // Get data for pie chart 2 : number of users per genres

      /*
      SELECT a.genres, SUM(a.followers) AS total_followers
      FROM artists a
      GROUP BY a.genres
      ORDER BY total_followers DESC;
       */

    //

  }

  protected readonly Component = Component;
}


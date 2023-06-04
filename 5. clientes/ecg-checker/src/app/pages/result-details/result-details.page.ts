import {
  Component, OnInit, ViewChild,
  ElementRef, AfterViewInit, QueryList, ViewChildren
} from '@angular/core';
import {Router} from "@angular/router";
import {Chart, ChartConfiguration, ChartType} from "chart.js";
import {BaseChartDirective} from "ng2-charts";



@Component({
  selector: 'app-result-details',
  templateUrl: './result-details.page.html',
  styleUrls: ['./result-details.page.scss'],
})
export class ResultDetailsPage implements OnInit, AfterViewInit {

  result: any;

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [], // Inicializa el array de datos vacío
        label: 'ECG trace',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        // fill: 'origin',
        pointRadius: 0,
      }
    ],
    labels: [ ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      x: {
        display: false, // Oculta las etiquetas del eje X
      },
      y:
        {
          position: 'left',
        }
    },
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  @ViewChildren('chartCanvas') charts!: QueryList<ElementRef>;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.result = navigation?.extras.state?.['result'];
  }


  ngOnInit() {
    console.log('this.result',this.result);
  }
  ngAfterViewInit() {
    this.charts.forEach((chartCanvas, index) => {
      this.generateChart(
        chartCanvas,
        this.result.resultados.heartbeats[index].segment,
        this.result.resultados.heartbeats[index].label
      );
    });
  }

  /*prepareChartData() {
    const ecgData = this.result.resultados.heartbeats;
    // console.log('ecgData',ecgData);
    if (ecgData && ecgData.length > 0) {
      const chartData: number[] = [];

      for (let i = 0; i < ecgData.length; i++) {
        chartData.push(ecgData[i]);
        // console.log('ecgData[i].value',ecgData[i]);
      }
      // generamos para el eje X los valores de 0 a ecgData.length
      this.lineChartData.labels = Array.from(Array(ecgData.length).keys()).map(String);
      this.lineChartData.datasets[0].data = chartData;
      if (this.chart) {
        this.chart.update(); // Actualiza la gráfica manualmente
      }
    }
    console.log('this.lineChartData',this.lineChartData);
  }*/

  generateChart(chartCanvas: ElementRef, segment: number[], label: string) {
    const ctx = (chartCanvas.nativeElement as HTMLCanvasElement).getContext(
      '2d'
    );

    if (!ctx) {
      console.error('Error al obtener el contexto del canvas');
      return;
    }

    const chartData: ChartConfiguration['data'] = {
      datasets: [
        {
          data: segment,
          label: 'Latido ECG',
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: this.getColorByLabel(label),
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          pointRadius: 0,
        },
      ],
      labels: Array.from(Array(segment.length).keys()).map(String),
    };
    const chartOptions: ChartConfiguration['options'] = {
      elements: {
        line: {
          tension: 0.5,
        },
      },
      scales: {
        x: {
          display: false, // Oculta las etiquetas del eje X
        },
        y: {
          position: 'left',
        },
      },
    };

    const chartType: ChartType = 'line';

    new Chart(ctx, {
      type: chartType,
      data: chartData,
      options: chartOptions,
    });
  }
  getColorByLabel(label: string): string {
    return label === 'N' ? 'green' : 'red';
  }

}

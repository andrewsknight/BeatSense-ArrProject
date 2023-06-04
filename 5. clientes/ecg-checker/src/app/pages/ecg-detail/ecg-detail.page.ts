import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { EcgService } from 'src/app/services/ecg.service';

import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-ecg-detail',
  templateUrl: './ecg-detail.page.html',
  styleUrls: ['./ecg-detail.page.scss'],
})
export class EcgDetailPage implements OnInit {
  trace: any;

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

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.trace = navigation?.extras.state?.['trace'];
  }
  ngOnInit() {
    if (!this.trace) {
      // Si no se recibe un trazo, redirecciona al usuario a la lista de trazos de ECG
      this.router.navigate(['/ecg-storage']);
    } else {
      this.prepareChartData();
    }
  }

  prepareChartData() {
    const ecgData = this.trace.trazo;
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
  }

}

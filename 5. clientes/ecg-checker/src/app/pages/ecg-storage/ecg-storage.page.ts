import { Component, OnInit } from '@angular/core';
import { EcgService } from 'src/app/services/ecg.service';
import { Router } from '@angular/router';
import { AuthenticationService } from "../../services/authentication.service";
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-ecg-storage',
  templateUrl: './ecg-storage.page.html',
  styleUrls: ['./ecg-storage.page.scss'],
})
export class EcgStoragePage implements OnInit {

  ecgTraces: any[] = [];
  // creamos variable userId que se obtiene del local storage
  userId : any;

  constructor(private ecgService: EcgService, private router: Router,
              private authenticationService: AuthenticationService,
              private loadingController: LoadingController) {
    // obtenemos el id del usuario del local storage
    this.userId = this.authenticationService.currentUserValue.user._id;
  }

  ngOnInit() {
    //console.log('User',this.userId)
    // console.log('currentUserValue',this.authenticationService.currentUserValue)
    this.loadECGTraces();
  }
  async loadECGTraces() {
    const loading = await this.presentLoading();
    this.ecgService.getECGTraces(this.userId)
      .subscribe(
      (traces) => {
        this.ecgTraces = traces;
        loading.dismiss();
        // console.log('traces',traces)
      },
      (error) => {
        console.error(error);
        loading.dismiss();
      }
    );
  }

  async generateECGTraces() {
    const loading = await this.presentLoading();
    this.ecgService.insertECGTrace(this.userId)
      .subscribe(
      () => {
        this.loadECGTraces();
        loading.dismiss();
      },
      (error) => {
        console.error(error);
        loading.dismiss();
      }
    );
  }

  openECGDetail(trace: any) {
    this.router.navigate(['/ecg-detail'], { state: { trace } });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'crescent'
    });
    await loading.present();
    return loading;
  }


}

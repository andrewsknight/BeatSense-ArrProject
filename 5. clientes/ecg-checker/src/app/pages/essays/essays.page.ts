import { Component, OnInit } from '@angular/core';
import { EcgService } from "../../services/ecg.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import { ModalController } from "@ionic/angular";
import { UploadModalComponent } from "../../components/upload-modal/upload-modal.component";
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-essays',
  templateUrl: './essays.page.html',
  styleUrls: ['./essays.page.scss'],
})
export class EssaysPage implements OnInit {

  userId : any;
  results: any[] = [];

  constructor(private ecgService: EcgService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private modalController: ModalController,
              private loadingController: LoadingController) {
    // obtenemos el id del usuario del local storage
    this.userId = this.authenticationService.currentUserValue.user._id;
  }

  ngOnInit() {
    this.loadECGResults();
  }

  async loadECGResults() {
    const loading = await this.presentLoading();
    this.ecgService.getECGResults(this.userId)
      .subscribe(
        (results) => {
          this.results = results;
          loading.dismiss();
          // console.log('traces',traces)
        },
        (error) => {
          console.error(error);
          loading.dismiss();
        }
      );
  }

  async presentUploadModal() {
    const modal = await this.modalController.create({
      component: UploadModalComponent,
      componentProps: { userId: this.userId }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.loadECGResults();
      }
    });

    return await modal.present();
  }
  // Nueva función para navegar a la página de detalles del resultado
  viewResultDetails(result: any) {
    this.router.navigate(['/result-details'], {
      state: { result },
    });
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

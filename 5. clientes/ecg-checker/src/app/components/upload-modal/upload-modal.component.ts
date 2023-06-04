import {Component, Input, OnInit} from '@angular/core';
import { EcgService } from "../../services/ecg.service";
import {LoadingController, ModalController} from '@ionic/angular';

import { from } from 'rxjs';
import { toArray } from 'rxjs/operators';
@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss'],
})
export class UploadModalComponent  implements OnInit {
  @Input() userId: string = '';
  selectedOption: string = '';
  fileToUpload: File | null = null;
  segment: any = []
  segment_base64: any = ""
  ecgTraces: any[] = [];
  traceId: string = '';


  constructor(
    private ecgService: EcgService,
    private loadingController: LoadingController,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    console.log('userId', this.userId);
    this.fetchECGTraces();
  }

  handleECGStorageSelect(event: any) {
    console.log('ECG Storage seleccionado:', event.target.value);
    this.traceId = event.target.value._id;
    // Implementa aquí la lógica para seleccionar un segmento de ECG Storage
  }

  handleImageUpload(event: any) {
    console.log('Imagen seleccionada:', event.target.files[0]);
    this.fileToUpload = event.target.files[0];
    this.convertImageToBase64(event.target.files[0]);
  }

  convertImageToBase64(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.segment_base64 = fileReader.result?.toString() || null;
      // console.log('Image converted to base64:', this.segment_base64);
    };
    fileReader.readAsDataURL(file);
  }

  handleCSVUpload(event: any) {
    console.log('CSV seleccionado:', event.target.files[0]);
    this.fileToUpload = event.target.files[0];
  }



  fileChangeEvent(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
      this.readFileContent(file);
    }
  }

  readFileContent(file: File): void {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const content = fileReader.result?.toString();
      if (content) {
        const list = this.csvToList(content);
        this.segment = list
        console.log('Converted CSV to list:', list);
      }
    };
    fileReader.readAsText(file);
  }

  async  uploadFile() {
    if (!this.fileToUpload && this.selectedOption !== 'ecg-storage') {
      alert('Por favor, selecciona un archivo para subir.');
      return;
    }
    await this.presentLoading(); // Muestra el loader

    const formData = new FormData();
    if (this.fileToUpload) {
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
    }
    formData.append('userId', this.userId);
    //console.log('lista a enviar', this.segment);
    //console.log('imagen a enviar', this.segment_base64);
    if (this.selectedOption === 'image') {
      console.log('imagen a enviar')
      // remover de this.segment "data:image/png;base64,"
      this.segment_base64 = this.segment_base64.replace(/^data:image\/[a-z]+;base64,/, "");
      this.ecgService.analyzeNewECGMulti(this.userId, this.segment_base64)
        .subscribe(
          (result) => {
            console.log('result', result);
            alert('Archivo subido correctamente Imagen.');
            this.dismissLoading(); // Cierra el loader
            this.dismissModal(); // Cierra el modal
          },
          (error) => {
            console.error(error);
            alert('Error al subir el archivo.');
            this.dismissLoading(); // Cierra el loader
          });
    }
    else if (this.selectedOption === 'csv'){
      console.log('lista a enviar')
      this.ecgService.analyzeNewECGMulti(this.userId, this.segment)
        .subscribe(
          (result) => {
            console.log('result', result);
            alert('Archivo subido correctamente CSV.');
            this.dismissLoading(); // Cierra el loader
            this.dismissModal(); // Cierra el modal
          },
          (error) => {
            console.error(error);
            alert('Error al subir el archivo.');
            this.dismissLoading(); // Cierra el loader
          });
    }
    else if (this.selectedOption === 'ecg-storage') {
      console.log('ecg-storage a enviar')
      this.ecgService.analyzeNewECGTrace(this.traceId)
        .subscribe(
          (result) => {
            console.log('result', result);
            alert('Procesado correctamente.');
            this.dismissLoading(); // Cierra el loader
            this.dismissModal(); // Cierra el modal
          },
          (error) => {
            console.error(error);
            alert('Error al subir el archivo.');
            this.dismissLoading(); // Cierra el loader
          });
    }
  }
  csvToList(csv: string): number[] {
    const rows = csv.trim().split(/\r?\n/);
    const list = rows.map(row => parseFloat(row));
    return list;
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Procesando archivo...',
      spinner: 'crescent',
      duration: 0, // No pongas un tiempo límite de duración, ya que lo cerraremos manualmente después
    });
    await loading.present();
  }
  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  dismissModal() {
    this.modalController.dismiss(); // Cierra el modal
  }

  fetchECGTraces() {
    this.ecgService.getECGTraces(this.userId).subscribe(
      (traces) => {
        this.ecgTraces = traces;
        console.log('ECG Traces:', this.ecgTraces);
      },
      (error) => {
        console.error(error);
        alert('Error al obtener los trazos de ECG.');
      }
    );
  }


}

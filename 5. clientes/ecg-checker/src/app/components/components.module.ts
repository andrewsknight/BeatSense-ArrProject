import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

// Importa tus componentes aquí
import { AppHeaderComponent } from './app-header/app-header.component';
import { UploadModalComponent } from "./upload-modal/upload-modal.component";

@NgModule({
  declarations: [
    // Añade tus componentes aquí
    AppHeaderComponent,
    UploadModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    // Añade tus componentes aquí para que puedan ser utilizados en otros módulos
    AppHeaderComponent,
    UploadModalComponent
  ]
})
export class ComponentsModule { }

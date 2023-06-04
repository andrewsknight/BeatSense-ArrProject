import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from "@angular/router";
import { AuthenticationService } from '../../services/authentication.service'; // Asegúrate de importar tu servicio de autenticación aquí

@Component({
  selector: 'app-split-pane',
  templateUrl: './split-pane.page.html',
  styleUrls: ['./split-pane.page.scss'],
})
export class SplitPanePage implements OnInit {

  pages = [
    /*{
      title: 'Tabs',
      url: '/split-pane/tabs-manager',
    },*/
    {
      title: 'Inicio',
      url: '/split-pane/home',
    },
    {
      title: 'Ensayos',
      url: '/split-pane/essays',
    },
    {
      title: 'Trazos ECG',
      url: '/split-pane/ecg-storage',
    }
  ];
  selectedPath = '';
  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd){
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout(); // Llama al método 'logout' del servicio de autenticación
    this.router.navigate(['/login']); // Navega a la página de inicio de sesión
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService) {
    // Inicializa la propiedad loginForm
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/split-pane/home']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authenticationService.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value)
      .subscribe({
        next: () => {
          this.router.navigate(['/split-pane/home']);
        },
        error: error => {
          // Handle login errors
          console.error(error);
          alert('Error al iniciar sesión, por favor intente de nuevo.');
        }
      });
  }

}

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, NavController } from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';
import { LoginService } from '../shared/services/login.service';

@Component({
  selector: 'landing-page',
  templateUrl: 'landing-page.component.html',
  styleUrls: ['landing-page.component.scss'],
  imports: [ReactiveFormsModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonInput],
})
export class LandingPage {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(NavController);


  loginForm = new FormGroup({
    server: new FormControl<string>('', { nonNullable: true }),
    username: new FormControl<string>('', { nonNullable: true }),
    password: new FormControl<string>('', { nonNullable: true }),
  });
  constructor() { }

  async submit() {
    try {
      this.loginForm.markAllAsTouched();
      const loginInfo = {
        server: this.loginForm.controls.server.value,
        userName: this.loginForm.controls.username.value,
        password: this.loginForm.controls.password.value,
      }
      await this.loginService.login(loginInfo);

      await Preferences.set({
        key: 'server',
        value: this.loginForm.controls.server.value,
      });
      await Preferences.set({
        key: 'username',
        value: this.loginForm.controls.username.value,
      });

      this.router.navigateRoot(['/home']);
    } catch (error) {

    }
  }
}

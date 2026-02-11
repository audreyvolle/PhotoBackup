import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, NavController, IonButton } from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';
import { LoginService } from '../../shared/services/login.service';
import { Colors, DisplayService } from '../../shared/services/display.service';
import { PreferencesKeys } from 'src/app/shared/models/preferences.model';

@Component({
  selector: 'app-landing-page',
  templateUrl: 'landing-page.component.html',
  imports: [ReactiveFormsModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton],
})
export class LandingPage {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(NavController);
  private readonly displayService = inject(DisplayService)

  loginForm = new FormGroup({
    server: new FormControl<string>('', { nonNullable: true }),
    username: new FormControl<string>('', { nonNullable: true }),
    password: new FormControl<string>('', { nonNullable: true }),
  });

  constructor() {
    Preferences.get({ key: PreferencesKeys.Username }).then(user => {
      if (user.value) this.loginForm.patchValue({ username: user.value });
    });

    Preferences.get({ key: PreferencesKeys.Server }).then(server => {
      if (server.value) this.loginForm.patchValue({ server: server.value });
    });
  }

  openHelp() {
    window.open("https://github.com/audreyvolle/PhotoBackup?tab=readme-ov-file#how-to-use");
  }

  async submit() {
    try {
      this.loginForm.markAllAsTouched();
      if (!this.loginForm.valid) {
        this.displayService.presentToast({ message: "Invalid Login", color: Colors.Danger });
        return;
      }

      await this.loginService.login({
        server: this.loginForm.controls.server.value,
        username: this.loginForm.controls.username.value,
        password: this.loginForm.controls.password.value
      });

      this.router.navigateRoot(['/home/backup']);
    } catch (error) {
      this.displayService.presentToast({ message: "Error Logging In", color: Colors.Danger, error });
    }
  }
}

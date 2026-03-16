import { Component, inject } from "@angular/core";
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, NavController } from '@ionic/angular/standalone';
import { logOut } from 'ionicons/icons';
import { addIcons } from "ionicons";
import { LoginService } from "src/app/shared/services/login.service";

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.component.html',
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon],
})
export class SettingsPage {
    private router = inject(NavController);
    private loginService = inject(LoginService);

    constructor() {
        addIcons({ logOut })
    }

    async logout() {
        this.loginService.logout();
        this.router.navigateRoot('/landing-page');
    }
}
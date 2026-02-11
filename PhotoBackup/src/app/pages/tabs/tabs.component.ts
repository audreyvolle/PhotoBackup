import { Component } from "@angular/core";
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { image, settings } from "ionicons/icons";

@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    imports: [
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon
    ]
})
export class TabsComponent {
    constructor() {
        addIcons({ settings, image })
    }
}
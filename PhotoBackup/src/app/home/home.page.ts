import { Component, computed, inject, resource } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { BackupService } from '../shared/services/backup.service';
import { Colors, DisplayService } from '../shared/services/display.service';
import { Media } from '@capacitor-community/media';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  private backupService = inject(BackupService);
  private displayService = inject(DisplayService);

  backedUpPhotos = resource({
    loader: async () => this.backupService.getBackedUpIdentifiers().catch(error =>
      this.displayService.presentToast("Error Fetching Photos", Colors.Danger, error))
  });

  photoLibraryIdentifiers = resource({
    loader: async () => {
      const allPhotos = await Media.getMedias().catch() ?? [];
      return allPhotos;
    }
  });

  photosToBackUp = computed(() => {
    const local = this.photoLibraryIdentifiers.value()?.medias ?? [];
    const remote = this.backedUpPhotos.value()?.identifiers ?? [];
    return local.filter(l => !remote.includes(l.identifier));
  });

  async backup() {
    const pending = this.photosToBackUp();
    if (pending.length === 0) return;

    try {
      await this.displayService.loader({
        loadingMessage: "Backing Up Photos",
        promise: this.backupService.uploadPhotos(pending)
      })
      this.backedUpPhotos.reload();
    } catch (e) {
      this.displayService.presentToast("Upload Failed", Colors.Danger);
    }
  }
}

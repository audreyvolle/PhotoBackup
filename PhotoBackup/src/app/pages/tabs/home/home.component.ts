import { Component, computed, inject, resource } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { Media } from '@capacitor-community/media';
import { BackupService, extractGuid } from 'src/app/shared/services/backup.service';
import { Colors, DisplayService } from 'src/app/shared/services/display.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  private backupService = inject(BackupService);
  private displayService = inject(DisplayService);

  backedUpPhotos = resource({
    loader: async () => this.backupService.getBackedUpIdentifiers().catch(error =>
      this.displayService.presentToast({message: "Error Fetching Photos", color: Colors.Danger, error}))
  });

  photoLibraryIdentifiers = resource({
    loader: async () => {
      const allPhotos = await Media.getMedias().catch() ?? [];
      return allPhotos;
    }
  });

  photosToBackUp = computed(() => {
    const local = this.photoLibraryIdentifiers.value()?.medias ?? [];
    const remote = this.backedUpPhotos.value()?.identifiers.map(id => id.toLowerCase()) ?? [];
    return local.filter(l => !remote.includes(extractGuid(l.identifier.toLowerCase())));
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
      this.photoLibraryIdentifiers.reload();
    } catch (error) {
      this.displayService.presentToast({message: "Upload Failed", color: Colors.Danger, error});
    }
  }
}

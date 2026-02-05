import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, ToastButton } from "@ionic/angular/standalone";

export enum Colors {
  Dark = "dark",
  Primary = "primary",
  Warning = "warning",
  Success = "success",
  Danger = "danger",
  Light = "light"
}

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  private loadingController = inject(LoadingController);
  private toastController = inject(ToastController);

  private loading: HTMLIonLoadingElement | null = null;

  async presentLoading(message: string = 'Loading...'): Promise<void> {
    await this.dismissLoading();
    this.loading = await this.loadingController.create({
      id: "loader",
      message,
      spinner: 'lines',
      backdropDismiss: false,
    });
    await this.loading.present();
  }

  async dismissLoading(): Promise<void> {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  async loader<T>(options: { loadingMessage: string; promise: (() => Promise<T>) | Promise<T> }): Promise<T> {
    try {
      await this.presentLoading(options.loadingMessage);
      return await (options.promise instanceof Function ? options.promise() : options.promise);
    } finally {
      await this.dismissLoading();
    }
  }

  async presentToast(displayMessage: string = 'Error...', color: Colors | undefined = undefined, error?: any, duration: number = 5000, buttons?: ToastButton[], icon: string | undefined = undefined) {
    let message = displayMessage;
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      message += `: ${error?.message?.slice(0, 200)}`;
    }

    const toast = await this.toastController.create({
      message,
      duration,
      icon,
      position: "bottom",
      cssClass: "toast",
      color,
      buttons: buttons ?? [
        {
          text: "OK",
          role: "cancel",
        },
      ],
      id: "toast-message",
    });
    await toast.present();
  }
}
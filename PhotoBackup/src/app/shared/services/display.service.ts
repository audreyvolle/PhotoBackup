import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, ToastButton, ToastOptions } from "@ionic/angular/standalone";

export enum Colors {
  Dark = "dark",
  Primary = "primary",
  Warning = "warning",
  Success = "success",
  Danger = "danger",
  Light = "light"
}

export interface MoreTostOptions extends ToastOptions {
  error?: any;
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

  async presentToast(options: MoreTostOptions): Promise<void> {
    let message = options.message;
    if (options.error) {
      // eslint-disable-next-line no-console
      console.error(options.error);
      message += `: ${options.error?.message?.slice(0, 200)}`;
    }
    const toast = await this.toastController.create({
      message,
      duration: options.duration ?? 5000,
      icon: options.icon,
      position: "bottom",
      cssClass: "toast",
      color: options.color,
      buttons: options.buttons ?? [
        {
          text: "OK",
          role: "cancel",
        },
      ],
    });
    await toast.present();
  }
}
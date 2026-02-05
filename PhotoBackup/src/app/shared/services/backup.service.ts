import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { LoginService } from "./login.service";
import { MediaAsset } from "@capacitor-community/media";

export interface BackedUpPhotos {
    identifiers: string[];
    count: number;
}

@Injectable({
    providedIn: 'root',
})
export class BackupService {
    private httpClient = inject(HttpClient);
    private loginService = inject(LoginService); // do this better

    async getBackedUpIdentifiers(): Promise<BackedUpPhotos> {
        const userInfo = await this.loginService.getUserInfo() // do this better
        return firstValueFrom(this.httpClient.request<BackedUpPhotos>('GET', `${userInfo.server}/photos/identifiers`, {
            responseType: 'json',
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
        }));
    }

    async uploadPhotos(photos: MediaAsset[]): Promise<void> {
        const userInfo = await this.loginService.getUserInfo(); // do this better
        await Promise.all(photos.map(async (photo) => {
            if (!photo.data) return;
            try {
                const response = await fetch(`data:image/jpeg;base64,${photo.data}`);
                const blob = await response.blob();
                const formData = new FormData();
                formData.append('file', blob, `${photo.identifier}.jpg`);

                return await firstValueFrom(
                    this.httpClient.post(`${userInfo.server}/photos/upload`, formData, {
                        headers: {
                            'Authorization': `Bearer ${userInfo.token}`,
                            'hash': photo.identifier,
                            'timestamp': photo.creationDate || new Date().toISOString()
                        }
                    })
                );
            } catch (err) {
                console.error(`Error uploading photo ${photo.identifier}:`, err);
                return err;
            }
        }));
    }
}
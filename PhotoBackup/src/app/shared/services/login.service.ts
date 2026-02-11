import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Preferences } from "@capacitor/preferences";
import { firstValueFrom } from "rxjs";
import { PreferencesKeys } from "../models/preferences.model";

export interface LoginInfo {
    username: string;
    password: string;
    server: string
}

export interface UserInfo {
    token: string,
    server: string,
    username: string
}

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private httpClient = inject(HttpClient);
    private jwtHelper = inject(JwtHelperService);
    private cachedToken: string | null = null;

    async login(loginInfo: LoginInfo): Promise<void> {
        return firstValueFrom(this.httpClient.request<{ token: string }>('POST', `${loginInfo.server}/auth/login`, {
            responseType: 'json',
            body: loginInfo
        })).then(token => this.setPreferences({ token: token.token, username: loginInfo.username, server: loginInfo.server }));
    }

    async loadToken(): Promise<void> {
        if (this.cachedToken) return;

        const { value } = await Preferences.get({ key: PreferencesKeys.Token });
        this.cachedToken = value;
    }

    async isAuthenticated(): Promise<boolean> {
        await this.loadToken();

        if (!this.cachedToken) return false;

        return !this.jwtHelper.isTokenExpired(this.cachedToken);
    }

    async logout(): Promise<void> {
        this.cachedToken = null;
        await Preferences.remove({ key: PreferencesKeys.Token });
    }

    async getUserInfo(): Promise<UserInfo> {
        const [token, server, username] = await Promise.all([
            Preferences.get({ key: PreferencesKeys.Token }),
            Preferences.get({ key: PreferencesKeys.Server }),
            Preferences.get({ key: PreferencesKeys.Username })]);

        return {
            token: token.value!,
            server: server.value!,
            username: username.value!
        }
    }

    private async setPreferences(info: UserInfo) {
        await Preferences.set({
            key: PreferencesKeys.Token,
            value: info.token,
        });
        await Preferences.set({
            key: PreferencesKeys.Server,
            value: info.server,
        });
        await Preferences.set({
            key: PreferencesKeys.Username,
            value: info.username,
        });
    }
}
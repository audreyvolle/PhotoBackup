import { Injectable } from "@angular/core";

export interface LoginInfo {
    userName: string;
    password: string;
    server: string
}


@Injectable({
    providedIn: 'root',
})
export class LoginService {

    login(loginInfo: LoginInfo) {
        
        
    }
}
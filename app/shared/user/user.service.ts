import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {AuthModel} from "../auth/auth.model";
import {Observable} from "rxjs/Rx";
import {User} from "./user";

/**
 * Ldap user service class
 * Api interaction example
 */

@Injectable()
export class UserService {
    constructor(public http:Http, private authModel: AuthModel) {}

    getUser(user: String): Observable<User> {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.authModel.access_token);

        return this.http.get(AuthModel.server + '/identity/' + user, {headers: headers}).map(res => res.json());
    }
}
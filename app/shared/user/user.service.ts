import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {AuthModel} from "../auth/auth.model";
import {Observable} from "rxjs/Rx";
import {User} from "./user";

/**
 * Ldapa user service class
 * Api interaction example
 * - Connects to API endpoints (Swagger + SpringBoot)
 * - Backend API queries and fetches information from internal AD LDAP
 * - Returns information as a response class payload
 */

@Injectable()
export class UserService {
  constructor(public http:Http, private authModel: AuthModel) {}

  /**
   * Get logged in user details
   * @returns {Observable<User>} User entity
   */
  getMe(token: String): Observable<User> {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(AuthModel.server + '/identity/me', {headers: headers}).map(res => res.json());
  }

  /**
   * Fetch a single user and their details by UPI
   * @param upi Username
   * @returns {Observable<User>} User entity
   */
  getUserByUpi(upi: String): Observable<User> {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.authModel.access_token);

    return this.http.get(AuthModel.server + '/identity/' + upi, {headers: headers}).map(res => res.json());
  }

  /**
   * Get a list of users by their name
   * @param firstName (users first name)
   * @returns {Observable<User>}
   */
  searchUserByName(firstName: String): Observable<User[]> {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.authModel.access_token);

    return this.http.get(AuthModel.server + '/identity/_search?firstname=' + firstName, {headers: headers}).map(res => res.json());
  }

  /**
   * Get a list of users by their last name
   * @param lastName (users last name)
   * @returns {Observable<User>}
   */
  searchUserLastName(lastName: String): Observable<User[]> {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.authModel.access_token);

    return this.http.get(AuthModel.server + '/identity/_search?lastname=' + lastName, {headers: headers}).map(res => res.json());
  }
}
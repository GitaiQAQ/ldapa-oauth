import {Injectable} from "@angular/core";
import {NavController, Loading} from "ionic-angular/index";

/**
 * AuthModel where logged in user and token are defined
 * Author: Max Tuzzolino-Smith
 */

@Injectable()
export class AuthModel {
  // Kong identity endpoint
  public static server: string = "https://proxy.api.dev.auckland.ac.nz";
  public static authUrl: string = "https://pam.dev.auckland.ac.nz/identity/oauth2/authorize?client_id=maxx-identity-app&response_type=token";
  public loading: Loading;

  // Logged in user details (access token + logged in user entity)
  public access_token: string;
  public expires_in: number;


  constructor() {}

  public showLoading(text: string, nav: NavController) {
    if (this.loading) {
      this.loading.dismiss();
    }
    this.loading = Loading.create({
      content: text,
      spinner: 'dots'
    });

    nav.present(this.loading);
  }

  public dismissLoading() {
    //noinspection TypeScriptUnresolvedFunction
    this.loading.dismiss().then(() => this.loading = null);
  }
}
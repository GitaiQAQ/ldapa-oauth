import {Component, ViewChild} from '@angular/core';
import {Platform, ionicBootstrap, Storage, Nav, Alert, LocalStorage} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import 'rxjs/add/operator/map'
import {AuthModel} from "./shared/auth/auth.model";

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  private rootPage:any;
  @ViewChild(Nav) nav: Nav;
  localStorage: Storage;

  constructor(private platform: Platform,
              private authModel: AuthModel) {
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      StatusBar.styleDefault();

      // Check if local token exists
      this.localStorage = new Storage(LocalStorage);
      this.localStorage.get('identity_info').then(identity_info => {
        if (identity_info) {
          this.resolveUser(identity_info);
        } else {
          this.authenticate()
        }
      });
    });
  }

  /**
   * Set auth model access token and expires information to oauth information
   * @param identity_info string
   */
  resolveUser(identity_info) {
    this.authModel.access_token = JSON.parse(identity_info).oauth.access_token;
    this.authModel.expires_in = JSON.parse(identity_info).oauth.expires_in;

    console.log(`Expires in: ${this.authModel.expires_in}`);

    this.localStorage.get('authDate').then(authDate => {
      let expireDate = new Date(authDate);
      expireDate.setSeconds(expireDate.getSeconds() + this.authModel.expires_in);

      console.log(`Authenticated: ${authDate}`);
      console.log(`Token expires: ${expireDate}`);

      // Current date greater than expiry date; reauth needed
      if (new Date().getDate() >= expireDate.getDate()) {
        // Re-authenticate
        console.log("Token expired, re-authenticating...");
        this.authenticate();
      } else {
        this.rootPage = TabsPage;
      }
    });
  }

  /**
   * Authentication handler
   */
  authenticate() {
    let confirm = Alert.create({
      title: 'Unauthenticated',
      message: "Looks like you need new keys. You'll have to log in again!",
      buttons: [{
        text: 'Login',
        handler: () => {
          this.redirect();
        }
      }]
    });

    this.nav.present(confirm);
  }

  /**
   * Redirect to oauth endpoint
   */
  redirect() {
    window.location.href = "https://pam.dev.auckland.ac.nz/identity/oauth2/authorize?client_id=maxx-identity-app&response_type=token";
  }
}

ionicBootstrap(MyApp, [AuthModel], {
  tabbarPlacement: 'bottom',
});

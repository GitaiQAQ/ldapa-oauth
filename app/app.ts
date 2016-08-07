import {Component, ViewChild} from '@angular/core';
import {Platform, ionicBootstrap, Storage, Nav, Alert, LocalStorage, Toast, AlertController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import 'rxjs/add/operator/map'
import {AuthModel} from "./shared/auth/auth.model";
import {UserService} from "./shared/user/user.service";

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  private rootPage:any;
  localStorage: Storage;

  constructor(private platform: Platform,
              private authModel: AuthModel,
              private userService: UserService,
              private alertCtrl: AlertController) {

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
    this.userService.getMe(JSON.parse(identity_info).oauth.access_token).subscribe(data => {
      this.authModel.user = data;
      this.authModel.access_token = JSON.parse(identity_info).oauth.access_token;
      this.authModel.expires_in = JSON.parse(identity_info).oauth.expires_in;

      // Navigate to tabs page
      this.rootPage = TabsPage;
    }, error => {
      this.authenticate();
    });
  }

  /**
   * Authentication handler
   */
  authenticate() {
    let confirm = this.alertCtrl.create({
      title: 'Unauthenticated',
      message: "Looks like you need new keys. You'll have to log in again!",
      buttons: [{
        text: 'Login',
        handler: () => {
          this.redirect();
        }
      }]
    });

    confirm.present();
  }

  /**
   * Redirect to oauth endpoint
   */
  redirect() {
    window.location.href = AuthModel.authUrl;
  }
}

ionicBootstrap(MyApp, [UserService, AuthModel], {
  tabPlacement: 'bottom',
});

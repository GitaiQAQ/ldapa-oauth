import {Component} from "@angular/core";
import {Storage, LocalStorage, LoadingController, ToastController, PopoverController,
  ModalController, AlertController
} from "ionic-angular";
import {FilterComponent} from "../filter/filter.component";
import {User} from "../../shared/user/user";
import {UserService} from "../../shared/user/user.service";
import {GroupsComponent} from "../groups/groups.component";
import {AuthModel} from "../../shared/auth/auth.model";
import {UserCardComponent} from "../../shared/usercard/usercard.component";

/**
 * Home component
 */

@Component({
  templateUrl: 'build/pages/home/home.component.html',
  directives: [UserCardComponent],
  providers: [UserService]
})
export class HomeComponent {
  // User list (for display)
  users: User[] = [];

  // NgModels (for searching) Note: Unique searches are prioritized (such as UPI)
  upi: String;
  firstName: String;
  lastName: String;

  localStorage: Storage;

  excludedFilters = {
    upi: true,
    email: false,
    displayName: false,
    firstName: false,
    lastName: false
  };

  constructor(private userService: UserService,
              private authModel: AuthModel,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private popoverCtrl: PopoverController,
              private modalCtrl: ModalController,
              private alterCtrl: AlertController) {
    this.localStorage = new Storage(LocalStorage);
  }

  /**
   * Get an entry for logged in user
   */
  getMe() {
    let loading = this.loadingCtrl.create({
      content: 'Fetching your details',
      spinner: 'dots'
    });
    loading.present();

    this.userService.getUserByUpi(this.authModel.user.username).subscribe(data=> {
      loading.dismiss().then(() => {
        this.users.push(data);
      });
    });
  }

  /**
   * Search method
   * Search by: UPI xor firstName xor lastName
   */
  search() {
    let loading = this.loadingCtrl.create({
      content: 'Searching',
      spinner: 'dots'
    });
    loading.present();

    if (this.upi) {
      this.userService.getUserByUpi(this.upi).subscribe(data => {
        if (data) {
          loading.dismiss().then(() => {
            this.users.push(data);
            this.upi = this.users.length > 0 ? '' : this.upi;
          });
        } else {
          loading.dismiss().then(() => {
            this.toastCtrl.create({
              message: `User ${this.upi} not found :(`,
              duration: 4000
            }).present();
          });
        }
      }, error => {
        loading.dismiss().then(() => {
          this.toastCtrl.create({
            message: JSON.parse(error._body).message,
            duration: 4000
          }).present();
        });
      });
    } else if (this.firstName) {
      this.userService.searchUserByName(this.firstName).subscribe(data => {
        if (data) {
          loading.dismiss().then(() => {
            // Cycle through userS and push to view. Limit to first 20 results.
            data.forEach((user, i) => {
              this.users.push(user);

              if (i == 20) { return false; }
            });

            this.toastCtrl.create({
              message: data.length < 10 ? `Fetched ${data.length} results` : `Fetched first ${data.length} results`,
              duration: 4000
            }).present();

            this.firstName = this.users.length > 0 ? '' : this.firstName;
          });
        } else {
          loading.dismiss().then(() => {
            this.toastCtrl.create({
              message: `Users with name ${this.firstName} not found :(`,
              duration: 4000
            }).present();
          });
        }
      }, error => {
        loading.dismiss().then(() => {
          this.toastCtrl.create({
            message: JSON.parse(error._body).message,
            duration: 4000
          }).present();
        });
      });
    } else if (this.lastName) {
      this.userService.searchUserLastName(this.lastName).subscribe(data => {
        if (data) {
          loading.dismiss().then(() => {
            // Cycle through userS and push to view. Limit to first 20 results.
            data.forEach((user, i) => {
              this.users.push(user);

              if (i == 20) { return false; }
            });

            this.toastCtrl.create({
              message: data.length < 10 ? `Fetched ${data.length} results` : `Fetched first ${data.length} results`,
              duration: 4000
            }).present();

            // Reset search only if results are found
            this.lastName = this.users.length > 0 ? '' : this.lastName;
          });
        } else {
          loading.dismiss().then(() => {
            this.toastCtrl.create({
              message: `Users with last name ${this.lastName} not found :(`,
              duration: 4000
            }).present();
          });
        }
      }, error => {
        loading.dismiss().then(() => {
          this.toastCtrl.create({
            message: JSON.parse(error._body).message,
            duration: 4000
          }).present();
        });
      });
    }
  }

  presentFilter(event) {
    // Reset inputs
    this.upi = "";
    this.firstName = "";
    this.lastName = "";

    let popover = this.popoverCtrl.create(FilterComponent, this.excludedFilters);
    popover.present({ev: event});
  }

  presentGroups(user: User) {
    let modal = this.modalCtrl.create(GroupsComponent, user);
    modal.present();
  }

  clearResults() {
    this.users = [];
  }

  popUser(user) {
    let index = this.users.indexOf(user, 0);

    if (index > -1) {
      this.users.splice(index, 1)
    }
  }

  logout(title) {
    this.localStorage.remove('identity_info');
    this.authModel.access_token = null;
    this.authModel.expires_in = null;

    let confirm = this.alterCtrl.create({
      title: title
        ? title
        : 'Successfully logged out',
      message: "You'll have to log in again to use this app",
      buttons: [{
        text: 'Login',
        handler: () => {
          window.location.href = AuthModel.authUrl;
        }
      }]
    });

    confirm.present();
  }
}
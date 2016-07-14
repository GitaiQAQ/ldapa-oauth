import {Component} from "@angular/core";
import {NavController, Toast, Loading, Modal, Storage, Alert, LocalStorage, Popover} from "ionic-angular";
import {FilterComponent} from "../filter/filter.component";
import {User} from "../../shared/user/user";
import {UserService} from "../../shared/user/user.service";
import {GroupsComponent} from "../groups/groups.component";
import {AuthModel} from "../../shared/auth/auth.model";

/**
 * Home component
 */

@Component({
  templateUrl: 'build/pages/home/home.component.html',
  providers: [UserService]
})
export class HomeComponent {

  // User list (for display)
  users: Array<User> = [];

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

  constructor(private nav: NavController, private userService: UserService, private authModel: AuthModel) {
    this.localStorage = new Storage(LocalStorage);
  }

  /**
   * Search method
   * Search by: UPI xor firstName xor lastName
   */
  search() {
    let loading = Loading.create({
      content: 'Searching',
      spinner: 'dots'
    });
    this.nav.present(loading);

    if (this.upi) {
      this.userService.getUserByUpi(this.upi).subscribe(data => {
        if (data) {
          loading.dismiss().then(() => {
            this.users.push(data);
            this.upi = this.users.length > 0 ? "" : this.upi;
          });
        } else {
          loading.dismiss().then(() => {
            this.nav.present(Toast.create({
              message: `User ${this.upi} not found :(`,
              duration: 4000
            }));
          });
        }
      }, error => {
        loading.dismiss().then(() => {
          this.nav.present(Toast.create({
            message: JSON.parse(error._body).message,
            duration: 4000
          }));
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

            this.nav.present(Toast.create({
              message: data.length < 10 ? `Fetched ${data.length} results` : `Fetched first ${data.length} results`,
              duration: 4000
            }));

            this.firstName = this.users.length > 0 ? "" : this.firstName;
          });
        } else {
          loading.dismiss().then(() => {
            this.nav.present(Toast.create({
              message: `Users with name ${this.firstName} not found :(`,
              duration: 4000
            }));
          });
        }
      }, error => {
        loading.dismiss().then(() => {
          this.nav.present(Toast.create({
            message: JSON.parse(error._body).message,
            duration: 4000
          }));
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

            this.nav.present(Toast.create({
              message: data.length < 10 ? `Fetched ${data.length} results` : `Fetched first ${data.length} results`,
              duration: 4000
            }));

            this.lastName = this.users.length > 0 ? "" : this.lastName;
          });
        } else {
          loading.dismiss().then(() => {
            this.nav.present(Toast.create({
              message: `Users with last name ${this.lastName} not found :(`,
              duration: 4000
            }));
          });
        }
      }, error => {
        loading.dismiss().then(() => {
          this.nav.present(Toast.create({
            message: JSON.parse(error._body).message,
            duration: 4000
          }));
        });
      });
    }
  }

  presentFilter(event) {
    // Reset inputs
    this.upi = "";
    this.firstName = "";
    this.lastName = "";

    let popover = Popover.create(FilterComponent, this.excludedFilters);
    this.nav.present(popover, {
      ev: event
    })
  }

  presentGroups(user: User) {
    let modal = Modal.create(GroupsComponent, user);
    this.nav.present(modal);
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

  logout() {
    this.localStorage.remove('identity_info');
    this.authModel.access_token = null;
    this.authModel.expires_in = null;

    let confirm = Alert.create({
      title: 'Successfully logged out',
      message: "You'll have to log in again to use this app",
      buttons: [{
        text: 'Login',
        handler: () => {
          window.location.href = AuthModel.authUrl;
        }
      }]
    });

    this.nav.present(confirm);
  }
}
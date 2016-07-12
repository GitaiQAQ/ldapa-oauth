import {Component} from '@angular/core';
import {NavController, Toast, Loading, Modal} from 'ionic-angular';
import {FilterComponent} from "../filter/filter.component";
import {User} from "../../shared/user/user";
import {UserService} from "../../shared/user/user.service";
import {GroupsComponent} from "../groups/groups.component";

/**
 * Home component
 */

@Component({
  templateUrl: 'build/pages/home/home.component.html',
  providers: [UserService]
})
export class HomeComponent {

  users: Array<User> = [];
  upi: String;

  excludedFilters = {
    upi: true,
    email: false,
    displayName: false,
    firstName: false,
    lastName: false
  };

  constructor(private nav: NavController, private userService: UserService) {
  }

  // Just grab upi and search for now
  search() {
    let loading = Loading.create({
      content: 'Searching',
      spinner: 'dots'
    });
    this.nav.present(loading);

    this.userService.getUser(this.upi).subscribe(data => {
      if (data) {
        loading.dismiss().then(() => {
          this.users.push(data);
          console.log(this.users.length);
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
  }

  presentFilter() {
    let modal = Modal.create(FilterComponent, this.excludedFilters);
    this.nav.present(modal);

    modal.onDismiss(data => {
      if (data) {
        this.excludedFilters = data;
      }
    });
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
}

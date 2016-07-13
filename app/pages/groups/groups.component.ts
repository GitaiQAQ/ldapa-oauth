import {Component} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular";
import {User} from "../../shared/user/user";

/**
 * Groups component for viewing user group information
 */

@Component({
  templateUrl: 'build/pages/groups/groups.component.html',
})
export class GroupsComponent {
  user: User;
  groups: Array<string>;
  searchQuery: string;

  constructor(private view: ViewController, private navParams: NavParams) {
    this.user = navParams.data;

    this.searchQuery = '';
    this.initializeItems();
  }

  dismiss() {
    // Dismiss view and then reset groups
    this.view.dismiss().then(() => {
      this.user.groups = this.groups;
    });
  }

  initializeItems() {
    this.groups = this.user.groups;
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.user.groups = this.groups;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.user.groups = this.user.groups.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
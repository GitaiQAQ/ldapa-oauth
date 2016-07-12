import {Component} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular";

/**
 * Groups component for viewing user group information
 */

@Component({
  templateUrl: 'build/pages/groups/groups.component.html',
})
export class GroupsComponent {
  constructor(private view: ViewController, private navParams: NavParams) { }

  dismiss(data) {
    this.view.dismiss(data);
  }
}
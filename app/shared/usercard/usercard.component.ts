import {Injectable, Component, Input, Output, EventEmitter} from "@angular/core";
import {User} from "../user/user";
import {NavController, ModalController} from "ionic-angular";
import {GroupsComponent} from "../../pages/groups/groups.component";

@Injectable()
@Component({
  selector: 'user-card',
  template: `
<ion-card>
  <ion-card-content>
    <ion-card-title>
        {{user.displayName}}
    </ion-card-title>
        
        <ion-item padding>
            <h2>Username</h2>
            <p>{{user.upi}}</p>
        </ion-item>
        <ion-item padding *ngIf="user.jobTitle">
            <h2>Job Title</h2>
            <p>{{user.jobTitle}}</p>
        </ion-item>
        <ion-item padding *ngIf="user.department">
            <h2>Department</h2>
            <p>{{user.department}}</p>
        </ion-item>
        <ion-item padding *ngIf="user.mobile">
            <h2>Mobile</h2>
            <p>{{user.mobile}}</p>
        </ion-item>
  </ion-card-content>
    <ion-toolbar white>
        <ion-buttons item-left>
            <button lightred (click)="removeUser()" item-right>
            <ion-icon name="remove-circle"></ion-icon>
            Remove
            </button>
        </ion-buttons>
        <ion-buttons end>
        <button (click)="presentGroups()" item-right>
        <ion-icon name="open"></ion-icon>
        Groups
        </button>
        </ion-buttons>
    </ion-toolbar>
  <!--</ion-buttons>-->
</ion-card>`
})
export class UserCardComponent {
  // Inputs
  @Input() user: User;

  // Outputs
  @Output() userDeleted = new EventEmitter();

  constructor(private nav: NavController, private modalCtrl: ModalController) {
  }

  presentGroups() {
    let modal = this.modalCtrl.create(GroupsComponent, this.user);
    modal.present();
  }

  removeUser() {
    this.userDeleted.emit(this.user);
  }
}
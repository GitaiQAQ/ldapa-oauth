import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/about/about.component.html'
})
export class AboutComponent {
    constructor(private navController: NavController) {
    }
}

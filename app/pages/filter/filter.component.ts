import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

/**
 * Filter component
 */

@Component({
    templateUrl: 'build/pages/filter/filter.component.html'
})
export class FilterComponent {

    excludedFilters = {
        upi: true,
        email: false,
        displayName: false,
        firstName: false,
        lastName: false
    };

    constructor(private view: ViewController, private navParams: NavParams) {
        this.excludedFilters = navParams.data;
    }

    resetFilters() {
        // reset all of the toggles to be checked
        this.excludedFilters.upi = true;
        this.excludedFilters.email = false;
        this.excludedFilters.displayName = false;
        this.excludedFilters.firstName = false;
        this.excludedFilters.lastName = false;
    }

    applyFilters()  {
        this.dismiss(this.excludedFilters);
    }

    dismiss(data) {
        // using the injected ViewController this page
        // can "dismiss" itself and pass back data
        this.view.dismiss(data);
    }
}

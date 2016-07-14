import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';

/**
 * Filter component (for choosing search term)
 */

@Component({
    templateUrl: 'build/pages/filter/filter.component.html'
})
export class FilterComponent {
    radioModel = 'upi';

    excludedFilters = {
        upi: true,
        firstName: false,
        lastName: false
    };

    constructor(private navParams: NavParams) {
        this.excludedFilters = navParams.data;

        // Messy but set the default radio-group value to whatever is already viewed
        if (this.excludedFilters.upi) {this.radioModel = 'upi'}
        if (this.excludedFilters.firstName) {this.radioModel = 'firstName'}
        if (this.excludedFilters.lastName) {this.radioModel = 'lastName'}
    }

    setValues() {
        this.excludedFilters.upi = this.radioModel == 'upi' ? true : false;
        this.excludedFilters.firstName = this.radioModel == 'firstName' ? true : false;
        this.excludedFilters.lastName = this.radioModel == 'lastName' ? true : false;
    }
}

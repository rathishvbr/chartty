import Controller from '@ember/controller';
import {
    computed, get
} from '@ember/object';

export default Controller.extend({
    navBar: computed('currentPath', function () {
        return !(get(this, 'currentPath') == "login");
    }),
});
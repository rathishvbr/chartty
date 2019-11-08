import Component from '@ember/component';
import {
    computed, get
} from '@ember/object';

export default Component.extend({

    userAdmin: computed('user', function () {
        return get(this, 'user') == "admin";
    }),
});

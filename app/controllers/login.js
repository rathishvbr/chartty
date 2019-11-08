import Controller from '@ember/controller';
import {get} from '@ember/object';
import { inject } from '@ember/controller';



export default Controller.extend({

    applicationController: inject('application'),
    actions: {
        signIn() {
            if (get(this, 'username') != undefined && get(this, 'password') != undefined) {

                if(get(this, 'username') == "admin"){
                    this.applicationController.set('user', "admin");
                    this.transitionToRoute('upload');
                } else if(get(this, 'username').includes('r')){
                    this.applicationController.set('user', "user");
                    this.transitionToRoute('dashboard');
                } else {
                    alert("Username and password wrong");
                }
            } else {
                alert(" please enter username and password")
            }
        }
    }
});

import Route from '@ember/routing/route';

export default Route.extend({

    model() {
        return [
            {
                value: 825111,
                label: 'San Francisco'
              },
              {
                value: 984299,
                label: 'San Jose'
              },
              {
                value: -400740,
                label: 'Oakland'
              },
          ];
    }


});
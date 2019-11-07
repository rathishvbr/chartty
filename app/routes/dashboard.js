
import Route from '@ember/routing/route';

export default Route.extend({
    //     model() {
    //       return      {
    //         labels: ['Running', 'Swimming', 'Eating', 'Cycling'],
    //         datasets: [{
    //             data: [20, 10, 4, 2]
    //         }]
    //     };
    //   }

    model() {
        let calls = ['csg', 'product', 'project', 'timeperiod'];
        let requests = calls.map(name => fetch(`https://localhost:5001/api/${name}`));
        return Promise.all(requests)
            .then(responses => {
                // for(let response of responses) {
                //   alert(`${response.url}: ${response.status}`);
                // }
                return responses;
            })
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(res => res);
    }


});
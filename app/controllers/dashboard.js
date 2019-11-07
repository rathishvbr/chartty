import Controller from '@ember/controller';
import {
    computed, get
} from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';



export default Controller.extend({
    baseUrl: "http://localhost:5000/api/",
    chartValue: null,
    showForCsg: false,
    csgName: null,
    selectedProduct: null,
    selectedProject: null,
    chartData: null,
    color:["rgba(255,99,132,0.2)", "rgba(179,181,198,0.2)"],
    radarData: {
        labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
        datasets: [
            {
                label: "1950",
                fill: true,
                backgroundColor: "rgba(179,181,198,0.2)",
                borderColor: "rgba(179,181,198,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(179,181,198,1)",
                data: [8.77, 55.61, 21.69, 6.62, 6.82]
            }, {
                label: "2050",
                fill: true,
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                data: [25.48, 54.16, 7.61, 8.06, 4.45]
            }
        ]
    },
    radarOptions: {
        title: {
            display: true,
            text: 'Distribution in % of world population'
        }
    },


    csg: computed('model.@each', function () {
        let results = ["All"];
        // let names = get(this, 'model') ? get(this, 'model').objectAt(0).map(cn => cn.name) : [];
        if (get(this, 'model')) {
            get(this, 'model').objectAt(0).forEach(csg => {
                results.push(csg.name);
            })
        }
        return results;
    }),

    product: computed('model.@each', function () {
        let results = ["All"];
        if (get(this, 'model')) {
            get(this, 'model').objectAt(1).forEach(product => {
                results.push(product.name);
            })
        }
        return results;
    }),

    project: computed('model.@each', function () {
        return get(this, 'model') ? get(this, 'model').objectAt(2).map(cn => cn.name) : [];
    }),

    // times: computed('model.@each', function () {
    //     // return get(this, 'model') ? get(this, 'model').objectAt(3).map(cn => cn.name) : [];
    //     let results = [];
    //     if (get(this, 'model')) {
    //         get(this, 'model').objectAt(3).forEach(t => {
    //             results.push(t.name);
    //         })
    //     }
    //     return results;
    // }),

    search(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].name === nameKey) {
                return myArray[i];
            }
        }
    },

    urlMaker() {
        // alert(this.search(get(this, "csgName"), this.get('model')[0]).id);
        let csg = get(this, "csgName") ? ((get(this, "csgName") == 'All') ? "-1" : this.search(get(this, "csgName"), this.get('model')[0]).id) : null;
        let product = get(this, "selectedProduct") ? ((get(this, "selectedProduct") == 'All') ? "-1" : this.search(get(this, "selectedProduct"), this.get('model')[1]).id) : null;
        let project = get(this, "selectedProject") ? ((get(this, "selectedProject") == 'All') ? "-1" : this.search(get(this, "selectedProject"), this.get('model')[2]).id) : null;
        // let product = get(this, "selectedProduct") ? ((get(this, "selectedProduct") == 'All') ? "-1" : get(this, "selectedProduct")) : null;
        // let project = get(this, "selectedProject");

        var url = "";
        if (isEmpty(csg) && isEmpty(product) && isEmpty(project)) {
            alert("Please select something");
        } else if (notEmpty(csg) && isEmpty(product) && isEmpty(project)) {
            // /api/csg/{csgId}/product
            url = `csg/${csg}/product`;
        } else if (notEmpty(csg) && notEmpty(product) && isEmpty(project)) {
            //  api/csg/{csgId}/product/{productId}/project
            url = `csg/${csg}/product/${product}/project`;
        } else if (isEmpty(csg) && notEmpty(product) && isEmpty(project)) {
            /// /api/product/{productId}/project
            url = `product/${product}/project`;
        } else if (notEmpty(csg) && notEmpty(product) && isEmpty(project)) {
            /// /api/csg/{csgId}/product
            alert("/api/csg/{csgId}/product");
        }

        // alert(url);
        return { url: url, item: url ? (url.substr(url.lastIndexOf('/') + 1)) : "" };
    },

    setterProduct(data) {
        console.log(JSON.stringify(data));
        this.set('selectedProduct', null);
        let model = [...this.model];
        model[1] = data;
        this.set('model', model);
    },

    setterProject(data) {
        console.log(JSON.stringify(data));
        this.set('selectedProject', null);
        let model = [...this.model];
        model[2] = data;
        this.set('model', model);
    },

    parseChartData(data) {
         console.log(JSON.stringify("datadatadatadatadatadatadata"));
         console.log(JSON.stringify(data));
         let dataSet = [];
         let labels = [];

         let option = {
            title: {
                display: true,
                text: 'Distribution in % of world population'
            }
        };

data.forEach((d,index) => {
    let set = {
        label: d.timePeriod,
        backgroundColor: get(this, 'color')[index],
        data: d.metrics.map(d => d.maturity)
    }
    dataSet.push(set);
    if(labels.length == 0){
        labels = d.metrics.map(d => d.category);
    }
})


        let chartData = {
            labels: labels,
            datasets: dataSet
        };

        this.set('barData', chartData);
        this.set('barOption', option);

    },

    actions: {
        csgChange(selectedItem) {
            this.set('csgName', selectedItem);
            this.send('updateDropDown');
        },

        productChange(selectedItem) {
            this.set('selectedProduct', selectedItem);
            this.send('updateDropDown');
        },

        projectChange(selectedItem) {
            this.set('selectedProject', selectedItem);
            this.send('updateDropDown');
        },

        async updateDropDown() {
            // if (this.csgName) {
            //     this.set('showForCsg', true);
            // }
            let url = this.urlMaker();
            await fetch(this.baseUrl + url.url).then((res) => {
                return res.json()
            }).then(data => {
                console.log(JSON.stringify(data));
                // this.set(url.item, res);
                if (url.item == "product") {
                    this.setterProduct(data);
                }
                if (url.item == "project") {
                    this.setterProject(data);
                }
            }).catch((err) => {
                console.log('Fetch Error :-S', err);
            })
        },

        async showChart() {
            let csg = get(this, "csgName") ? ((get(this, "csgName") == 'All') ? "-1" : this.search(get(this, "csgName"), this.get('model')[0]).id) : null;
            let product = get(this, "selectedProduct") ? ((get(this, "selectedProduct") == 'All') ? "-1" : this.search(get(this, "selectedProduct"), this.get('model')[1]).id) : null;
            let project = get(this, "selectedProject") ? ((get(this, "selectedProject") == 'All') ? "-1" : this.search(get(this, "selectedProject"), this.get('model')[2]).id) : null;
            let timeperiod = this.get('timeLine');
                await fetch(this.baseUrl + "query", {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "csg": csg || null,
                        "product": product || null,
                        "project": project || null,
                        "timePeriod": timeperiod || []
                      })
                  }).then((res) => {
                    console.log(JSON.stringify(res));
                    return res.json();
                })
                .then(data => {
                    this.parseChartData(data);
                })
                .catch((err) => {
                    console.log('Fetch Error :-S', err);
                })
        },

    }
});

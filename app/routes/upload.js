import Route from '@ember/routing/route';

export default Route.extend({
    baseUrl: "http://localhost:5000/api/",

    actions: {
        sendData() {
        let a= JSON.parse(JSON.parse(document.getElementById('test').value));
        a=a.filter(b=>b != a[0]);
        let c = a.map(d=>{
            return {
                Question :d[0],
                Score :d[1] ,
                Notes :d[2] ,
                WeightedScore  : d[3]  ,
                MaxWeightedScore : d[4],
                TotalMaxWeightedScoreForTopic: d[5], 
                Maturity : d[6],
                NumberOfTopicsInCategory : d[7],
                CategoryMaturityTotal : d[8],
                AverageMaturity: d[9],
                Year : d[10],
                Quarter: d[11],
                project_id  : d[12]
            }
        });


         fetch(this.baseUrl + "query", {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: c
              }).then((res) => {
                return res.json();
            })
            .then(data => {
                console.log(JSON.stringify(data));
            });
        }
    }
});

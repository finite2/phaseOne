


function getTruth(doses){
  d3.select('#doses').append('div')
            .selectAll('div')
            .data(doses).enter()
            .append('div')
            .html(function(d,i) { return '<div class="col-xs-6">Dose level ' + (i + 1) + '</div><div class="col-xs-6"><input onchange="updateTruth(' + i + ')" id="doseLevel' + i + '" class="vcenter" type="number" min="0" max="1" step="0.01" value=' + d + '></div>' ;})
}

function updateTruth(i){
  truth[i] = parseFloat(d3.select('#doseLevel' + i).node().value);
}


d3.select('#smodel').selectAll("option").data(models).enter()
  .append("option")
  .attr("value",function(d) { return d.id})
  .text(function(d) { return d.name })


d3.select('#target')
  .on('input', function(){
  setup.target = parseFloat(this.value);
  updateTargetLine(priorGraph);
  updateTargetLine(modelGraph);
  updateTargetLine(postGraph);

});

d3.select("#smodel")
  .on('change', function(){
    model = models[d3.select('#smodel').property('selectedIndex')];
    console.log(model.name);
    rerunModel();
    model.prior();
});

d3.select('#submitbutton')
  .on('click', function() {
    addPatient(modelGraph);
});

d3.select('#nDoses')
  .on('input', function(){
    nDoses = parseInt(this.value);
    doses = truth.slice(0,nDoses)
    d3.select('#doses div').remove();
    getTruth(doses)
  });

sPatients = 10
d3.select('#sPatients')
  .on('input', function(){
    sPatients = this.value;
    d3.select('#manyPatients').text(sPatients);
  });

d3.select('#cohortSize')
  .on('input', function(){
    cohortSize = this.value;
  })

d3.select('#submitMany')
  .on('click', function() {

    //resetTrialData();
    //resetGraph();
    addPatients(sPatients);
});





d3.select('#resetButton')
  .on('click', function(){
    resetTrialData();
    resetGraph();
})




function Model(id, name, fun, priorUI) {
  this.id = id;
  this.name = name;
  this.fun = fun;
  this.priorUI = priorUI;
}

function oneParamNormalPrior(){
d3.select('#priorDist').selectAll('*').remove();
var ui = d3.select('#priorDist').append('div')

ui.append('div')
  .attr('class','col-xs-6')
  .html('Mean');

ui.append('div')
  .attr('class','col-xs-6')
  .html("<input class='smallBox' onchange='updateMean(0)' id='mean0' type='number' value='2.5' step='0.01'>");
  
ui.append('div')
  .attr('class','col-xs-6')
  .html('Variance');
  
ui.append('div')
  .attr('class','col-xs-6')
  .html("<input id='sigma0' class='smallBox' onchange='updateSigma(0)' type='number' value='0.64' step='0.01'>");
}

function updateMean(i){
  setup.prior.mean[i] = parseFloat(d3.select('#mean' + i).node().value);
}

function updateSigma(i){
  setup.prior.sigma[i] = parseFloat(d3.select('#sigma' + i).node().value);
}

function twoParamNormalPrior(){
d3.select('#priorDist').select('div').remove();
var ui = d3.select('#priorDist').append('div')

ui.append('div')
  .attr('class','col-xs-6')
  .html('Mean');

ui.append('div')
  .attr('class','col-xs-6')
  .html("<input class='smallBox' id='mean0' type='number' value='2.5' step='0.01'><input id='mean1' class='smallBox' type='number' value='1.5' step='0.01'>");
  
ui.append('div')
  .attr('class','col-xs-6')
  .html('Variance');
  
ui.append('div')
  .attr('class','col-xs-6')
  .html("<input id='sigma0' class='smallBox' onchange='updateSigma(0)' type='number' value='0.64' step='0.01'><input id='sigma1' class='smallBox' onchange='updateSigma(1)' type='number' value='0.13' step='0.01'>");
ui.append('div')
  .attr('class','col-xs-6')
ui.append('div')
  .attr('class','col-xs-6')
  .html("<input id='sigma2' class='smallBox' onchange='updateSigma(2)' type='number' value='0.13' step='0.01'><input id='sigma3' class='smallBox' onchange='updateSigma(3)' type='number' value='0.64' step='0.01'>");

}

var models = []

models[0] = new Model(
  id = 0,
  name = "Bayes One Parameter Logistic TITE-CRM (bcrm)",
  fun = function(prior, posterior) {
    var data;
    if(prior) {
      data = setup.trialData.summaryData
    } else {
      data = trialData.summaryData
    }
    console.log(setup)
    console.log(data)
    var req = ocpu.rpc("runModelLogisticOne", {
      data: data,
      targetTox: setup.target,
      inDoses: [1,2,3,4,5,6,7],
      mean: setup.prior.mean[0],
      variance: setup.prior.variance[0]
    }, 
    function(output){
      // data from R output to console
      console.log(output);
    
      // get next dose based on model
      trialData.nextDose = nextDose(output);
      
      
      
      if(prior) {
        updateModelLine(priorGraph, output);
        paintHistogram(priorHist0, output.params[0]);
        removeGraph(priorHist1)
      } 
    if (posterior) {
        paintHistogram(postHist0, output.params[0])
        removeGraph(postHist1)
        updateModelLine(modelGraph, output);
        updateModelLine(postGraph, output);
      }
    
    });
  },
  priorUI = function(){
    oneParamNormalPrior()
  }
)

models[1] = new Model(
  id = 0,
  name = "Bayes Two Parameter Logistic TITE-CRM (bcrm)",
  fun = function(prior, posterior) {
    var data;
    if(prior) {
      data = setup.trialData.summaryData
    } else {
      data =trialData.summaryData
    }
  var req = ocpu.rpc("runModelLogisticTwo", {
      data: data,
      targetTox: setup.target,
      inDoses: [1,2,3,4,5,6,7],
      mean: setup.prior.mean,
      variance: setup.prior.variance
    }, 
    function(output){
      // data from R output to console
      console.log(output);
    
      // get next dose based on model
      trialData.nextDose = nextDose(output);
      
      
      
      if(prior) {
        updateModelLine(priorGraph, output);
        paintHistogram(priorHist0, output.params[0]);
        paintHistogram(priorHist1, output.params[1]);
      } 
      if(posterior) {
        paintHistogram(postHist0, output.params[0])
        paintHistogram(postHist1, output.params[1])
        updateModelLine(modelGraph, output);
        updateModelLine(postGraph, output);
      }
    
    });
},
  priorUI = function(){
    twoParamNormalPrior()
  }
)

models[2] = new Model(
  id = 0,
  name = "Bayes One Parameter Power TITE-CRM (bcrm)",
  fun = function(prior, posterior) {
    var data;
    if(prior) {
      data = setup.trialData.summaryData
    } else {
      data =trialData.summaryData
    }
  var req = ocpu.rpc("runModelPower", {
      data: data,
      targetTox: setup.target,
      inDoses: [1,2,3,4,5,6,7],
      mean: setup.prior.mean[0],
      variance: setup.prior.variance[0]
    }, 
    function(output){
      // data from R output to console
      console.log(output);
    
      // get next dose based on model
      trialData.nextDose = nextDose(output);
      
      
      
      if(prior) {
        updateModelLine(priorGraph, output);
        paintHistogram(priorHist0, output.params[0]);
        removeGraph(priorHist1)

      } 
      if(posterior) {
        paintHistogram(postHist0, output.params[0])
        removeGraph(postHist1)
        updateModelLine(modelGraph, output);
        updateModelLine(postGraph, output);
      }
    
    });
},
  priorUI = function(){
    oneParamNormalPrior()
  }
)


var model = models[0];


function nextDose(output) {
  console.log('current MTD = ' + output.mtd)
  return output.mtd
}


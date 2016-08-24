

function Model(id, name, fun, prior) {
  this.id = id;
  this.name = name;
  this.fun = fun;
  this.prior = prior;
}

function oneParamNormalPrior(){
d3.select('#priorUI').select('div').remove();
var ui = d3.select('#priorUI').append('div')

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
d3.select('#priorUI').select('div').remove();
var ui = d3.select('#priorUI').append('div')

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
  fun = function(g) {
  var req = ocpu.rpc("runModelLogisticOne", {
      data: trialData.summaryData,
      targetTox: setup.target,
      inDoses: [1,2,3,4,5,6,7],
      mean: setup.prior.mean[0],
      variance: setup.prior.variance[0]
    }, 
    function(output){
      // data from R output to console
      console.log(output);
    
      // data for finding next dose goes into mFit
      output.mFit = {a: -3, b: output.median};
      // get next dose based on model
      trialData.nextDose = nextDose(output);
      
      
      
      if(g.prior) {
        priorData = output
        updateModelLine(priorGraph, output);
        updateModelLine(modelGraph, output);
        updateModelLine(postGraph, output);
        paintHistogram(priorHist0, priorData.params);
        //paintHistogram(priorHist1, priorData.params[1]);
        paintHistogram(postHist0, priorData.params);
        //paintHistogram(postHist1, priorData.params[1]);

      } else {
        paintHistogram(postHist0, output.params)
        //paintHistogram(postHist1, output.params[1])
        updateModelLine(modelGraph, output);
        updateModelLine(postGraph, output);
      }
    
    });
  },
  prior = function(){
    oneParamNormalPrior()
  }
)

models[1] = new Model(
  id = 0,
  name = "Bayes Two Parameter Logistic TITE-CRM (bcrm)",
  fun = function(g) {
  var req = ocpu.rpc("runModelLogisticTwo", {
      data: trialData.summaryData,
    }, 
    function(output){
      // data from R output to console
      console.log(output);
    
      // data for finding next dose goes into mFit
      output.mFit = {a: output.median[0], b: output.median[1][4]};
      // get next dose based on model
      trialData.nextDose = nextDose(output);
      
      
      
      if(g.prior) {
        priorData = output
        updateModelLine(priorGraph, output);
        updateModelLine(modelGraph, output);
        updateModelLine(postGraph, output);
        paintHistogram(priorHist0, priorData.params[0]);
        paintHistogram(priorHist1, priorData.params[1]);
        paintHistogram(postHist0, priorData.params[0]);
        paintHistogram(postHist1, priorData.params[1]);

      } else {
        paintHistogram(postHist0, output.params[0])
        paintHistogram(postHist1, output.params[1])
        updateModelLine(modelGraph, output);
        updateModelLine(postGraph, output);
      }
    
    });
},
  prior = function(){
    twoParamNormalPrior()
  }
)


/* Bayes One Parameter Power CRM
models[1] = new Model(
  id = 1,
  name = "Bayes One Parameter Power CRM",
  fun = function(g) {
    var req = ocpu.rpc("updateModel", {
      target: setup.target,
      data: trialData.patientData,
      prior: prior
    }, 
    function(output){
      console.log(output);
      // data for finding next dose goes into mFit
      output.mFit = output.estimate[0];
      // get next dose based on model
      trialData.nextDose = nextDose(output);


      console.log("Model MTD = ", output.mtd[0]);

      rOutput = output
      var MTDdata = [{x: trialData.nextDose, y: 0}, {x: trialData.nextDose, y: setup.target}]
      updateModelLine(g, output.ptox, output.ptoxL, output.ptoxU, MTDdata);

    });
  },
  curve = function(x, param) {
    return Math.pow(prior[x-1],Math.exp(param))
  },
  inverse = function(param) {
    var dose = 0;
    var estimates = [];
    for (i=0; i<prior.length; i++) {
      estimates.push(Math.abs(setup.target - Math.pow(prior[i],Math.exp(param))));
    }
    return indexOfSmallest(estimates) + 1
  },
  curveDefined = function(){ return doseLevels.length - 1}
)
*/

var model = models[0];



/*
function plotCurve(g, a, b){
  var data = getLine(curve2, {a: a, b: b}, 0.5, doseLevels.length+0.5, 200);
      updateModelLine(g, data, what);
}

function plotCurve(g, a,b ,al,bl,au,bu, nd) {
  var data = getLine(model.curve, {a: a, b: b}, 0.5, doseLevels.length+0.5, model.curveDefined());
  var lData = getLine(model.curve, {a: al, b: bl}, 0.5, doseLevels.length+0.5, model.curveDefined());
  var uData = getLine(model.curve, {a: au, b: bu}, 0.5, doseLevels.length+0.5, model.curveDefined());
  var MTDdata = [{x: nd, y: 0}, {x: nd, y: setup.target}]
  updateModelLine(g, data, lData, uData, MTDdata);
}
*/

function nextDose(output) {
  console.log('current MTD = ' + output.mtd)
  return output.mtd
}


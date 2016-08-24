

function Model(id, name, fun, curve, inverse, curveDefined) {
  this.id = id;
  this.name = name;
  this.fun = fun;
  this.curve = curve;
  this.inverse = inverse;
  this.curveDefined = curveDefined;
}


var models = []
/* Bayesian two parameter logistic */
models[0] = new Model(
  id = 0,
  name = "Bayes Two Parameter Logistic TITE-CRM",
  fun = function bayesTwoParamLogistic(g) {
  var req = ocpu.rpc("runModel", {
      data: trialData.patientData,
    }, 
    function(output){
      // data from R output to console
      // console.log(output);
    
      // data for finding next dose goes into mFit
      output.mFit = {a: output.summary[0][4], b: output.summary[1][4]};
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
  curve = function(x, param) {
    return invLogit(param.a + param.b * x);
  },
  inverse = function(param) {
    return (- Math.log((1 / setup.target) - 1) - param.a)/param.b
  },
  curveDefined = function(){ return 200}
)

models[1] = new Model(
  id = 0,
  name = "bcrm Bayes One Parameter Logistic TITE-CRM",
  fun = function(g) {
  var req = ocpu.rpc("runModelLogisticOne", {
      data: trialData.summaryData,
      targetTox: setup.target,
      inDoses: [1,2,3,4,5,6,7]
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
  curve = function(x, param) {
    return invLogit(param.a + param.b * x);
  },
  inverse = function(param) {
    return (- Math.log((1 / setup.target) - 1) - param.a)/param.b
  },
  curveDefined = function(){ return 200}
)

models[2] = new Model(
  id = 0,
  name = "bcrm Bayes Two Parameter Logistic TITE-CRM",
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
  curve = function(x, param) {
    return invLogit(log(param.a + param.b * x);
  },
  inverse = function(param) {
    return (- Math.log((1 / setup.target) - 1) - param.a)/param.b
  },
  curveDefined = function(){ return 200}
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


// Main js file


var param = {};
param.speed = 1000;
param.rConnected = false;
param.rConnected = true;
param.sPatients = 10;
var setup = {};
setup.target = 0.4;
setup.cohort = {};
setup.prior = {};
setup.prior.mean = [2.5, 1.5];
setup.prior.variance = [0.64,0.13,0.13,0.64];
setup.cohortSize = 2;
setup.trialData = {}
resetTrialData(setup.trialData)


var rOutput;





var prior = [0.05, 0.10, 0.20, 0.35, 0.50, 0.70, 0.85,0.9,0.95,0.99];
// var doseLevels = [1, 5, 10, 20, 40, 70, 100];
var initTruth = [0, 0.05, 0.05, 0.1, 0.2, 0.35, 0.5, 0.8, 0.9, 0.99];
var truth = initTruth;

var leftOnCohort = setup.cohortSize;

// add doses to ui
doses = truth.slice(0,7)
getTruth(doses)

var trialData = {}
resetTrialData(trialData);

priorGraph = {};
priorGraph.id = 'priorModel';
priorGraph.prior = true;
paintModelGraph(priorGraph);


priorHist0 = {}
priorHist0.id = 'priorHist0';

priorHist1 = {}
priorHist1.id = 'priorHist1';

postHist0 = {}
postHist0.id = 'postHist0';

postHist1 = {}
postHist1.id = 'postHist1';

doseGraph = {}
doseGraph.id = 'doseGraph';
doseGraph.xMax = 8;
paintDoseGraph(doseGraph);




modelGraph = {};
modelGraph.id = 'graph';
modelGraph.patients = true;
paintModelGraph(modelGraph);
var patientUI = d3.select('#patients');

postGraph = {};
postGraph.id = 'postModel';
postGraph.prior = false;
postGraph.posterior = true;
paintModelGraph(postGraph);

model.priorUI();

if (param.rConnected) {
  model.fun(true, true);
}

// Main js file


var param = {};
param.speed = 1000;
param.rConnected = true;

var setup = {};
setup.target = 0.4;
setup.cohort = {};
setup.prior = {};




var rOutput;

var trialData = {};


var sPatients = 10;
var prior = [0.05, 0.10, 0.20, 0.35, 0.50, 0.70, 0.85];
var doseLevels = [1, 5, 10, 20, 40, 70, 100]
var truth = [0, 0.05, 0.05, 0.1, 0.2, 0.35, 0.5, 0.8];
var cohortSize = 2;
var leftOnCohort = cohortSize;


resetTrialData()

priorGraph = {};
priorGraph.id = 'priorModel';
priorGraph.prior = true;
if (param.rConnected) {
  paintModelGraph(priorGraph);
}

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


if (param.rConnected) {
  model.fun(priorGraph);
}

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

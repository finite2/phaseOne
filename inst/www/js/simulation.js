
function resetTrialData(trialData) {
  trialData.patients = -1;
  trialData.patientData = [];
  trialData.toxicities = 0;
  trialData.summaryData = [
    {e: 0, n: 0},
    {e: 0, n: 0},
    {e: 0, n: 0},
    {e: 0, n: 0},
    {e: 0, n: 0},
    {e: 0, n: 0},
    {e: 0, n: 0},
    {e: 0, n: 0}
  ];
  trialData.lastDose = 1;
  trialData.nextDose = 1;
}

function addPatients(n) {
  for(var i=0; i<n; i++){
    setTimeout(function() {addPatient(modelGraph)}, i * 2*param.speed)
  }
}

newPatient = function() {
  trialData.patients ++
  
  // var dose = getNextDose();
  trialData.nextDose = Math.floor(trialData.nextDose);
  //console.log(dose);
  if(setup.cohortSize > 1) {
    if(leftOnCohort > 0) {
      trialData.nextDose = trialData.lastDose;
    } else {
      leftOnCohort = setup.cohortSize;
    }
    leftOnCohort --
  }
  
  var dose = trialData.nextDose  <= trialData.lastDose + 1 ? trialData.nextDose: trialData.lastDose + 1;
  trialData.lastDose = dose
  dose = Math.max(1,Math.min(dose, doses.length));
  //console.log(truth)
  var event = rbern(truth[dose-1]);
  var weights = 1;
  dta = {
    x: dose,
    y: event,
    weights: weights,
    ecount: event === 1 ? trialData.summaryData[dose].e + 1: trialData.summaryData[dose].n + 1
  }
  trialData.patientData.push(dta)
  
  if(event){
    trialData.summaryData[dose].e ++;
    trialData.toxicities ++;
  } else {
    trialData.summaryData[dose].n ++;
  }
}
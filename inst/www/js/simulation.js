


newPatient = function() {
  trialData.patients ++
  
  // var dose = getNextDose();
  trialData.nextDose = Math.floor(trialData.nextDose);
  console.log(dose);
  if(cohortSize > 1) {
    if(leftOnCohort > 0) {
      trialData.nextDose = trialData.lastDose;
    } else {
      leftOnCohort = cohortSize;
    }
    leftOnCohort --
  }
  
  var dose = trialData.nextDose  <= trialData.lastDose + 1 ? trialData.nextDose: trialData.lastDose + 1;
  trialData.lastDose = dose
  dose = Math.max(1,Math.min(dose, doseLevels.length));
  console.log(truth)
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
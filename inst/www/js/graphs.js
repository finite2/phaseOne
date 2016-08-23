
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

function resetTrialData() {
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

function resetGraph() {
  d3.select('#patients').selectAll("*").remove();
  rerunModel();
  
}


function updateGraphSizevalues(g, hRatio){
  g.fullWidth = Math.max(100,d3.select('#tcontent').node().getBoundingClientRect().width - 40);
  g.fullHeight = g.fullWidth * hRatio;
}

function paintHistogram(g, values) {
  d3.select('#' + g.id).selectAll('*').remove();
  updateGraphSizevalues(g, 0.5);
  g.fullWidth *= 0.5;
  g.fullHeight *= 0.5;
  g.margin = {top: 30, right: 20, bottom: 30, left: 50};
  g.width = g.fullWidth - g.margin.left - g.margin.right;
  g.height = g.fullHeight - g.margin.top - g.margin.bottom;

  // Set the ranges
  g.x = d3.scale.linear().range([0, g.width]);
  g.y = d3.scale.linear().range([g.height, 0]);
  
  g.xAxis = d3.svg.axis().scale(g.x)
      .orient("bottom").ticks(8);
  g.yAxis = d3.svg.axis().scale(g.y)
      .orient("left").ticks(5);
  
  // Scale the range of the data
  g.x.domain([Math.min(...values), Math.max(...values)]);
  
  var data = d3.layout.histogram()
    .frequency(false)
    (values);
  
  g.y.domain([0, d3.max(data, function(d) { return d.y; })])
    
  
  var svg = d3.select("#" + g.id)
    .append("svg")
      .attr("width", g.width + g.margin.left + g.margin.right)
      .attr("height", g.height + g.margin.top + g.margin.bottom)
    .append("g")
      .attr("transform", 
        "translate(" + g.margin.left + "," + g.margin.top + ")")
  
  var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + g.x(d.x) + "," + g.y(d.y) + ")"; });

  
  bar.append("rect")
    .attr("x", 1)
    .attr("width", function(d) { return g.x(d.dx) - g.x(0)})
    .attr("height", function(d) { return g.height - g.y(d.y); })
    .attr("fill", "steelblue")
  
  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + g.height + ")")
    .style('fill', 'white')
    .call(g.xAxis);

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .style('fill', 'white')
    .call(g.yAxis);
}

function paintModelGraph(g) {
  updateGraphSizevalues(g, 0.4);

  // Set the dimensions of the canvas / graph
  g.margin = {top: 30, right: 20, bottom: 30, left: 50};
  g.width = g.fullWidth - g.margin.left - g.margin.right;
  g.height = g.fullHeight - g.margin.top - g.margin.bottom;
  
  

  // Set the ranges
  g.x = d3.scale.linear().range([0, g.width]);
  g.y = d3.scale.linear().range([g.height, 0]);
  // Define the axes
  g.xAxis = d3.svg.axis().scale(g.x)
      .orient("bottom").ticks(8);
  g.yAxis = d3.svg.axis().scale(g.y)
      .orient("left").ticks(5);
  // Define the line
  g.valueline = d3.svg.line()
      .x(function(d) { return g.x(d.x); })
      .y(function(d) { return g.y(d.y); });
  
  g.valuelinel = d3.svg.line()
      .x(function(d) { return g.x(d.x); })
      .y(function(d) { return g.y(d.yl); });
  
  g.valuelineu = d3.svg.line()
      .x(function(d) { return g.x(d.x); })
      .y(function(d) { return g.y(d.yu); });
  // Adds the svg canvas
  g.svg = d3.select("#" + g.id)
    .append("svg")
      .attr("width", g.width + g.margin.left + g.margin.right)
      .attr("height", g.height + g.margin.top + g.margin.bottom)
    .append("g")
      .attr("transform", 
        "translate(" + g.margin.left + "," + g.margin.top + ")");

  // Scale the range of the data
  g.x.domain([0.5, doseLevels.length + 0.5]);
  g.y.domain([0, 1]);

  g.cols = ['white', 'red'];


  // Add the valueline path.
  g.svg.append("path")
    .attr("class", "line")
    .attr("id","median")
    
  

  g.svg.append("path")
    .attr("id","lower")
    .attr("class", "line")
    .style("stroke-dasharray", ("3, 3"));

  g.svg.append("path")
    .attr("id","upper")
    .attr("class", "line")
    .style("stroke-dasharray", ("3, 3"));
  
  g.svg.append("path")
    .attr("id","MTD")
    .attr("class", "line")
  
  
  // Add the X Axis
  g.svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + g.height + ")")
    .style('fill', 'white')
    .call(g.xAxis);

  // Add the Y Axis
  g.svg.append("g")
    .attr("class", "y axis")
    .style('fill', 'white')
    .call(g.yAxis);


  g.svg.append("line")
    .attr('id', 'targetLine')
    .attr("x1", 0)
    .attr("x2", g.width)
    .attr("y1", g.y(setup.target))
    .attr("y2", g.y(setup.target))
    .style("stroke", "rgb(189, 189, 189)");

  if(g.patients) {
    g.svg.append('g')
      .attr('id', 'patients');
  }
}


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
  var event = rbern(truth[dose]);
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


function addPatient(g) {

  newPatient();
  patientUI.append('circle')
  .attr('id','p' + patients)
  .attr('cx', g.x(0.5))
  .attr('cy', g.y(setup.target))
  .attr('r', 10)
  .attr('fill', 'purple')
  .transition()
    .duration(param.speed)
    .attr('cx',g.x(trialData.patientData[trialData.patients].x))
    .transition()
      .duration(param.speed)
      .attr('cy',g.y(trialData.patientData[trialData.patients].y + (trialData.patientData[trialData.patients].y === 1 ? -0.05*trialData.patientData[trialData.patients].ecount: 0.05*trialData.patientData[trialData.patients].ecount)))
      .attr('fill', g.cols[trialData.patientData[trialData.patients].y])
  
  if (param.rConnected) {
    model.fun(g)
  }
}

function addPatients(n) {
  for(var i=0; i<n; i++){
    setTimeout(function() {addPatient(modelGraph)}, i * 2*param.speed)
  }
}


// ** Update data section (Called from the onclick)
function updateModelLine(g, data) {
  g.svg.transition()
    .select(".line")   // change the line
    .duration(1500)
    .attr("d", g.valueline(data));
}


function updateModelLine(g, output) {
  // Make the changes
  g.svg.transition()
    .select("#median")
    .duration(1500)
    .attr("d", g.valueline(output.model));
  

  g.svg.transition()
    .select("#lower")
    .duration(1500)
    .attr("d", g.valueline(output.modelL));

  g.svg.transition()
    .select("#upper")
    .duration(1500)
    .attr("d", g.valueline(output.modelU));
  
  var MTDdata = [{x: output.mtd, y: 0}, {x: output.mtd, y: setup.target}]
  g.svg.transition()
    .select("#MTD")
    .duration(1500)
    .attr("d", g.valueline(MTDdata)); 

}


function rerunModel() {
  if (param.rConnected) {
    model.fun(modelGraph)
  }
}

resetTrialData()

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



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
  updateGraphSizevalues(g, 0.35);
  g.fullWidth *= 0.5;
  g.fullHeight *= 0.5;
  g.margin = {top: 30, right: 20, bottom: 30, left: 50};
  g.width = g.fullWidth - g.margin.left - g.margin.right;
  g.height = g.fullHeight - g.margin.top - g.margin.bottom;

  // Set the ranges
  g.x = d3.scaleLinear().range([0, g.width]);
  g.y = d3.scaleLinear().range([g.height, 0])

  g.xAxis = d3.axisBottom().scale(g.x).ticks(8);
  g.yAxis = d3.axisLeft().scale(g.y).ticks(5);
  
  g.x.domain([Math.min(...values), Math.max(...values)])

  var data = d3.histogram()
  .domain(g.x.domain())
    (values);
  
  g.y.domain([0, d3.max(data, function(d) { return d.length; })/ values.length])
  
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
    .attr("transform", function(d) { return "translate(" + g.x(d.x0) + "," + g.y(d.length/ values.length) + ")"; });

  
  bar.append("rect")
    .attr("x", 1)
    .attr("width", function(d) {return g.x(d.x1) - g.x(d.x0)})
    .attr("height", function(d) { return g.height - g.y(d.length/ values.length)  ; })
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
  updateGraphSizevalues(g, 0.35);

  // Set the dimensions of the canvas / graph
  g.margin = {top: 30, right: 20, bottom: 30, left: 50};
  g.width = g.fullWidth - g.margin.left - g.margin.right;
  g.height = g.fullHeight - g.margin.top - g.margin.bottom;
  
  

  // Set the ranges
  g.x = d3.scaleLinear().range([0, g.width]).domain([0.5, doseLevels.length + 0.5]);
  g.y = d3.scaleLinear().range([g.height, 0]).domain([0, 1]);
  // Define the axes
  g.xAxis = d3.axisBottom().scale(g.x).ticks(8);
  g.yAxis = d3.axisLeft().scale(g.y).ticks(5);
  // Define the line
  g.valueline = d3.line()
      .x(function(d) { return g.x(d.x); })
      .y(function(d) { return g.y(d.y); });
  
  g.valuelinel = d3.line()
      .x(function(d) { return g.x(d.x); })
      .y(function(d) { return g.y(d.yl); });
  
  g.valuelineu = d3.line()
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





function paintDoseGraph(g) {
  updateGraphSizevalues(g, 0.35);

  // Set the dimensions of the canvas / graph
  g.margin = {top: 30, right: 20, bottom: 30, left: 50};
  g.width = g.fullWidth - g.margin.left - g.margin.right;
  g.height = g.fullHeight - g.margin.top - g.margin.bottom;
  
  // Set the ranges
  g.x = d3.scaleLinear().range([0, g.width]).domain([0.5, 8.5]);
  g.y = d3.scaleLinear().range([g.height, 0]).domain([0.5, doseLevels.length + 0.5]);
  // Define the axes
  g.xAxis = d3.axisBottom().scale(g.x).ticks(8);
  g.yAxis = d3.axisLeft().scale(g.y).ticks(doseLevels.length);
  // Define the line

  // Adds the svg canvas
  g.svg = d3.select("#" + g.id)
    .append("svg")
      .attr("width", g.width + g.margin.left + g.margin.right)
      .attr("height", g.height + g.margin.top + g.margin.bottom)
    .append("g")
      .attr("transform", 
        "translate(" + g.margin.left + "," + g.margin.top + ")");

  g.cols = ['white', 'red'];
  g.svg.append("g")
    .attr("id", "Hlines")
  
  d3.select('#Hlines')
    .selectAll('line').data(doseLevels)
      .enter()
      .append('line')
      .attr('x1', g.x(g.x.domain()[0]))
      .attr('x2', g.x(g.x.domain()[1]))
      .attr('y1', function(d,i) {return g.y(i + 1.5);})
      .attr('y2', function(d,i) {return g.y(i + 1.5);})
      .attr("stroke-width", 2)
      .attr('stroke', 'grey')
      .style("stroke-dasharray", ("3, 3"));
  
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

  g.svg.append('g')
    .attr('id', 'dosePatients');
}


function addDosePatient(g) {
  d3.select('#dosePatients')
  .selectAll('circle').data(trialData.patientData)
    .enter()
    .append('circle')
    .attr('id','pd' + patients)
    .attr('cx', function(d, i) {return g.x(i + 1);})
    .attr('cy', function(d, i) {return g.y(d.x);})
    .attr('r', 8)
    .attr('fill', function(d, i) {return g.cols[d.y];});

}

function rescalex(g, newMax) {
  
  // Set the ranges
  g.x = d3.scaleLinear().range([0, g.width]).domain([0.5, newMax + 0.5]);
  // Define the axes
  g.xAxis = d3.axisBottom().scale(g.x).ticks(newMax);
  g.svg.select('.x')
    .transition()
      .duration(1500)
      .call(g.xAxis);

  
  g.svg.selectAll('circle')
   .data(trialData.patientData)
   .transition()
      .duration(1500)
      .attr('cx',function(d, i) {return g.x(i + 1)})

}

function updateTargetLine(g) {
  g.svg.select('#targetLine')
    .transition()
    .duration(param.speed)
      .attr("y1", g.y(setup.target))
      .attr("y2", g.y(setup.target))
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
  
  addDosePatient(doseGraph)
  if(doseGraph.xMax < trialData.patientData.length){
    doseGraph.xMax = trialData.patientData.length
    rescalex(doseGraph, doseGraph.xMax)
  }
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
  g.svg.select("#median")
      .transition()
      .duration(1500)
      .attr("d", g.valueline(output.model));
  
  g.svg.select("#lower")
      .transition()
      .duration(1500)
      .attr("d", g.valueline(output.modelL));

  g.svg.select("#upper")
      .transition()
      .duration(1500)
      .attr("d", g.valueline(output.modelU));
  
  var MTDdata = [{x: output.mtd, y: 0}, {x: output.mtd, y: setup.target}]
  g.svg.select("#MTD")
    .transition()
    .duration(1500)
    .attr("d", g.valueline(MTDdata)); 

}

function rerunModel() {
  if (param.rConnected) {
    model.fun(modelGraph)
  }
}




rinteger = function(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

rexp = function (rate) {
  return -Math.log(Math.random()) / rate;
}

rbern = function(p) {
  return Math.random() < p ? 1 : 0;
}


function sortNumber(a,b) {
    return a - b;
}

quantile = function(data, p) {
  p = p.constructor === Array ? p : [p];
  var dta = []
  data.sort(sortNumber)
  for(i=0; i<p.length; i++){
    var n = data.length;
    var position = (data.length - 1) * p[i];
    var lower = Math.floor(position);
    var diff = position - lower;
    dta.push( (1 - diff) * data[lower] + (diff) * data[lower + 1])
  }
  return dta
}


logit = function(p) {
  return Math.log(p / (1-p));
}

invLogit = function(alpha) {
  var dta = [];
  alpha = alpha.constructor === Array ? alpha : [alpha];
  for(i = 0; i<alpha.length; i++) {
    dta.push(Math.exp(alpha[i]) / (1 + Math.exp(alpha[i])));
  }
  return dta;
}

function indexOfSmallest(a) {
 var lowest = 0;
 for (var i = 1; i < a.length; i++) {
  if (a[i] < a[lowest]) lowest = i;
 }
 return lowest;
}


getLine = function(fun, param, xmin, xmax, n) {
  var i,x,y
  dta = [];
  
  for(i=0; i<=n; i++){
    x = xmin + i * (xmax-xmin) / n;
    y = fun(x, param);
    dta.push({x: x, y: y})
  }
  return dta;
}
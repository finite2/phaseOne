

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


getLine2 = function(q, output, xmin, xmax, n) {
  var i, x, y, sum,
  dta = [];
  for(i=0; i<=n; i++){
    x = xmin + i * (xmax-xmin) / n;
    var array2 = output.params[1];
    sum = output.params[0].map(function (num, idx) {
      return num + x * array2[idx];
    });
    // console.log(quantile(output.params[0] + x * output.params[1], q));
    console.log(quantile(sum, [0.025, 0.5, 0.975]))
    y = invLogit(quantile(sum, [0.025, 0.5, 0.975]));
    console.log(y)
    dta.push({x: x, yl: y[0], y: y[1], yu: y[2]})
  }
  return dta;
}
function generateRegion (xmin, xmax, ymin, ymax, margin) { 
  // margin of zero if not defined.
  margin = typeof margin !== 'undefined' ? margin : {top: 0, right: 0, bottom: 0, left: 0};
  
  return  {xmin: (xmin + margin.left), xmax: (xmax - margin.right), ymin: (ymin+margin.top), ymax: (ymax - margin.bottom)};
}

function generateRegionMarginless (margin, marginless) {
  return  {xmin: (marginless.xmin + margin.left), xmax: (marginless.xmax - margin.right), ymin: (marginless.ymin+margin.top), ymax: (marginless.ymax - margin.bottom)};
}


function generateEqualRegions (x,y,graph) {
  
  regions = []
  for ( i=0; i<x; i++) {
    for (j=0; j<y; j++) {
      regions.push({
        xmin: graph.width * i / x,
        xmax: graph.width * (i + 1) / x,
        ymin: graph.height * (j) / y,
        ymax: graph.height * (j + 1) / y
      });
    }
  }
  return regions;
}



function drawDonut(error, dType, dAge, dGender, dRace, dMonth, dDay) {

  var data0 = [], data1 = [], data2 = [], data3 = [], data4 = [], data5 = [];
  var data = [data0, data1, data2, data3, data4, data5];
  var label0 = [], label1 = [], label2 = [], label3 = [], label4 = [], label5 = [];
  var labels = [];  
  var n = 16;

  // convert strings to numbers
  dType.forEach(function(d) {
    d.Deaths = +d.Deaths;
    data0.push(d.Deaths);
    label0.push(d.Cause);
  });
  dAge.forEach(function(d) {
    d.Deaths = +d.Deaths;
    data1.push(d.Deaths);   
    label1.push(d.Cause);     
  });  
  dGender.forEach(function(d) {
    d.Deaths = +d.Deaths;
    data2.push(d.Deaths); 
    label2.push(d.Cause);       
  });  
  dRace.forEach(function(d) {
    d.Deaths = +d.Deaths;
    d.Rate = +d.Rate;
    d.Deaths = d.Rate;
    data3.push(d.Deaths); 
    label3.push(d.Cause);       
  });  
  dMonth.forEach(function(d) {
    d.Deaths = +d.Deaths;
    data4.push(d.Deaths); 
    label4.push(d.Cause);       
  });  
  dDay.forEach(function(d) {
    d.Deaths = +d.Deaths;
    data5.push(d.Deaths); 
    label5.push(d.Cause);       
  });

  data.forEach(function(d) {
    while (d.length < n) {
      d.push(0);
    }
  });     

  console.log(data);
  
  console.log(data0);
  console.log(data1);

  switch (donutType) {    // donutType is global variable from suicide.js
    case 'Method':
      labels = label0;
      break;
    case 'Age':
      labels = label1;
      break;
    case 'Gender':
      labels = label2;
      break;
    case 'Race':
      labels = label3;
      break;
    case 'Month':
      labels = label4;
      break;
    case 'Day':
      labels = label5;
      break;
    default:
      labels = label0;
      donutType = 'Method'
  }

console.log(labels);

  var chartGroup = d3.select('#chartG');

  chartGroup.append('g')
            .attr('transform', 'translate(650, 50)')
            .attr('id', '#chartTitle')
            .append('text')
            .text(function (d) {
              if (donutType == 'Race') {
                return ('Columbus Counties Suicides by ' + donutType + ' (Rate) (1999 - 2016)');
              } else {
                return ('Columbus Counties Suicides by ' + donutType + ' (Number) (1999 - 2016)');                
              }
            })
            .attr('class', 'title');

  var canvasWidth = 1200;
  var canvasHeight = 1000;

  var marginLeft = 60;
  var marginRight = 20;
  var marginTop = 100;
  var marginBottom = 20;

  var innerRadius = 200;
  var outerRadius = 400;

  var radiusScale = d3.scaleSqrt()
      .range([0, outerRadius])
      .domain([0, 110]); 

  var chartWidth = canvasWidth - marginLeft - marginRight;
  var chartHeight = canvasHeight - marginTop - marginBottom;

  var colors = d3.scaleOrdinal(d3.schemePaired);  

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
  });  

  var arc = d3.arc().innerRadius(0);
  var pie = d3.pie().sort(null);


  var pieGroup = chartGroup.append('g')
        .attr('transform', 'translate(' + canvasWidth/2 + ',' + canvasHeight/2 +')');

  var arcGenerator = d3.arc()
      .innerRadius(200)
      .outerRadius(400);

  var arcLabel = d3.arc()
      .innerRadius(220)
      .outerRadius(400);

  var svg = d3.select('#svgchart');

  svg.selectAll('.arc')
      .data(arcs(data0, data1))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .attr('transform', 'translate(' + canvasWidth/2 + ',' + canvasHeight/2 +')')      
      .append('path')
      .attr('fill', function(d, i) {
        return colors(i);
      })
      .attr('d', arc);


  // create pie slice labels
  svg.selectAll('text.title')
    .data(arcs(data0, data1))
    .enter()
    .append('text')  
      .attr('transform', 'translate(' + canvasWidth/2 + ',' + canvasHeight/2 +')')         
    .each(function(d, i) {
      var cen = arcGenerator.centroid(d);
      d3.select(this)
        .attr("transform", function(d) {
          var midAngle = d.startAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI;               // line used from web tutorial 
          return "translate(" + arcLabel.centroid(d)[0] + "," +arcLabel.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")";  // line used from web tutorial            
        })
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .text(function(d) { 
              console.log(i + labels[i]);
              return labels[i] + '\xa0\xa0\xa0\xa0\xa0' + data1[i];
            })
        .style("font-size", function(d) {
          if (data1[i] > 600) {
            return 18;
          } else if (d.data.Deaths > 100) {
            return 16;
          } else {
            return 14;
          }
        });
    });


      
  function arcs(data0, data1) {

    var arcs0 = pie(data0),
        arcs1 = pie(data1),
        i = -1,
        arc;
        //var outerRad0 = radiusScale(d3.sum(data0)),
        //var outerRad1 = radiusScale(d3.sum(data1));
        var outerRad0 = outerRadius;
        var outerRad1 = outerRadius;
    
    console.log("hi", outerRad0, outerRad1) 
    
    while (++i < n) {
      arc = arcs0[i];
      arc.outerRadius = outerRad0;
      arc.startAngle = arc.startAngle + 0.1;
      arc.endAngle = arc.endAngle + 0.1;
      arc.next = arcs1[i];
      arc.next.outerRadius = outerRad1; 
    }
    return arcs0;
  }



  d3.select('#sMethod')
    .on('mouseover', changeMethod);
  d3.select('#sAge')
    .on('mouseover', changeAge);
  d3.select('#sGender')
    .on('mouseover', changeGender);
  d3.select('#sRace')
    .on('mouseover', changeGender);
  d3.select('#sMonth')
    .on('mouseover', changeGender);    
  d3.select('#sDay')
    .on('mouseover', changeGender);



  function changeMethod() {

  }

  function changeAge() {


  }

  function changeGender() {

  }

  function changeRace() {

  }

  function changeMonth() {

  }

  function changeDay() {

  }    


  function arcTween(b) {
    return function(a, i) {
      var d = b.call(this, a, i), i = d3.interpolate(a, d);
      for (var k in d) a[k] = d[k];
      return function(t) { return arc(i(t)); };
    };
  }








  //pieGroup.append('text')
  //    .text('Number of Suicides')
  //    .attr('class', 'titlechart');







}





function drawLineChartUS(error, dataUS, dataOhio) {
  console.log('drawLine chart');

  // convert strings to numbers
  dataUS.forEach(function(d) {
    d.Rate = +d.Rate;
    d.Year = +d.Year;
  });
  dataOhio.forEach(function(d) {
    d.Rate = +d.Rate;
    d.Year = +d.Year;
  });        

  var chartGroup = d3.select('#chartG');

  chartGroup.append('g')
            .attr('transform', 'translate(650, 50)')
            .attr('id', '#chartTitle')
            .append('text')
            .text('U.S. Suicide Rates per 100,000 Population (1999 - 2016)')
            .attr('class', 'title');

  var canvasWidth = 1200;
  var canvasHeight = 1000;

  var marginLeft = 60;
  var marginRight = 20;
  var marginTop = 100;
  var marginBottom = 20;  

  var chartWidth = canvasWidth - marginLeft - marginRight;
  var chartHeight = canvasHeight - marginTop - marginBottom;

  // get min/max rates from the Ohio and US data sets
  minRate = d3.min(dataOhio, function(d) {return d.Rate});
  maxRate = d3.max(dataOhio, function(d) {return d.Rate});

  var minUS = -1;
  var maxUS = -1;
  minUS = d3.min(dataUS, function(d) {return d.Rate});
  maxUS = d3.max(dataUS, function(d) {return d.Rate});
  if (minUS != -1 && minUS < minRate) {
    minRate = minUS;
  }
  if (maxUS != -1 && maxUS > maxRate) {
    maxRate = maxUS;
  }
  console.log('Chart min max rates: ' + minRate + ' ' + maxRate);  

  var states = d3.nest()
                .key(function(d) {return d.State;})
                .sortKeys(function(a, b) {
                  //console.log(a);
                  return a == 'Ohio' ? 1 : -1;    // sort Ohio to end of list for drawing on top
                })
                .entries(dataUS);

  console.log('states length: ' + states.length);

  // normalize ranges
  var xScale = d3.scaleLinear().domain([1999, 2016]).range([marginLeft, chartWidth + marginLeft]);
  var yScale = d3.scaleLinear().domain([0, Math.round(maxRate)+20]).range([chartHeight + marginBottom, marginTop]);

  // x-axis
  var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('d'));
  chartGroup.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + (chartHeight+marginBottom) + ')')
            .call(xAxis);

  chartGroup.append('text')
            .attr('transform', 'translate(' + ((chartWidth+marginLeft+marginRight+10) / 2) + ',' + (chartHeight+marginTop+marginBottom) + ')')
            .style('text-anchor', 'middle')
            .style('font-size', '20px')
            .text('Year');

  // y-axis
  var yAxis = d3.axisLeft().scale(yScale).tickPadding(14);
  chartGroup.append('g')
            .attr('class', 'axis')  
            .attr('transform', 'translate(' + marginLeft + ',0)')
            .call(yAxis);

  chartGroup.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -5)
            .attr('x', 0 - (chartHeight / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-size', '20px')            
            .text('Deaths Per 100,000 People');

  // vertical grid lines
  function make_x_gridlines() {
    return d3.axisBottom(xScale).ticks(7);
  }

  chartGroup.append('g')
            .attr('class', 'grid')
            .attr('transform', 'translate(0,' + (chartHeight+marginBottom) + ')')
            .call(make_x_gridlines()
              .tickSize(-(chartHeight-marginTop))
              .tickFormat("")
            );   

  //var color = d3.scaleOrdinal(d3.schemeCategory10);   // choose color scheme

  var colors = ['#2e8b57', '#ff0000'];  

  var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltipAlt')
    .style('opacity', 0);  

  var lineGenerator = d3.line()
            .curve(d3.curveMonotoneX)  
            .x(function(d) {
              return xScale(d.Year);
            })
            .y(function(d) {
              return yScale(d.Rate);
            });

  var lineGroup = chartGroup.append('g');
  //chartGroup.append('g')
  var lines = lineGroup.selectAll('path')
            .data(states, function(d) {return d.key;})
            .enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', function(d) {
              if (d.key == 'Ohio') {return colors[1];}
              return colors[0];
            })
            .attr('stroke-width', function(d) {
              if (d.key == 'Ohio') {return 5;}
              return 3;
            })
            .attr('z-index', function(d) {
              if (d.key == 'Ohio') {return 2;}
              return 1;
            })
            .attr('id', function(d) {return d.key + 'line';})
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', function(d) {return lineGenerator(d.values); })
            .on('mouseover', function(d, i) {
              tooltip.transition()
                    .duration(200)
                    .style('opacity', 1.0);                
              tooltip.html(d.key)
                    .style('left', (d3.event.pageX - 70) + 'px')
                    .style('top', (d3.event.pageY - 35) + 'px')
                    .style('background-color', 'lightgray')
                    .style('width', '140px')
              d3.select(this).attr('stroke', '#778899');                 
            })
            .on('mouseout', function(d, i) {
              tooltip.transition()
                    .duration(700)
                    .style('opacity', 0)
              d3.select(this).attr('stroke', function(d) {
              if (d.key == 'Ohio') {return colors[1];}
              return colors[0];
              });                       
            });     

  lines.each(function(d) {d.totalLength = this.getTotalLength();})
  .attr("stroke-dasharray", function(d) {return d.totalLength + " " + d.totalLength})
  .attr("stroke-dashoffset", function(d) {return d.totalLength;})
  .transition()
  .delay(function(d) {
    if (d.key == 'Ohio') {
      return 2600;
    }
    return 400;
  })
  .duration(2000)
  .ease(d3.easeLinear)
  .attr("stroke-dashoffset", 0);                     

  // legend
  var barHeight = 5;
  var padding = 35;
  var names = ['States', 'Ohio']
  legendGroup = chartGroup.append('g');
  legendGroup.selectAll('text')
            .data(names)
            .enter()
            .append('text')
            .style('text-anchor', 'end')        
            .attr('x', chartWidth-350)
            .attr('y', function(d, i) {
              return (chartHeight/2 - 330) + (i+1)*(barHeight + padding);
            })
            .style('font-size', 20)
            .text(function(d) {
              return d;
            });
  legendGroup.selectAll('rect')
    .data(names)
    .enter().append('rect')
    .attr('x', chartWidth-330)
    .attr('y', function(d, i) {
      return (chartHeight/2 - 340) + (i+1)*(barHeight + padding+2);
    })
    .attr('width', function(d, i) {
      return 50;
    })
    .attr('height', barHeight)
    .style('fill', function(d, i) {
      return colors[i];
    });


}




function drawLineChartOhio(error, dataUS, dataOhio) {
  console.log('drawLine chart');

  // convert strings to numbers
  dataUS.forEach(function(d) {
    d.Rate = +d.Rate;
    d.Year = +d.Year;
  });
  dataOhio.forEach(function(d) {
    d.Rate = +d.Rate;
    d.Year = +d.Year;
  });      

  var chartGroup = d3.select('#chartG');

  chartGroup.append('g')
            .attr('transform', 'translate(650, 50)')
            .attr('id', '#chartTitle')
            .append('text')
            .text('Ohio Counties Suicide Rates per 100,000 Population (incomplete) (1999 - 2016)')
            .attr('class', 'title');

  var canvasWidth = 1200;
  var canvasHeight = 1000;

  var marginLeft = 60;
  var marginRight = 15;
  var marginTop = 100;
  var marginBottom = 20;  

  var chartWidth = canvasWidth - marginLeft - marginRight;
  var chartHeight = canvasHeight - marginTop - marginBottom;

  // get min/max rates from the Ohio and US data sets
  minRate = d3.min(dataOhio, function(d) {return d.Rate});
  maxRate = d3.max(dataOhio, function(d) {return d.Rate});

  var minUS = -1;
  var maxUS = -1;
  minUS = d3.min(dataUS, function(d) {return d.Rate});
  maxUS = d3.max(dataUS, function(d) {return d.Rate});
  if (minUS != -1 && minUS < minRate) {
    minRate = minUS;
  }
  if (maxUS != -1 && maxUS > maxRate) {
    maxRate = maxUS;
  }
  console.log('Chart min max rates: ' + minRate + ' ' + maxRate);  

  var states = d3.nest()
                .key(function(d) {return d.County;})
                .sortKeys(function(a, b) {
                 // console.log(a);
                  return (a == 'Franklin' || a == 'Delaware' || a == 'Fairfield' || a == 'Pickaway') ? 1 : -1;    // sort Ohio to end of list for drawing on top
                })
                .entries(dataOhio);

  console.log(states);
  console.log('states length: ' + states.length);

  // normalize ranges
  var xScale = d3.scaleLinear().domain([1999, 2016]).range([marginLeft, chartWidth + marginLeft]);
  var yScale = d3.scaleLinear().domain([0, Math.round(maxRate)+20]).range([chartHeight + marginBottom, marginTop]);

  // x-axis
  var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('d'));
  chartGroup.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + (chartHeight+marginBottom) + ')')
            .call(xAxis);

  chartGroup.append('text')
            .attr('transform', 'translate(' + ((chartWidth+marginLeft+marginRight+10) / 2) + ',' + (chartHeight+marginTop+marginBottom) + ')')
            .style('text-anchor', 'middle')
            .style('font-size', '20px')
            .text('Year');

  // y-axis
  var yAxis = d3.axisLeft().scale(yScale).tickPadding(14);
  chartGroup.append('g')
            .attr('class', 'axis')  
            .attr('transform', 'translate(' + marginLeft + ',0)')
            .call(yAxis);

  chartGroup.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -5)
            .attr('x', 0 - (chartHeight / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-size', '20px')            
            .text('Deaths Per 100,000 People');

  // vertical grid lines
  function make_x_gridlines() {
    return d3.axisBottom(xScale).ticks(7);
  }

  chartGroup.append('g')
            .attr('class', 'grid')
            .attr('transform', 'translate(0,' + (chartHeight+marginBottom) + ')')
            .call(make_x_gridlines()
              .tickSize(-(chartHeight-marginTop))
              .tickFormat("")
            );           

  //var color = d3.scaleOrdinal(d3.schemeCategory10);   // choose color scheme

  var colors = ['#87ceeb', '#8b0000'];  

  var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltipAlt')
    .style('opacity', 0);  

  var lineGenerator = d3.line()
            .curve(d3.curveBasis)  
            .x(function(d) {
              return xScale(d.Year);
            })
            .y(function(d) {
              return yScale(d.Rate);
            });

  var lineGroup = chartGroup.append('g');
  //chartGroup.append('g')
  var lines = lineGroup.selectAll('path')
            .data(states, function(d) {return d.key;})
            .enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', function(d) {
              if (d.key == 'Franklin' || d.key == 'Delaware' || d.key == 'Fairfield' || d.key == 'Pickaway') {return colors[1];}
              return colors[0];
            })
            .attr('stroke-width', function(d) {
              if (d.key == 'Franklin' || d.key == 'Delaware' || d.key == 'Fairfield' || d.key == 'Pickaway') {return 5;}
              return 3;
            })
            .attr('z-index', function(d) {
              if (d.key == 'Franklin' || d.key == 'Delaware' || d.key == 'Fairfield' || d.key == 'Pickaway') {return 2;}
              return 1;
            })
            .attr('id', function(d) {return d.key + 'line';})
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', function(d) {return lineGenerator(d.values); })
            .on('mouseover', function(d, i) {
              tooltip.transition()
                    .duration(200)
                    .style('opacity', 1.0);                
              tooltip.html(d.key)
                    .style('left', (d3.event.pageX - 70) + 'px')
                    .style('top', (d3.event.pageY - 35) + 'px')
                    .style('background-color', 'lightgray')
                    .style('width', '140px')
              d3.select(this).attr('stroke', '#778899');                 
            })
            .on('mouseout', function(d, i) {
              tooltip.transition()
                    .duration(700)
                    .style('opacity', 0)
              d3.select(this).attr('stroke', function(d) {
              if (d.key == 'Franklin' || d.key == 'Delaware' || d.key == 'Fairfield' || d.key == 'Pickaway') {return colors[1];}
              return colors[0];
              });                       
            });        

  lines.each(function(d) {d.totalLength = this.getTotalLength();})
  .attr("stroke-dasharray", function(d) {return d.totalLength + " " + d.totalLength})
  .attr("stroke-dashoffset", function(d) {return d.totalLength;})
  .transition()
  .delay(function(d) {
    if (d.key == 'Franklin' || d.key == 'Delaware' || d.key == 'Fairfield' || d.key == 'Pickaway') {
      return 2600;
    }
    return 400;
  })
  .duration(2000)
  .ease(d3.easeLinear)
  .attr("stroke-dashoffset", 0);                        

  // legend
  var barHeight = 5;
  var padding = 35;
  var names = ['Ohio Counties', 'Columbus Counties']
  legendGroup = chartGroup.append('g');
  legendGroup.selectAll('text')
            .data(names)
            .enter()
            .append('text')
            .style('text-anchor', 'end')        
            .attr('x', chartWidth-50)
            .attr('y', function(d, i) {
              return (chartHeight/2 - 330) + (i+1)*(barHeight + padding);
            })
            .style('font-size', 20)
            .text(function(d) {
              return d;
            });
  legendGroup.selectAll('rect')
    .data(names)
    .enter().append('rect')
    .attr('x', chartWidth-30)
    .attr('y', function(d, i) {
      return (chartHeight/2 - 340) + (i+1)*(barHeight + padding+2);
    })
    .attr('width', function(d, i) {
      return 50;
    })
    .attr('height', barHeight)
    .style('fill', function(d, i) {
      return colors[i];
    });

}



function partialDrawLineChartUS(error, dataUS, dataOhio) {
  console.log('drawLine chart');

  // convert strings to numbers
  dataUS.forEach(function(d) {
    d.Rate = +d.Rate;
    d.Year = +d.Year;
  });
  dataOhio.forEach(function(d) {
    d.Rate = +d.Rate;
    d.Year = +d.Year;
  });      

  var chartGroup = d3.select('#chartG');

  chartGroup.append('g')
            .attr('transform', 'translate(650, 50)')
            .attr('id', '#chartTitle')
            .append('text')
            .text('U.S. and Ohio Suicide Rates per 100,000 Population (incomplete) (1999 - 2016)')
            .attr('class', 'title');

  var canvasWidth = 1200;
  var canvasHeight = 1000;

  var marginLeft = 60;
  var marginRight = 15;
  var marginTop = 100;
  var marginBottom = 20;  

  var chartWidth = canvasWidth - marginLeft - marginRight;
  var chartHeight = canvasHeight - marginTop - marginBottom;

  // get min/max rates from the Ohio and US data sets
  minRate = d3.min(dataOhio, function(d) {return d.Rate});
  maxRate = d3.max(dataOhio, function(d) {return d.Rate});

  var minUS = -1;
  var maxUS = -1;
  minUS = d3.min(dataUS, function(d) {return d.Rate});
  maxUS = d3.max(dataUS, function(d) {return d.Rate});
  if (minUS != -1 && minUS < minRate) {
    minRate = minUS;
  }
  if (maxUS != -1 && maxUS > maxRate) {
    maxRate = maxUS;
  }
  console.log('Chart min max rates: ' + minRate + ' ' + maxRate);  

  var states = d3.nest()
                .key(function(d) {return d.State;})
                .sortKeys(function(a, b) {
                 // console.log(a);
                  return a == 'Ohio' ? 1 : -1;    // sort Ohio to end of list for drawing on top
                })
                .entries(dataUS);

  console.log(states);
  console.log('states length: ' + states.length);

  // normalize ranges
  var xScale = d3.scaleLinear().domain([1999, 2016]).range([marginLeft, chartWidth + marginLeft]);
  var yScale = d3.scaleLinear().domain([0, Math.round(maxRate)+20]).range([chartHeight + marginBottom, marginTop]);

  // x-axis
  var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('d'));
  chartGroup.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + (chartHeight+marginBottom) + ')')
            .call(xAxis);

  chartGroup.append('text')
            .attr('transform', 'translate(' + ((chartWidth+marginLeft+marginRight+40) / 2) + ',' + (chartHeight+marginTop+marginBottom) + ')')
            .style('text-anchor', 'middle')
            .style('font-size', '20px')
            .text('Year');

  // y-axis
  var yAxis = d3.axisLeft().scale(yScale).tickPadding(14);
  chartGroup.append('g')
            .attr('class', 'axis')  
            .attr('transform', 'translate(' + marginLeft + ',0)')
            .call(yAxis);

  chartGroup.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -5)
            .attr('x', 0 - (chartHeight / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-size', '20px')            
            .text('Deaths Per 100,000 People');

  // vertical grid lines
  function make_x_gridlines() {
    return d3.axisBottom(xScale).ticks(7);
  }

  chartGroup.append('g')
            .attr('class', 'grid')
            .attr('transform', 'translate(0,' + (chartHeight+marginBottom) + ')')
            .call(make_x_gridlines()
              .tickSize(-(chartHeight-marginTop))
              .tickFormat("")
            );          

  //var color = d3.scaleOrdinal(d3.schemeCategory10);   // choose color scheme

  var colors = ['#2e8b57', '#ff0000'];  

  var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltipAlt')
    .style('opacity', 0);  

  var lineGenerator = d3.line()
            .curve(d3.curveMonotoneX)  
            .x(function(d) {
              return xScale(d.Year);
            })
            .y(function(d) {
              return yScale(d.Rate);
            });

  var lineGroup = chartGroup.append('g');
  //chartGroup.append('g')
  var lines = lineGroup.selectAll('path')
            .data(states, function(d) {return d.key;})
            .enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', function(d) {
              if (d.key == 'Ohio') {return colors[1];}
              return colors[0];
            })
            .attr('stroke-width', function(d) {
              if (d.key == 'Ohio') {return 5;}
              return 3;
            })
            .attr('z-index', function(d) {
              if (d.key == 'Ohio') {return 2;}
              return 1;
            })
            .attr('id', function(d) {return d.key + 'line';})
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', function(d) {return lineGenerator(d.values); })
            .on('mouseover', function(d, i) {
              tooltip.transition()
                    .duration(200)
                    .style('opacity', 1.0);                
              tooltip.html(d.key)
                    .style('left', (d3.event.pageX - 70) + 'px')
                    .style('top', (d3.event.pageY - 35) + 'px')
                    .style('background-color', 'lightgray')
                    .style('width', '140px')
              d3.select(this).attr('stroke', '#778899');                 
            })
            .on('mouseout', function(d, i) {
              tooltip.transition()
                    .duration(700)
                    .style('opacity', 0)
              d3.select(this).attr('stroke', function(d) {
              if (d.key == 'Ohio') {return colors[1];}
              return colors[0];
              });                       
            });            

  lines.each(function(d) {d.totalLength = this.getTotalLength();})
  .attr("stroke-dasharray", function(d) {return d.totalLength + " " + d.totalLength})
  .attr("stroke-dashoffset", function(d) {return d.totalLength;})
  .transition()
  .delay(function(d) {
    if (d.key == 'Ohio') {
      return 2600;
    }
    return 400;
  })
  .duration(2000)
  .ease(d3.easeLinear)
  .attr("stroke-dashoffset", 0); 

  // legend
  var barHeight = 5;
  var padding = 35;
  var names = ['States', 'Ohio']
  legendGroup = chartGroup.append('g');
  legendGroup.selectAll('text')
            .data(names)
            .enter()
            .append('text')
            .style('text-anchor', 'end')        
            .attr('x', chartWidth-350)
            .attr('y', function(d, i) {
              return (chartHeight/2 - 330) + (i+1)*(barHeight + padding);
            })
            .style('font-size', 20)
            .text(function(d) {
              return d;
            });
  legendGroup.selectAll('rect')
    .data(names)
    .enter().append('rect')
    .attr('x', chartWidth-330)
    .attr('y', function(d, i) {
      return (chartHeight/2 - 340) + (i+1)*(barHeight + padding+2);
    })
    .attr('width', function(d, i) {
      return 50;
    })
    .attr('height', barHeight)
    .style('fill', function(d, i) {
      return colors[i];
    });

}




function partialDrawLineChartOhio(error, dataUS, dataOhio) {
  console.log('drawLine chart');

  // convert strings to numbers
  dataUS.forEach(function(d) {
    d.Rate = +d.Rate;
    d.Year = +d.Year;
  });
  dataOhio.forEach(function(d) {
    d.Rate = +d.Rate;
    d.Year = +d.Year;
  });      

  var chartGroup = d3.select('#chartG');

  var canvasWidth = 1200;
  var canvasHeight = 1000;

  var marginLeft = 60;
  var marginRight = 15;
  var marginTop = 100;
  var marginBottom = 20;  

  var chartWidth = canvasWidth - marginLeft - marginRight;
  var chartHeight = canvasHeight - marginTop - marginBottom;

  // get min/max rates from the Ohio and US data sets
  minRate = d3.min(dataOhio, function(d) {return d.Rate});
  maxRate = d3.max(dataOhio, function(d) {return d.Rate});

  var minUS = -1;
  var maxUS = -1;
  minUS = d3.min(dataUS, function(d) {return d.Rate});
  maxUS = d3.max(dataUS, function(d) {return d.Rate});
  if (minUS != -1 && minUS < minRate) {
    minRate = minUS;
  }
  if (maxUS != -1 && maxUS > maxRate) {
    maxRate = maxUS;
  }
  console.log('Chart min max rates: ' + minRate + ' ' + maxRate);  

  var states = d3.nest()
                .key(function(d) {return d.County;})
                .sortKeys(function(a, b) {
                //  console.log(a);
                  return (a == 'Franklin' || a == 'Delaware' || a == 'Fairfield' || a == 'Pickaway') ? 1 : -1;    // sort Ohio to end of list for drawing on top
                })
                .entries(dataOhio);

  console.log(states);
  console.log('states length: ' + states.length);

  // normalize ranges
  var xScale = d3.scaleLinear().domain([1999, 2016]).range([marginLeft, chartWidth + marginLeft]);
  var yScale = d3.scaleLinear().domain([0, Math.round(maxRate)+20]).range([chartHeight + marginBottom, marginTop]);
        

  //var color = d3.scaleOrdinal(d3.schemeCategory10);   // choose color scheme

  var colors = ['#87ceeb', '#8b0000'];  

  var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltipAlt')
    .style('opacity', 0);  

  var lineGenerator = d3.line()
            .curve(d3.curveBasis)  
            .x(function(d) {
              return xScale(d.Year);
            })
            .y(function(d) {
              return yScale(d.Rate);
            });

  var lineGroup = chartGroup.append('g');
  //chartGroup.append('g')
  var lines = lineGroup.selectAll('path')
            .data(states, function(d) {return d.key;})
            .enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', function(d) {
              if (d.key == 'Franklin' || d.key == 'Delaware' || d.key == 'Fairfield' || d.key == 'Pickaway') {return colors[1];}
              return colors[0];
            })
            .attr('stroke-width', function(d) {
              if (d.key == 'Franklin' || d.key == 'Delaware' || d.key == 'Fairfield' || d.key == 'Pickaway') {return 5;}
              return 3;
            })
            .attr('z-index', function(d) {
              if (d.key == 'Franklin' || d.key == 'Delaware' || d.key == 'Fairfield' || d.key == 'Pickaway') {return 2;}
              return 1;
            })
            .attr('id', function(d) {return d.key + 'line';})
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', function(d) {return lineGenerator(d.values); })
            .on('mouseover', function(d, i) {
              tooltip.transition()
                    .duration(200)
                    .style('opacity', 1.0);                
              tooltip.html(d.key)
                    .style('left', (d3.event.pageX - 70) + 'px')
                    .style('top', (d3.event.pageY - 35) + 'px')
                    .style('background-color', 'lightgray')
                    .style('width', '140px')
              d3.select(this).attr('stroke', '#778899');                 
            })
            .on('mouseout', function(d, i) {
              tooltip.transition()
                    .duration(700)
                    .style('opacity', 0)
              d3.select(this).attr('stroke', function(d) {
              if (d.key == 'Franklin' || d.key == 'Delaware' || d.key == 'Fairfield' || d.key == 'Pickaway') {return colors[1];}
              return colors[0];
              });                       
            });     

  lines.each(function(d) {d.totalLength = this.getTotalLength();})
  .attr("stroke-dasharray", function(d) {return d.totalLength + " " + d.totalLength})
  .attr("stroke-dashoffset", function(d) {return d.totalLength;})
  .transition()
  .delay(function(d) {
    if (d.key == 'Franklin' || d.key == 'Delaware' || d.key == 'Fairfield' || d.key == 'Pickaway') {
      return 6600;
    }
    return 4600;
  })
  .duration(2000)
  .ease(d3.easeLinear)
  .attr("stroke-dashoffset", 0);                     

  // legend
  var barHeight = 5;
  var padding = 35;
  var names = ['Ohio Counties', 'Columbus Counties']
  legendGroup = chartGroup.append('g');
  legendGroup.selectAll('text')
            .data(names)
            .enter()
            .append('text')
            .style('text-anchor', 'end')        
            .attr('x', chartWidth-50)
            .attr('y', function(d, i) {
              return (chartHeight/2 - 330) + (i+1)*(barHeight + padding);
            })
            .style('font-size', 20)
            .text(function(d) {
              return d;
            });
  legendGroup.selectAll('rect')
    .data(names)
    .enter().append('rect')
    .attr('x', chartWidth-30)
    .attr('y', function(d, i) {
      return (chartHeight/2 - 340) + (i+1)*(barHeight + padding+2);
    })
    .attr('width', function(d, i) {
      return 50;
    })
    .attr('height', barHeight)
    .style('fill', function(d, i) {
      return colors[i];
    });

}




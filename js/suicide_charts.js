

function drawDonut(error, dType, dAge, dGender, dRace, dMonth, dDay) {

  // convert strings to numbers
  dType.forEach(function(d) {
    d.Deaths = +d.Deaths;
    d.Percent = +d.Percent
  });
  dAge.forEach(function(d) {
    d.Deaths = +d.Deaths;
    d.Percent = +d.Percent    
  });  
  dGender.forEach(function(d) {
    d.Deaths = +d.Deaths;
    d.Percent = +d.Percent    
  });  
  dRace.forEach(function(d) {
    d.Deaths = +d.Deaths;
    d.Rate = +d.Rate;
    d.Percent = +d.Percent    
  });  
  dMonth.forEach(function(d) {
    d.Deaths = +d.Deaths;
    d.Percent = +d.Percent    
  });  
  dDay.forEach(function(d) {
    d.Deaths = +d.Deaths;
    d.Percent = +d.Percent    
  });            

  var data = dType;
  switch (donutType) {    // donutType is global variable from suicide.js
    case 'Method':
      data = dType;
      break;
    case 'Age':
      data = dAge;
      break;
    case 'Gender':
      data = dGender;
      break;
    case 'Race':
      data = dRace;
      break;
    case 'Month':
      data = dMonth;
      break;
    case 'Day':
      data = dDay;
      break;
    default:
      data = dType;
      donutType = 'Method'
  }


  var chartGroup = d3.select('#chartG');

  chartGroup.append('g')
            .attr('transform', 'translate(0, 50)')
            .attr('id', '#chartTitle')
            .append('text')
            .text(function (d) {
                return ('Columbus Total Suicides by ' + donutType + ' 1999 - 2016');
            })
            .attr('class', 'title')
            .style('text-anchor', 'start');

  var canvasWidth = 1200;
  var canvasHeight = 1000;

  var marginLeft = 60;
  var marginRight = 20;
  var marginTop = 100;
  var marginBottom = 20;  

  var chartWidth = canvasWidth - marginLeft - marginRight;
  var chartHeight = canvasHeight - marginTop - marginBottom;

  var colors = d3.scaleOrdinal(d3.schemePaired);  

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
  });  

  var pieMaker = d3.pie().value(function(d, i) { return d.Deaths; });
  var pieData = pieMaker(data);

  var pieGroup = chartGroup.append('g')
        .attr('transform', 'translate(' + canvasWidth/2 + ',' + canvasHeight/2 +')');



  var arcGenerator = d3.arc()
      .innerRadius(200)
      .outerRadius(400);

  var arcLabel = d3.arc()
      .innerRadius(220)
      .outerRadius(400);

  var tooltip = d3.select('body').append('div').attr('class', 'tooltipTree');      

  var path = pieGroup.selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      //.each(function(d) {this._current = Object.assign({}, d, { startAngle: d.endAngle}); })
      .attr('d', arcGenerator)
      .style('fill', function(d, i) {
        return colors(i);
      })
      .on('mousemove', function(d) {
          tooltip.style("left", d3.event.pageX + 10 + "px");
          tooltip.style("top", d3.event.pageY - 20 + "px");
          tooltip.style("display", "inline-block");        
          tooltip.html(d.data.Cause + ' | ' + d.data.Percent.toFixed(1) + '%');
      }).on('mouseout', function(d) {
        tooltip.style('display', 'none');
      });  // save initial angles
      
    // create pie slice labels
    pieGroup.selectAll('text')
      .data(pieData)
      .enter()
      .append('text')
      .each(function(d) {
        var cen = arcGenerator.centroid(d);
        d3.select(this)
          .attr("transform", function(d) {
            var midAngle = d.startAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI;               // line used from web tutorial 
            return "translate(" + arcLabel.centroid(d)[0] + "," +arcLabel.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")";  // line used from web tutorial            
          })
          .attr('dy', '.35em')
          .attr('text-anchor', 'middle')
          .text(function(d, i) { 
                return d.data.Cause + ': \xa0\xa0\xa0' + d.data.Deaths.toLocaleString('en');
              })
          .style("font-size", function(d) {
            if (d.data.Percent > 20) {
              return 24;
            } else if (d.data.Percent > 10) {
              return 22;
            } else if (d.data.Percent > 1.7) {
              return 18;
            } 
              else if (d.data.Percent > 0.9) {
              return 14;
            } else {
              return 12;
            }            
          });
      });


  pieGroup.append('text')
      .text(function (d) {
        if (donutType == 'Race') {
          return ('(Suicide Rate per 100,000)');
        } else {
          return ('(Number of Suicides)');                
        }
      })
      .style('font-size', '24px')
      .attr('transform', 'translate(0,30)');
      //.attr('class', 'titlechart');       

  pieGroup.append('text')
      .text(function (d) {
        return (d3.sum(data, function(d){return d.Deaths;}).toLocaleString('en') + ' Total Deaths');
      })
      .style('font-size', '24px')
      .attr('transform', 'translate(0,-30)');      

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
/*    data = dAge;    
    console.log('data: ' + data);
    console.log('value: ' + this.value);
    var value = this.value;
    pieMaker.value(function(d) {return d[value]; });
    path = path.data(pieData);
    console.log('path: ' + path);
    path.transition().duration(750).attrTween('d', arcTween); */

  }

  function changeGender() {

  }

  function changeRace() {

  }

  function changeMonth() {

  }

  function changeDay() {

  }      

  function arcTween(a) {
    console.log('test arcTween');
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arcGenerator(i(t));
    };
  }

}




function drawDonutR(error, dAge, dGender, dRace) {

  // convert strings to numbers
  dAge.forEach(function(d) {
    d.Rate = +d.Rate;
    d.Total_Rate = +d.Total_Rate;
    d.Deaths = +d.Deaths;
    d.Percent = +d.Percent    
  });  
  dGender.forEach(function(d) {
    d.Rate = +d.Rate;    
    d.Total_Rate = +d.Total_Rate;    
    d.Deaths = +d.Deaths;
    d.Percent = +d.Percent    
  });  
  dRace.forEach(function(d) {
    d.Deaths = +d.Deaths;
    d.Rate = +d.Rate;
    d.Total_Rate = +d.Total_Rate;    
    d.Percent = +d.Percent    
  });           

  var data = dAge;
  switch (donutType) {    // donutType is global variable from suicide.js
    case 'Age':
      data = dAge;
      break;
    case 'Gender':
      data = dGender;
      break;
    case 'Race':
      data = dRace;
      break;
    default:
      data = dAge;
      donutType = 'Method'
  }


  var chartGroup = d3.select('#chartG');

  chartGroup.append('g')
            .attr('transform', 'translate(0, 50)')
            .attr('id', '#chartTitle')
            .append('text')
            .text(function (d) {
              return ('Columbus Total Suicide Rates per 100,000 Population by ' + donutType + ' 1999 - 2016');
            })
            .attr('class', 'title')
            .style('text-anchor', 'start');

  var canvasWidth = 1200;
  var canvasHeight = 1000;

  var marginLeft = 60;
  var marginRight = 20;
  var marginTop = 100;
  var marginBottom = 20;  

  var chartWidth = canvasWidth - marginLeft - marginRight;
  var chartHeight = canvasHeight - marginTop - marginBottom;

  var colors = d3.scaleOrdinal(d3.schemePaired);  

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
  });  

  var pieMaker = d3.pie().value(function(d, i) { return d.Rate; });
  var pieData = pieMaker(data);

  var pieGroup = chartGroup.append('g')
        .attr('transform', 'translate(' + canvasWidth/2 + ',' + canvasHeight/2 +')');



  var arcGenerator = d3.arc()
      .innerRadius(200)
      .outerRadius(400);

  var arcLabel = d3.arc()
      .innerRadius(220)
      .outerRadius(400);

  var tooltip = d3.select('body').append('div').attr('class', 'tooltipTree');      

  var path = pieGroup.selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      //.each(function(d) {this._current = Object.assign({}, d, { startAngle: d.endAngle}); })
      .attr('d', arcGenerator)
      .style('fill', function(d, i) {
        return colors(i);
      })
      .on('mousemove', function(d) {
          tooltip.style("left", d3.event.pageX + 10 + "px");
          tooltip.style("top", d3.event.pageY - 20 + "px");
          tooltip.style("display", "inline-block");        
          tooltip.html(d.data.Cause + ' | ' + d.data.Rate.toFixed(1));
      }).on('mouseout', function(d) {
        tooltip.style('display', 'none');
      });  // save initial angles
      
    // create pie slice labels
    pieGroup.selectAll('text')
      .data(pieData)
      .enter()
      .append('text')
      .each(function(d) {
        var cen = arcGenerator.centroid(d);
        d3.select(this)
          .attr("transform", function(d) {
            var midAngle = d.startAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI;               // line used from web tutorial 
            return "translate(" + arcLabel.centroid(d)[0] + "," +arcLabel.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")";  // line used from web tutorial            
          })
          .attr('dy', '.35em')
          .attr('text-anchor', 'middle')
          .text(function(d, i) { 
                return d.data.Cause + ' :\xa0\xa0\xa0' + d.data.Rate;
              })
          .style("font-size", function(d) {
            if (d.data.Percent > 20) {
              return 24;
            } else if (d.data.Percent > 10) {
              return 22;
            } else if (d.data.Percent > 1.7) {
              return 18;
            } 
              else if (d.data.Percent > 0.9) {
              return 14;
            } else {
              return 12;
            }            
          });
      });


  pieGroup.append('text')
      .text(function (d) {
        return ('(Suicide Rate per 100,000)');
      })
      .style('font-size', '24px')
      .attr('transform', 'translate(0,30)');
      //.attr('class', 'titlechart');       

console.log(data);
  var total = data[0].Total_Rate;
  console.log('total' + total);

  pieGroup.append('text')
      .text(function () {
          return (data[0].Total_Rate + ' Average Rate');
      })
      .style('font-size', '24px')
      .attr('transform', 'translate(0,-30)');      

  d3.select('#sAge')
    .on('mouseover', changeAge);
  d3.select('#sGender')
    .on('mouseover', changeGender);
  d3.select('#sRace')
    .on('mouseover', changeGender);



  function changeAge() {
/*    data = dAge;    
    console.log('data: ' + data);
    console.log('value: ' + this.value);
    var value = this.value;
    pieMaker.value(function(d) {return d[value]; });
    path = path.data(pieData);
    console.log('path: ' + path);
    path.transition().duration(750).attrTween('d', arcTween); */

  }

  function changeGender() {

  }

  function changeRace() {

  }
  

  function arcTween(a) {
    console.log('test arcTween');
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arcGenerator(i(t));
    };
  }




}





function drawLineChartUS(error, dataUS, dataOhio) {

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
            .attr('transform', 'translate(0, 50)')
            .attr('id', '#chartTitle')
            .append('text')
            .text('U.S. Suicide Rates per 100,000 Population (1999 - 2016)')
            .attr('class', 'title')
            .style('text-anchor', 'start');

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

  var states = d3.nest()
                .key(function(d) {return d.State;})
                .sortKeys(function(a, b) {
                  return a == 'Ohio' ? 1 : -1;    // sort Ohio to end of list for drawing on top
                })
                .entries(dataUS);

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
              var xCoord = d3.mouse(this)[0];
              var xDomInv = parseInt(xScale.invert(xCoord));          
              var ind = 0;
              for (i = 0; i < d.values.length; i++) {
                if (d.values[i].Year == xDomInv) {
                  ind = i;
                  break;
                }
              }
              tooltip.transition()
                    .duration(200)
                    .style('opacity', 1.0);                
              tooltip.html(d.key + ' | ' + xDomInv + ' Rate: ' + d.values[ind].Rate)
                    .style('left', (d3.event.pageX - 180) + 'px')
                    .style('top', (d3.event.pageY - 45) + 'px')                 
                    .style('background-color', 'lightgray')
                    .style('width', function() {
                      var str = d.key + ' | 1999 Rate: ' + d.values[0].Rate;
                      return str.length*8 + 'px';
                    });
              d3.select(this).attr('stroke', '#00ff00');                 
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
            .attr('transform', 'translate(0, 50)')
            .attr('id', '#chartTitle')
            .append('text')
            .text('Ohio Counties Suicide Rates per 100,000 Population (incomplete) (1999 - 2016)')
            .attr('class', 'title')
            .style('text-anchor', 'start');            

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
              var xCoord = d3.mouse(this)[0];
              var xDomInv = parseInt(xScale.invert(xCoord));          
              var ind = 0;
              for (i = 0; i < d.values.length; i++) {
                if (d.values[i].Year == xDomInv) {
                  ind = i;
                  break;
                }
              }
              tooltip.transition()
                    .duration(200)
                    .style('opacity', 1.0);                
              tooltip.html(d.key + ' | ' + xDomInv + ' Rate: ' + d.values[ind].Rate)
                    .style('left', (d3.event.pageX - 180) + 'px')
                    .style('top', (d3.event.pageY - 45) + 'px')                 
                    .style('background-color', 'lightgray')
                    .style('width', function() {
                      var str = d.key + ' | 1999 Rate: ' + d.values[0].Rate;
                      return str.length*8 + 'px';
                    });
              d3.select(this).attr('stroke', '#00ff00');                 
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
            .attr('transform', 'translate(0, 50)')
            .attr('id', '#chartTitle')
            .append('text')
            .text('U.S. and Ohio Suicide Rates per 100,000 Population (incomplete) (1999 - 2016)')
            .attr('class', 'title')
            .style('text-anchor', 'start');

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
              var xCoord = d3.mouse(this)[0];
              var xDomInv = parseInt(xScale.invert(xCoord));          
              var ind = 0;
              for (i = 0; i < d.values.length; i++) {
                if (d.values[i].Year == xDomInv) {
                  ind = i;
                  break;
                }
              }
              tooltip.transition()
                    .duration(200)
                    .style('opacity', 1.0);                
              tooltip.html(d.key + ' | ' + xDomInv + ' Rate: ' + d.values[ind].Rate)
                    .style('left', (d3.event.pageX - 180) + 'px')
                    .style('top', (d3.event.pageY - 45) + 'px')                 
                    .style('background-color', 'lightgray')
                    .style('width', function() {
                      var str = d.key + ' | 1999 Rate: ' + d.values[0].Rate;
                      return str.length*8 + 'px';
                    });
              d3.select(this).attr('stroke', '#00ff00');                 
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
              var xCoord = d3.mouse(this)[0];
              var xDomInv = parseInt(xScale.invert(xCoord));          
              var ind = 0;
              for (i = 0; i < d.values.length; i++) {
                if (d.values[i].Year == xDomInv) {
                  ind = i;
                  break;
                }
              }
              tooltip.transition()
                    .duration(200)
                    .style('opacity', 1.0);                
              tooltip.html(d.key + ' | ' + xDomInv + ' Rate: ' + d.values[ind].Rate)
                    .style('left', (d3.event.pageX - 180) + 'px')
                    .style('top', (d3.event.pageY - 45) + 'px')                 
                    .style('background-color', 'lightgray')
                    .style('width', function() {
                      var str = d.key + ' | 1999 Rate: ' + d.values[0].Rate;
                      return str.length*8 + 'px';
                    });
              d3.select(this).attr('stroke', '#00ff00');                 
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




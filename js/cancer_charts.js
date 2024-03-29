
// using Mike Bostick's Treemap example
function drawBubble() {

  document.getElementById('analysisText').innerHTML = 'Hover over each bubble for more information about the type of cancer, the larger category it belongs to,' +
          ' the number of deaths the cancer caused, and the percentage of total cancer deaths.  The size of the bubble represents'
          + ' the number of deaths, so a larger bubble means higher number of deaths.';  

  var canvasWidth = 1200;
  var canvasHeight = 1000;

  var marginLeft = 20;
  var marginRight = 20;
  var marginTop = 100;
  var marginBottom = 20;

  var chartWidth = canvasWidth - marginLeft - marginRight;
  var chartHeight = canvasHeight - marginTop - marginBottom;

  var format = d3.format(',d');

  var pack = d3.pack()                // set size of chart
      //.size([chartWidth, chartHeight])
      .size([1200,1000])
      .padding(1);

  var totalDeaths = 0;

  var tooltip = d3.select('body').append('div').attr('class', 'tooltipTree'); 

  d3.csv("data/cancer_data/cancer_types_columbus_bubble.csv", function(d) {
    d.value = +d.value;
    if (d.value) {
      totalDeaths += d.value;
      return d;
    }
  }, function(error, classes) {
    if (error) throw error;

    var root = d3.hierarchy({children: classes})
        .sum(function(d) { return d.value; })
        .each(function(d) {
          if (id = d.data.id) {
            var id, i = id.lastIndexOf(".");
            d.id = id;
            d.package = id.slice(0, i);
            d.class = id.slice(i + 1);
          }
        });

    var chartGroup = d3.select('#chartG');

    chartGroup.append('g')
              .attr('transform', 'translate(0, 50)')
              .attr('id', '#chartTitle')
              .append('text')
              .text('Columbus Cancer Deaths by Type (1999 - 2015)')
              .attr('class', 'title')
              .style('text-anchor', 'start');              

    var color = d3.scaleOrdinal(d3.schemeCategory20c);     



    var node = chartGroup.append('g')
      .attr('transform', 'translate(0, 0)')
      .selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.package); })
        .on('mousemove', function(d) {
            d3.select(this)
              .transition()
              .attr('r', 1.1*d.r)
              .duration(300);
            tooltip.style("left", d3.event.pageX + 10 + "px");
            tooltip.style("top", d3.event.pageY - 20 + "px");
            tooltip.style("display", "inline-block");        
            tooltip.html(d.children ? null : 'Category: ' + d.package.slice(7, d.package.length+1) 
                                            + ' | Type: ' + d.class + ' | ' + d.data.value.toLocaleString('en')
                                            + ' deaths' + ' | ' + (d.data.value*100/totalDeaths).toLocaleString('en') + '% of ' 
                                            + totalDeaths.toLocaleString('en') + ' total deaths');
        }).on('mouseout', function(d) {
            d3.select(this)
              .transition()
              .ease(d3.easeBounce)
              .attr('r', d.r)
              .duration(300);            
          tooltip.style('display', 'none');
        });        

    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
        .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });
    var fontSize = 14;
    node.append("text")
        .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
        .selectAll("tspan")
        .data(function(d) { 
          var maxLen = parseInt(d.r/6.5);
          var label = d.class.slice(0, maxLen);
          if (d.r > 100) {
            fontSize = 24;
          } else if (d.r > 80) {
            fontSize = 22;
          } else if (d.r > 50){
            fontSize = 20;
          } else if (d.r > 20) {
            fontSize = 18;
          } else {
            fontSize = 16;
          }
          var labelJoin = [];
          var labelArr = label.split(" ");
          labelArr.forEach(function(d) {
            labelJoin.push({'wordV': d, 'sizeF': fontSize});
          })
          return labelJoin;
        })
        .enter().append("tspan")
        .style('font-size', function(d) {
          return d.sizeF + 'px';
          //return fontSize + 'px';

        })
        .style('font-weight', 'bold')
        .attr("x", 0)
        .attr("y", function(d, i, nodes) { return 20 + (i - nodes.length / 2 - 0.5) * (d.sizeF-2); })
        .text(function(d) { return d.wordV; });

    //node.append("title")
    //    .text(function(d) { return d.id + "\n" + format(d.value); });
  });

}





// using Mike Bostick's Treemap example
function drawTreemap(error, data) {

  document.getElementById('analysisText').innerHTML = 'Hover over each box for more information about the type of cancer, the larger category it belongs to,' +
          ' the number of deaths the cancer caused, and the percentage of total cancer deaths.  The size of the box represents'
          + ' the number of deaths, so a larger box represents higher number of deaths.';    

  groups = ['Category'];
  var totalDeaths = 0;
  // convert string data to numbers
  data.forEach(function(d) {
    d.Deaths = +d.Deaths;
    totalDeaths += d.Deaths;
  });

  // parse csv data to hierarchical json format
  var genGroups = function(data) {
    return _.map(data, function(element, index) {
      return { name : index, children : element };
    });
  };

  var nest = function(node, curIndex) {
    if (curIndex === 0) {
      node.children = genGroups(_.groupBy(data, groups[0]));
      _.each(node.children, function (child) {
        nest(child, curIndex + 1);
      });
    }
    else {
      if (curIndex < groups.length) {
        node.children = genGroups(
          _.groupBy(node.children, groups[curIndex])
        );
        _.each(node.children, function (child) {
          nest(child, curIndex + 1);
        });
      }
    }
    return node;
  };

  jsonData = nest({}, 0);


  jsonData.name = 'Cancer';

  var canvasWidth = 1200;
  var canvasHeight = 1000;

  var marginLeft = 60;
  var marginRight = 20;
  var marginTop = 100;
  var marginBottom = 20;  

  var chartWidth = canvasWidth - marginLeft - marginRight;
  var chartHeight = canvasHeight - marginTop - marginBottom;


  var chartGroup = d3.select('#chartG');

  chartGroup.append('g')
            .attr('transform', 'translate(0, 50)')
            .attr('id', '#chartTitle')
            .append('text')
            .text('Columbus Cancer Deaths by Type (1999 - 2015)')
            .attr('class', 'title')
            .style('text-anchor', 'start');

  var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); },
      color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
      format = d3.format(",d");

  var treemapGroup = chartGroup.append('g')
       .attr('transform', 'translate(0,' + marginTop + ')')     

  var treemap = d3.treemap()
      .tile(d3.treemapResquarify)
      .size([chartWidth, chartHeight])
      .round(true)
      .paddingInner(1);

  data = jsonData;

  var root = d3.hierarchy(data)
      .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
      .sum(sumBySize)
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

  var tooltip = d3.select('body').append('div').attr('class', 'tooltipTree');

  treemap(root);

  var cell = treemapGroup.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
    .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

  cell.append("rect")
      .attr("id", function(d) { return d.data.id; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("fill", function(d) { return color(d.parent.data.id); })
      .on('mousemove', function(d) {
          d3.select(this)
            .transition()
            .style('opacity', 0.8)
            .duration(10);        
          tooltip.style("left", d3.event.pageX + 10 + "px");
          tooltip.style("top", d3.event.pageY - 20 + "px");
          tooltip.style("display", "inline-block");        
          tooltip.html(d.children ? null : 'Category: ' + d.parent.data.name + ' | Type: ' + d.data.name + ' | ' + d.data.Deaths.toLocaleString('en')
                                            + ' deaths' + ' | ' + (d.data.Deaths*100/totalDeaths).toLocaleString('en') + '% of ' 
                                            + totalDeaths.toLocaleString('en') + ' total deaths');
      }).on('mouseout', function(d) {
        d3.select(this)
          .transition()
          .style('opacity', 1)
          .duration(400);         
        tooltip.style('display', 'none');
      });

  cell.append("clipPath")
      .attr("id", function(d) { return "clip-" + d.data.id; })
      .append("use")
      .attr("xlink:href", function(d) { return "#" + d.data.id; });

  cell.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
      .selectAll("tspan")
      .data(function(d) { 
        var fontSize = 14;
        var maxLen = parseInt((d.x1-d.x0)/10);
        var maxWord = parseInt ((d.y1-d.y0)/14);
        var label = d.data.name.slice(0, maxLen);
        if (maxLen == 0 || maxWord == 0) {
          return ([{'wordV':"", 'sizeF':fontSize}]);
        }
        if (maxLen > 30) {
          fontSize = 24;
        } else if (maxLen > 10) {
          fontSize = 18;
        }
        var labelJoin = [];
        var labelArr = label.split(" ");
        labelArr.forEach(function(d) {
          if (maxWord > 0) {
            labelJoin.push({'wordV': d, 'sizeF': fontSize});
            maxWord--;
          }
        })
        //return label.split(" ");
        return labelJoin;  
      })
      .enter().append("tspan")
      .attr('x', 0)
      .style('font-weight', 'bold')
      .style('text-anchor', 'start')
      .style('font-size', function(d) {
        return d.sizeF + 'px';
      })         
      .attr("x", 4)
      .attr("y", function(d, i) { return (4+d.sizeF) + i*d.sizeF; })
      .text(function(d) { return d.wordV; });

  

  function sumBySize(d) {
    return d.Deaths;
  }


}






function drawSunburst(error, data) {


}




function drawLineChartUS(error, dataUS, dataOhio) {


  document.getElementById('analysisText').innerHTML = 'This parallel coordinates line chart shows the yearly cancer mortality rate of Ohio, in red, versus the other 49 states, in green.' +
          ' Hover over any line to see the state and mortality rate at any point in time.  This chart can be useful for identifying changes in cancer mortality rates since 1999.';



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
            .text('U.S. Cancer Mortality Rates per 100,000 Population (1999 - 2016)')
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
  var yScale = d3.scaleLinear().domain([80, Math.round(maxRate)]).range([chartHeight + marginBottom, marginTop]);

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

  document.getElementById('analysisText').innerHTML = 'This parallel coordinates line chart shows the yearly cancer mortality rate of the four Columbus counties, Delaware, Fairfield' +
          ' Franklin, and Pickaway, in red, versus the other 84 Ohio counties, in green.' +
          ' Hover over any line to see the state and mortality rate at any point in time.  This chart can be useful for identifying changes in cancer mortality rates since 1999.';
   


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
            .text('Ohio Counties Cancer Mortality Rates per 100,000 Population (1999 - 2016)')
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
                .key(function(d) {return d.County;})
                .sortKeys(function(a, b) {
                  return (a == 'Franklin' || a == 'Delaware' || a == 'Fairfield' || a == 'Pickaway') ? 1 : -1;    // sort Ohio to end of list for drawing on top
                })
                .entries(dataOhio);


  // normalize ranges
  var xScale = d3.scaleLinear().domain([1999, 2016]).range([marginLeft, chartWidth + marginLeft]);
  var yScale = d3.scaleLinear().domain([80, Math.round(maxRate)]).range([chartHeight + marginBottom, marginTop]);

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

  document.getElementById('analysisText').innerHTML = 'This combined parallel coordinates line chart overlays both state and national cancer charts to compare cancer rates ' +
          ' of Columbus and Ohio counties to other states.  Columbus counties are shown in dark red, Ohio in light red, states in green, and Ohio counties in light blue. '
          + ' Hover over any line to see the state or county and mortality rate at any point in time.  This chart can be useful for identifying changes in cancer mortality rates since 1999.';  

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
            .text('U.S. and Ohio Cancer Mortality Rates per 100,000 Population (1999 - 2016)')
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
  var yScale = d3.scaleLinear().domain([80, Math.round(maxRate)]).range([chartHeight + marginBottom, marginTop]);

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

  var states = d3.nest()
                .key(function(d) {return d.County;})
                .sortKeys(function(a, b) {
                  return (a == 'Franklin' || a == 'Delaware' || a == 'Fairfield' || a == 'Pickaway') ? 1 : -1;    // sort Ohio to end of list for drawing on top
                })
                .entries(dataOhio);

  // normalize ranges
  var xScale = d3.scaleLinear().domain([1999, 2016]).range([marginLeft, chartWidth + marginLeft]);
  var yScale = d3.scaleLinear().domain([80, Math.round(maxRate)]).range([chartHeight + marginBottom, marginTop]);
        

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

  //var totalLength = lines.node().getTotalLength();
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




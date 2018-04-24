
function drawLineChart2(error, dataUS, dataOhio) {
  console.log('drawLine chart');

  var chartGroup = d3.select('#chartG');

  chartGroup.append('g')
            .attr('transform', 'translate(600, 50)')
            .attr('id', '#chartTitle')
            .append('text')
            .text('U.S. and Ohio Heart Disease Mortality Rates per 100,000 Population')
            .attr('class', 'title');

  var chartWidth = 1200;
  var chartHeight = 1000;
  var marginLeft = 35;
  var marginRight = 15;
  var marginTop = 25;
  var marginBottom = 20;
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
                  console.log(a);
                  return a == 'Ohio' ? 1 : -1;    // sort Ohio to end of list for drawing on top
                })
                .entries(dataUS);

  console.log(states);
  console.log('states length: ' + states.length);



  // x-axis
  var xScale = d3.scaleLinear().domain([1999, 2015]).range([marginLeft, chartWidth - marginRight]);
  var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('d'));
  chartGroup.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + (chartHeight-marginBottom) + ')')
            .call(xAxis);

  // y-axis
  var yScale = d3.scaleLinear().domain([50, Math.round(maxRate)]).range([chartHeight - marginBottom, marginTop]);
  var yAxis = d3.axisLeft().scale(yScale).tickPadding(14);
  chartGroup.append('g')
            .attr('class', 'axis')  
            .attr('transform', 'translate(' + marginLeft + ',0)')
            .call(yAxis);

  var color = d3.scaleOrdinal(d3.schemeCategory10);   // choose color scheme

  var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltipAlt')
    .style('opacity', 0);  

  var lineGenerator = d3.line()
            .x(function(d) {
              return xScale(d.Year);
            })
            .y(function(d) {
              return yScale(d.Rate);
            });

    var lineGroup = chartGroup.append('g');
    //chartGroup.append('g')
    lineGroup.selectAll('path')
              .data(states, function(d) {return d.key;})
              .enter()
              .append('path')
              .attr('fill', 'none')
              .attr('stroke', function(d) {
                if (d.key == 'Ohio') {return 'red';}
                return '#43565a';
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
                d3.select(this).attr('stroke', 'orange');                 
              })
              .on('mouseout', function(d, i) {
                tooltip.transition()
                      .duration(700)
                      .style('opacity', 0)
                d3.select(this).attr('stroke', function(d) {
                if (d.key == 'Ohio') {return 'red';}
                return '#43565a';
                });                       
              });            

}




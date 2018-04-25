
// dataType is already set as a global variable
function drawLEUSMap() {

  // set up the size US map within svg (left half of svg area)
  var width = 1000;
  var height = 800;

  // scale to US map
  var projection = d3.geoAlbersUsa()
      .translate([450, 300])
      .scale([1100]);

  // convert GeoJSON to SVG paths
  var path = d3.geoPath()               
      .projection(projection);

  // create single title for both maps
  var mapsvg = d3.select("#svgmap")
    .attr("class", "maptitle")
    .append("text")               //apend the graph title                     
            .attr("x", 800)
            .attr("y", 40)
            .attr('id', 'mastertitle')
            .text("Life Expectancy in 2014")
            .style('font-size', 22);    

  // select US map group within svg
  var usmapg = d3.select("#usmap")
                  .attr("class", "maptitle")
                  .append("text")               //apend the graph title                     
                  .attr("x", 400)
                  .attr("y", 50)
                  .text("U.S.")
                  .style('font-size', 18);

  // append Div for tooltip
  var div = d3.select("body")
              .append("div")   
              .attr("class", "tooltip")               
              .style("opacity", 0);

  var textg = usmapg.append('g')                    // append text subgroup to usmap group
      .attr('id', 'textg')
      .attr('transform','translate (300, 0)')
      .classed('map-layer', true);      

  var textLayer = usmapg.append('g')
      .attr('transform','translate (300, 0)')
      .classed('map-layer', true);


  var tipg = usmapg.append('g')
      .attr('id', 'tipg')

  // get data from US and Ohio to find global min max rates for color scaling
  queue().defer(d3.csv, "data/le_data/LE_US_States_2014.csv")
        .defer(d3.csv, "data/le_data/LE_OH_Counties_2014.csv")
        .await(drawUS);


  // import data from the obesity file
  function drawUS(error, data, dataOhio) {

    var minRate = d3.min(data, function(d) {return d.LE});    // get min, max values from Rate column for color scaling
    var maxRate = d3.max(data, function(d) {return d.LE});
    console.log('U.S. LE: ' + minRate + ' ' + maxRate);
    // check if Ohio min/max is less/greater and use global
    var minOhio = -1;
    var maxOhio = -1;
    minOhio = d3.min(dataOhio, function(d) {return d.LE});
    maxOhio = d3.max(dataOhio, function(d) {return d.LE});

    console.log('Ohio LE: ' + minOhio + ' ' + maxOhio);   

    if (minOhio != -1 && minOhio < minRate) {
      minRate = minOhio;
    }
    if (maxOhio != -1 && maxOhio > maxRate) {
      maxRate = maxOhio;
    }

      var color = d3.scaleSequential(d3.interpolateYlGnBu)    // set color scheme
                    .domain([minRate, maxRate])  

       d3.json("data/us-states.json",function(json) {        // import GeoJSON data 
        for (var i = 0; i < data.length; i++) {             // iterate each row of data in the csv file
          var state = data[i].State;                        // extract the state
          var le = data[i].LE;                   
          for (var j = 0; j < json.features.length; j++)  {             // Find the corresponding state inside the GeoJSON
            var jsonState = json.features[j].properties.name;
            if (state == jsonState) {
              json.features[j].properties.value = le;
              break;
            }
          }
        }

        var tooltip = d3.select('body').append('div')
                        .attr('class', 'tooltipAlt')
                        .style('opacity', 0);

        var t = d3.transition()
                  .duration(400)
                  .ease(d3.easeLinear);  

        var paths = d3.select('#usmap')         // assign the color for each state
                      .selectAll("path")
                      .data(json.features)
                      .enter()
                      .append("path")
                      .attr("d", path)
                      .style("stroke", function(d, i) {
                        if (d.properties.name == 'Ohio') {
                          return 'black';       // border Ohio in red
                        }
                        return "#606060";
                      })
                      .style("stroke-width", function(d, i) {
                        if (d.properties.name == 'Ohio') {
                          return 3;       // border Ohio in thicker path line
                        }
                        return 1;
                      }) 
                      .style("fill", function(d) {
                        return color(d.properties.value);
                      })
                      .on('mouseover',function(d, i) {            // add mouse over function
                          tooltip.transition()
                                .duration(200)
                                .style('opacity', 0.9);
                          tooltip.html(d.properties.value + '&ensp;' + d.properties.name)
                                .style('left', (d3.event.pageX - 70) + 'px')
                                .style('top', (d3.event.pageY - 35) + 'px')
                                .style('background-color', color(parseInt(d.properties.value)))
                                .style('width', function() {
                                  var pixwidth = 140;
                                  try {
                                    pixwidth = d.properties.name.length * 9 + 50;
                                  } 
                                  catch(e) { }
                                  return pixwidth + 'px'; 
                                });

                      d3.select(this)
                        .transition()
                        .duration(1)
                        .attr("opacity", 0.6)
                    })
                    .on('mouseout', function(d, i) {                // add mouse out function
                        tooltip.transition()
                              .duration(400)
                              .style('opacity', 0);
                        d3.select(this)
                          .transition()
                          .duration(200)
                          .attr("opacity", 1)
                          .style('fill', color(d.properties.value));
                    });

        var texts = d3.select('#usmap')         // add text notation to map
                      .selectAll('text')
                      .data(json.features)
                      .enter()
                      .append('text')
                      .attr('text-anchor', 'middle')
                      .attr('alignment-baseline', 'middle')
                      .attr('id', function(d, i) {
                        return 'statename' + i;
                      })
                      .style('opacity', 0.7)
                      .style('font-size', 8)
                      .attr('display', '')
                      .text(function(d) {
                        if (d.properties.name == 'Puerto Rico') {
                          return '';
                        }
                        return d.properties.name;
                      })
                      .attr('transform', function(d, i) {
                        var center = path.centroid(d);
                        if(isNaN(center[0]) != true) {                      // skip the last (NaN, NaN) in the code
                          return 'translate (' + center + ')';
                        }
                      });
          
        var legend = d3.select('#usmap')                       // add legend for the svg
                      .append("g")
                      .attr("class", "legend")
                      .attr("transform","translate(800,500)") // position for the legend position
                      .selectAll("g")
                      .data([minRate, 76, 78.71, maxRate])
                      .enter()
                      .append("g")
                      .attr("transform", function(d, i) { return "translate(10," + i * 28 + ")"; });

        legend.append("rect")               // append the rectangle box for legend
                .attr("width", 24)
                .attr("height", 24)
                .style("fill", function(d, i) { return d3.interpolateYlGnBu(d) });

        legend.append("text")                 // append the legend text
                  .data([minRate + ' yrs', '76 yrs', '78.71 yrs (Avg)', maxRate+' yrs'])
                  .attr("x", 120)
                  .attr("y", 7)
                  .attr("dy", ".7em")
                  .style('font-size', 16)
                  .text(function(d) { return d; });
      }); // end d3.json data function
    } // end function(data)
  return 1;
} // end drawUSMap ()
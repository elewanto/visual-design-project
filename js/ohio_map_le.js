
function drawLEOhioMap() {

  // set up size for the OH svg map
  var width = 500;
  var height = 600;


  // declare the properties for the div used for the tooltips
  var div = d3.select("body").append("div")   
              .attr("class", "tooltip")             
              .style("opacity", 0); 

  var ohiomapg = d3.select('#ohiomap');

  var mapLayer = ohiomapg.attr('transform','translate (1000, 0)')
                        .classed('map-layer', true);

  // get data from US and Ohio to find global min max rates for color scaling
  queue().defer(d3.csv, "data/le_data/LE_US_States_2014.csv")
        .defer(d3.csv, "data/le_data/LE_OH_Counties_2014.csv")
        .await(drawOhio);

  // import data from file
  function drawOhio(error, dataUS, data) {
    minRate = d3.min(data, function(d) {return d.LE});    // get min, max values from Rate column for color scaling
    maxRate = d3.max(data, function(d) {return d.LE});

    var minUS = -1;
    var maxUS = -1;
    minUS = d3.min(dataUS, function(d) {return d.LE});
    maxUS = d3.max(dataUS, function(d) {return d.LE}); 

    if (minUS != -1 && minUS < minRate) {
      minRate = minUS;
    }
    if (maxUS != -1 && maxUS > maxRate) {
      maxRate = maxUS;
    }

    var color = d3.scaleSequential(d3.interpolateYlGnBu)    // set color scheme
                  .domain([minRate, maxRate])    

    d3.json("data/OH_map.json", function(counties) {
      // iterate each row of data in the csv file
      for (var i = 0; i < data.length; i++) {
          // extract the county name from data
          var county = data[i].County;
          // extract the LE from data
          var le = data[i].LE;
          // Find the corresponding county inside the GeoJSON
          for (var j = 0; j < counties.features.length; j++)  {
            var jsonCounty = counties.features[j].properties.NAME;
            if (county == jsonCounty) {
              // assign the mortality rate to json array
              counties.features[j].properties.value = le;
              break;
            }
          }
        }

    var projection = d3.geoEquirectangular().fitExtent([[0,0], [width, height]], counties);   // map scaling here

    var geoGenerator = d3.geoPath().projection(projection);

    var tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltipAlt')
                    .style('opacity', 0);        

    var columbusCounties = ['Franklin', 'Delaware', 'Pickaway', 'Fairfield', 'Union', 'Hocking', 'Knox', 'Licking', 'Madison'];

    var paths = mapLayer.selectAll('path')
                        .data(counties.features)
                        .enter()
                        .append('path')
                        .style("stroke", function(d, i) {
                          if (columbusCounties.includes(d.properties.NAME)) {
                            return 'black';       // border Columbus counties in red
                          }
                          return "#606060";
                        })
                        .style("stroke-width", function(d, i) {
                          if (columbusCounties.includes(d.properties.NAME)) {
                            return 3;       // border Columbus counties in thicker path line
                          }
                          return 1;
                        })        
                        // fill colors to maps
                        .attr("fill", function(d, i) {
                          // assign color based on the min, max mortality rate
                          return color(parseInt(d.properties.value));
                        })
                        .attr('d', geoGenerator)
                            .on('mouseover', function(d, i) {
                                tooltip.transition()
                                      .duration(200)
                                      .style('opacity', 0.9);
                                tooltip.html(d.properties.value + '&ensp;' + d.properties.NAME)
                                      .style('left', (d3.event.pageX - 70) + 'px')
                                      .style('top', (d3.event.pageY - 40) +'px')
                                      .style('background-color', color(parseInt(d.properties.value)))
                                      .style('width', (d.properties.NAME.length*9 + 50) +'px');  
                                
                                d3.select(this)
                                  .transition()
                                  .duration(1)
                                  .attr("opacity", 0.5)             
                            })
                            .on('mouseout', function(d, i) {
                                tooltip.transition()
                                        .duration(400)
                                        .style('opacity', 0);          
                                mapLayer.selectAll('path')
                                        .transition()
                                        .duration(200)
                                        .attr("opacity", 1);             
                            });

    // add text notation to map
    var texts = mapLayer.selectAll('text')
                        .data(counties.features)
                        .enter()
                        .append('text')
                        .attr('text-anchor', 'middle')
                        .attr('alignment-baseline', 'middle')
                        // assign id to each text
                        .attr('id', function(d, i) {
                          return 'name' + i;
                        })
                        .style('opacity', 0.7)
                        .style('font-size', 8)
                        .attr('display', '')
                        .text(function(d) {
                          return d.properties.NAME;
                        })
                        .attr('transform', function(d, i) {
                          var center = geoGenerator.centroid(d);
                          return 'translate (' + center + ')';
                        });

    //apend the graph title
    var title = mapLayer.append("text")
                        .attr("transform","translate(250,80)")
                        .text("Ohio")
                        .style('font-size', 18);
    });
  }
  return 1;
}


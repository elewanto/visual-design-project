
// dataType is already set as a global variable
function drawHeartDiseaseUSMap(year) {

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
            .text(year +"  Heart Disease Mortality Rates per 100,000 Population ")
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

  // import data from the obesity file
  d3.csv("data/heart_disease_data/heart_disease_mortality_us_1999_2015.csv",  function(d, i) {
      return d;
    },function(data) {

      minRate = d3.min(data, function(d) {return d.Rate});    // get min, max values from Rate column for color scaling
      maxRate = d3.max(data, function(d) {return d.Rate});
      console.log('min rate: ' + minRate);
      console.log('max rate: ' + maxRate);
      var color = d3.scaleSequential(d3.interpolateYlOrBr)    // set color scheme
                    .domain([minRate, maxRate])     
       d3.json("data/us-states.json",function(json) {        // import GeoJSON data 
        for (var i = 0; i < data.length; i++) {             // iterate each row of data in the csv file
          if (data[i].Year == year) {                        // filter only selected year
            var state = data[i].State;                        // extract the state
            var rate = data[i].Rate;                   
            for (var j = 0; j < json.features.length; j++)  {             // Find the corresponding state inside the GeoJSON
              var jsonState = json.features[j].properties.name;
              if (state == jsonState) {
                json.features[j].properties.value = rate;
                break;
              }
            }
          }
        }


        var paths = d3.select('#usmap')         // assign the color for each state
          .selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("stroke", "#606060")
          .style("stroke-width", "1")
          .style("fill", function(d) {
            return color(d.properties.value);
          })
          .on('mouseover',function(d, i) {            // add mouse over function
            d3.select(this)
              .transition()
              .duration(1)
              .attr("opacity", 0.5)

              d3.select('#statename' + i)
                .attr('display', '')
          })
                .on('mouseout', function(d, i) {                // add mouse out function
            d3.select(this)
              .transition()
              .duration(200)
              .attr("opacity", 1)
              .style('fill', color(d.properties.value));
            d3.select('#statename' + i)
              .attr('display', 'none')
          });
        var texts = d3.select('#usmap')         // add text notation to map
          .selectAll('text')
          .data(json.features)
          .enter()
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          // assign id to each text
          .attr('id', function(d, i) {
            return 'statename' + i;
          })
          .attr('opacity', 0.5)
          .attr('font-size', 'x-small')
          // hide the text
          .attr('display', 'none')
          .text(function(d) {
            return d.properties.name;
          })
          .attr('transform', function(d, i) {
            var center = path.centroid(d);
            if(isNaN(center[0]) != true) {                      // skip the last (NaN, NaN) in the code
              return 'translate (' + center + ')';
            }
          });
        var legend = d3.select('#usmap')                // add legend for the svg
              .append("g")
              .attr("class", "legend")
              .attr("transform","translate(800,500)")                // position for the legend position
              .selectAll("g")
              .data([0.1, 0.4, 0.7, 1.0])
              .enter()
              .append("g")
              .attr("transform", function(d, i) { return "translate(10," + i * 28 + ")"; });
            legend.append("rect")               // append the rectangle box for legend
                .attr("width", 24)
                .attr("height", 24)
                .style("fill", function(d, i) {
                  console.log('d: ' + d3.interpolateYlOrBr(d));
                  return(d3.interpolateYlOrBr(d)) });
            legend.append("text")                 // append the legend text
                  .data([Math.round(0.1*maxRate) + ' deaths per 100,000', Math.round(0.4*maxRate) + ' deaths per 100,000',
                         Math.round(0.7*maxRate) + ' deaths per 100,000', Math.round(1.0*maxRate) + ' deaths per 100,000'])
                  .attr("x", 120)
                  .attr("y", 7)
                  .attr("dy", ".7em")
                  .style('font-size', 16)
                  .text(function(d) { return d; });
      }); // end d3.json data function
    }); // end function(data)

  function mouseover(d){
      // Highlight hovered province
      d3.select(this)
       .transition()
       .duration(1)
       .attr("opacity", 0.5);

     // display the statename on map
     d3.select('#statename' + i)
       .attr('display', '')
  }

  function mouseout(d, i){
      // Reset province color
      d3.selectAll('path')
        .attr("opacity", 1);
  }

} // end drawUSMap ()









function drawHeartDiseaseUSMapMultiple(year) {

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

  parent = document.getElementById('svgmap');     // clear old title and rewrite new year
  child = document.getElementById('mastertitle');
  parent.removeChild(child);

  // create single title for both maps
  var mapsvg = d3.select("#svgmap")
    .attr("class", "maptitle")
    .append("text")               //apend the graph title                     
            .attr("x", 800)
            .attr("y", 40)
            .attr('id', 'mastertitle')            
            .text(year +"  Heart Disease Mortality Rates per 100,000 Population ")  
            .style('font-size', 22);    

  // import data from the obesity file
  d3.csv("data/heart_disease_data/heart_disease_mortality_us_1999_2015.csv",  function(d, i) {
      return d;
    },function(data) {

      minRate = d3.min(data, function(d) {return d.Rate});    // get min, max values from Rate column for color scaling
      maxRate = d3.max(data, function(d) {return d.Rate});
      var color = d3.scaleSequential(d3.interpolateYlOrBr)    // set color scheme
                    .domain([minRate, maxRate])     
       d3.json("data/us-states.json",function(json) {        // import GeoJSON data 
        for (var i = 0; i < data.length; i++) {             // iterate each row of data in the csv file
          if (data[i].Year == year) {                        // filter only selected year
            var state = data[i].State;                        // extract the state
            var rate = data[i].Rate;                   
            for (var j = 0; j < json.features.length; j++)  {             // Find the corresponding state inside the GeoJSON
              var jsonState = json.features[j].properties.name;
              if (state == jsonState) {
                json.features[j].properties.value = rate;
                break;
              }
            }
          }
        }

      var t = d3.transition()
                .duration(500)
                .ease(d3.easeLinear);        

        var paths = d3.select('#usmap')         // assign the color for each state
          .selectAll("path")
          .data(json.features)
          .transition(t)
          .style("fill", function(d) {
            return color(d.properties.value);
          });
      }); // end d3.json data function
    }); // end function(data)


}



function drawHeartDiseaseUSMap1999_2015(year) {

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

  parent = document.getElementById('svgmap');     // clear old title and rewrite new year
  child = document.getElementById('mastertitle');
  parent.removeChild(child);

  // create single title for both maps
  var mapsvg = d3.select("#svgmap")
    .attr("class", "maptitle")
    .append("text")               //apend the graph title                     
            .attr("x", 800)
            .attr("y", 40)
            .attr('id', 'mastertitle')            
            .text(year +"  Heart Disease Mortality Rates per 100,000 Population ")  
            .style('font-size', 22);    

  // import data from the obesity file
  d3.csv("data/heart_disease_data/heart_disease_mortality_us_1999_2015.csv",  function(d, i) {
      return d;
    },function(data) {

      minRate = d3.min(data, function(d) {return d.Rate});    // get min, max values from Rate column for color scaling
      maxRate = d3.max(data, function(d) {return d.Rate});
      var color = d3.scaleSequential(d3.interpolateYlOrBr)    // set color scheme
                    .domain([minRate, maxRate])     
       d3.json("data/us-states.json",function(json) {        // import GeoJSON data 
        for (var i = 0; i < data.length; i++) {             // iterate each row of data in the csv file
          if (data[i].Year == year) {                        // filter only selected year
            var state = data[i].State;                        // extract the state
            var rate = data[i].Rate;                   
            for (var j = 0; j < json.features.length; j++)  {             // Find the corresponding state inside the GeoJSON
              var jsonState = json.features[j].properties.name;
              if (state == jsonState) {
                json.features[j].properties.value = rate;
                break;
              }
            }
          }
        }

      var t = d3.transition()
                .duration(2000)
                .ease(d3.easeLinear);        

        var paths = d3.select('#usmap')         // assign the color for each state
          .selectAll("path")
          .data(json.features)
          .transition(t)
          .style("fill", function(d) {
            return color(d.properties.value);
          });
      }); // end d3.json data function
    }); // end function(data)

}
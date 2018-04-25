
// dataType is already set as a global variable
function drawUSMap(year) {

  // set up the size US map within svg (left half of svg area)
  var width = 1000;
  var height = 800;

  // scale to US map
  var projection = d3.geoAlbersUsa()
  //    .translate([width/2, height/2])   
      .translate([450, 300])
      .scale([1100]);

  // convert GeoJSON to SVG paths
  var path = d3.geoPath()               
      .projection(projection);

  // set the color for the degree of obesity
  var color = d3.scaleLinear()
      .range(["#77dd77","#fdfd96","#ffb347","#d7191c"]);

  // create single title for both maps
  var mapsvg = d3.select("#svgmap")
    .attr("class", "maptitle")
    .append("text")               //apend the graph title                     
            .attr("x", 800)
            .attr("y", 40)
            .text("U.S. Percentage of Obesity")
            .style('font-size', 22);    

  // select US map group within svg
  var usmapg = d3.select("#usmap")
    //.attr("width", width)
    //.attr("height", height)
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

  // import the file name
  var US_filename = 'US_'+String(year)+'.csv';

  console.log('data/obesity_data/'+ US_filename);
  // import data from the obesity file
  d3.csv('data/obesity_data/'+US_filename,  function(d, i) {

      d['obese_'+String(year)+'_degree'] = +d['obese_'+String(year)+'_degree'];
      return d;
    },function(data) {
       color.domain([0,1,2,3]);                             // set the range of the input data
       d3.json("data/us-states.json",function(json) {        // import GeoJSON data 
        for (var i = 0; i < data.length; i++) {             // iterate each row of data in the csv file
          var state = data[i].state;                        // extract the state
          var obese_degree = data[i]['obese_'+String(year)+'_degree'];               // extract the degree of obesity


          //console.log(obese_degree);
          for (var j = 0; j < json.features.length; j++)  {             // Find the corresponding state inside the GeoJSON
            var jsonState = json.features[j].properties.name;
            if (state == jsonState) {
              json.features[j].properties.value = obese_degree;               // assign the obese rate to json file
              break;
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
            // extract the obese rate value
            var degree = d.properties.value;
            //console.log(degree);
            // assign color based on the severity
            return color(degree);
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
             // .attr("width", 340)
            //.attr("height", 100)
                  .attr("transform","translate(800,500)")                // position for the legend position
              .selectAll("g")
              .data(color.domain().slice().reverse())
              .enter()
              .append("g")
                .attr("transform", function(d, i) { return "translate(10," + i * 28 + ")"; });
            legend.append("rect")               // append the rectangle box for legend
                .attr("width", 24)
                .attr("height", 24)
                .style("fill", color);
            legend.append("text")                 // append the legend text
               .data(["Obesity > 29%", "Obesity < 29%", "Obesity < 26%", "Obesity < 23%"])
                  .attr("x", 92)
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

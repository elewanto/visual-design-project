
function drawOhioMap() {

  // set up size for the OH svg map
  var width = 500;
  var height = 600;

  // set the color for the degree of obesity
  var color = d3.scaleLinear()
    .range(["#77dd77","#fdfd96","#ffb347","#d7191c"]);

  // declare the properties for the div used for the tooltips
  var div = d3.select("body").append("div")   
      .attr("class", "tooltip")             
      .style("opacity", 0); 

  // set the size for the bar chart
  //var svg2 = d3.select("#svgmap")
    //.attr("transform","translate(0,0)")

  var ohiomapg = d3.select('#ohiomap');

  var mapLayer = ohiomapg
    .attr('transform','translate (1000, 0)')
    .classed('map-layer', true);
  // import data from the obesity file
  d3.csv("data/obesity_data/Ohio_Obesity.csv",  function(d, i) {
      d['obese_degree'] = +d['obese_degree'];
      return d;
    },function(data) {
      // set the range of the input data
      color.domain([0,1,2,3]); 
      d3.json("data/OH_map.json", function(counties) {
        // iterate each row of data in the csv file
        for (var i = 0; i < data.length; i++) {
          // extract the state
          var county = data[i].County;
          // extract the degree of obesity
          var obese_degree = data[i]['2004_degree'];
          // Find the corresponding state inside the GeoJSON
          for (var j = 0; j < counties.features.length; j++)  {
            var jsonCounty = counties.features[j].properties.NAME;
            if (county == jsonCounty) {
              // assign the obese rate to json file
              counties.features[j].properties.value = obese_degree; 
              break;
            }
          }
        }

      var projection = d3.geoEquirectangular()
        //.fitExtent([[0,0], [width/1.7, height/1.7]], counties);
        .fitExtent([[0,0], [width, height]], counties);   // map scaling here

      var geoGenerator = d3.geoPath()
        .projection(projection);

      var paths = mapLayer
        .selectAll('path')
        .data(counties.features)
        .enter()
        .append('path')
        .style("stroke", "#606060")
        // fill colors to maps
        .attr("fill", function(d, i) {
          // extract the obese rate value
          var degree = parseInt(d.properties.value);
          // assign color based on the severity
          return color(parseInt(d.properties.value));
        })
        .attr('d', geoGenerator)
        // add mouse over function
            .on('mouseover', mouseover)
            .on('mouseout', mouseout);

      // add text notation to map
      var texts = mapLayer
        .selectAll('text')
        .data(counties.features)
        .enter()
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        // assign id to each text
        .attr('id', function(d, i) {
          return 'name' + i;
        })
        .attr('opacity', 0.5)
        .attr('font-size', 'x-small')

        // hide the text
        .attr('display', 'none')
        .text(function(d) {
          return d.properties.NAME;
        })
        .attr('transform', function(d, i) {
          var center = geoGenerator.centroid(d);
          return 'translate (' + center + ')';
        });

      //apend the graph title
      var title = mapLayer
        .append("text")
          .attr("transform","translate(250,80)")
                .text("Ohio")
                .style('font-size', 18);

     // no legend...already created in drawUSMap()
    /*
      // add legend for the svg
      var legend = d3.select('#svgmap')
        .append("svg")
              .attr("class", "legend")
            .attr("width", 140)
          .attr("height", 100)
        // position for the legend position
                .attr("transform","translate(50,400)")
            .selectAll("g")
            .data(color.domain().slice().reverse())
            .enter()
            .append("g")
              .attr("transform", function(d, i) { return "translate(10," + i * 20 + ")"; });

        // append the rectangle box for legend
          legend.append("rect")
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);

        // append the legend text
          legend.append("text")
             .data(["Obesity: >29%", "Obesity: <=29%", "Obesity: <=26%", "Obesity: <=23%"])
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(function(d) { return d; });

    */
      });

      function mouseover(d, i){
        // Highlight hovered province
        d3.select(this)
         .transition()
         .duration(1)
          .attr("opacity", 0.5)

        d3.select('#name' + i)
          .attr('display', '')
      }

      function mouseout(d, i){
          // Reset province color
          mapLayer.selectAll('path')
        // fill colors to maps
         .transition()
        .duration(200)
        .attr("opacity", 1);  

        d3.select('#name' + i)
          .attr('display', 'none')
      }

  });




}
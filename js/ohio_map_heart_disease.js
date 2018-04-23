
function drawHeartDiseaseOhioMap(year) {

  // set up size for the OH svg map
  var width = 500;
  var height = 600;


  // declare the properties for the div used for the tooltips
  var div = d3.select("body").append("div")   
      .attr("class", "tooltip")             
      .style("opacity", 0); 

  var ohiomapg = d3.select('#ohiomap');

  var mapLayer = ohiomapg
    .attr('transform','translate (1000, 0)')
    .classed('map-layer', true);
  // import data from file
  d3.csv("data/heart_disease_data/heart_disease_mortality_ohio_1999_2015.csv",  function(d, i) {
      return d;
    },function(data) {

      minRate = d3.min(data, function(d) {return d.Rate});    // get min, max values from Rate column for color scaling
      maxRate = d3.max(data, function(d) {return d.Rate});
      console.log('min rate: ' + minRate);
      console.log('max rate: ' + maxRate);
      var color = d3.scaleSequential(d3.interpolateYlOrBr)    // set color scheme
                    .domain([minRate, maxRate])      
      d3.json("data/OH_map.json", function(counties) {
        // iterate each row of data in the csv file
        for (var i = 0; i < data.length; i++) {
          if (data[i].Year == year) {                         // filter only selected year from slider parameter
            // extract the county name from data
            var county = data[i].County;
            // extract the mortality rate from data
            var rate = data[i].Rate;
            // Find the corresponding county inside the GeoJSON
            for (var j = 0; j < counties.features.length; j++)  {
              var jsonCounty = counties.features[j].properties.NAME;
              if (county == jsonCounty) {
                // assign the mortality rate to json array
                counties.features[j].properties.value = rate;
                break;
              }
            }
          }
        }

      var projection = d3.geoEquirectangular()
        .fitExtent([[0,0], [width, height]], counties);   // map scaling here

      var geoGenerator = d3.geoPath()
        .projection(projection);

      var tooltip = d3.select('body').append('div')
        .attr('class', 'tooltipAlt')
        .style('opacity', 0);        

      var paths = mapLayer
        .selectAll('path')
        .data(counties.features)
        .enter()
        .append('path')
        .style("stroke", "#606060")
        // fill colors to maps
        .attr("fill", function(d, i) {
          // assign color based on the min, max mortality rate
          return color(parseInt(d.properties.value));
        })
        .attr('d', geoGenerator)
        // add mouse over function
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

           //     d3.select('#name' + i)
           //       .attr('display', '')              
            })
            .on('mouseout', function(d, i) {
                tooltip.transition()
                      .duration(400)
                      .style('opacity', 0);          
                mapLayer.selectAll('path')
                  .transition()
                  .duration(200)
                  .attr("opacity", 1);  

            //    d3.select('#name' + i)
            //      .attr('display', 'none')              
            });

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
        .attr('opacity', 0.9)
        .attr('font-size', 'small')

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
      });

  });

  return 1;

}




function drawHeartDiseaseOhioMapRedraw(year, delay) {

  // set up size for the OH svg map
  var width = 500;
  var height = 600;



  var ohiomapg = d3.select('#ohiomap');

  // import data from file
  d3.csv("data/heart_disease_data/heart_disease_mortality_ohio_1999_2015.csv",  function(d, i) {
      return d;
    },function(data) {

      minRate = d3.min(data, function(d) {return d.Rate});    // get min, max values from Rate column for color scaling
      maxRate = d3.max(data, function(d) {return d.Rate});
      var color = d3.scaleSequential(d3.interpolateYlOrBr)    // set color scheme
                    .domain([minRate, maxRate])      
      d3.json("data/OH_map.json", function(counties) {
        // iterate each row of data in the csv file
        for (var i = 0; i < data.length; i++) {
          if (data[i].Year == year) {                         // filter only selected year from slider parameter
            // extract the county name from data
            var county = data[i].County;
            // extract the mortality rate from data
            var rate = data[i].Rate;
            // Find the corresponding county inside the GeoJSON
            for (var j = 0; j < counties.features.length; j++)  {
              var jsonCounty = counties.features[j].properties.NAME;
              if (county == jsonCounty) {
                // assign the mortality rate to json array
                counties.features[j].properties.value = rate;
                break;
              }
            }
          }
        }

      var projection = d3.geoEquirectangular()
        .fitExtent([[0,0], [width, height]], counties);   // map scaling here

      var geoGenerator = d3.geoPath()
        .projection(projection);

      var t = d3.transition()
                .duration(delay)
                .ease(d3.easeLinear);

      ohiomapg.selectAll('path')
        .data(counties.features)
        .transition(t)
        .attr("fill", function(d, i) {
          // assign color based on the min, max mortality rate
          return color(parseInt(d.properties.value));
        })

      });
  });

  return 1;

}


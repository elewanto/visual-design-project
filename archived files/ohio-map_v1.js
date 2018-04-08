

// create svg canvas and setup to draw map
function drawOhioMap() {

  console.log('in setupOhioMap()');

  // remove any existing svg so we don't append a second one below

  oldSvg = document.getElementById('mapDiv');
  removeChildren(oldSvg);


  //var width = 1300;
  //var height = 1000;
  var width = '50%';
  var height = '100%';
  var mapSvg = d3.select('#mapDiv').append('svg').attr('id', 'svgmap');
  mapSvg.attr('width', width).attr('height', height);

  // set the color for the graph
  var color = d3.scaleLinear()
                .domain([0, 35, 100])
                .range(["#2c7bb6", "#ffff8c", "#d7191c"])
                .interpolate(d3.interpolateHcl);

        //.range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"]);


  // set the size for the bar chart
  var svg = d3.select("#svgmap")

  //Append a defs (for definition) element to your SVG
  var defs = svg.append("defs");

  //Append a linearGradient element to the defs and give it a unique id
  var linearGradient = defs.append("linearGradient")
                            .attr("id", "linear-gradient");



  //Append multiple color stops by using D3's data/enter step
  linearGradient.selectAll("stop") 
        .data( color.range() )                  
        .enter().append("stop")
        .attr("offset", function(d,i) { return i/(color.range().length-1); })
        .attr("stop-color", function(d) { return d; });


  d3.json("data/OH_map.json", drawOhio);
}



// draw OHIO state map with counties
function drawOhio(error, counties) {

  console.log(counties);

  var color = d3.scaleLinear()
                .domain([0, 35, 100])
                .range(["#2c7bb6", "#ffff8c", "#d7191c"])
                .interpolate(d3.interpolateHcl);

  //var width = 1300;
  //var height = 1000;
  var width = '50%';
  var height = '100%';  

  var projection = d3.geoEquirectangular()
    .fitExtent([[0,0], [width, height]], counties);
      
  var geoGenerator = d3.geoPath()
    .projection(projection);

  var paths = d3.select('#svgmap')
    .selectAll('path')
    .data(counties.features)
    .enter()
    .append('path')
    // fill colors to maps
    .attr("fill", function(d, i) {
          return color(i);
    })
    .attr('d', geoGenerator);

  var texts = d3.select('svg')
    .selectAll('text')
    .data(counties.features)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('opacity', 0.5)
    .text(function(d) {
      return d.properties.NAME;
    })
    .attr('transform', function(d) {
      var center = geoGenerator.centroid(d);
      return 'translate (' + center + ')';
    });

    }

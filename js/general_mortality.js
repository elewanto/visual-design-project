
// global variables
var sliderValue = "2015";     //


/************************************************************************************************/
// main function called from index.html homepage
function drawStart() {

  console.log('in landingPageStart()');

  // create slider object
  // slider = $('#mapSlider').slider()
  //                             .on('slide', sliderChange)
  //                             .data('slider');  

  // automatically draw side-by-side U.S and Ohio county map by default
  mortality1_chart1();
}



/************************************************************************************************/


// Map Slider function
function sliderChange() {
  console.log('slider used: ' + slider.getValue());
  sliderValue = slider.getValue();
  drawMaps();
}  




// draw Obesity maps and charts
function mortality1_chart1() {
  console.log('mortality1_chart1()')

  //drawMaps();

  // Added by Sangeeta
  //Draw the bubble chart
  drawWordCloud()

  drawBubbles("data/mortality_data/OH_Rural_Counties_Mortality_rate.csv");
  drawBubbles("data/mortality_data/OH_Urban_Counties_Mortality_Rate.csv");

  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);
  // draw chart here

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1200 800')
                .classed('svg-content', true)
                .attr('overflow', 'visible');
                //.attr('width', width)
                //.attr('height', height);

  // create US map group <g>  ID #usmap
  var chartGroup = chartSvg.append('g')
                .attr('id', 'chartG')
                .attr('transform', 'translate(5, 0)');

  drawBarChart5start();

}

function drawWordCloud(){
  var word_count = {};
  d3.csv("data/mortality_data/Causes_of_death_OH_wordcloud.csv",function(data){
    for (var i = 0; i < data.length; i++){
      word_count[data[i]["Cause of death"]] = +data[i].Deaths/1000;
    }

    var word_entries = d3.entries(word_count);
    var fill = d3.scaleOrdinal(d3.schemeCategory20);
    var width = 1000;
    var height = 1000;
    var xScale = d3.scaleLinear()
                  .domain([0, d3.max(word_entries, function(d) { return d.value; }) ])
                  .range([10,100]);

    d3.layout.cloud().size([width, height])
                    .timeInterval(20)
                    .words(word_entries)
                    .fontSize(function(d) { return xScale(+d.value); })
                    .text(function(d) { return d.key; })
                    .rotate(function() { return ~~(Math.random() * 2) * 90; })
                    .font("Impact")
                    .on("end", draw)
                    .start();

    function draw(words) {
        d3.select("#cloud").append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
              .selectAll("text")
              .data(words)
              .enter().append("text")
              .style("font-size", function(d) { return xScale(d.value) + "px"; })
              .style("font-family", "Impact")
              .style("fill", function(d, i) { return fill(i); })
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .text(function(d) { return d.key; });
        }
        d3.layout.cloud().stop();
  });
}

function drawBubbles(file){
  
  if(file == "data/mortality_data/OH_Rural_Counties_Mortality_rate.csv"){
    xtransform = 5;
  }else{
    xtransform = 200;
  }

  var diameter = 300;
  var color = d3.scaleOrdinal(d3.schemeCategory20c);
  var pack = d3.pack()
                .size([diameter, diameter])
                .padding(1);

  var bubbles_svg = d3.select('#bubbles-chart')
            .append('svg')
            .attr('class', 'bubbles')
            .attr('id', 'bubble-chart')
            .attr('width', 500)
            .attr('height', 300)
            .attr('transform', 'translate(' +xtransform+ ', 0)');

  d3.csv(file, function(error, data){

      data = data.map(function(d){ d.value = +d["Deaths_2015"]/10; d.Change = +d.Change; return d; });

      var nodes = d3.hierarchy({children: data})
                    .sum(function(d) { return d.value; })
                    .sort(function(a, b) { return b.value - a.value; });

      var circle = bubbles_svg.selectAll("circle")
                      .data(pack(nodes).leaves(), function(d){ return d.Change; });


      circle.enter().append("circle")
          .attr("r", function(d){ return d.r; })
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; })
          .attr("fill", function(d,i){ 
            if(d.data.Change > 0){
              return "orange";
            }else{
              return "green"; 
          }})
          .attr("id", function(d){return d.data.County;})
          .on("mouseover", function(d) {
              showPopover.call(this, d);
          })
          .on("mouseout", function(d) {
              removePopovers();
          })
  });
}

function removePopovers() {
  $('.popover').each(function() {
    $(this).remove();
  });
}
 
function showPopover(d) {
  $(this).popover({
      placement: 'auto top',
      container: 'body',
      trigger: 'manual',
      html: true,
      content: function() {
        return "County: "+ d.data.County + "</br>Deaths in 2005: " + d.data.Deaths_2005 + "</br>Deaths in 2015: " + d.data.Deaths_2015 + "</br>Change: " + d.data.Change ;
      }
  });
  $(this).popover('show');
}

// create SVG and groups needed to draw two maps side-by-side
// can add data parameters to pass to function
function drawMaps() {

  console.log('in drawMaps()');

  // remove any existing svg so we don't append a second one below
  oldSvg = document.getElementById('mapDiv');   // get the parent container div for the svg
  removeChildren(oldSvg);                       // delete previous svg element before drawing new svg

  // create single SVG element for two side-by-side maps (maps share the same SVG
  // we will use transformation to position horizontally)
  var width = 1500;
  var height = 700;
  var mapSvg = d3.select('#mapDiv')
                .append('svg')
                .attr('id', 'svgmap')       // svg ID is '#svgmap'
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', '0 0 1500 700')
                .classed('svg-content', true);
                //.attr('width', width)
                //.attr('height', height);

  // create US map group <g>  ID #usmap
  var usmapg = mapSvg.append('g')
                .attr('id', 'usmap')
                .attr('transform', 'translate(5, 0)');

  // create Ohio map group <g> ID #ohiomap
  var ohiomapg = mapSvg.append('g')
                .attr('id', 'ohiomap')
                .attr('transform', 'translate(800, 0)');

  drawUSMap();
  drawOhioMap();
}


// draw SVG D3 charts 
function drawCharts() {

  console.log('in drawCharts()');

  // remove any existing svg so we don't append a second one below
  oldSvg = document.getElementById('chartDiv');   // get the parent container div for the svg
  removeChildren(oldSvg);                       // delete previous svg element before drawing new svg

}


// remove document html children of node parameter
function removeChildren(node) {

  console.log('in removeChildren()');

  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

}
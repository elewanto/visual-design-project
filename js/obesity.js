
// global variables
var sliderValue = "2013";     //


/************************************************************************************************/
// main function called from index.html homepage
function drawStart() {

  console.log('in landingPageStart()');

  // create slider object
  slider = $('#mapSlider').slider()
                              .on('slide slideStop', sliderChange)
                              .data('slider');  

  // automatically draw side-by-side U.S and Ohio county map by default
  columbus_bar_chart();
}



/************************************************************************************************/


// Map Slider function
function sliderChange() {
  console.log('slider used: ' + slider.getValue());
  sliderValue = slider.getValue();

  // pass the year value to the map
  drawMaps(sliderValue);
}  




// draw Obesity maps and charts
function obesity1_chart1() {
  console.log('obesity1_chart1()')

  drawMaps(sliderValue);

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


// draw Columbus obesity chart
function columbus_bar_chart() {
  console.log('columbus_bar_chart()')

  drawMaps(sliderValue);

  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);
  // draw chart here

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 2000 1200')
                .classed('svg-content', true)
                .attr('overflow', 'visible');
                //.attr('width', width)
                //.attr('height', height);

  // create US map group <g>  ID #usmap
  var chartGroup = chartSvg.append('g')
                .attr('id', 'chartG')
                .attr('transform', 'translate(5, 0)');

  drawColumbusObesBarChart();



}


// draw Obesity maps and charts
function columbus_bubble() {
  console.log('columbus_bubble()')

  drawMaps(sliderValue);

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

  drawColumbusBubbleChart();



}


// diaplay the image for obesity
function columbus_trend(img_id){
  console.log('display_image()');

  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  var img = new Image();
  var parentDiv = document.getElementById('chartDiv');
  img.onload = function() {
                parentDiv.appendChild(img);
                imgNode = parentDiv.childNodes[0];
                imgNode.setAttribute('id', 'chartImage');
                imgNode.setAttribute('class', 'center-block');
                imgNode.setAttribute('width', '150%');  
                imgNode.setAttribute('height', '150%');  

  };

  switch(parseInt(img_id)){
    case 0: img.src = 'images/Columbus_Trending.jpg';
            break;
    case 1: img.src = 'images/Bar_Chart.jpg';
            break;
    case 2: img.src = 'images/Columbus_Scatter_Plot.jpg';
            break;
    default:
            break; 
  }
}




// create SVG and groups needed to draw two maps side-by-side
// can add data parameters to pass to function
function drawMaps(year) {

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

  drawUSMap(year);
  drawOhioMap(year);
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

// function for automatically change the chart for years
async function obesity_maps_years() {

  drawMaps(2004);

  for (var year = 2004; year <= 2013; year++) {
    $('#mapSlider').slider('setValue', year);
    var mapSvg = d3.select('#svgmap');
    var usmapg = mapSvg.select('#usmap');
    var ohiomapg = mapSvg.select('#ohiomap');

    // redraw the map for both US and OH 
    drawMaps(year);
    await sleep(800);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }  

}

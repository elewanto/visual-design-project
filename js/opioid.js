
// global variables
var sliderValue = "2015";     //


/************************************************************************************************/
// main function called from index.html homepage
function drawStart() {

  console.log('in landingPageStart()');

  // create slider object
  slider = $('#mapSlider').slider()
                              .on('slide', sliderChange)
                              .data('slider');  

  // automatically draw side-by-side U.S and Ohio county map by default
  drawMaps(sliderValue);  
  opioidLineChartUS();
}



/************************************************************************************************/


// Map Slider function
async function sliderChange() {
  console.log('slider used: ' + slider.getValue());
  sliderValue = await slider.getValue();
  var ret1 = redrawOpioidUSMap(sliderValue, 500);
  var ret2 = redrawdrawOpiodOhioMap(sliderValue, 500);
  var hold = [await ret1, await ret2]
  return 1;
} 




// draw Obesity maps and charts
function opioid1_chart1() {
  console.log('opioid1_chart1()')

  drawMaps();

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



function opioidLineChartUS() {

  // delete old chart elements
  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1200 1000')
                .classed('svg-content', true)
                .attr('overflow', 'visible');

  // create chart group as child of svg
  var chartGroup = chartSvg.append('g')
                .attr('id', 'chartG')
                .attr('transform', 'translate(0, 0)');


  queue().defer(d3.csv, "data/opiod_data/opiodDataState.csv")
        .defer(d3.csv, "data/opiod_data/opiodData.csv")
        .await(drawLineChartUS); // file in heart_disease_charts.js
}



function opioidLineChartOhio() {

  // delete old chart elements
  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1200 1000')
                .classed('svg-content', true)
                .attr('overflow', 'visible');

  // create chart group as child of svg
  var chartGroup = chartSvg.append('g')
                .attr('id', 'chartG')
                .attr('transform', 'translate(0, 0)');


  queue().defer(d3.csv, "data/opiod_data/opiodDataState.csv")
        .defer(d3.csv, "data/opiod_data/opiodData.csv")
        .await(drawLineChartOhio); // file in heart_disease_charts.js

}


function opioidLineChartOhioUS() {

  // delete old chart elements
  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1200 1000')
                .classed('svg-content', true)
                .attr('overflow', 'visible');

  // create chart group as child of svg
  var chartGroup = chartSvg.append('g')
                .attr('id', 'chartG')
                .attr('transform', 'translate(0, 0)');

  queue().defer(d3.csv, "data/opiod_data/opiodDataState.csv")
        .defer(d3.csv, "data/opiod_data/opiodData.csv")
        .await(partialDrawLineChartOhio); // file in heart_disease_charts.js

  queue().defer(d3.csv, "data/opiod_data/opiodDataState.csv")
        .defer(d3.csv, "data/opiod_data/opiodData.csv")
        .await(partialDrawLineChartUS); // file in heart_disease_charts.js
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

  drawOpiodOhioMap(year);
  drawOpioidUSMap(year);
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

  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

}
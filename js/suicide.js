
// global variables
var sliderValue = "2016";     //
var donutType = 'none';


/************************************************************************************************/
// main function called from index.html homepage
function drawStart() {

  console.log('in landingPageStart()');

  // create slider object
  slider = $('#mapSlider').slider()
                              .on('slide slideStop', sliderChange)
                              .data('slider');  

  // automatically draw side-by-side U.S and Ohio county map by default
  drawMaps(sliderValue);  
  suicideDonuts('Age')
}



/************************************************************************************************/


// Map Slider function
async function sliderChange() {
  console.log('slider used: ' + slider.getValue());
  sliderValue = await slider.getValue();
  var ret1 = redrawSuicideUSMap(sliderValue, 500);
  var ret2 = redrawSuicideOhioMap(sliderValue, 500);
  var hold = [await ret1, await ret2]
  return 1;
}

function suicideDonuts(selection) {
  console.log(selection);
  donutType = selection;
  // delete old chart elements
  //oldChartSvg = document.getElementById('chartDiv');
  //removeChildren(oldChartSvg);
  clearAll();

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1200 1000')
                .classed('svg-content-bot', true)
                .attr('overflow', 'visible');

  // create chart group as child of svg
  var chartGroup = chartSvg.append('g')
                .attr('id', 'chartG')
                .attr('transform', 'translate(0, 0)');

  var linkGroup = chartSvg.append('g')
    .attr('transform', 'translate(1100, 980)')      
    .append('a')
    .attr("href", "data/suicide_data/suicide_types_columbus_1999_2016.csv")    
    .append('text')
    .style("fill", "darkblue")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")
    .style("pointer-events", "all")
    .style('cursor', 'pointer')
    .text('Data Source');                  


  queue().defer(d3.csv, "data/suicide_data/suicide_types_columbus_1999_2016.csv")
        .defer(d3.csv, "data/suicide_data/suicide_age_columbus_1999_2016.csv")
        .defer(d3.csv, "data/suicide_data/suicide_gender_columbus_1999_2016.csv")
        .defer(d3.csv, "data/suicide_data/suicide_race_columbus_1999_2016.csv")
        .defer(d3.csv, "data/suicide_data/suicide_month_columbus_1999_2016.csv")
        .defer(d3.csv, "data/suicide_data/suicide_day_columbus_1999_2016.csv")
        .await(drawDonut); // file in heart_disease_charts.js
}


function suicideDonutsR(selection) {
  console.log(selection);
  donutType = selection;
  // delete old chart elements
  //oldChartSvg = document.getElementById('chartDiv');
  //removeChildren(oldChartSvg);
  clearAll();

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1200 1000')
                .classed('svg-content-bot', true)
                .attr('overflow', 'visible');                      

  // create chart group as child of svg
  var chartGroup = chartSvg.append('g')
                .attr('id', 'chartG')
                .attr('transform', 'translate(0, 0)');

  var linkGroup = chartSvg.append('g')
    .attr('transform', 'translate(1100, 980)')      
    .append('a')
    .attr("href", "data/suicide_data/suicide_age_columbus_1999_2016.csv")    
    .append('text')
    .style("fill", "darkblue")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")
    .style("pointer-events", "all")
    .style('cursor', 'pointer')
    .text('Data Source');                  


  queue().defer(d3.csv, "data/suicide_data/suicide_age_columbus_1999_2016.csv")
        .defer(d3.csv, "data/suicide_data/suicide_gender_columbus_1999_2016.csv")
        .defer(d3.csv, "data/suicide_data/suicide_race_columbus_1999_2016.csv")
        .await(drawDonutR); // file in heart_disease_charts.js
}




function suicideLineChartUS() {

  // delete old chart elements
  //oldChartSvg = document.getElementById('chartDiv');
  //removeChildren(oldChartSvg);
  clearAll();

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1200 1000')
                .classed('svg-content-bot', true)
                .attr('overflow', 'visible');                      

  // create chart group as child of svg
  var chartGroup = chartSvg.append('g')
                .attr('id', 'chartG')
                .attr('transform', 'translate(0, 0)');

  var linkGroup = chartSvg.append('g')
    .attr('transform', 'translate(1100, 980)')      
    .append('a')
    .attr("href", "data/suicide_data/suicide_us_1999_2016.csv")    
    .append('text')
    .style("fill", "darkblue")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")
    .style("pointer-events", "all")
    .style('cursor', 'pointer')
    .text('Data Source');                     


  queue().defer(d3.csv, "data/suicide_data/suicide_us_1999_2016.csv")
        .defer(d3.csv, "data/suicide_data/suicide_ohio_1999_2016.csv")
        .await(drawLineChartUS); // file in heart_disease_charts.js

}



function suicideLineChartOhio() {

  // delete old chart elements
  //oldChartSvg = document.getElementById('chartDiv');
  //removeChildren(oldChartSvg);
  clearAll();

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1200 1000')
                .classed('svg-content-bot', true)
                .attr('overflow', 'visible');                      

  // create chart group as child of svg
  var chartGroup = chartSvg.append('g')
                .attr('id', 'chartG')
                .attr('transform', 'translate(0, 0)');

  var linkGroup = chartSvg.append('g')
    .attr('transform', 'translate(1100, 980)')      
    .append('a')
    .attr("href", "data/suicide_data/suicide_ohio_1999_2016.csv")    
    .append('text')
    .style("fill", "darkblue")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")
    .style("pointer-events", "all")
    .style('cursor', 'pointer')
    .text('Data Source');                 


  queue().defer(d3.csv, "data/suicide_data/suicide_us_1999_2016.csv")
        .defer(d3.csv, "data/suicide_data/suicide_ohio_1999_2016.csv")
        .await(drawLineChartOhio); // file in heart_disease_charts.js    

}


function suicideLineChartOhioUS() {

  // delete old chart elements
  //oldChartSvg = document.getElementById('chartDiv');
  //removeChildren(oldChartSvg);
  clearAll();

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1200 1000')
                .classed('svg-content-bot', true)
                .attr('overflow', 'visible');                      

  // create chart group as child of svg
  var chartGroup = chartSvg.append('g')
                .attr('id', 'chartG')
                .attr('transform', 'translate(0, 0)');

  var linkGroup = chartSvg.append('g')
    .attr('transform', 'translate(1100, 980)')      
    .append('a')
    .attr("href", "data/suicide_data/suicide_us_1999_2016.csv")    
    .append('text')
    .style("fill", "darkblue")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")
    .style("pointer-events", "all")
    .style('cursor', 'pointer')
    .text('Data Source'); 
                

  queue().defer(d3.csv, "data/suicide_data/suicide_us_1999_2016.csv")
        .defer(d3.csv, "data/suicide_data/suicide_ohio_1999_2016.csv")
        .await(partialDrawLineChartOhio); // file in heart_disease_charts.js

  queue().defer(d3.csv, "data/suicide_data/suicide_us_1999_2016.csv")
        .defer(d3.csv, "data/suicide_data/suicide_ohio_1999_2016.csv")
        .await(partialDrawLineChartUS); // file in heart_disease_charts.js
    
}




async function suicide_maps_years() {

  drawMaps(1999);

  for (var year = 1999; year <= 2015; year++) {
    $('#mapSlider').slider('setValue', year);
    var mapSvg = d3.select('#svgmap');
    var usmapg = mapSvg.select('#usmap');
    var ohiomapg = mapSvg.select('#ohiomap');
    delay = 500 // transition milliseconds
    redrawSuicideUSMap(year, delay);
    redrawSuicideOhioMap(year, delay);
    await sleep(600);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }  

}


async function suicide_maps_1999_2016() {

  $('#mapSlider').slider('setValue', 1999);
  drawMaps(1999);  
  await sleep(1500);

  delay = 800 // transition milliseconds
  redrawSuicideUSMap(2015, delay);
  redrawSuicideOhioMap(2015, delay);

  $('#mapSlider').slider('setValue', 2016);  

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1500 700')
                .classed('svg-content-top', true);

  // create US map group <g>  ID #usmap
  var usmapg = mapSvg.append('g')
                .attr('id', 'usmap')
                .attr('transform', 'translate(5, 0)');

  // create Ohio map group <g> ID #ohiomap
  var ohiomapg = mapSvg.append('g')
                .attr('id', 'ohiomap')
                .attr('transform', 'translate(800, 0)');

  drawSuicideUSMap(year);
  drawSuicideOhioMap(year);
}



// remove document html children of node parameter
function removeChildren(node) {

  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

}


function clearAll(){
  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  oldDataSrc = document.getElementById('dataSource');
  removeChildren(oldDataSrc);

  oldTitle = document.getElementById('chartTitle');
  removeChildren(oldTitle);

  oldText = document.getElementById('analysisText');
  removeChildren(oldText);
}
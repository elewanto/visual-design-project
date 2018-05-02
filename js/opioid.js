
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



function display_image(img_id){
  console.log('display_image()');

  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  oldDataSrc = document.getElementById('dataSource');
  removeChildren(oldDataSrc);

  var img = new Image();
  var parentDiv = document.getElementById('chartDiv');
  img.onload = function() {
                parentDiv.appendChild(img);
                imgNode = parentDiv.childNodes[0];
                imgNode.setAttribute('id', 'chartImage');
                imgNode.setAttribute('class', 'center-block');
                imgNode.setAttribute('width', img.width);  
  };

  switch(parseInt(img_id)){
    case 0: img.src = 'images/opioidByGender.png';
            link1 = 'data/opiod_data/opioidDataByGender.csv';
            break;
    case 1: img.src = 'images/opioidByRace.png';
            link1 = 'data/opiod_data/opioidDataByRace.csv';
            break;
    case 2: img.src = 'images/opioidByAge.png';
            link1 = 'data/opiod_data/opioidDataByAge.csv';
            break;
    default:
            break; 
  }

  var parentDiv2 = document.getElementById('dataSource');
  parentDiv2.setAttribute("top", img.height);
  
  var anchorTag = document.createElement('a');
  anchorTag.setAttribute("href", link1); 
  anchorTag.setAttribute("style", "float:right");
  anchorTag.innerHTML = "Data Source";
  parentDiv2.appendChild(anchorTag);
}


function opioidLineChartUS() {

  // delete old chart elements
  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  oldDataSrc = document.getElementById('dataSource');
  removeChildren(oldDataSrc);

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
    .attr("href", "data/opiod_data/opiodDataState.csv")    
    .append('text')
    .style("fill", "darkblue")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")
    .style("pointer-events", "all")
    .style('cursor', 'pointer')
    .text('Data Source');

  queue().defer(d3.csv, "data/opiod_data/opiodDataState.csv")
        .defer(d3.csv, "data/opiod_data/opiodData.csv")
        .await(drawLineChartUS); // file in heart_disease_charts.js
}



function opioidLineChartOhio() {

  // delete old chart elements
  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  oldDataSrc = document.getElementById('dataSource');
  removeChildren(oldDataSrc);

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1200 1000')
                .classed('svg-content-bot', true)
                .attr('overflow', 'visible');                ;

  // create chart group as child of svg
  var chartGroup = chartSvg.append('g')
                .attr('id', 'chartG')
                .attr('transform', 'translate(0, 0)');

  var linkGroup = chartSvg.append('g')
    .attr('transform', 'translate(1100, 980)')      
    .append('a')
    .attr("href", "data/opiod_data/opiodData.csv")    
    .append('text')
    .style("fill", "darkblue")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")
    .style("pointer-events", "all")
    .style('cursor', 'pointer')
    .text('Data Source');

  queue().defer(d3.csv, "data/opiod_data/opiodDataState.csv")
        .defer(d3.csv, "data/opiod_data/opiodData.csv")
        .await(drawLineChartOhio); // file in heart_disease_charts.js

}


function opioidLineChartOhioUS() {

  // delete old chart elements
  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  oldDataSrc = document.getElementById('dataSource');
  removeChildren(oldDataSrc);

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
    .attr("href", "data/opiod_data/opiodData.csv")    
    .append('text')
    .style("fill", "darkblue")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")
    .style("pointer-events", "all")
    .style('cursor', 'pointer')
    .text('Data Source 1');

  var linkGroup = chartSvg.append('g')
    .attr('transform', 'translate(1100, 1000)')      
    .append('a')
    .attr("href", "data/opiod_data/opiodDataState.csv")    
    .append('text')
    .style("fill", "darkblue")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")
    .style("pointer-events", "all")
    .style('cursor', 'pointer')
    .text('Data Source 2');

  queue().defer(d3.csv, "data/opiod_data/opiodDataState.csv")
        .defer(d3.csv, "data/opiod_data/opiodData.csv")
        .await(partialDrawLineChartOhio); // file in heart_disease_charts.js

  queue().defer(d3.csv, "data/opiod_data/opiodDataState.csv")
        .defer(d3.csv, "data/opiod_data/opiodData.csv")
        .await(partialDrawLineChartUS); // file in heart_disease_charts.js
}


async function opioid_maps_years() {

  drawMaps(1999);

  for (var year = 1999; year <= 2015; year++) {
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
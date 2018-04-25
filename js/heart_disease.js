
// global variables
var sliderValue = "2015";


/************************************************************************************************/
// main function called from index.html homepage
function drawStart() {
  // create slider object
  slider = $('#mapSlider').slider()
                              .on('slide slideStop', sliderChange)
                              .data('slider');  
  // default chart / maps to draw on heart_disease.html page load
  drawMaps(sliderValue);  
  heartDiseaseLineChartUS();
}



// Map Slider function
async function sliderChange() {
  console.log('slider used: ' + slider.getValue());
  sliderValue = await slider.getValue();
  var ret1 = redrawHeartDiseaseUSMap(sliderValue, 500);
  var ret2 = redrawHeartDiseaseOhioMap(sliderValue, 500);
  var hold = [await ret1, await ret2]
  return 1;
}


function test_image1() {
  console.log('test_image1()');

  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  var img = new Image();
  var parentDiv = document.getElementById('chartDiv');
  img.onload = function() {
    parentDiv.appendChild(img);

    imgNode = parentDiv.childNodes[0];
    imgNode.setAttribute('id', 'chartImage');
    imgNode.setAttribute('class', 'center-block');
    //dynamically set max image width to minimize distortion
    console.log('image width: ' + img.width);
    imgNode.setAttribute('width', img.width);  
  };

  img.src = 'images/LE_US_gender_race.png';

}


function test_image2() {
  console.log('test_image2()');

  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  var img = new Image();
  var parentDiv = document.getElementById('chartDiv');
  img.onload = function() {
    parentDiv.appendChild(img);

    imgNode = parentDiv.childNodes[0];
    imgNode.setAttribute('id', 'chartImage');
    imgNode.setAttribute('class', 'center-block');
    //dynamically set max image width to minimize distortion
    console.log('image width: ' + img.width);
    imgNode.setAttribute('width', img.width);  
  };

  img.src = 'images/causeDeathB.png';

}




function heart_disease1_chart1() {
  console.log('heart_disease1_chart1()')

  drawMaps(sliderValue);

  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);
  // draw chart here

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1200 900')
                .classed('svg-content', true)
                .attr('overflow', 'visible');

  // create chart group as child of svg
  var chartGroup = chartSvg.append('g')
                .attr('id', 'chartG')
                .attr('transform', 'translate(5, 0)');

  drawBarChart5start();

}



function heartDiseaseLineChartUS() {

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


  queue().defer(d3.csv, "data/heart_disease_data/heart_disease_mortality_us_1999_2015.csv")
        .defer(d3.csv, "data/heart_disease_data/heart_disease_mortality_ohio_1999_2015.csv")
        .await(drawLineChartUS); // file in heart_disease_charts.js
}



function heartDiseaseLineChartOhio() {

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


  queue().defer(d3.csv, "data/heart_disease_data/heart_disease_mortality_us_1999_2015.csv")
        .defer(d3.csv, "data/heart_disease_data/heart_disease_mortality_ohio_1999_2015.csv")
        .await(drawLineChartOhio); // file in heart_disease_charts.js

}


function heartDiseaseLineChartOhioUS() {

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

  queue().defer(d3.csv, "data/heart_disease_data/heart_disease_mortality_us_1999_2015.csv")
        .defer(d3.csv, "data/heart_disease_data/heart_disease_mortality_ohio_1999_2015.csv")
        .await(partialDrawLineChartOhio); // file in heart_disease_charts.js

  queue().defer(d3.csv, "data/heart_disease_data/heart_disease_mortality_us_1999_2015.csv")
        .defer(d3.csv, "data/heart_disease_data/heart_disease_mortality_ohio_1999_2015.csv")
        .await(partialDrawLineChartUS); // file in heart_disease_charts.js
}




async function heart_disease_maps_years() {

  drawMaps(1999);

  for (var year = 1999; year <= 2015; year++) {
    $('#mapSlider').slider('setValue', year);
    var mapSvg = d3.select('#svgmap');
    var usmapg = mapSvg.select('#usmap');
    var ohiomapg = mapSvg.select('#ohiomap');
    delay = 500 // transition milliseconds
    redrawHeartDiseaseUSMap(year, delay);
    redrawHeartDiseaseOhioMap(year, delay);
    await sleep(600);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }  

}


async function heart_disease_maps_1999_2015() {

  $('#mapSlider').slider('setValue', 1999);
  drawMaps(1999);  
  await sleep(2500);

  delay = 800 // transition milliseconds
  redrawHeartDiseaseUSMap(2015, delay);
  redrawHeartDiseaseOhioMap(2015, delay);

  $('#mapSlider').slider('setValue', 2015);  

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

  drawHeartDiseaseUSMap(year);
  drawHeartDiseaseOhioMap(year);
}



// remove document html children of node parameter
function removeChildren(node) {

  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

}
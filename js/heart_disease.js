
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
  heart_disease1_chart1();
}



// Map Slider function
async function sliderChange() {
  console.log('slider used: ' + slider.getValue());
  sliderValue = await slider.getValue();
  var ret1 = drawHeartDiseaseUSMapRedraw(sliderValue, 500);
  var ret2 = drawHeartDiseaseOhioMapRedraw(sliderValue, 500);
  var hold = [await ret1, await ret2]
  return 1;
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
                .attr('viewBox', '0 0 1200 800')
                .classed('svg-content', true)
                .attr('overflow', 'visible');

  // create US map group <g>  ID #usmap
  var chartGroup = chartSvg.append('g')
                .attr('id', 'chartG')
                .attr('transform', 'translate(5, 0)');

  drawBarChart5start();

}



async function heart_disease_maps_years() {

  drawMaps(1999);

  for (var year = 1999; year <= 2015; year++) {
    $('#mapSlider').slider('setValue', year);
    var mapSvg = d3.select('#svgmap');
    var usmapg = mapSvg.select('#usmap');
    var ohiomapg = mapSvg.select('#ohiomap');
    delay = 500 // transition milliseconds
    drawHeartDiseaseUSMapRedraw(year, delay);
    drawHeartDiseaseOhioMapRedraw(year, delay);
    await sleep(600);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }  

}


async function heart_disease_maps_1999_2015() {

  drawMaps(1999);  
  await sleep(1000);

  delay = 800 // transition milliseconds
  drawHeartDiseaseUSMapRedraw(2015, delay);
  drawHeartDiseaseOhioMapRedraw(2015, delay);

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
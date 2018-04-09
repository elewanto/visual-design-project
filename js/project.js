
// global variables
var dataLocation = "ohio";    // "franklin", "ohio"
var dataType = "life";        // "life", "heart", "cancer", "opioid", "obesity"
var sliderValue = "2010";     //


/************************************************************************************************/
// main function called from index.html homepage
function landingPageStart() {

  console.log('in landingPageStart()');

  // create slider object
  slider = $('#mapSlider').slider()
                              .on('slide', sliderChange)
                              .data('slider');

  // map button event listeners
  document.getElementById('OhioBut').addEventListener('click', OhioData);
  document.getElementById('FranklinBut').addEventListener('click', FranklinData);

  // data button event listeners
  document.getElementById('LifeBut').addEventListener('click', LifeExpectData);
  document.getElementById('HeartBut').addEventListener('click', HeartDiseaseData);
  document.getElementById('CancerBut').addEventListener('click', CancerData);    
  document.getElementById('OpioidBut').addEventListener('click', OpioidData);
  document.getElementById('ObesityBut').addEventListener('click', ObesityData);    

  // automatically draw side-by-side U.S and Ohio county map by default
  drawMaps();
}



/************************************************************************************************/


// Map Slider function
function sliderChange() {
  console.log('slider used: ' + slider.getValue());
  sliderValue = slider.getValue();
}  


// Ohio map button function
function OhioData() {
  console.log('clicked Ohio button');
  dataLocation = 'ohio';
  updateButtonGroup1('OhioBut');


  if (dataType == 'life') {

  } else if (dataType == 'heart') {
    drawOhioMapv1();
  } else if (dataType == 'cancer') { 

  } else if (dataType == 'opioid') {

  } else if (dataType == 'obesity') {
    drawMaps();
  }  


}


// Franklin County map button function
function FranklinData() {

  console.log('clicked Franklin County button');  
  dataLocation = 'franklin';
  updateButtonGroup1('FranklinBut');

  if (dataType == 'life') {

  } else if (dataType == 'heart') {
    drawOhioMapv1();
  } else if (dataType == 'cancer') { 

  } else if (dataType == 'opioid') {
    drawMaps();
  } else if (dataType == 'obesity') {

  }

  
}


function LifeExpectData() {

  console.log('clicked Life Expectancy Data button');
  dataType = 'life';
  updateButtonGroup2('LifeBut');

  if (dataLocation == 'ohio') {   // draw U.S. / Ohio county data

  } else if (dataLocation == 'franklin') { // draw U.S. / Franklin county data

  }      

}


function HeartDiseaseData() {

  console.log('clicked Heart Disease Data button');
  dataType = 'heart';
  updateButtonGroup2('HeartBut');

  if (dataLocation == 'ohio') {   // draw U.S. / Ohio county data
    drawOhioMapv1();
  } else if (dataLocation == 'franklin') { // draw U.S. / Franklin county data
    drawOhioMapv1();
  }      

}


function CancerData() {

  console.log('clicked Cancer Data button');
  dataType = 'cancer';
  updateButtonGroup2('CancerBut');

  if (dataLocation == 'ohio') {   // draw U.S. / Ohio county data

  } else if (dataLocation == 'franklin') { // draw U.S. / Franklin county data

  }      

}


// draw Opioid maps and charts
function OpioidData() {

  console.log('clicked Opioid Data button');
  dataType = 'opioid';
  updateButtonGroup2('OpioidBut'); 

  if (dataLocation == 'ohio') {   // draw U.S. / Ohio county data

  } else if (dataLocation == 'franklin') { // draw U.S. / Franklin county data

  }  

}

// draw Obesity maps and charts
function ObesityData() {

  console.log('clicked Obesity Data button');
  dataType = 'obesity';
  updateButtonGroup2('ObesityBut');

  if (dataLocation == 'ohio') {   // draw U.S. / Ohio county data
    drawMaps();
  } else if (dataLocation == 'franklin') { // draw U.S. / Franklin county data
    drawMaps();
  }


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
                .attr('width', width)
                .attr('height', height);

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







// update button selection attributes
function updateButtonGroup1(butId) {
  
  var buttons = document.getElementsByClassName('bg1');

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('btn-primary');
    buttons[i].classList.add('btn-secondary');
  }

  document.getElementById(butId).classList.remove('btn-secondary');    
  document.getElementById(butId).classList.add('btn-primary');  
}


function updateButtonGroup2(butId) {
  
  var buttons = document.getElementsByClassName('bg2');

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('btn-primary');
    buttons[i].classList.add('btn-secondary');
  }

  document.getElementById(butId).classList.remove('btn-secondary');    
  document.getElementById(butId).classList.add('btn-primary');  
}

// remove html children of node parameter
function removeChildren(node) {

  console.log('in removeChildren()');

  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

}
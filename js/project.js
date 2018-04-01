
// global variables
var drawMaps = true;
var dataLocation = "ohio";    // "franklin", "ohio", "us"
var dataType = "life";    // "life", "opioid", "obesity"

// main function called from index.html homepage
function landingPageStart() {

  console.log('in landingPageStart()');

  // create slider object
  slider = $('#mapSlider').slider()
                              .on('slide', sliderChange)
                              .data('slider');

  // map to graph toggle button event listener
  document.getElementById('chartMapButton').addEventListener('click', toggleChartMap);  

  // map button event listeners
  document.getElementById('USBut').addEventListener('click', USData);
  document.getElementById('OhioBut').addEventListener('click', OhioData);
  document.getElementById('FranklinBut').addEventListener('click', FranklinData);

  // data button event listeners
  document.getElementById('LifeBut').addEventListener('click', LifeExpectData);
  document.getElementById('OpioidBut').addEventListener('click', OpioidData);
  document.getElementById('ObesityBut').addEventListener('click', ObesityData);    

  // automatically draw Ohio county map by default
  drawOhioMap();

}






// Map Slider function
function sliderChange() {
  console.log('slider used: ' + slider.getValue());

}  


function toggleChartMap() {
  console.log('clicked map-chart toggle button');

  if (drawMaps) {    // switch to graphs
    document.getElementById('chartMapButton').innerHTML = "&nbsp;Maps&nbsp;&nbsp;";
    document.getElementById('chartMapButton').classList.remove('btn-outline-dark');
    document.getElementById('chartMapButton').classList.add('btn-outline-primary');        
    drawMaps = false;
  } else {
    document.getElementById('chartMapButton').innerHTML = "Charts";
    document.getElementById('chartMapButton').classList.remove('btn-outline-primary');
    document.getElementById('chartMapButton').classList.add('btn-outline-dark');     
    drawMaps = true;
  }


}


// United States Map button function
function USData() {
  console.log('clicked United States button');
  dataLocation = 'us';
  updateButtonGroup1('USBut');

  if (drawMaps) {
    // draw U.S. maps
    if (dataType == 'life') {
    
    } else if (dataType == 'opioid') {

    } else {  // dataType == 'obesity'

    }

  } else { // draw U.S. charts

    if (dataType == 'life') {

    } else if (dataType == 'opioid') {

    } else {  // dataType == 'obesity'

    }    
  }   

}


// Ohio map button function
function OhioData() {
  console.log('clicked Ohio button');
  dataLocation = 'ohio';
  updateButtonGroup1('OhioBut');

  if (drawMaps) {
    // draw Ohio maps
    if (dataType == 'life') {
      drawOhioMap();
    } else if (dataType == 'opioid') {

    } else {  // dataType == 'obesity'

    }

  } else { // draw Ohio charts

    if (dataType == 'life') {

    } else if (dataType == 'opioid') {

    } else {  // dataType == 'obesity'

    }    
  }  



}


// Franklin County map button function
function FranklinData() {
  console.log('clicked Franklin County button');  
  dataLocation = 'franklin';
  updateButtonGroup1('FranklinBut');

  if (drawMaps) {
    // draw Franklin County maps
    if (dataType == 'life') {

    } else if (dataType == 'opioid') {

    } else {  // dataType == 'obesity'

    }

  } else { // draw Franklin County charts

    if (dataType == 'life') {

    } else if (dataType == 'opioid') {

    } else {  // dataType == 'obesity'

    }    
  }     

}


function LifeExpectData() {
  console.log('clicked Life Expectancy Data button');
  dataType = 'life';
  updateButtonGroup2('LifeBut');

  if (drawMaps) {
    // draw life expectancy maps
    if (dataLocation == 'franklin') {

    } else if (dataLocation == 'ohio') {

    } else {  // dataLocation == 'us'

    }

  } else { // draw life expectancy charts

    if (dataLocation == 'franklin') {

    } else if (dataLocation == 'ohio') {

    } else {  // dataLocation == 'us'

    }    
  }     

}


function OpioidData() {
  console.log('clicked Opioid Data button');
  dataType = 'opioid';
  updateButtonGroup2('OpioidBut'); 

  if (drawMaps) {
    // draw opioid maps
    if (dataLocation == 'franklin') {

    } else if (dataLocation == 'ohio') {

    } else {  // dataLocation == 'us'

    }

  } else { // draw opioid charts

    // draw opioid charts
    if (dataLocation == 'franklin') {

    } else if (dataLocation == 'ohio') {

    } else {  // dataLocation == 'us'

    }    
  }  

}


function ObesityData() {
  console.log('clicked Obesity Data button');
  dataType = 'obesity';
  updateButtonGroup2('ObesityBut');

  if (drawMaps) {
    // draw obesity maps
    if (dataLocation == 'franklin') {

    } else if (dataLocation == 'ohio') {

    } else {  // dataLocation == 'us'

    }

  } else { // draw obesity charts

    // draw obesity charts
    if (dataLocation == 'franklin') {

    } else if (dataLocation == 'ohio') {

    } else {  // dataLocation == 'us'

    }    
  }

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
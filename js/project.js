
// global variables
var mapToggle = true;

// main function called from index.html homepage
function landingPageStart() {

  console.log('in landingPageStart()');

  // create slider object
  slider = $('#mapSlider').slider()
                              .on('slide', sliderChange)
                              .data('slider');

  // map to graph toggle button event listener
  document.getElementById('graphMapButton').addEventListener('click', toggleGraphMap);  

  // map button event listeners
  document.getElementById('USMapBut').addEventListener('click', USMap);
  document.getElementById('OhioMapBut').addEventListener('click', OhioMap);
  document.getElementById('FranklinMapBut').addEventListener('click', FranklinMap);

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


function toggleGraphMap() {
  console.log('clicked map-graph toggle button');

  if (mapToggle) {    // switch to graphs
    document.getElementById('graphMapButton').innerHTML = "&nbsp;Maps&nbsp;&nbsp;";
    document.getElementById('graphMapButton').classList.remove('btn-outline-dark');
    document.getElementById('graphMapButton').classList.add('btn-outline-primary');        
    mapToggle = false;
  } else {
    document.getElementById('graphMapButton').innerHTML = "Graphs";
    document.getElementById('graphMapButton').classList.remove('btn-outline-primary');
    document.getElementById('graphMapButton').classList.add('btn-outline-dark');     
    mapToggle = true;
  }


}


// United States Map button function
function USMap() {
  console.log('clicked United States Map button');
  updateButtonGroup1('USMapBut'); 

}


// Ohio map button function
function OhioMap() {
  console.log('clicked Ohio Map button');
  updateButtonGroup1('OhioMapBut');

  drawOhioMap();

}


// Franklin County map button function
function FranklinMap() {
  console.log('clicked Franklin County Map button');  
  updateButtonGroup1('FranklinMapBut');     

}


function LifeExpectData() {
  console.log('clicked Life Expectancy Data button'); 
  updateButtonGroup2('LifeBut');     

}


function OpioidData() {
  console.log('clicked Opioid Data button');  
  updateButtonGroup2('OpioidBut'); 

}


function ObesityData() {
  console.log('clicked Obesity Data button');  
  updateButtonGroup2('ObesityBut'); 

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
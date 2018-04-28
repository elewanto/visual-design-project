
/************************************************************************************************/
// main function called from index.html homepage
function drawStart() {

  console.log('in landingPageStart()');

  // automatically draw side-by-side U.S and Ohio county map by default
  drawMaps();
  display_image(0);
}

/************************************************************************************************/
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
    case 0: img.src = 'images/LE_temporal_Cbus.png';
            link1 = "";
            link2 = 'data/le_data/LE_ParallelCord.csv';
            break;
    case 1: img.src = 'images/LE_US_gender_race.png';
            link1 = "";
            link2 = 'data/le_data/NCHS_-_Death_rates_and_life_expectancy_at_birth.csv';
            break;
    case 2: img.src = 'images/LE_physical_activity_Cbus.png';
            link1 = 'data/le_data/IHME_county_data_LifeExpectancy_OHIO.csv';
            link2 = 'data/le_data/IHME_county_data_PhysicalActivity_OHIO.csv';
            break;
    case 3: img.src = 'images/LE_obesity_Cbus.png';
            link1 = 'data/le_data/IHME_county_data_LifeExpectancy_OHIO.csv';
            link2 = 'data/le_data/IHME_county_data_Obesity_OHIO.csv';
            break;
    default:
            break; 
  }

  var parentDiv2 = document.getElementById('dataSource');
  parentDiv2.setAttribute("top", img.height);
  if(link1 != ""){
    var anchorTag = document.createElement('a');
    anchorTag.setAttribute("href", link1); 
    anchorTag.setAttribute("style", "float:left");
    anchorTag.innerHTML = "Data Source";
    parentDiv2.appendChild(anchorTag);
  }

  var anchorTag = document.createElement('a');
  anchorTag.setAttribute("href", link2); 
  anchorTag.setAttribute("style", "float:right");
  anchorTag.innerHTML = "Data Source";
  parentDiv2.appendChild(anchorTag);
}

function LE_MF_Gap(img_id){
  console.log('LE_MF_Gap()')

  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  oldDataSrc = document.getElementById('dataSource');
  removeChildren(oldDataSrc);

  var img1 = new Image();
  var img2 = new Image();
  var parentDiv = document.getElementById('chartDiv');
  img1.onload = function() {
                parentDiv.appendChild(img1);
                imgNode = parentDiv.childNodes[0];
                imgNode.setAttribute('id', 'chartImage');
                imgNode.setAttribute('class', 'center-block');
                imgNode.setAttribute('width', img1.width);  
  };
  img2.onload = function() {
                parentDiv.appendChild(img2);
                imgNode = parentDiv.childNodes[1];
                imgNode.setAttribute('id', 'chartImage');
                imgNode.setAttribute('class', 'center-block');
                imgNode.setAttribute('width', img2.width);  
  };
  switch(parseInt(img_id)){
    case 0: img1.src = 'images/LE_Q1_US.png';
            img2.src = 'images/LE_Q4_US.png';
            link = "data/le_data/LE_M_F_States_Income_2015.csv";
            break;
    case 1: img1.src = 'images/LE_Q1_Cbus.png';
            img2.src = 'images/LE_Q4_Cbus.png';
            link = "data/le_data/LE_M_F_County_Income_2015.csv";
            break;
    default:
            break; 
  }
  var parentDiv2 = document.getElementById('dataSource');
  parentDiv2.setAttribute("top", img1.height+img2.height-40);

  var anchorTag1 = document.createElement('a');
  anchorTag1.setAttribute("href", link); 
  anchorTag1.setAttribute("style", "float:right");
  anchorTag1.innerHTML = "Data Source";
  parentDiv2.appendChild(anchorTag1);
}

function LE_income_OH() {
  console.log('LE_income_OH()')

  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  oldDataSrc = document.getElementById('dataSource');
  removeChildren(oldDataSrc);

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1200 800')
                .classed('svg-content', true)
                .attr('overflow', 'visible');

  var chartGroup = chartSvg.append('g')
                            .attr('id', 'chartF')
                            .attr('transform', 'translate(5, 0)');
  chartSvg.append('g')
          .attr('id', 'chartM')
          .attr('transform', 'translate(5, 450)');

  drawFIncomeChartstart();
  drawMIncomeChartstart();

  var parentDiv2 = document.getElementById('dataSource');
  parentDiv2.setAttribute("top", 1200);
  var anchorTag = document.createElement('a');
  anchorTag.setAttribute("href", "data/le_data/LE_M_F_County_Income_2015.csv"); 
  anchorTag.setAttribute("style", "float:right");
  anchorTag.setAttribute("fill", "darkblue");
  anchorTag.setAttribute("font-size", "18px");
  anchorTag.innerHTML = "Data Source";
  parentDiv2.appendChild(anchorTag); 
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

  drawLEUSMap();
  drawLEOhioMap();
}

// remove document html children of node parameter
function removeChildren(node) {
  console.log('in removeChildren()');

  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}



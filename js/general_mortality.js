
// global variables
var sliderValue = "2015";     //


/************************************************************************************************/
// main function called from index.html homepage
function drawStart() {

  console.log('in landingPageStart()');
  draw_static_word_cloud();
  display_image_mortality(1);
}

/************************************************************************************************/
function draw_static_word_cloud(){
  var img = new Image();
  img.src = 'images/wordcloud.png';

  var parentDiv = document.getElementById('cloud');

  img.onload = function() {
                parentDiv.appendChild(img);
                //console.log(parentDiv.childNodes);
                //imgNode = parentDiv.childNodes[0];
                imgNode = parentDiv.getElementsByTagName("img")[0]
                //console.log(imgNode);
                imgNode.setAttribute('id', 'cloudImage');
                imgNode.setAttribute('class', 'center-block');
                imgNode.setAttribute('width', img.width);    
  };
}

function display_image_mortality(img_id){
  console.log('display_image_mortality()');

  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

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
    case 0: img.src = 'images/Deaths_Race_Cbus.png';
            break;
    case 1: img.src = 'images/mortality_risk_age.png';
            break;
    default:
            break; 
  }
}

function deaths_BW_Gap(img_id){
  console.log('deaths_BW_Gap()')

  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

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
    case 0: img1.src = 'images/Diff_Deaths_White_OH.png';
            img2.src = 'images/Diff_Deaths_Black_OH.png';
            break;
    default:
            break; 
  }
}

function deaths_rural_urban_OH() {
  console.log('deaths_rural_urban_OH()')

  oldChartSvg = document.getElementById('chartDiv');
  removeChildren(oldChartSvg);

  var chartSvg = d3.select('#chartDiv')
                .append('svg')
                .attr('id', 'svgchart')       // svg ID is '#svgchart'
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', '0 0 1200 400')
                .classed('svg-content', true)
                .attr('overflow', 'visible');

  var chartGroup = chartSvg.append('g')
                          .attr('id', 'chartG')
                          .attr('transform', 'translate(5, 0)');

  drawBubbles("data/mortality_data/OH_Rural_Counties_Mortality_rate.csv");
  drawBubbles("data/mortality_data/OH_Urban_Counties_Mortality_Rate.csv");
}

function drawWordCloud(){
  var word_count = {};
  d3.csv("data/mortality_data/Causes_of_death_OH_wordcloud.csv",function(data){
    for (var i = 0; i < data.length; i++){
      word_count[data[i]["Cause of death"]] = +data[i].Deaths/1000;
    }

    var word_entries = d3.entries(word_count);
    var fill = d3.scaleOrdinal(d3.schemeCategory20);
    var width = 1000;
    var height = 1000;
    var xScale = d3.scaleLinear()
                  .domain([0, d3.max(word_entries, function(d) { return d.value; }) ])
                  .range([10,100]);

    d3.layout.cloud().size([width, height])
                    .timeInterval(20)
                    .words(word_entries)
                    .fontSize(function(d) { return xScale(+d.value); })
                    .text(function(d) { return d.key; })
                    .rotate(function() { return ~~(Math.random() * 2) * 90; })
                    .font("Impact")
                    .on("end", draw)
                    .start();

    function draw(words) {
        d3.select("#cloud").append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
              .selectAll("text")
              .data(words)
              .enter().append("text")
              .style("font-size", function(d) { return xScale(d.value) + "px"; })
              .style("font-family", "Impact")
              .style("fill", function(d, i) { return fill(i); })
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .text(function(d) { return d.key; });
        }
        d3.layout.cloud().stop();
  });
}

function drawBubbles(file){

  if(file == "data/mortality_data/OH_Rural_Counties_Mortality_rate.csv"){
    xtransform = 5;
  }else{
    xtransform = 200;
  }

  var diameter = 400;
  var color = d3.scaleOrdinal(d3.schemeCategory20c);
  var pack = d3.pack()
                .size([diameter, diameter])
                .padding(1);

  var bubbles_svg = d3.select('#chartG')
            .append('svg')
            .attr('class', 'bubbles')
            .attr('id', 'bubble-chart')
            .attr('width', 1000)
            .attr('height', 400)
            .attr('transform', 'translate(' +xtransform+ ', 0)');

  var tooltip = d3.select('#tooltip');
  var formatterDec = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2
    });

  d3.csv(file, function(error, data){

      data = data.map(function(d){ 
        d.value = +d["Deaths_2015"]/10; 
        d.Change = +d.Change; 
        if(d.Change < 0)
          d.per = "Decrease";
        else
          d.per = "Increase";
        return d; 
      });

      var nodes = d3.hierarchy({children: data})
                    .sum(function(d) { return d.value; })
                    .sort(function(a, b) { return b.value - a.value; });

      var circle = bubbles_svg.selectAll("circle")
                      .data(pack(nodes).leaves(), function(d){ return d.Change; });

      circle.enter().append("circle")
          .attr("r", function(d){ return d.r; })
          .attr("cx", function(d){  
            if(file == "data/mortality_data/OH_Rural_Counties_Mortality_rate.csv"){return d.x; }
            else {return 600+d.x;}
          })
          .attr("cy", function(d){ return d.y; })
          .attr("fill", function(d,i){ 
            if(d.data.Change > 0){
              return "orange";
            }else{
              return "green"; 
          }})
          .attr("id", function(d){return d.data.County;})
          .on('mouseover',function(d, i) {            // add mouse over function
              tooltip.transition()
                     .duration(200)
                     .style('opacity', 0.9);
              tooltip.html("The number of deaths in <b>"+ d.data.County + "</b> County changed from " + d.data.Deaths_2005 + " in 2005 to " + d.data.Deaths_2015 + " in 2015." + "Thus, noticing <b>"+ d.data.per + "</b> by <b>" + formatterDec.format(100*d.data.Change)+"%</b>")

              d3.select(this)
                .transition()
                .duration(10)
                .attr("opacity", 0.6)
          })
          .on('mouseout', function(d, i) {                // add mouse out function
              tooltip.transition()
                      .duration(40)
                      .style('opacity', 0);
              d3.select(this)
                  .transition()
                  .duration(200)
                  .attr("opacity", 1)
          });
      var text = bubbles_svg.selectAll("text")
                        .data(pack(nodes).leaves()).enter().append("text")
                        .attr("x", function(d){  
                            if(file == "data/mortality_data/OH_Rural_Counties_Mortality_rate.csv"){return d.x; }
                            else {return 600+d.x;}
                        })
                        .attr("y", function(d) {
                          return d.y;
                        })
                        .attr("dx",12)
                        .attr("dy",".35em")
                        .text(function(d){
                          return d.data.County;
                        });
  });
}


function generalBubbleColumbus() {
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

  var linkGroup = chartSvg.append('g')
    .attr('transform', 'translate(1100, 1000)')      
    .append('a')
    .attr("href", "data/general_mortality_data/general_mortality_all_causes_bubble_1999_2016.csv")    
    .append('text')
    .style("fill", "darkblue")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")
    .style("pointer-events", "all")
    .style('cursor', 'pointer')
    .text('Data Source');                  

  drawAllCauseBubble(); 
}


// remove document html children of node parameter
function removeChildren(node) {
  console.log('in removeChildren()');

  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}


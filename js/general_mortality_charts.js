

function drawAllCauseBubble() {


  var canvasWidth = 1200;
  var canvasHeight = 1000;

  var marginLeft = 20;
  var marginRight = 20;
  var marginTop = 100;
  var marginBottom = 20;

  var chartWidth = canvasWidth - marginLeft - marginRight;
  var chartHeight = canvasHeight - marginTop - marginBottom;

  var format = d3.format(',d');

  var pack = d3.pack()                // set size of chart
      //.size([chartWidth, chartHeight])
      .size([1200,1000])
      .padding(1);

  var totalDeaths = 0;

  var tooltip = d3.select('body').append('div').attr('class', 'tooltipTree'); 

  d3.csv("data/general_mortality_data/general_mortality_all_causes_bubble_1999_2016.csv", function(d) {
    d.value = +d.value;
    if (d.value) {
      totalDeaths += d.value;
      return d;
    }
  }, function(error, classes) {
    if (error) throw error;

    var root = d3.hierarchy({children: classes})
        .sum(function(d) { return d.value; })
        .each(function(d) {
          if (id = d.data.id) {
            var id, i = id.lastIndexOf(".");
            d.id = id;
            d.package = id.slice(0, i);
            d.class = id.slice(i + 1);
          }
        });

    var chartGroup = d3.select('#chartG');

    chartGroup.append('g')
              .attr('transform', 'translate(640, 50)')
              .attr('id', '#chartTitle')
              .append('text')
              .text('Columbus All Causes of Death (1999 - 2016)')
              .style('font-size', '32px')
              .attr('class', 'title');

    var color = d3.scaleOrdinal(d3.schemeCategory20b);     



    var node = chartGroup.append('g')
      .attr('transform', 'translate(0, 50)')
      .selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    var circles = node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.package); })
        .style('cursor', 'pointer')
        .on('mousemove', function(d) {
            d3.select(this)   
              .transition()
              //.ease(d3.easeBounce)
              .attr('r', 1.1*d.r)
              .duration(300);
            tooltip.style("left", d3.event.pageX + 10 + "px");
            tooltip.style("top", d3.event.pageY - 20 + "px");
            tooltip.style("display", "inline-block");        
            tooltip.html(d.children ? null : 'Category: ' + d.package.slice(11, d.package.length+1) 
                                            + ' | Type: ' + d.class + ' | ' + d.data.value.toLocaleString('en')
                                            + ' deaths' + ' | ' + (d.data.value*100/totalDeaths).toLocaleString('en') + '% of ' 
                                            + totalDeaths.toLocaleString('en') + ' total deaths');
        }).on('mouseout', function(d) {
            d3.select(this)
              .transition()
              .ease(d3.easeBounce)
              .attr('r', d.r)
              .duration(300);          
          tooltip.style('display', 'none');
        });



    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
        .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });

    node.append("text")
        .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
        .selectAll("tspan")
        .data(function(d) { 
          var fontSize = 14;
          var maxLenPerWord = parseInt(d.r/6.5);
          var maxWord = parseInt(d.r/15);
          //var label = d.class.slice(0, maxLen);
          var label = d.class
          if (maxLenPerWord == 0 || maxWord == 0) {
            return ([{'wordV':"", 'sizeF':fontSize}]);
          }
          if (d.r > 100) {
            fontSize = 24;
          } else if (d.r > 80) {
            fontSize = 22;
          } else if (d.r > 50){
            fontSize = 20;
          } else if (d.r > 20) {
            fontSize = 18;
          } else {
            fontSize = 16;
          }
          var labelJoin = [];
          var labelArr = label.split(" ");
          if (maxWord > 3) {
            maxWord = 3;
          }          
          labelArr.forEach(function(d) {
            if (maxWord > 0) {
              if (d.length > maxLenPerWord) { 
                labelJoin.push({'wordV': d.slice(0, maxLenPerWord+1), 'sizeF': fontSize});
              } else {
                labelJoin.push({'wordV': d.slice(0, maxLenPerWord+1), 'sizeF': fontSize});
              }
              maxWord--;              
            }
          })
          return labelJoin;
        })
        .enter().append("tspan")       
        .style('font-size', function(d) {
          return d.sizeF + 'px';
        })
        .style('font-weight', 'bold')
        .style('cursor', 'pointer')        
        .attr("x", 0)
        .attr("y", function(d, i, nodes) { return 20 + (i - nodes.length / 2 - 0.5) * (d.sizeF-2); })
        .text(function(d) { return d.wordV; });

  });

}







// based on Mike Bostick's Sunburst Template
function drawAllCauseSunburst() {

  var width = 1000,
      height = 850,
      radius = (Math.min(width, height) / 2) - 10;

  var formatNumber = d3.format(",d");

  var x = d3.scaleLinear()
      .range([0, 2 * Math.PI]);

  var y = d3.scaleSqrt()
      .range([0, radius]);

  var color = d3.scaleOrdinal(d3.schemeCategory20b);

  var partition = d3.partition();

  var arc = d3.arc()
      .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
      .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
      .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
      .outerRadius(function(d) { return Math.max(0, y(d.y1)); });




  var chartGroup = d3.select('#chartG')
      .append('g')
      .attr("transform", "translate(600, 550)");      

  var titleGroup = d3.select('#chartG')
            .append('g')
            .attr('transform', 'translate(620, 50)')
            .attr('id', '#chartTitle')
            .append('text')
            .text('Columbus All Causes of Death (1999 - 2016)')
            .style('font-size', '32px')
            .attr('class', 'title');


  var root = {
    "name":"All Causes",
    "children":[]
  };

  d3.csv("data/general_mortality_data/general_mortality_all_causes_sunburst_1999_2016.csv", function(data){
    var parent = root;
    var current = root;
    var totalDeaths = 122394;    
    data.forEach(function(d){     // iterate through each row of csv data

      value = +d.value;
      //totalDeaths += value;
      if (d.category == "All Causes") {
        root.children[root.children.length] = {"name":d.name, "children":[]};
        current = root.children[root.children.length-1];
        parent = root;     
      } else if (value == 0) {
        if (current.name == d.category) {   // new category child of current
          current.children[current.children.length] = {"name":d.name, "children":[]};
          parent = current;
          current = current.children[current.children.length-1];        
        } else {  // new category of parent
          current = parent;
          parent = root;
          current.children[current.children.length] = {"name":d.name, "children":[]};
        }
      } else if (current.name == d.category) {      
        current.children.push({"name":d.name,"size":+d.value});
      } else if (parent.name == d.category) {   
        current = parent;
        parent = root;
        current.children.push({"name":d.name,"size":+d.value});
      }

    });
  
  var tooltip = d3.select('body').append('div').attr('class', 'tooltipTree');       

    root = d3.hierarchy(root);


    root.sum(function(d) { return d.size; });

  var slice = chartGroup.selectAll("path")
        .data(partition(root).descendants())
        .enter().append('g');

  slice.append("path")
        .attr("d", arc)
        .style('stroke', '#fff')
        .style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })
        .on('mousemove', function(d) {
            tooltip.style("left", d3.event.pageX + 10 + "px");
            tooltip.style("top", d3.event.pageY - 20 + "px");
            tooltip.style("display", "inline-block");        
            if (d.parent != null) {
              //console.log(d);
              tooltip.html('Category: ' + d.parent.data.name 
                                            + ' | Type: ' + d.data.name + ' | ' + d.value.toLocaleString('en')
                                            + ' deaths' + ' | ' + (d.value*100/totalDeaths).toLocaleString('en') + '% of ' 
                                            + totalDeaths.toLocaleString('en') + ' total deaths');
            } else {
              tooltip.html('Type: ' + d.data.name + ' | ' + d.value.toLocaleString('en')
                                            + ' deaths' + ' | ' + (d.value*100/totalDeaths).toLocaleString('en') + '% of ' 
                                            + totalDeaths.toLocaleString('en') + ' total deaths');
            }
        }).on('mouseout', function(d) {
          tooltip.style('display', 'none');
        })        
        .on("click", click)
        //.append("title")
        //.text(function(d) { return d.data.name + "\n" + formatNumber(d.value); });

    slice.append("text")
        .attr('transform', function(d) {
              //console.log(d);
              if (d.depth > 0) {
                var t = (180 / Math.PI * (arc.startAngle()(d) + arc.endAngle()(d)) / 2 - 90);
                var rotAng = 0;
                if (t > 90) {
                  rotAng = t - 180;
                }
                return "translate(" + arc.centroid(d) + ")" + "rotate(" + rotAng + ")";
              } else {
                return null;
              }
        })
        .style('font-weight', 'bold')
        //.style('cursor', 'pointer')        
        .style('font-size', '14px')
        .style('stroke', 'black')
        .style('stroke-width', 5)
        //.attr("x", 0)
        //.attr("y", 0)
        //.text(function(d) { console.log(d.data.name); return d.data.name; });



  }); // end csv function

  function click(d) {
    chartGroup.transition()
        .duration(750)
        .tween("scale", function() {
          var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
              yd = d3.interpolate(y.domain(), [d.y0, 1]),
              yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
          return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
        })
      .selectAll("path")
        .attrTween("d", function(d) { return function() { return arc(d); }; });
  }

  d3.select(self.frameElement).style("height", height + "px");







}

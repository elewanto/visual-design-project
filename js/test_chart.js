/* Author:  Eric Lewantowicz
 * Course:  CSE 5544 Data Visualization
 * Project: Lab 3 - Visualization of 2016 Consumer Expenditure Data Using D3
 * Date: 3/1/2018
 * Dependences: lab.css, lab3.html
 */


function drawBarChart5start() {

console.log("in chart");
// Problem 5
d3.csv("js/2016ConsumerTopLevelProb5.csv", drawBarCharts5);

}



///////////////////////////////////////////////////////////////////////////////////////////////////////
// Problem 5

// function to draw top-level bar charts
// param: error: is null when operation is successful

function drawBarCharts5(error, data) {
  
  var group = d3.select('#chartG')
  // add overall title group
  .append('g')
  .attr('transform', function(d) {
    return "translate(500,50)";
  })
  .attr('id', function(d) {
    return "g5mastertitle";
  });

  // create subtitle group
  d3.select('#chartG')
  .append('g')
  .attr('transform', function(d) {
    return "translate(100,120)";
  })
  .attr('id', function(d) {
    return "g5subtitle";
  });

  // create 6 svg groups for barcharts
  for (k = 0; k < 6; k++) {
    // add bar chart groups
    d3.select("#chartG")
    .append("g")
    .attr('transform', function(d) {
      xtrans = 0;
      switch(k) {
        case 0:
          xtrans = 0;
          break;
        case 1:
          xtrans = 190;      
          break;
        case 2:
          xtrans = 240 + 300 * (k - 1);
          break;
        case 3:
          xtrans = 160 + 300 * (k - 1);
          break;
        case 4:
          xtrans = 40 + 300 * (k - 1);
          break;
        case 5:
          xtrans = 50 + 260 * (k - 1);
          break;
        default:
          break;
      }
      return "translate(" + xtrans + "," + 150 + ")";
    })
    .attr('id', function(d) {
      return "g5" + k;
    });      
  }
  // create chart master label 
  d3.select('#chartG').select('#g5mastertitle')
    .append("text")
    .text("Problem 5: Annual Spending per Top-Level Category by Income Groups (2016) (Sorted by Highest Income Group)")
    .attr("class", "title");

  d3.select('#chartG').select('#g5subtitle')
    .append("text")
    .text("Income Groups")
    .attr("class", "title");    

  // left side chart labels
  var barHeightStep = 25;
  var vertPad = 10;
  var barHeight = 25;  
  d3.select('#chartG').select('#g50')
    .selectAll('text')
    .data(data)
    .enter().append('text')
    .attr('x', 180)   // relative offset from group boundary
    .attr('y', function(d, i) {
      if (i == 1 || i == 2 || i == 16) {
        barHeight += 2 * barHeightStep;
        return barHeight - vertPad;
      } else if (i != 0) {
        barHeight += barHeightStep;
        return barHeight - vertPad;
      }
      return barHeight;
    })
    .style('font-size', 14)
    .style('text-anchor', 'end')
    .text(function(d, i) {
      if (d.Item != "Label") {
        return d.Item; 
      } else {
        return " ";
      }
    });

  var scaleIncome = .01;
  var scalePeople = 50;
  // draw bar charts and labels
  for (j = 0; j < 5; j++) {
         
    var headings = ["Highest 20%", "Fourth 20%", "Third 20%", "Second 20%", "Lowest 20%"];
    var group = d3.select('#chartG').select('#g5' + (j+1));
    var barHeightStep = 25;
    var barHeight = 0;
    var vertPad = 10;    
    // draw rectangles
    group.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', 0) // relative to group boundary
      .attr('y', function(d, i) {
        if (i == 1 || i == 2 || i == 16) {
          barHeight += 2 * barHeightStep;
          return barHeight;
        } else if (i != 0) {
          barHeight += barHeightStep;
          return barHeight;
        }
        return barHeight;
      }) 
      .attr('width', function(d, i) {
        var scale = (d.Index == 16) ? scalePeople : scaleIncome;
        if (d.Index == 0) {
          return 0;
        }
        var baseNum = 0;
        switch(j) {
          case 0:  
            baseNum = d.Highest;
            break;
          case 1:
            baseNum = d.Fourth;
            break;
          case 2:
            baseNum = d.Third;
            break;
          case 3:
            baseNum = d.Second;
            break;
          case 4:
            baseNum = d.Lowest;
            break;
          default:
            break;      
        }  
        return baseNum * scale;
      })
      .attr('height', barHeightStep-2)
      .style('fill', function(d, i) {
        if (i == 1 || i == 16) {
          return 'goldenrod';
        }
        var color = 'khaki';
        switch(j) {
          case 0:  
            color = (d.Highest > 16556) ? 'lightcoral' : 'khaki';
            break;
          case 1:
            color = (d.Fourth > 7014) ? 'lightcoral' : 'khaki';            
            break;
          case 2:
            color = (d.Third > 4214) ? 'lightcoral' : 'khaki';            
            break;
          case 3:
            color = (d.Second > 2415) ? 'lightcoral' : 'khaki';            
            break;
          case 4:
            color = (d.Lowest > 986) ? 'lightcoral' : 'khaki';            
            break;
          default:
            break;      
        }          
        return color;
      });


    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    var formatterDec = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 1
    });

    // create bar labels
    barHeight = 25;    
    group.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .attr('x', 25) // relative to group boundary
      .attr('y', function(d, i) {
      if (i == 1 || i == 2 || i == 16) {
        barHeight += 2 * barHeightStep;
        return barHeight - vertPad;
      } else if (i != 0) {
        barHeight += barHeightStep
        return barHeight - vertPad;
      }
      return barHeight;
    })
    .style('font-size', 14)
    .style('text-anchor', 'start')
    .text(function(d, i) {
        var baseNum = 0
        switch(j) {
          case 0:
            baseNum = d.Highest;
            break;
          case 1:
            baseNum = d.Fourth;
            break;
          case 2:
            baseNum = d.Third;
            break;
          case 3:
            baseNum = d.Second;
            break;
          case 4:
            baseNum = d.Lowest;
            break;
          default:
            break;      
        }
        if (d.Item == "Label") {
          return baseNum;
        }
        if (i == 16) {
          return formatterDec.format(baseNum);
        } else {
          return formatter.format(baseNum);
        }
    });

  }  // end for loop

} // end drawBarCharts()

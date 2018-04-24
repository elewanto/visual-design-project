function drawIncomeChartstart() {
  console.log("in chart");
  d3.csv("/data/le_data/LE_M_F_Cbus_Counties_Income_2015.csv", drawIncomeCharts);
}

function drawIncomeCharts(error, data) {

  var group = d3.select('#chartG')
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
  for (k = 0; k < 5; k++) {
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
          xtrans = 200;      
          break;
        case 2:
          xtrans = 140 + 300 * (k - 1);
          break;
        case 3:
          xtrans = 90 + 300 * (k - 1);
          break;
        case 4:
          xtrans = 60 + 300 * (k - 1);
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
    .text("Female Life Expectancy of Different Income Levels (Columbus Counties)")
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
      if (i == 1) {
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
      if (d.County != "Average") {
        return d.County; 
      } else {
        return "Avg in Columbus";
      }
    });

  for (j = 0; j < 4; j++) {         
    var headings = ["Income Quartile 1", "Income Quartile 2", "Income Quartile 3", "Income Quartile 4"];
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
        if (i == 1) {
          barHeight += 2 * barHeightStep;
          return barHeight;
        } else if (i != 0) {
          barHeight += barHeightStep;
          return barHeight;
        }
        return barHeight;
      }) 
      .attr('width', function(d, i) {
        var scale = 2;
        if (d.Index == 0) {
          return 0;
        }
        var baseNum = 0;
        switch(j) {
          case 0:  
            baseNum = d.le_raceadj_q1_F;
            break;
          case 1:
            baseNum = d.le_raceadj_q2_F;
            break;
          case 2:
            baseNum = d.le_raceadj_q3_F;
            break;
          case 3:
            baseNum = d.le_raceadj_q4_F;
            break;
          default:
            break;      
        }  
        return baseNum * scale;
      })
      .attr('height', barHeightStep-2)
      .style('fill', function(d, i) {
        if (i == 0) {
          return 'goldenrod';
        }
        var color = 'khaki';
        switch(j) {
          case 0:  
            color = (d.le_raceadj_q1_F > 81.25) ? 'lightcoral' : 'khaki';
            break;
          case 1:
            color = (d.le_raceadj_q2_F > 84.51) ? 'lightcoral' : 'khaki';            
            break;
          case 2:
            color = (d.le_raceadj_q3_F > 85.52) ? 'lightcoral' : 'khaki';            
            break;
          case 3:
            color = (d.le_raceadj_q4_F > 87.38) ? 'lightcoral' : 'khaki';            
            break;
          default:
            break;      
        }          
        return color;
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
      if (i == 1) {
        barHeight += 2 * barHeightStep;
        return barHeight - vertPad;
      } else if (i != 0) {
        barHeight += barHeightStep
        return barHeight - vertPad;
      }else{
        return barHeight - vertPad;
      }

    })
    .style('font-size', 14)
    .style('text-anchor', 'start')
    .text(function(d, i) {
        var baseNum = 0
        switch(j) {
          case 0:
            baseNum = d.le_raceadj_q1_F;
            break;
          case 1:
            baseNum = d.le_raceadj_q2_F;
            break;
          case 2:
            baseNum = d.le_raceadj_q3_F;
            break;
          case 3:
            baseNum = d.le_raceadj_q4_F;
            break;
          default:
            break;      
        }
        if (d.County == "County") {
          return baseNum;
        }
        return formatterDec.format(baseNum);
    });

  }  // end for loop

} // end drawBarCharts()

function drawFIncomeChartstart() {
  console.log("in chart");
  d3.csv("data/le_data/LE_F_Cbus_Counties_Income_2015.csv", drawIncomeCharts);
}

function drawMIncomeChartstart() {
  console.log("in chart");
  d3.csv("data/le_data/LE_M_Cbus_Counties_Income_2015.csv", drawIncomeCharts);
}

function drawIncomeCharts(error, data) {
  var str = 'F';
  var str_txt = "Female";
  var ytrans_g = 30;
  if(data[1]["le_raceadj_q1_F"] == ""){
    str='M';
    str_txt = "Male";
  }
  var group = d3.select('#chart'+str)
                .append('g')
                .attr('transform', function(d) {
                  return "translate(500,"+ ytrans_g +")";
                })
                .attr('id', function(d) {
                  return "g5mastertitle";
                });

  // create 6 svg groups for barcharts
  for (k = 0; k < 5; k++) {
    // add bar chart groups
    d3.select("#chart"+str)
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
      return "translate(" + xtrans + "," + 50 + ")";
    })
    .attr('id', function(d) {
      return "g5" + k;
    });      
  }
  // create chart master label 
  d3.select('#chart'+str).select('#g5mastertitle')
    .append("text")
    .text(str_txt +" Life Expectancy of Different Income Levels")
    .attr("class", "subtopic") 
    
  // left side chart labels
  var barHeightStep = 25;
  var vertPad = 10;
  var barHeight = 25;

  d3.select('#chart'+str).select('#g50')
    .selectAll('text')
    .data(data)
    .enter().append('text')
    .attr('x', 180)   // relative offset from group boundary
    .attr('y', function(d, i) {
      if (i == 2) {
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
      if (d.County == "Average") {
        return "Avg in Columbus"; 
      }else if (d.County == "Label") {
        return " "; 
      } else {
        return d.County;
      }
    });

  for (j = 0; j < 4; j++) {         
    var group = d3.select('#chart'+str).select('#g5' + (j+1));
    var barHeightStep = 25;
    var barHeight = 0;
    var vertPad = 10;    
    var xScale = d3.scaleLinear()
                  .domain([70, 90 ])
                  .range([0, 200]);

    group.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', 0) // relative to group boundary
      .attr('y', function(d, i) {
        if (i == 2) {
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
            baseNum = d["le_raceadj_q1_"+ str];
            break;
          case 1:
            baseNum = d["le_raceadj_q2_"+ str];
            break;
          case 2:
            baseNum = d["le_raceadj_q3_"+ str];
            break;
          case 3:
            baseNum = d["le_raceadj_q4_"+ str];
            break;
          default:
            break;      
        }  
        return xScale(baseNum);
      })
      .attr('height', barHeightStep-2)
      .style('fill', function(d, i) {
        if (i == 1) {
          return 'goldenrod';
        }
        var color = 'lightcoral';
        switch(j) {
          case 0:  
            color = (d["le_raceadj_q1_"+ str] > data[1]["le_raceadj_q1_"+ str]) ? 'yellowgreen': 'lightcoral';
            break;
          case 1:
            color = (d["le_raceadj_q2_"+ str] > data[1]["le_raceadj_q2_"+ str]) ? 'yellowgreen': 'lightcoral';          
            break;
          case 2:
            color = (d["le_raceadj_q3_"+ str] > data[1]["le_raceadj_q3_"+ str]) ? 'yellowgreen': 'lightcoral';            
            break;
          case 3:
            color = (d["le_raceadj_q4_"+ str] > data[1]["le_raceadj_q4_"+ str]) ? 'yellowgreen': 'lightcoral';            
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
      if (i == 2) {
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
            baseNum = d["le_raceadj_q1_"+ str];
            break;
          case 1:
            baseNum = d["le_raceadj_q2_"+ str];
            break;
          case 2:
            baseNum = d["le_raceadj_q3_" + str];
            break;
          case 3:
            baseNum = d["le_raceadj_q4_" + str];
            break;
          default:
            break;      
        }
        if (d.County == "Label") {
          return baseNum;
        }
        return formatterDec.format(baseNum);
    });
  }
}

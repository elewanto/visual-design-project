/* Author:  Mike
 * Course:  CSE 5544 Data Visualization
 */


function drawColumbusBubbleChart() {

        console.log('columbus_bar_chart()')


        // change the id for the bar chart <g> tag
	var group = d3.select('#chartG')
	  // add overall title group
	  .append('g')

          // set the scality for the chart
	  .attr('transform', function(d) {
	    return "translate(0,50) scale(1)";
	  })
	  .attr('id', function(d) {
	    return "columbus_bubble";
	  });


	// set the size for the graph
	var margin = {top: 100, right: 80, bottom: 190, left: 90},
    	    width = 1300 - margin.left - margin.right,
    	    height = 1000 - margin.top - margin.bottom;


	// set the x, y axises range for the scatter chart
	var xScale = d3.scalePoint().range([0, 900]), 
	    yScale = d3.scaleLinear().range([height - 100, 0]);

	var rScale = d3.scaleLinear().range([5, 10]);

	// setup x axis and y axis position
	var xAxis = d3.axisBottom().scale(xScale);
	var yAxis = d3.axisLeft().scale(yScale);


	// square root scale.
	var radius = d3.scaleSqrt()
		.range([2,5]);

	// declare the properties for the div used for the tooltips

	var div = d3.select("body").append("div")   
	    .attr("class", "tooltip")             
	    .style("opacity", 0); 

	// set the color for the pie chart
         var color = d3.scaleOrdinal()
    .range([ "#0066cc", "#ff99cc", "#00ffcc", "#ffcc66", "#00ccff", "#ff6666"]);


	// create a svg image for the scatter plot
	var svg = d3.select('#columbus_bubble')
     		    .attr('width', width)
  		    .attr('height', height)
  		    .append('g')
  		    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

	// read the csv data file
        d3.csv("data/obesity_data/Columbus_obesity_by_gender.csv", function(d, i) {
		d['2001_M'] = +d['2001_M'];
		d['2001_F'] = +d['2001_F'];
		d['2009_M'] = +d['2009_M'];
		d['2009_F'] = +d['2009_F'];
		d['2011_M'] = +d['2011_M'];
		d['2011_F'] = +d['2011_F'];
	        return d;
	}, function(error, data) {

		// throw the error message if no file is found
   		if (error) return console.error(error);



		// set up domain for the x, y axis
		xScale.domain(['', 'Delaware','Fairfield','Franklin','Hocking','Licking',
		'Madison','Morrow','Perry','Pickaway','Union']);

		yScale.domain([19, 43]);

		rScale.domain(d3.extent(data, function(d){
			return d['2001_M'];
		}));

		// set up the radius for the circle
		radius.domain(d3.extent(data, function(d){
			return d['2001_M']/10;
		}));
	    	
		// x-axis position translated to (0,height)
		svg.append('g')
			.attr('transform', 'translate(0,' + 580 + ')')
			.attr('class', 'x axis')
			.call(xAxis);

		// y-axis position translated to (0,0)
		svg.append('g')
			.attr('transform', 'translate(0,0)')
			.attr('class', 'y axis')
			.call(yAxis);

		var g1 = svg.append('g');
		// draw all circle on the scatter plot
		var bubble_2001_M = g1.selectAll('.circle')
			.data(data)
			.enter().append('circle')
			.attr('class', 'circle')
			.attr('cx', function(d){return xScale(d['County']);})
			.attr('cy', function(d){ return yScale(d['2001_M']); })
			.attr('r', function(d, i){ return rScale(d['2001_M']); })
			.style('fill', function(d, i){ 
					return color(0); 
				
			})

		      // add mouseover functionality
		      .on("mouseover", function(d, i) {	
	
			   div.transition()		
				.duration(200)		
				.style("opacity", 9);
			})
		      .on("mouseout", function(d) {		
			   div.transition()		
				.duration(500)		
				.style("opacity", 0);	
			   });

		var g2 = svg.append('g');
		// draw all circle on the scatter plot
		var bubble_2001_F = g2.selectAll('.circle')
			.data(data)
			.enter().append('circle')
			.attr('class', 'circle')
			.attr('cx', function(d){
				return xScale(d['County']);})
			.attr('cy', function(d){ return yScale(d['2001_F']); })
			.attr('r', function(d){ return rScale(d['2001_F']); })
			.style('fill', function(d, i){ 
					return color(1); 
			});


		var g3 = svg.append('g');
		// draw all circle on the scatter plot
		var bubble_2009_M = g3.selectAll('.circle')
			.data(data)
			.enter().append('circle')
			.attr('class', 'circle')
			.attr('cx', function(d){
				return xScale(d['County']);})
			.attr('cy', function(d){ return yScale(d['2009_M']); })
			.attr('r', function(d){ return rScale(d['2009_M']); })
			.style('fill', function(d, i){ 
					return color(2); 
			});

		var g4 = svg.append('g');
		// draw all circle on the scatter plot
		var bubble_2009_F = g4.selectAll('.circle')
			.data(data)
			.enter().append('circle')
			.attr('class', 'circle')
			.attr('cx', function(d){
				return xScale(d['County']);})
			.attr('cy', function(d){ return yScale(d['2009_F']); })
			.attr('r', function(d){ return rScale(d['2009_F']); })
			.style('fill', function(d, i){ 
					return color(3); 
			});

		var g5 = svg.append('g');
		// draw all circle on the scatter plot
		var bubble_2011_M = g5.selectAll('.circle')
			.data(data)
			.enter().append('circle')
			.attr('class', 'circle')
			.attr('cx', function(d){
				return xScale(d['County']);})
			.attr('cy', function(d){ return yScale(d['2011_M']); })
			.attr('r', function(d){ return rScale(d['2011_M']); })
			.style('fill', function(d, i){ 
					return color(4); 
			});


		var g6 = svg.append('g');
		// draw all circle on the scatter plot
		var bubble_2011_F = g6.selectAll('.circle')
			.data(data)
			.enter().append('circle')
			.attr('class', 'circle')
			.attr('cx', function(d){
				return xScale(d['County']);})
			.attr('cy', function(d){ return yScale(d['2011_F']); })
			.attr('r', function(d){ return rScale(d['2011_F']); })
			.style('fill', function(d, i){ 
					return color(5); 
			});


		// add title for the bar chart
		  svg.append("text")
		    .attr("x", width / 2 )
		    .attr("y", -50)
		    .attr("font-size", "34px")
		    .style("text-anchor", "middle")
		    .text("Columbus Obesity Rate Scatter Plot");

 		//Create X axis label   
		  svg.append("text")
		    .attr("x", 500 )
		    .attr("y",  620)
		    .style("text-anchor", "middle")
      		    .attr("font", "48px")
		    .text("County");

		  //Create Y axis label
		  svg.append("text")
		    .attr("transform", "rotate(-90)")
		    .attr("y", -50)
		    .attr("x", -270)
		    .attr("dy", "1em")
		    .style("text-anchor", "middle")
		    .style("font", "48px")
		    .text("Obsesity");  

		// Add Legend for the diargram
		   svg.append("text")
    		    .attr("transform","translate(985,375)") 
		    .style("text-anchor", "middle")
		    .text("2001 Male")
		// add legend notation
		   svg.append("circle") // make a matching color rect
		    .attr('cx', 940)
		    .attr('cy', 370)
		    .attr('r', 5)
		    .attr("fill", color(0));

 		svg.append("text")
    		    .attr("transform","translate(995,390)") 
		    .style("text-anchor", "middle")
		    .text("2001 Female")
		// add legend notation
		   svg.append("circle") // make a matching color rect
		    .attr('cx', 940)
		    .attr('cy', 385)
		    .attr('r', 5)
		    .attr("fill", color(1));

 		svg.append("text")
    		    .attr("transform","translate(985,405)") 
		    .style("text-anchor", "middle")
		    .text("2009 Male")
		// add legend notation
		   svg.append("circle") // make a matching color rect
		    .attr('cx', 940)
		    .attr('cy', 400)
		    .attr('r', 5)
		    .attr("fill", color(2));

 		svg.append("text")
    		    .attr("transform","translate(995,420)") 
		    .style("text-anchor", "middle")
		    .text("2009 Female")
		// add legend notation
		   svg.append("circle") // make a matching color rect
		    .attr('cx', 940)
		    .attr('cy', 415)
		    .attr('r', 5)
		    .attr("fill", color(3));


 		svg.append("text")
    		    .attr("transform","translate(985,435)") 
		    .style("text-anchor", "middle")
		    .text("2011 Male")
		// add legend notation
		   svg.append("circle") // make a matching color rect
		    .attr('cx', 940)
		    .attr('cy', 430)
		    .attr('r', 5)
		    .attr("fill", color(4));

 		svg.append("text")
    		    .attr("transform","translate(995,450)") 
		    .style("text-anchor", "middle")
		    .text("2011 Female")
		// add legend notation
		   svg.append("circle") // make a matching color rect
		    .attr('cx', 940)
		    .attr('cy', 445)
		    .attr('r', 5)
		    .attr("fill", color(5));

	});


}

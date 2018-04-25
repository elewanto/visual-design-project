/* Author:  Mike
 * Course:  CSE 5544 Data Visualization
 */


function drawColumbusObesBarChart() {


        console.log('columbus_bar_chart()')

	// Reference the code from: https://bl.ocks.org/mbostock/3887051


        // change the id for the bar chart <g> tag
	var group = d3.select('#chartG')
	  // add overall title group
	  .append('g')
	  .attr('transform', function(d) {
	    return "translate(200,50)";
	  })
	  .attr('id', function(d) {
	    return "columbus_obes_bar_chart";
	  });

	// graph size for SVG
	var svg = d3.select("#columbus_obes_bar_chart"),
	    margin = {top: 20, right: 140, bottom: 30, left: 40},
	    width = 1600 - margin.left - margin.right,
	    height = 450 - margin.top - margin.bottom,
	    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	// Set up the x0 range
	var x0 = d3.scaleBand()
	    .rangeRound([0, width])
	    .paddingInner(0.1);

	// Set up the x1 range
	var x1 = d3.scaleBand()
	    .padding(0.05);

	// Set up the y range
	var y = d3.scaleLinear()
	    .rangeRound([height, 0]);

	// Set up the color range
	var z = d3.scaleOrdinal()
	    .range(["#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	// Define the div for the tooltip
	var div = d3.select("body").append("div")	
	    .attr("class", "tooltip")				
	    .style("opacity", 0);


	// import the data file
	d3.csv("data/obesity_data/Columbus_Obesity.csv", function(d, i, columns) {

	  // convert all data into the integers
	  for (var i = 1, n = columns.length; i < n; ++i) 
		d[columns[i]] = +d[columns[i]];
	  return d;
	}, function(error, data) {
	  if (error) throw error;

	  // extract columns from each row of data
	  var keys = data.columns.slice(1);

	  // set up domain for x0, x1, y
	  x0.domain(data.map(function(d) { return d.County; }));
	  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
	  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

	  // append the g tag from the data
	  g.append("g")
	    .selectAll("g")
	    .data(data)
	    .enter().append("g")
	      .attr("transform", function(d) { return "translate(" + x0(d.County) + ",0)"; })
	    .selectAll("rect")
	    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
	    .enter().append("rect")
	      .attr("x", function(d) { return x1(d.key); })
	      .attr("y", function(d) { return y(d.value); })
	      .attr("width", x1.bandwidth())
	      .attr("height", function(d) { return height - y(d.value); })
	      .attr("fill", function(d) { return z(d.key); })

	    // add mouseover functionality
	     .on("mouseover", function(d) {		
		   div.transition()		
			.duration(200)		
			.style("opacity", 1);		
		   div.html(d.key + "<br/>"  + d.value)
	  		//.style("transform","translate(0, -150)")	
			.style("left", (d3.event.pageX) + "px")		
			.style("top", (d3.event.pageY - 30) + "px");	
			})					
	     .on("mouseout", function(d) {		
			div.transition()		
			.duration(500)		
			.style("opacity", 0);	
		   });

	  // append x axis
	  g.append("g")
	      .attr("class", "axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x0));

	  // append y axis
	  g.append("g")
	      .attr("class", "axis")
	      .call(d3.axisLeft(y).ticks(null, "s"))
	    .append("text")
	      .attr("x", 2)
	      .attr("y", y(y.ticks().pop()) + 0.5)
	      .attr("dy", "0.32em")
	      .attr("fill", "#000")
	      .attr("font-weight", "bold")
	      .attr("text-anchor", "start")
	      .text("Obesity Rate");

	  // add legend
	  var legend = g.append("g")
	      .attr("font-family", "sans-serif")
	      .attr("font-size", 10)
	      .attr("text-anchor", "end")
	    .selectAll("g")
	    .data(keys.slice().reverse())
	    .enter().append("g")
	      .attr("transform", function(d, i) { return "translate(50," + i * 20 + ")"; });

	  // add rectangles for legend
	  legend.append("rect")
	      .attr("x", width - 19)
	      .attr("width", 19)
	      .attr("height", 19)
	      .attr("fill", z);

	  // add texts for legends
	  legend.append("text")
	      .attr("x", width - 24)
	      .attr("y", 9.5)
	      .attr("dy", "0.32em")
	      .text(function(d) { return d; });
	});

} // end drawBarCharts()

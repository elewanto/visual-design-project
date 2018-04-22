var diameter = 500; //max size of the bubbles
var color = d3.scaleOrdinal(d3.schemeCategory20c);
var bubble = d3.pack()
    .size([diameter, diameter])
    .padding(1.5);

var bubbles_svg = d3.select('#bubbles-chart')
				  .append('svg')
				  .attr('class', 'bubbles')
				  .attr('id', 'bubble-chart')
				  .attr('width', 1160)
				  .attr('height', 280)

d3.csv("./data/mortality_data/OH_Rural_Counties_Mortality_rate.csv", function(error, data){

    data = data.map(function(d){ d.value = +d["Change"]; return d; });

    var nodes = d3.hierarchy(data)
                  .sum(function(d) { return d.value; });

    var bubbles = bubbles_svg.append("g")
        .attr("transform", "translate(200,80)")
        .selectAll(".bubble")
        .data(bubble(nodes).descendants())

    bubbles.append("circle")
        .attr("r", function(d){ return d.r; })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .style("fill", function(d) { return color(d.value); });
});

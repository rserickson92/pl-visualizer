d3.json("data.json", function(err, data) {
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
  padding = {top: 60, right: 60, bottom: 60, left: 60},
  outerWidth = 960, outerHeight = 500,
  innerWidth = outerWidth - margin.left - margin.right, 
  innerHeight = outerHeight - margin.top - margin.bottom,
  w = innerWidth - padding.left - padding.right, 
  h = innerHeight - padding.top - padding.bottom,
  year = function(d) { return d["year"]; },
  repos = function(d) { return d["nbRepos"]; },
  xScale = d3.scale.linear()
                   .domain(d3.extent(data, year))
		   .range([0, w]),
  yScale = d3.scale.log()
                   .domain(d3.extent(data, repos))
		   .range([h, 0]),
  xAxis = d3.svg.axis()
                .scale(xScale)
		.orient("bottom"),
  yAxis = d3.svg.axis()
                .scale(yScale)
		.orient("left"),
  svg = d3.select("body").append("svg")
          .attr("width", outerWidth)
	  .attr("height", outerHeight)
          .append("g")
          .attr("transform", "translate("+margin.left+","+margin.top+")");

  svg.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
       return xScale(year(d));
     })
     .attr("cy", function(d) {
       return yScale(repos(d));
     })
     .attr("r", 5);
  svg.selectAll("text")
     .data(data)
     .enter()
     .append("text")
     .text(function(d) {
       return d["name"];
     })
     .attr("x", function(d) {
       return xScale(year(d));
     })
     .attr("y", function(d) {
       return yScale(repos(d));
     });

  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0,"+h+")")
     .call(xAxis);

  svg.append("g")
     .attr("class", "axis")
     .call(yAxis);


});

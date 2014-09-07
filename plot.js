(function() {
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
  padding = {top: 60, right: 60, bottom: 60, left: 60},
  outerWidth = 960, outerHeight = 500,
  innerWidth = outerWidth - margin.left - margin.right, 
  innerHeight = outerHeight - margin.top - margin.bottom,
  w = innerWidth - padding.left - padding.right, 
  h = innerHeight - padding.top - padding.bottom,
  svg = d3.select("body").append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate("+margin.left+","+margin.top+")"),
  year = function(d) { return d["year"]; },
  repos = function(d) { return d["nbRepos"]; },
  xScale, yScale;

  d3.json("data.json", function(err, data) {
    initPlot(data);
    d3.select("select").on("change", function(){
      drawPlot(data, this.value);
    });
  });

  var selectAllAndFilter = function(selector, data, paradigm) {
    var key = function(d) { return d.name };
    if(paradigm != "all") {
      return svg.selectAll(selector).data(data.filter(function(d) {
	return _.contains(d["paradigms"], paradigm);
      }), key);
    }
    return svg.selectAll(selector).data(data, key);
  }
  
  var drawPlot = function(data, paradigm) {
    var circleData = selectAllAndFilter("circle", data, paradigm);
    circleData.enter()
      .append("circle")
      .attr("cx", function(d) {
	return xScale(year(d));
      })
      .attr("cy", function(d) {
	return yScale(repos(d));
      })
      .attr("r", 5);
    circleData.exit().remove();
    var textData = selectAllAndFilter("text", data, paradigm);
    textData.enter()
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
    textData.exit().remove();
  };

  var initPlot = function(data) {
    xScale = d3.scale.linear()
      .domain(d3.extent(data, year))
      .range([0, w]),
    yScale = d3.scale.log()
      .domain(d3.extent(data, repos))
      .range([h, 0]);
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom"),
    yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,"+h+")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "axis")
      .call(yAxis);
    
    drawPlot(data, "all");

  };
})()

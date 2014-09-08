(function() {
  var margin = {top: 20, right: 20, bottom: 20, left: 40},
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
  key = function(d) { return d.name },
  x = function(d) { return xScale(year(d)); },
  y = function(d) { return yScale(repos(d)); },
  fadeIn = function(){ return d3.interpolate(0.0, 1.0); },
  xScale, yScale, xAxis, yAxis;

  d3.json("data.json", function(err, data) {
    initPlot(data);
    loadSelect(data);
    d3.select("#paradigm-select").on("change", function(){
      drawPlot(data, this.value);
    });
  });

  var loadSelect = function(data) {
    var select = d3.select("body").append("select")
      .attr("id", "paradigm-select"), i,
    numParadigmArrays = data.length, 
    allParadigmArrays = [];
    for(i = 0; i < numParadigmArrays; i++) {
      allParadigmArrays.push(data[i].paradigms);
    }
    var options = _.uniq(_.flatten(allParadigmArrays)),
    numOptions = options.unshift("all");
    for(i = 0; i < numOptions; i++) {
      select.append("option").text(options[i]);
    }
  }

  var drawPlot = function(data, paradigm) {
    var filteredData = paradigm === "all" 
      ? data 
      : data.filter(function(d) {
	return _.contains(d["paradigms"], paradigm);
      });
    updateScales(filteredData);
    updateAxes();
    circleData = svg.selectAll("circle").data(filteredData, key);
    circleData.transition()
      .duration(500)
      .delay(500)
      .attr("cx", x)
      .attr("cy", y);
    circleData.enter()
      .append("circle")
      .transition()
      .styleTween("opacity", fadeIn)
      .delay(1000)
      .duration(500)
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 5);
    var textData = svg.selectAll("text").data(filteredData, key);
    textData.transition()
      .duration(500)
      .delay(500)
      .attr("x", x)
      .attr("y", y);
    textData.enter()
      .append("text")
      .transition()
      .styleTween("opacity", fadeIn)
      .delay(1000)
      .duration(500)
      .text(function(d) {
	return d["name"];
      })
      .attr("x", x)
      .attr("y", y);
    circleData.exit()
      .transition()
      .style("opacity", 0.0)
      .duration(500)
      .remove();
    textData.exit()
      .transition()
      .style("opacity", 0.0)
      .duration(500)
      .remove();

  };

  var updateScales = function(data) {
    xScale.domain(d3.extent(data, year));
    yScale.domain(d3.extent(data, repos));
  }

  var updateAxes = function () {
    d3.select(".x.axis").call(xAxis).transition().delay(500).duration(500);
    d3.select(".y.axis").call(yAxis);
  };

  var initPlot = function(data) {
    xScale = d3.scale.linear()
      .domain(d3.extent(data, year))
      .range([0, w]),
    yScale = d3.scale.log()
      .domain(d3.extent(data, repos))
      .range([h, 0]),
    xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(15)
      .tickFormat(d3.format("d")),
    yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(10);

    drawPlot(data, "all");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+h+")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
    

  };
})()

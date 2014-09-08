(function() {
  var margin, padding, yearPadding, reposPadding, outerWidth, outerHeight,
  innerWidth, innerHeight, w, h, svg, year, repos, key, x, y, fadeIn,
  xScale, yScale, xAxis, yAxis;

  d3.json("data.json", function(err, data) {
    init(data);
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
    circleData = svg.selectAll("circle").data(filteredData, key);
    circleData.transition()
      .delay(500)
      .duration(500)
      .attr("cx", x)
      .attr("cy", y);
    circleData.enter()
      .append("circle")
      .style("opacity", 0.0)
      .transition()
      .styleTween("opacity", fadeIn)
      .delay(1000)
      .duration(500)
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 5);
    var textData = svg.selectAll("text.name").data(filteredData, key);
    textData.transition()
      .delay(500)
      .duration(500)
      .attr("x", x)
      .attr("y", y);
    textData.enter()
      .append("text")
      .attr("class", "name")
      .style("opacity", 0.0)
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
      .duration(500)
      .style("opacity", 0.0)
      .remove();
    textData.exit()
      .transition()
      .duration(500)
      .style("opacity", 0.0)
      .remove();
    updateAxes();
  };

  var updateScales = function(data) {
    xScale.domain(xDomain(data)).nice();
    yScale.domain(yDomain(data)).nice();
  }

  var xDomain = function(data){
    var domain = d3.extent(data, year);
    domain[0] -= yearPadding;
    domain[1] += yearPadding;
    return domain;
  };

  var yDomain = function(data) {
    var domain = d3.extent(data, repos),
    bottom = domain[0] - reposPadding;
    domain[0] = bottom >= 1 ? bottom : domain[0];
    domain[1] += reposPadding;
    console.log(domain.toString());
    return domain;
  }
  var updateAxes = function() {
    xAxis.scale(xScale);
    yAxis.scale(yScale);
    d3.select(".x.axis")
      .transition()
      .delay(500)
      .duration(500)
      .call(xAxis);
    d3.select(".y.axis")
      .transition()
      .delay(500)
      .duration(500)
      .call(yAxis);
  };

  var init = function(data) {
    margin = {top: 20, right: 20, bottom: 20, left: 60};
    padding = {top: 60, right: 60, bottom: 60, left: 60};
    yearPadding = 1, reposPadding = 10;
    outerWidth = 960, outerHeight = 500;
    innerWidth = outerWidth - margin.left - margin.right; 
    innerHeight = outerHeight - margin.top - margin.bottom;
    w = innerWidth - padding.left - padding.right; 
    h = innerHeight - padding.top - padding.bottom;
    svg = d3.select("body").append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
      .append("g")
      .attr("transform", "translate("+margin.left+","+margin.top+")");
    year = function(d) { return d["year"]; };
    repos = function(d) { return d["nbRepos"]; };
    key = function(d) { return d.name };
    x = function(d) { return xScale(year(d)); };
    y = function(d) { return yScale(repos(d)); };
    fadeIn = function(){ return d3.interpolate(0.0, 1.0); };

    xScale = d3.scale.linear()
      .range([0, w]);
    yScale = d3.scale.log()
      .range([h, 0]);
    xAxis = d3.svg.axis()
      .orient("bottom")
      .ticks(15)
      .tickFormat(d3.format("d"));
    yAxis = d3.svg.axis()
      .ticks(5)
      .orient("left");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+h+")");

    svg.append("g")
      .attr("class", "y axis");
    
    drawPlot(data, "all");

  };
})()

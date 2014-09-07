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
  xScale, yScale, xAxis, yAxis;

  d3.json("data.json", function(err, data) {
    initPlot(data);
    loadSelect(data);
    d3.select("#paradigm-select").on("change", function(){
      var updatedData = drawPlot(data, this.value);
      //updateAxes(updatedData);
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
    numOptions = options.length;
    for(i = 0; i < numOptions; i++) {
      select.append("option").text(options[i]);
    }
  }

  var drawPlot = function(data, paradigm) {
    var filteredData = paradigm == "all" ? data 
      : data.filter(function(d) {
	return _.contains(d["paradigms"], paradigm);
      }),
    key = function(d) { return d.name },
    circleData = svg.selectAll("circle").data(filteredData, key);
    circleData.enter()
      .append("circle")
      .attr("cx", function(d) {
	return xScale(year(d));
      })
      .attr("cy", function(d) {
	return yScale(repos(d));
      })
      .attr("r", 5),
    circleData.exit().remove();
    var textData = svg.selectAll("text").data(filteredData, key);
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

  var updateAxes = function(data) {
    xScale.domain(d3.extent(data, year));
    yScale.domain(d3.extent(data, repos));
  }

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
      .ticks(10),
    yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(10);

    drawPlot(data, "all");

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,"+h+")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "axis")
      .call(yAxis);
    

  };
})()

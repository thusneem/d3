// @TODO: YOUR CODE HERE!

// Step 1: Set up our chart
//= ================================
var svgWidth = 1000;
var svgHeight = 600;

var margin = {
  top: 30,
  right: 40,
  bottom: 60,
  left: 70
};

var width = svgWidth - margin.left - margin.right ;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);


var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data2.csv").then(function(paperData) {
    // if(error){
    //     return console.warn(error);
    // }
  
    console.log("test" + paperData);
  
    // log a list of names
    //var state = paperData.map(data => data.state);
    //console.log("state", state);
  
    // Cast each hours value in tvData as a number using the unary + operator
    paperData.forEach(
      function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      console.log("healthcare:", data.healthcare);
      console.log("poverty:", data.poverty);
    });
    //create scale
    var xScale = d3.scaleLinear()
    .domain([d3.min(paperData, d => d.poverty)*0.9,d3.max(paperData, d => d.poverty)*1.2])
    //.domain([10,d3.max(paperData, d => d.poverty)*1.2])
    .range([0, width]);

    var yScale = d3.scaleLinear()
    .domain([d3.min(paperData, d => d.healthcare)*0.9, d3.max(paperData, d => d.healthcare)*1.2])
    //.domain([6, d3.max(paperData, d => d.healthcare)*1.2])
    .range([height, 0]);
    // crete axes
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // Step 7: Append the axes to the chartGroup - ADD STYLING
  // ==============================================
  // Add bottomAxis
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .attr("stroke", "green") // NEW!
    .call(leftAxis);
    
    var toolTip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

    var circlesGroup=chartGroup.selectAll("circle")
    .data(paperData)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r",9)
    .attr("fill","lightblue")
        // append circles to data points
    chartGroup.selectAll("xxx")
    .data(paperData)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.poverty))
    .attr("y", d => yScale(d.healthcare))
    .attr("text-anchor","middle")
    .attr("text-color", "blue")
    .attr("font-size",8)
    .text(d => d.abbr)
    circlesGroup.on("mouseover", function(d) {
        toolTip.transition()
            .duration(200)
            .style("opacity", .9);
        toolTip.html(d.abbr ) 
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
    .on("mouseout", function(d) {
        toolTip.transition()
            .duration(500)
            .style("opacity", 0);
        });
        //append chart axes
        

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 25)
        .attr("x", 0 - (height / 2)-30)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text(" Lacks healthcare(%)");
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left +10)
        .attr("x", 0 - (height / 2)-30)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text(" Smokes(%)");   
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left -5)
        .attr("x", 0 - (height / 2)-30)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obese(%)");     

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 0})`)
        .attr("class", "axisText")
        .text("Poverty(%)");
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 15})`)
        .attr("class", "axisText")
        .text("Age(median)"); 
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Household Income(median)");      
    });





// @TODO: YOUR CODE HERE!

// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 30,
  right: 40,
  bottom: 150,
  left: 150
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


//initial params
var chosenXaxis = "poverty";
var chosenYaxis = "obesity";
function Xscale(paperData,chosenXaxis){
    var xlinearScale = d3.scaleLinear()
    .domain([d3.min(paperData, d => d[chosenXaxis])*0.9,
                    d3.max(paperData, d => d[chosenXaxis])*1.2])
    //.domain([10,d3.max(paperData, d => d.poverty)*1.2])
    .range([0, width]);
   return xlinearScale;
}

function Yscale(paperData,chosenYaxis){
    var ylinearScale = d3.scaleLinear()
    .domain([d3.min(paperData, d => d[chosenYaxis])*0.75,
             d3.max(paperData, d => d[chosenYaxis])*1.1])
    //.domain([10,d3.max(paperData, d => d.poverty)*1.2])
    .range([height, 0]); 
   return ylinearScale;
}

function renderxAxes(newXscale,Xaxis){
    var bottomAxis = d3.axisBottom(newXscale);
    Xaxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return Xaxis;    
}

function renderyAxes(newYscale,Yaxis){
    var leftAxis = d3.axisLeft(newYscale);
    Yaxis.transition()
        .duration(1000)
        .call(leftAxis);
    return Yaxis;    
}

function renderXCircles(tGroup,newXscale,chosenXaxis){
    tGroup.transition()
        .duration(1000)
        .attr("cx", d=> newXscale(d[chosenXaxis]))
    return tGroup;    
}

function renderYCircles(tGroup,newYscale,chosenYaxis){
    tGroup.transition()
        .duration(1000)
        .attr("cy",d =>newYscale(d[chosenYaxis]))
    return tGroup;    
}
function renderXText(textGroup, newXscale, chosenXaxis){
    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXscale(d[chosenXaxis]));
    return textGroup; 
    
  }

 function renderYText(textGroup, newYscale, chosenYaxis){
    textGroup.transition()
        .duration(1000)
        .attr("y", d => newYscale(d[chosenYaxis]));
    return textGroup; 
    
  }  


d3.csv("assets/data/data2.csv").then(function(paperData) {
    
    // Cast each hours value in tvData as a number using the unary + operator
    paperData.forEach(
      function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      //data.abbr= +data.abbr;
      data.age = +data.age;
      data.income = +data.income;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
      //console.log("healthcare:", data.healthcare);
      //console.log("poverty:", data.poverty);
    });

    //create scale
    var xlinearScale = Xscale(paperData,chosenXaxis);
    var ylinearScale = Yscale(paperData, chosenYaxis); 

    // crete axes
    var bottomAxis = d3.axisBottom(xlinearScale);
    var leftAxis = d3.axisLeft(ylinearScale);

     // Step 7: Append the axes to the chartGroup - ADD STYLING
    // ==============================================
   // Add bottomAxis and left axis
    var Xaxis=chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    var Yaxis = chartGroup.append("g")
    .attr("stroke", "green") // NEW!
    .call(leftAxis);
    
    
    var circlesGroup = chartGroup.selectAll("circle")
    .data(paperData)
    .enter()
    var tGroup = circlesGroup.append("circle")
    .attr("cx", d => xlinearScale(d[chosenXaxis]))
    .attr("cy", d => ylinearScale(d[chosenYaxis]))
    .attr("r", "10")
    .attr("fill", "lightblue")
    .attr("opacity", ".5");
    

    var textGroup = circlesGroup.selectAll("null")
    .data(paperData)
    .enter()
    .append("text")
    //.text(d => d.abbr)
    .attr("x", d => xlinearScale(d[chosenXaxis]))
    .attr("y", d => ylinearScale(d[chosenYaxis]))
    .attr("text-anchor","middle")
    .attr("font-size", 8)
    .attr("text-color","gray")
    .text(d => d.abbr)
    .on("mouseover",function(x1){
      toolTip.show(x1, this)
     }).on("mouseout",function(x1){
      toolTip.hide(x1)
     });

     var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(data) {
        return (`${data.state}<br>${chosenXaxis} : ${data[chosenYaxis]} <br> ${chosenYaxis} : ${data[chosenYaxis]}%`);
     });
   
    chartGroup.call(toolTip);
    tGroup.on("mouseover", function(data) {
        toolTip.show(data,this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    
        //append chart axes
        
    var  xlabelsGroup = chartGroup.append("g")
        .attr("transform",`translate(${width/2},${height+20})`);
    var ylabelsGroup = chartGroup.append("g");  
        

    var healthcare = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left +40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        //.attr("class", "axisText")
        .attr("value", "healthcare")
        .text(" Lacks healthcare(%)");
    var smokes=ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left+60 )
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes")
        //.attr("class", "axisText")
        .text(" Smokes(%)");   
    var obese =ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left+80)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity")
        //.attr("class", "axisText")
        .text("Obesity(%)");     

    var poverty = xlabelsGroup.append("text")
       // .attr("transform", `translate(${width / 2}, ${height + margin.top + 0})`)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty(%)");
    var age = xlabelsGroup.append("text")
        //.attr("transform", `translate(${width / 2}, ${height + margin.top + 15})`)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");  
        
    var income = xlabelsGroup.append("text")
       // .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
       .attr("x", 0)
       .attr("y", 60)
       .attr("value", "income") // value to grab for event listener
       .classed("inactive", true)
       .text("Household Income (Median)");
             
        
        
    
    xlabelsGroup.selectAll("text")
            .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXaxis) {
                // replaces chosenXAxis with value
                chosenXaxis = value;
                console.log(chosenXaxis);
                // console.log(chosenXAxis
                // functions here found above csv import
                // updates x scale for new data
                xlinearScale = Xscale(paperData, chosenXaxis);
                // updates x axis with transition
                Xaxis = renderxAxes(xlinearScale, Xaxis);
                // updates circles with new x values
                tGroup = renderXCircles(tGroup, xlinearScale,chosenXaxis);
                textGroup = renderXText(textGroup, xlinearScale, chosenXaxis);
                
                if (chosenXaxis === "poverty") {
                    poverty
                      .classed("active", true)
                      .classed("inactive", false);
                    age
                      .classed("active", false)
                      .classed("inactive", true);
                    income
                        .classed("active", false)
                        .classed("inactive", true);
                  }
                  else if (chosenXaxis === "age"){
                    poverty
                      .classed("active", false)
                      .classed("inactive", true);
                    age
                      .classed("active", true)
                      .classed("inactive", false);
                    income
                        .classed("active", false)
                        .classed("inactive", true);
                  }
                  else {
                    poverty
                      .classed("active", false)
                      .classed("inactive", true);
                    age
                      .classed("active", false)
                      .classed("inactive", true);
                    income
                        .classed("active", true)
                        .classed("inactive", false);
                  }
                
            }
        });


    ylabelsGroup.selectAll("text")
            .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYaxis) {
                // replaces chosenXAxis with value
                chosenYaxis = value;
                // console.log(chosenYAxis)
                // functions here found above csv import
                // updates x scale for new data
                ylinearScale = Yscale(paperData, chosenYaxis);
                // updates x axis with transition
                Yaxis = renderyAxes(ylinearScale, Yaxis);
                // updates circles with new x values
                tGroup = renderYCircles(tGroup,ylinearScale, chosenYaxis);
                // updates tooltips with new info
                textGroup = renderYText(textGroup,ylinearScale, chosenYaxis);
         
                if (chosenYaxis === "healthcare") {
                    healthcare
                    .classed("active", true)
                    .classed("inactive", false);
                    smokes
                    .classed("active", false)
                    .classed("inactive", true);
                    obese
                    .classed("active", false)
                    .classed("inactive", true);  
                }
                  else if (chosenYaxis === "smokes") {
                    obese
                      .classed("active", false)
                      .classed("inactive", true);
                    smokes
                      .classed("active", true)
                      .classed("inactive", false);
                    healthcare
                     .classed("active", false)
                     .classed("inactive", true);
                  }
                  else {
                    obese
                      .classed("active", true)
                      .classed("inactive",false);
                    smokes
                      .classed("active", false)
                      .classed("inactive", true);
                    healthcare
                      .classed("active", false)
                      .classed("inactive", true);
                  }
                
            }
      });
});

  

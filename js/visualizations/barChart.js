// NOTE FOR EMILY B: the barchart div has already been created in index.html
// Simply start adding elements (add an svg to the parentElement), and they will show up
// Additionally, the data is dynamically updated based on the radio buttons and dropdown. No need to worry about that
// Simply create the visualization using the vis.data in updateVis()
class BarChart {
  constructor(_config) {
    // TODO: add more configurations (width, height, margins, etc.)
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 430,
      margin: { top: 20, bottom: 50, right: 30, left: 55 },
    };

    this.initVis();
  }

  initVis() {
    const vis = this;
      vis.svg = d3
        .select(vis.config.parentElement)
        .append("svg")
        .attr(
          "width",
          vis.config.containerWidth +
            vis.config.margin.left +
            vis.config.margin.right
        )
        .attr(
          "height",
          vis.config.containerHeight +
            vis.config.margin.top +
            vis.config.margin.bottom
        )
        .append("g")
        .attr(
          "transform",
          `translate(${vis.config.margin.left},${vis.config.margin.top})`
        );
  
      vis.x = d3
        .scaleBand()
        .range([0, vis.config.containerWidth])
        .padding(0.1);
      vis.xAxis = vis.svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${vis.config.containerHeight})`);
  
      vis.y = d3.scaleLinear().range([vis.config.containerHeight, 0]);
      vis.yAxis = vis.svg.append("g").attr("class", "y-axis");
  
      // X axis label
      vis.svg
        .append("text")
        .attr(
          "transform",
          "translate(" +
            vis.config.containerWidth / 2 +
            " ," +
            (vis.config.containerHeight + 35) +
            ")"
        )
        .attr("y", 12)
        .style("text-anchor", "middle")
        .text("Character");
  
      // Y axis label
      vis.svg
        .append("text")
        .attr("class", "y-axis-label") 
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - vis.config.margin.left - 3)
        .attr("x", 0 - vis.config.containerHeight / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Episodes");

    // TODO: add the logic to create the visualization's elements that won't update at all (not dependent upon data)

    vis.updateVis();
  }

  updateVis() {
    const vis = this;
    vis.data = barchartData;

    // NOTE FOR EMILY B: use the vis.data variable. If it's not in a good format, feel free to modify the vis.data variable
    // ... but I would shy away from modifying the barchartData variable without contacting Emma
    console.log("Barchart data:", vis.data);

    // NOTE FOR EMILY B...
    // The global barchartIsAppearances variable is true when the user has selected the "Episode appearances" option
    // It's false when they've selected the "Lines spoken" option. You can use this to determine the correct axes labeling.
    console.log(
      "Barchart 'Episode appearances' is selected?:",
      barchartIsAppearances
    );

    // Updates the x axis scale
    vis.x.domain(vis.data.map(d => d.character));

    // Updates the y axis scale
    vis.y.domain([0, d3.max(vis.data, d => (barchartIsAppearances ? d.numAppearances : d.numLines))]);

    // Updates the x axis
    vis.xAxis.call(d3.axisBottom(vis.x));

    // Updates the y axis
    vis.yAxis.call(d3.axisLeft(vis.y));

    // Updates the y axis label based on what data is being displayed
    vis.svg.select(".y-axis-label")
    .text(barchartIsAppearances ? "Number of Appearances" : "Number of Lines");

    // Creates the bars
    const bars = vis.svg.selectAll(".bar").data(vis.data);
    // Updates the bars based on the data
    bars
      .join("rect")
      .attr("class", "bar")
      .attr("x", d => vis.x(d.character))
      .attr("width", vis.x.bandwidth())
      .attr("y", d => vis.y(barchartIsAppearances ? d.numAppearances : d.numLines))
      .attr("height", d => vis.config.containerHeight - vis.y(barchartIsAppearances ? d.numAppearances : d.numLines));

    // NOTE FOR EMILY B: you can also get the selected season with the barchartSelectedPeriod variable.
    // It's 0 when the user selected the entire show and anything else for that season (e.g. barchartSelectedPeriod == 1 means the first season was chosen)
    console.log("Barchart selected period:", barchartSelectedPeriod);

    // TODO: add the logic to create the elements that will update when the data changes (reminder: use join instead of enter and append)
  }
}

class BarChart {
  constructor() {
    this.config = {
      parentElement: "#barchart",
      containerWidth: 500,
      containerHeight: 430,
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

    vis.x = d3.scaleBand().range([0, vis.config.containerWidth]).padding(0.1);
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

    vis.updateVis();
  }

  updateVis() {
    const vis = this;
    vis.data = barchartData;

    // Updates the x axis scale
    vis.x.domain(vis.data.map((d) => d.character));

    // Updates the y axis scale
    vis.y.domain([
      0,
      d3.max(vis.data, (d) =>
        barchartIsAppearances ? d.numAppearances : d.numLines
      ),
    ]);

    // Updates the x axis
    vis.xAxis.call(d3.axisBottom(vis.x));

    // Updates the y axis
    vis.yAxis.call(d3.axisLeft(vis.y));

    // Updates the y axis label based on what data is being displayed
    vis.svg
      .select(".y-axis-label")
      .text(
        barchartIsAppearances ? "Number of Appearances" : "Number of Lines"
      );

    // Creates the bars and updates them based on the data
    const bars = vis.svg.selectAll(".bar").data(vis.data);

    const colors = [
      "#EC4E20",
      "#FFBD0A",
      "#0E76A8",
      "#55A860",
      "#D8AB86",
      "#874D92",
      "#6E7F80",
      "#A06545",
      "#F0C05A",
      "#E76F51",
    ];

    bars
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => vis.x(d.character))
      .attr("width", vis.x.bandwidth())
      .attr("y", (d) =>
        vis.y(barchartIsAppearances ? d.numAppearances : d.numLines)
      )
      .attr(
        "height",
        (d) =>
          vis.config.containerHeight -
          vis.y(barchartIsAppearances ? d.numAppearances : d.numLines)
      )
      .style("fill", (d, i) => colors[i % colors.length])
      .attr("rx", 2) // Make the bars have rounded edges
      .attr("ry", 2)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke-width", "2").attr("stroke", "black");
        tooltip.style("visibility", "visible").html(`
          <div class="tooltip-title">${d.character}</div>
          <div><b>${
            barchartIsAppearances ? "Number of Appearances" : "Number of Lines"
          }</b>: ${barchartIsAppearances ? d.numAppearances : d.numLines}</div>
        `);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", "0");
        tooltip.style("visibility", "hidden");
      });
  }
}

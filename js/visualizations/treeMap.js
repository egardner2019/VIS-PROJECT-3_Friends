// NOTE FOR EMILY T: the treemap div has already been created in index.html
// Simply start adding elements (add an svg to the parentElement), and they will show up
// Also, since this visualization doesn't need to update at all (data doesn't change)
// ... createVis is used in place of initVis and updateVis
class TreeMap {
  constructor() {
    // TODO: add more configurations (width, height, margins, etc.)
    this.config = {
      containerWidth: 400,
      containerHeight: 400,
      margin: { top: 25, right: 25, bottom: 25, left: 25 },
      parentElement: "#treemap",
    };

    // Modify these values if you want to get a different number of
    // ... locations or characters in each location
    const numCharacters = 10;
    const numLocations = 10;

    this.data = getTreeMapData(numLocations, numCharacters);

    this.createVis();
  }

  createVis() {
    const vis = this;

    // NOTE FOR EMILY T: use the vis.data variable. If you need it in a different format,
    // ... please reach out to Emma, and she'll change it.
    console.log("Tree map data:", vis.data);

    // TODO: add the logic to create the visualization

    var svg = d3
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
        `translate(${vis.config.margin.left}, ${vis.config.margin.top})`
      );

    const root = d3
      .hierarchy(vis.data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    d3
      .treemap()
      .size([vis.config.containerWidth, vis.config.containerHeight])
      .padding(2)(root);

    // Prepare a color scale
    const color = d3
      .scaleOrdinal()
      .domain(vis.data.children.map((child) => child.name))
      .range(d3.schemeCategory10); // Feel free to manually set colors if you don't like this preset color scheme

    // Prepare an opacity scale
    const opacity = d3
      .scaleLinear()
      .domain(getMinMaxTreeMapValues(vis.data))
      .range([0.5, 1]);

    svg
      .selectAll("rect")
      .data(root.leaves())
      .join("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .style("fill", (d) => color(d.parent.data.name))
      .style("opacity", (d) => opacity(d.data.value))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke-width", "2").attr("stroke", "white");
        tooltip.style("visibility", "visible").html(`
          <div class="tooltip-title">${d.parent.data.name}</div>
          <div><b>Character</b>: ${d.data.name}</div>
          <div><b>Number of appearances</b>: ${d.data.value}</div>
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

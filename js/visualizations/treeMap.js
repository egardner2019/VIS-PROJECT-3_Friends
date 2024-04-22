class TreeMap {
  constructor() {
    this.config = {
      containerWidth: 400,
      containerHeight: 400,
      margin: { top: 0, right: 25, bottom: 25, left: 25 },
      parentElement: "#treemap",
    };

    // Can modify these values to get a different number of locations/characters
    const numCharacters = 10;
    const numLocations = 10;

    this.data = getTreeMapData(numLocations, numCharacters);

    this.createVis();
  }

  createVis() {
    const vis = this;

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
      .range([
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
      ]);

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
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .style("fill", (d) => color(d.parent.data.name))
      .style("opacity", (d) => opacity(d.data.value))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke-width", "2").attr("stroke", "black");
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

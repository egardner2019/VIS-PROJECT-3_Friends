class HeatMap {
  constructor() {
    this.config = {
      parentElement: "#heatmap",
      width: 800,
      height: 400,
      margin: { top: 20, right: 20, bottom: 50, left: 50 },
    };

    this.initVis();
  }

  initVis() {
    const vis = this;

    vis.width =
      vis.config.width - vis.config.margin.left - vis.config.margin.right;
    vis.height =
      vis.config.height - vis.config.margin.top - vis.config.margin.bottom;

    vis.svg = d3
      .select(vis.config.parentElement)
      .append("svg")
      .attr("width", vis.config.width)
      .attr("height", vis.config.height)
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    vis.xScale = d3.scaleBand().range([0, vis.width]).padding(0.05);
    vis.yScale = d3.scaleBand().range([vis.height, 0]).padding(0.05);

    vis.xAxis = d3.axisBottom(vis.xScale).tickFormat((d) => `E${d}`);
    vis.yAxis = d3.axisLeft(vis.yScale).tickFormat((d) => `S${d}`);

    vis.xAxisGroup = vis.svg
      .append("g")
      .attr("transform", `translate(0, ${vis.height})`);

    vis.yAxisGroup = vis.svg.append("g");

    vis.xScale.domain(d3.range(1, 26));
    vis.yScale.domain(d3.range(1, 11));

    vis.xAxisGroup.call(vis.xAxis);
    vis.yAxisGroup.call(vis.yAxis);

    vis.svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", vis.width / 2 + vis.config.margin.left)
      .attr("y", vis.height + vis.config.margin.bottom - 10)
      .text("Episode");

    vis.svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -vis.config.margin.left + 15)
      .attr("x", -vis.height / 2 + vis.config.margin.top)
      .text("Season");

    vis.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("visibility", "hidden");

    vis.updateVis();
  }

  updateVis() {
    const vis = this;
    vis.data = heatmapData;

    const rects = vis.svg
      .selectAll("rect")
      .data(vis.data, (d) => `${d.seasonNum}-${d.episodeNum}`);

    rects
      .join("rect")
      .attr("x", (d) => vis.xScale(d.episodeNum))
      .attr("y", (d) => vis.yScale(d.seasonNum))
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("width", vis.xScale.bandwidth())
      .attr("height", vis.yScale.bandwidth())
      .attr("fill", (d) =>
        getColorForSeasonAndLines(heatmapSelectedCharacter, d.linesSpoken)
      )
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke-width", "2").attr("stroke", "black");
        vis.tooltip.style("visibility", "visible").html(`
            <div class="tooltip-title">S${d.seasonNum}E${d.episodeNum}: ${d.episodeName}</div>
            <div>Lines Spoken: ${d.linesSpoken}</div>
          `);
      })
      .on("mousemove", function (event) {
        vis.tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", "0").attr("stroke", "none");
        vis.tooltip.style("visibility", "hidden");
      });
  }
}

function getColorForSeasonAndLines(character, lines) {
  const characterGradients = {
    Ross: d3.interpolateRgb("#ffcccc", "#8b0000"),
    Rachel: d3.interpolateRgb("#fff200", "#9b8600"),
    Monica: d3.interpolateRgb("#cce0ff", "#00008b"),
    Chandler: d3.interpolateRgb("#f0c8d0", "#600000"),
    Joey: d3.interpolateRgb("#FFFACD", "#9C8C15"),
    Phoebe: d3.interpolateRgb("#cceeff", "#004c99"),
  };

  const minLinesSpoken = getMinLinesSpoken();
  const maxLinesSpoken = getMaxLinesSpoken();
  const lineScale = d3
    .scaleLinear()
    .domain([minLinesSpoken, maxLinesSpoken])
    .range([0, 1]);
  const colorInterpolator = characterGradients[character];

  return colorInterpolator(lineScale(lines));
}

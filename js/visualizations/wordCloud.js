class WordCloud {
  constructor() {
    this.config = {
      parentElement: "#wordcloud",
      containerWidth: 550,
      containerHeight: 400,
      margin: { top: 20, bottom: 0, right: 0, left: 55 },
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

    vis.updateVis();
  }

  updateVis() {
    const vis = this;
    vis.data = wordcloudData;

    vis.svg.selectAll("*").remove();

    const maxCount = d3.max(vis.data, (d) => d.count);
    const colors = ["#EC4E20", "#FFBD0A", "#0E76A8"];

    const layout = d3.layout
      .cloud()
      .size([vis.config.containerWidth, vis.config.containerHeight])
      .words(
        vis.data.map((d) => ({ text: d.word, size: d.count, newSize: d.count }))
      )
      .padding(5)
      .rotate(0)
      .fontSize((d) => Math.sqrt(d.size / maxCount) * 60)
      .on("end", draw);

    layout.start();

    function draw(words) {
      vis.svg
        .append("g")
        .attr(
          "transform",
          `translate(${vis.config.containerWidth / 2.5},${
            vis.config.containerHeight / 2
          })`
        )
        .selectAll("text")
        .data(words)
        .join("text")
        .style("font-size", (d) => d.size + "px")
        .style("fill", (d, i) => colors[i % colors.length])
        .style("stroke-width", "0px")
        .attr("text-anchor", "middle")
        .style("text-shadow", "1px 1px 1px gray")
        .attr(
          "transform",
          (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`
        )
        .text((d) => d.text)
        .on("mouseover", function (event, d) {
          d3.select(this).attr("stroke-width", "2").attr("stroke", "white");
          tooltip.style("visibility", "visible").html(`
              <div class="tooltip-title">${d.text}</div>
              <div>Count: ${d.newSize}</div>
            `);
          d3.select(this).attr("cursor", "default");
        })
        .on("mousemove", function (event) {
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke-width", "0").attr("stroke", "none");
          tooltip.style("visibility", "hidden");
        });
    }
  }
}

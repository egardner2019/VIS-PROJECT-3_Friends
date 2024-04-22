class ArcDiagram {
  constructor() {
    this.config = {
      parentElement: "#arcdiagram",
      width: 1200,
      height: 200,
      margin: { top: 40, right: 20, bottom: 0, left: 20 },
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

    vis.xScale = d3.scalePoint().range([0, vis.width]).padding(1);

    vis.line = d3
      .line()
      .curve(d3.curveNatural)
      .x((d) => d.x)
      .y((d) => d.y);

    vis.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("visibility", "hidden");

    vis.seasonColors = [
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
    vis.mainCharacters = [
      "Joey",
      "Chandler",
      "Monica",
      "Phoebe",
      "Ross",
      "Rachel",
    ];
    vis.updateVis();
  }

  updateVis() {
    const vis = this;
    vis.data = arcdiagramData;
    const dataCharacters = Array.from(
      new Set(vis.data.flatMap((d) => [d.characterA, d.characterB]))
    );
    const allCharacters = vis.mainCharacters.concat(
      dataCharacters.filter((d) => !vis.mainCharacters.includes(d))
    );
    vis.xScale.domain(allCharacters);

    function getStrokeWidth(interactions) {
      if (interactions <= 5) return 1;
      if (interactions <= 10) return 2;
      if (interactions <= 20) return 3;
      if (interactions <= 50) return 4;
      if (interactions <= 80) return 5;
      if (interactions <= 110) return 6;
      if (interactions <= 120) return 7;
      return 8;
    }
    vis.svg
      .selectAll(".node")
      .data(allCharacters)
      .join("text")
      .attr("class", "node")
      .attr("x", (d) => vis.xScale(d))
      .attr("y", vis.height / 2 + 25)
      .style("text-anchor", "middle")
      .text((d) => d)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("cursor", "default");
        vis.svg
          .selectAll(".link")
          .style("opacity", 0.1)
          .filter((link) => link.characterA === d || link.characterB === d)
          .style("opacity", 1);

        const connections = vis.data.filter(
          (link) => link.characterA === d || link.characterB === d
        );
        connections.sort((a, b) => b.interactions - a.interactions); // Sort connections by interactions in descending order

        let tooltipHtml = `<div class="tooltip-title">Scenes with ${d}</div>`;
        connections.forEach((link) => {
          const otherCharacter =
            link.characterA === d ? link.characterB : link.characterA;
          tooltipHtml += `<div>${otherCharacter}: ${link.interactions}</div>`;
        });
        vis.tooltip
          .style("visibility", "visible")
          .html(tooltipHtml)
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function () {
        vis.svg.selectAll(".link").style("opacity", 0.7);
        vis.tooltip.style("visibility", "hidden");
      });

    vis.svg
      .selectAll(".link")
      .data(vis.data, (d) => `${d.characterA}-${d.characterB}`)
      .join("path")
      .attr("class", "link")
      .attr("d", (d) => {
        const startX = vis.xScale(d.characterA);
        const endX = vis.xScale(d.characterB);
        const midY = vis.height / 2;
        return vis.line([
          { x: startX, y: midY },
          { x: (startX + endX) / 2, y: midY - 50 - Math.sqrt(d.interactions) },
          { x: endX, y: midY },
        ]);
      })
      .attr("fill", "none")
      .attr("stroke", (d) => vis.seasonColors[arcdiagramSelectedSeason - 1])
      .attr("stroke-width", (d) => getStrokeWidth(d.interactions))
      .style("opacity", 0.7);
  }
}

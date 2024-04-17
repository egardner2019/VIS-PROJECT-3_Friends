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
      margin: {top: 25, right: 25, bottom: 25, left: 25},
      parentElement: "#treemap"
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

    var svg = d3.select(vis.config.parentElement)
      .append("svg")
        .attr("width", vis.config.containerWidth + vis.config.margin.left + vis.config.margin.right)
        .attr("height", vis.config.containerHeight + vis.config.margin.top + vis.config.margin.bottom)
      .append("g")
        .attr("transform",
              `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

    const root = d3.hierarchy(vis.data);

    //.sum(function(d){return d.location});    

    const treemap = d3.treemap()
      .size([vis.config.containerWidth, vis.config.containerHeight])
      .paddingTop(28)
      .paddingRight(7)
      .paddingInner(3);

    treemap(root);

    console.log(root);
    console.log(root.leaves());

    svg
      .selectAll("rect")
      .data(root.leaves())
      .join("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", "gray")
        .style("opacity", "0.7");



  }
}

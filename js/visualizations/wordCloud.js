// NOTE FOR EMILY B: the wordcloud div has already been created in index.html
// Simply start adding elements (add an svg to the parentElement), and they will show up
// Additionally, the data is dynamically updated based on the dropdowns. No need to worry about that
// Simply create the visualization using the vis.data in updateVis()
class WordCloud {
  constructor() {
    // TODO: add more configurations (width, height, margins, etc.)
    this.config = {
      parentElement: "#wordcloud",
      containerWidth: 550,
      containerHeight: 400,
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

    // TODO: add the logic to create the visualization's elements that won't update at all (not dependent upon data)

    vis.updateVis();
  }

  updateVis() {
    const vis = this;
    vis.data = wordcloudData;

    vis.svg.selectAll("*").remove();

    const maxCount = d3.max(vis.data, d => d.count);
    const colors = ["#EC4E20", "#FFBD0A", "#0E76A8"];

    const layout = d3.layout
      .cloud()
      .size([vis.config.containerWidth, vis.config.containerHeight])
      .words(vis.data.map(d => ({ text: d.word, size: d.count, newSize: d.count })))
      .padding(5)
      .rotate(0)
      .fontSize(d => Math.sqrt(d.size / maxCount) * 60) 
      .on("end", draw);

    layout.start();

    function draw(words) {
      vis.svg
        .append("g")
        .attr("transform", `translate(${vis.config.containerWidth / 2.5},${vis.config.containerHeight / 2})`)
        .selectAll("text")
        .data(words)
        .join("text")
        .style("font-size", d => d.size + "px")
        .style("fill", (d, i) => colors[i % colors.length]) 
        .style("stroke", "black") 
        .style("stroke-width", "1px") 
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
        .text(d => d.text)
        
        .on("mouseover", function(event, d) {
          d3.select(this).attr("stroke-width", "2").attr("stroke", "white"); 
          tooltip.style("visibility", "visible").html(`
            <div class="tooltip-title">${d.text}</div>
            <div>Count: ${d.newSize}</div>
          `);
        })
        .on("mousemove", function(event) {
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function() {
          d3.select(this).attr("stroke-width", "0").attr("stroke", "none"); 
          tooltip.style("visibility", "hidden");
        });
    }
    
    // NOTE FOR EMILY B: use the vis.data variable. If it's not in a good format, feel free to modify the vis.data variable
    // ... but I would shy away from modifying the wordcloudData variable without contacting Emma
    // If there are words in the data that you don't want to include, simply add the word you want to hide to the
    // ... stopWords array in helperVariables.js (it'll automatically filter out anything included in that array)
    console.log("Word cloud data:", vis.data);

    // NOTE FOR EMILY B...
    // You can use the wordcloudSelectedCharacter to get the currently selected character's name
    console.log("Word cloud selected character:", wordcloudSelectedCharacter);

    // NOTE FOR EMILY B: you can also get the selected season with the wordcloudSelectedPeriod variable.
    // It's 0 when the user selected the entire show and anything else for that season (e.g. wordcloudSelectedPeriod == 1 means the first season was chosen)
    console.log("Word cloud selected period:", wordcloudSelectedPeriod);

    // TODO: add the logic to create the elements that will update when the data changes (reminder: use join instead of enter and append)
  }
}
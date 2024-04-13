// NOTE FOR MOLLY: the heatmap div has already been created in index.html
// Simply start adding elements (add an svg to the parentElement in config), and they will show up
// Additionally, the data is dynamically updated based on the dropdown. No need to worry about that
// Simply create the visualization using the vis.data in updateVis()
class HeatMap {
  constructor() {
    // TODO: add more configurations (width, height, margins, etc.)
    this.config = {
      parentElement: "#heatmap",
    };

    this.initVis();
  }

  initVis() {
    const vis = this;

    // TODO: add the logic to create the visualization's elements that won't update at all (not reliant upon data)

    vis.updateVis();
  }

  updateVis() {
    const vis = this;
    vis.data = heatmapData;

    // NOTE FOR MOLLY: use the vis.data variable. If you decide you need a different format, feel free to modify the vis.data variable
    // ... after it's set to heatmapData. I would shy away from modifying the heatmapData variable without contacting Emma
    // The data is automatically filtered by the selected character, so no need to worry about that part
    console.log("Heatmap data:", vis.data);

    // NOTE FOR MOLLY: you can get the currently selected character using the heatmapSelectedCharacter variable (if you need it for labels or the tooltip)
    // I don't believe you will need this value, as the user knows who they selected in the dropdown, but I wanted to keep you informed
    console.log("Heatmap selected character:", heatmapSelectedCharacter);

    // TODO: add the logic to create the elements that update based on the data (reminder: use .join instead of .enter and .append)
  }
}

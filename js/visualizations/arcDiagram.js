// NOTE FOR MOLLY: the arcdiagram div has already been created in index.html
// Simply start adding elements (add an svg to the parentElement), and they will show up
// Additionally, the data is dynamically updated based on the dropdown. No need to worry about that
// Simply create the visualization using the vis.data in updateVis()
class ArcDiagram {
  constructor() {
    // TODO: add more configurations (width, height, margins, etc.)
    this.config = {
      parentElement: "#arcdiagram",
    };

    this.initVis();
  }

  initVis() {
    const vis = this;

    // TODO: add the logic to create the visualization's elements that won't update at all (not dependent upon data)

    vis.updateVis();
  }

  updateVis() {
    const vis = this;
    vis.data = arcdiagramData;

    // NOTE FOR MOLLY: use the vis.data variable. If you need it in a different format, feel free to modify the vis.data variable
    // ... but I would shy away from modifying the arcdiagramData variable without contacting Emma
    console.log("Arc diagram data:", vis.data);

    // NOTE FOR MOLLY: you can also get the selected season with the arcdiagramSelectedSeason variable.
    console.log("Arc diagram selected season:", arcdiagramSelectedSeason);

    // TODO: add the logic to create the elements that will update when the data changes (reminder: use join instead of enter and append)
  }
}

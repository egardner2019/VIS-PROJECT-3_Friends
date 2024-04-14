// NOTE FOR EMILY T: the treemap div has already been created in index.html
// Simply start adding elements (add an svg to the parentElement), and they will show up
// Also, since this visualization doesn't need to update at all (data doesn't change)
// ... createVis is used in place of initVis and updateVis
class TreeMap {
  constructor() {
    // TODO: add more configurations (width, height, margins, etc.)
    this.config = {
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
  }
}

// NOTE FOR EMILY B: the barchart div has already been created in index.html
// Simply start adding elements (add an svg to the parentElement), and they will show up
// Additionally, the data is dynamically updated based on the radio buttons and dropdown. No need to worry about that
// Simply create the visualization using the vis.data in updateVis()
class BarChart {
  constructor() {
    // TODO: add more configurations (width, height, margins, etc.)
    this.config = {
      parentElement: "#barchart",
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
    vis.data = barchartData;

    // NOTE FOR EMILY B: use the vis.data variable. If it's not in a good format, feel free to modify the vis.data variable
    // ... but I would shy away from modifying the barchartData variable without contacting Emma
    console.log("Barchart data:", vis.data);

    // NOTE FOR EMILY B...
    // The global barchartIsAppearances variable is true when the user has selected the "Episode appearances" option
    // It's false when they've selected the "Lines spoken" option. You can use this to determine the correct axes labeling.
    console.log(
      "Barchart 'Episode appearances' is selected?:",
      barchartIsAppearances
    );

    // NOTE FOR EMILY B: you can also get the selected season with the barchartSelectedPeriod variable.
    // It's 0 when the user selected the entire show and anything else for that season (e.g. barchartSelectedPeriod == 1 means the first season was chosen)
    console.log("Barchart selected period:", barchartSelectedPeriod);

    // TODO: add the logic to create the elements that will update when the data changes (reminder: use join instead of enter and append)
  }
}

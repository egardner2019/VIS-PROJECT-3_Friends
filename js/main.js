let allData;
let barchart, heatmap, wordcloud, arcdiagram, treemap;
let barchartData, heatmapData, wordcloudData, arcdiagramData;

// Change the variable below to get more/fewer characters for the bar chart
const numBarchartCharacters = 10;
// Change the variable below to get more/fewer words for the word cloud
const numWordcloudWords = 50;

let barchartSelectedPeriod = 0,
  barchartIsAppearances = true;

let heatmapSelectedCharacter = "Chandler";

let wordcloudSelectedPeriod = 0,
  wordcloudSelectedCharacter = "Rachel";

// Read in the JSON file and create the variable for all the data
d3.json("data/data.json")
  .then((jsonResult) => {
    allData = jsonResult;
    //#region Initial data
    barchartData = getTopCharactersAppearancesEntireShow(
      getTopCharactersAppearancesBySeason(numBarchartCharacters),
      numBarchartCharacters
    );
    heatmapData = getNumberOfLinesPerEpisode(heatmapSelectedCharacter);
    wordcloudData = getCharacterWordsEntireShow(
      wordcloudSelectedCharacter,
      numWordcloudWords
    );
    // Tree map data is determined within treeMap.js and never changes
    //#endregion

    //#region Create visualizations
    barchart = new BarChart();
    heatmap = new HeatMap();
    wordcloud = new WordCloud();
    treemap = new TreeMap();
    //#endregion

    //#region Bar Chart logic
    const barchartPeriodSelect = document.getElementById(
      "barchartPeriodSelect"
    );
    const barchartEpisodeAppearancesBtn =
      document.getElementById("episodeAppearances");
    const barchartLinesSpokenBtn = document.getElementById("linesSpoken");

    const updateBarchart = () => {
      // If the "Episode appearances" option is chosen, get that data for the selected period
      if (barchartIsAppearances) {
        const appearances = getTopCharactersAppearancesBySeason(
          numBarchartCharacters
        );
        // If the entire show is selected, get the counts for that
        if (barchartSelectedPeriod == 0) {
          barchartData = getTopCharactersAppearancesEntireShow(
            appearances,
            numBarchartCharacters
          );
        } else {
          // If a season is selected, get the top characters for that season
          barchartData = appearances[barchartSelectedPeriod - 1].appearances;
        }
      }
      // Otherwise, get the lines spoken for the selected period
      else {
        const lines = getTopCharactersLinesBySeason(numBarchartCharacters);
        // If the entire show is selected, get the counts for that
        if (barchartSelectedPeriod == 0) {
          barchartData = getTopCharactersLinesEntireShow(
            lines,
            numBarchartCharacters
          );
        }
        // If a season is selected, get the top characters for that season
        else {
          barchartData = lines[barchartSelectedPeriod - 1].linesSpoken;
        }
      }

      // Update the barchart visualization
      barchart.updateVis();
    };

    barchartEpisodeAppearancesBtn.onclick = () => {
      barchartIsAppearances = true;
      updateBarchart();
    };

    barchartLinesSpokenBtn.onclick = () => {
      barchartIsAppearances = false;
      updateBarchart();
    };

    barchartPeriodSelect.onchange = () => {
      barchartSelectedPeriod = barchartPeriodSelect.value;
      updateBarchart();
    };
    //#endregion

    //#region Heat Map logic
    const heatmapCharacterSelect = document.getElementById(
      "heatmapCharacterSelect"
    );

    const updateHeatmap = () => {
      heatmapData = getNumberOfLinesPerEpisode(heatmapSelectedCharacter);
      heatmap.updateVis();
    };

    heatmapCharacterSelect.onchange = () => {
      heatmapSelectedCharacter = heatmapCharacterSelect.value;
      updateHeatmap();
    };
    //#endregion

    //#region Word Cloud logic
    const wordCloudCharacterSelect = document.getElementById(
      "wordCloudCharacterSelect"
    );
    const wordcloudPeriodSelect = document.getElementById(
      "wordcloudPeriodSelect"
    );

    // Update the word cloud data and re-render the visualization
    const updateWordcloud = () => {
      if (wordcloudSelectedPeriod == 0) {
        wordcloudData = getCharacterWordsEntireShow(
          wordcloudSelectedCharacter,
          numWordcloudWords
        );
      } else {
        getCharacterWordsSingleSeason(
          wordcloudSelectedPeriod,
          wordcloudSelectedCharacter,
          numWordcloudWords
        );
      }
      wordcloud.updateVis();
    };

    // Update the available characters within the dropdown
    const updateWordcloudAvailableCharacters = () => {
      // Add the options
      wordcloudCharacterOptions[wordcloudSelectedPeriod].forEach(
        (character, index) => {
          wordCloudCharacterSelect.options[index] = new Option(
            character,
            character
          );
        }
      );

      // Select the first character
      wordcloudSelectedCharacter = wordCloudCharacterSelect.options[0].value;

      // Update the visualization
      updateWordcloud();
    };

    wordcloudPeriodSelect.onchange = () => {
      wordcloudSelectedPeriod = wordcloudPeriodSelect.value;
      updateWordcloudAvailableCharacters();
    };

    wordCloudCharacterSelect.onchange = () => {
      wordcloudSelectedCharacter = wordCloudCharacterSelect.value;
      updateWordcloud();
    };
    //#endregion

    //#region Arc Diagram logic
    //#endregion
  })
  .catch((error) => console.error(error));

// NO NEED TO RUN THIS FILE UNLESS JSON FILE NEEDS TO BE RECREATED
// This can be run with "node js/createJSONFile.js"
const fs = require("fs");
const readline = require("readline");

// Read file line by line
const readStream = readline.createInterface({
  input: fs.createReadStream("data/Friends_Transcript.txt"),
});

const transcriptJSON = {
  seasons: [],
};

const firstEpisodeOfEachSeason = [
  "THE ONE WHERE IT ALL BEGAN", // 1
  "THE ONE WITH ROSS'S NEW GIRLFRIEND", // 2
  "THE ONE WITH THE PRINCESS LEIA FANTASY", // 3
  "THE ONE WITH THE JELLYFISH", // 4
  "THE ONE AFTER ROSS SAYS RACHEL", // 5
  "THE ONE AFTER VEGAS", // 6
  "THE ONE WITH MONICA'S THUNDER", // 7
  "THE ONE AFTER I DO", // 8
  "THE ONE WHERE NO ONE PROPOSES", // 9
  "THE ONE AFTER JOEY AND RACHEL KISS", // 10
];

// Keep track of where in the object data should be added
let currentSeason = 0;
let currentEpisode = 0;
let currentScene = 0;

// Event listener for each line read
readStream.on("line", (line) => {
  // Remove any whitespace
  line = line.trim();

  // If it's an episode title...
  if (line.includes("THE ONE ")) {
    // If it's the start of a new season, create a new season in the JSON variable
    if (firstEpisodeOfEachSeason.includes(line)) {
      currentSeason++;
      currentEpisode = 0;
      transcriptJSON.seasons.push({
        number: currentSeason,
        episodes: [],
      });
    }

    // Regardless, add the episode
    currentEpisode++;
    currentScene = 0;
    transcriptJSON.seasons[currentSeason - 1].episodes.push({
      number: currentEpisode,
      name: line,
      scenes: [],
    });
  }
  // If it's a new scene, add it to the JSON variable within the current season and episode
  else if (line.includes("Scene: ")) {
    currentScene++;
    let sceneLoc = line.substring(8).trim();
    sceneLoc = sceneLoc.substring(0, sceneLoc.length - 1);
    transcriptJSON.seasons[currentSeason - 1].episodes[
      currentEpisode - 1
    ].scenes.push({
      number: currentScene,
      location: sceneLoc,
      lines: [],
    });
  }
  // If it's denoting the end of an episode or is any empty line, skip it
  else if (line === "END" || line.length === 0) {
    return;
  }
  // If it's a character's line
  else {
    const colonIndex = line.indexOf(":");

    // Get the character's name
    const character = line.substring(0, colonIndex).trim();

    // Get the line they said
    const spokenLine = line
      .substring(colonIndex + 1)
      .split(":")
      .join("")
      .trim();

    transcriptJSON.seasons[currentSeason - 1].episodes[
      currentEpisode - 1
    ].scenes[currentScene - 1].lines.push({
      character: character,
      spokenLine: spokenLine,
      words: spokenLine.toLowerCase().split(":").join("").split(" "),
    });
  }
});

// Event listener for end of file
readStream.on("close", () => {
  const resultsFile = fs.createWriteStream("data/data.json");
  resultsFile.write(JSON.stringify(transcriptJSON));
  resultsFile.close();
  console.log("JSON file created");
});

// Event listener for error
readStream.on("error", err => {
  console.error("Error reading file:", err);
});

/**
 * Get the count of all non-stop words in the provided array
 * @param {Array} arrayOfWords An array (or array of arrays) of words
 * @returns {[...{word: string, count: number}]} An array with objects containing the count of each non-stop word
 */
const getWordCounts = (arrayOfWords) => {
  // Make the array 1D and remove stop words
  const filteredWords = arrayOfWords
    .flat(Infinity)
    .filter((word) => !stopWords.includes(word));

  // Get the count of each word
  return Object.entries(
    filteredWords.reduce((acc, word) => ((acc[word] = -~acc[word]), acc), {})
  ).map(([word, count]) => ({ word, count }));
};

// Get the characters that appear in the most episodes in each season (for barchart)
const getTopCharactersAppearancesBySeason = (allData, numCharacters) => {
  return allData.seasons.map((_, seasonIndex) => ({
    season: seasonIndex + 1,
    appearances: [
      ...allData.seasons[seasonIndex].episodes.reduce((acc, episode) => {
        const spoken = new Set();
        episode.scenes.forEach((scene) =>
          scene.lines.forEach((line) => spoken.add(line.character))
        );
        [...spoken].forEach((character) => {
          if (namedCharacters.includes(character)) {
            acc.set(character, (acc.get(character) || 0) + 1);
          }
        });
        return acc;
      }, new Map()),
    ]
      .sort((a, b) => b[1] - a[1])
      .slice(0, numCharacters)
      .map(([character, numAppearances]) => ({ character, numAppearances })),
  }));
};

// Get the characters that appear in the most episodes throughout the entire show (for barchart)
const getTopCharactersAppearancesEntireShow = (
  topCharactersAppearancesBySeason,
  numCharacters
) => {
  return Object.entries(
    topCharactersAppearancesBySeason
      .flatMap((season) => season.appearances)
      .reduce(
        (acc, { character, numAppearances }) => (
          (acc[character] = (acc[character] || 0) + numAppearances), acc
        ),
        {}
      )
  )
    .map(([character, numAppearances]) => ({ character, numAppearances }))
    .sort((a, b) => b.numAppearances - a.numAppearances)
    .slice(0, numCharacters);
};

// Get the characters that speak the most throughout the entire show (for barchart)
const getTopCharactersLinesEntireShow = (
  topCharactersLinesBySeason,
  numCharacters
) => {
  return Object.entries(
    topCharactersLinesBySeason
      .flatMap((season) => season.linesSpoken)
      .reduce(
        (acc, { character, numLines }) => (
          (acc[character] = (acc[character] || 0) + numLines), acc
        ),
        {}
      )
  )
    .map(([character, numLines]) => ({ character, numLines }))
    .sort((a, b) => b.numLines - a.numLines)
    .slice(0, numCharacters);
};

// Get the characters that speak the most lines in each season (for barchart)
const getTopCharactersLinesBySeason = (allData, numCharacters) => {
  return allData.seasons.map((season, index) => {
    // Initialize an object to store line counts for each character
    const lineCounts = {};

    // Iterate over episodes and scenes to count lines for each character
    season.episodes.forEach((episode) => {
      episode.scenes.forEach((scene) => {
        scene.lines.forEach((line) => {
          const { character } = line;
          if (namedCharacters.includes(character))
            lineCounts[character] = (lineCounts[character] || 0) + 1;
        });
      });
    });

    // Convert lineCounts object into an array of objects
    const linesSpoken = Object.entries(lineCounts)
      .sort(([, countA], [, countB]) => countB - countA) // Sort characters by line count
      .slice(0, numCharacters) // Select the top 10 characters with the most lines spoken
      .map(([character, numLines]) => ({ character, numLines }));

    return { season: index + 1, linesSpoken };
  });
};

// Get the number of lines the provided character says within each episode (for heatmap)
const getNumberOfLinesPerEpisode = (allData, characterName) => {
  return allData.seasons.flatMap((season, seasonIndex) =>
    season.episodes.flatMap((episode, episodeIndex) => ({
      season: seasonIndex + 1,
      episode: episodeIndex + 1,
      linesSpoken: episode.scenes.reduce(
        (acc, scene) =>
          acc +
          scene.lines.filter((line) => line.character === characterName).length,
        0
      ),
    }))
  );
};

// Get all of the characters present within all the data
// DO NOT USE AGAIN, JUST FOR CREATING namedCharacters IN helperVariables.js
const getAllCharacters = () => {
  return [
    ...new Set(
      allData.seasons.flatMap((season) =>
        season.episodes.flatMap((episode) =>
          episode.scenes.flatMap((scene) =>
            scene.lines.map((line) => line.character)
          )
        )
      )
    ),
  ];
};

// Used to create the locationFrequencies variable in helperVariables.js
// Use that variable instead of calling this method!
const getLocationsFrequency = (data) => {
  const result = data.seasons
    .flatMap((season) =>
      season.episodes.flatMap((episode) =>
        episode.scenes.map((scene) => scene.location)
      )
    )
    .reduce((acc, location) => ((acc[location] = -~acc[location]), acc), {});

  return Object.entries(result)
    .map(([location, frequency]) => ({ location, frequency }))
    .sort((a, b) => b.frequency - a.frequency);
};

/**
 * Get the count of all non-stop words in the provided array
 * @param {Array} arrayOfWords An array (or array of arrays) of words
 * @param {number} numWords The number of words to return
 * @returns {[...{word: string, count: number}]} An array with objects containing the count of each non-stop word
 */
const getWordCounts = (arrayOfWords, numWords) => {
  // Make the array 1D and remove stop words
  const filteredWords = arrayOfWords
    .flat(Infinity)
    .filter((word) => !stopWords.includes(word));

  // Get the count of each word
  return Object.entries(
    filteredWords.reduce((acc, word) => ((acc[word] = -~acc[word]), acc), {})
  )
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, numWords);
};

// Get the words a character said in the entire show (for wordcloud)
const getCharacterWordsEntireShow = (characterName, numWords) => {
  const unfilteredWords = allData.seasons.flatMap((season) =>
    season.episodes.flatMap((episode) =>
      episode.scenes.flatMap((scene) =>
        scene.lines
          .filter((line) => line.character === characterName)
          .map((line) => line.words)
      )
    )
  );
  return getWordCounts(unfilteredWords, numWords);
};

// Get the words a character said in a specific season (for wordcloud)
const getCharacterWordsSingleSeason = (
  seasonNumber,
  characterName,
  numWords
) => {
  const unfilteredWords = allData.seasons[seasonNumber - 1].episodes.flatMap(
    (episode) =>
      episode.scenes.flatMap((scene) =>
        scene.lines
          .filter((line) => line.character === characterName)
          .flatMap((line) => line.words)
      )
  );
  return getWordCounts(unfilteredWords, numWords);
};

// Get the characters that appear in the most episodes in each season (for barchart)
const getTopCharactersAppearancesBySeason = (numCharacters) => {
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
const getTopCharactersLinesBySeason = (numCharacters) => {
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
const getNumberOfLinesPerEpisode = (characterName) => {
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

// Get the maximum number of lines spoken by the currently selected heatmap character
const getMaxLinesSpoken = () => {
  return heatmapData.reduce((max, obj) => {
    return obj.linesSpoken > max ? obj.linesSpoken : max;
  }, -Infinity);
};

// Get the minimum number of lines spoken by the currently selected heatmap character
const getMinLinesSpoken = () => {
  return heatmapData.reduce((min, obj) => {
    return obj.linesSpoken < min ? obj.linesSpoken : min;
  }, Infinity);
};

// Get the data for the tree map visualization
const getTreeMapData = (numLocations, numCharacters) => {
  const locations = locationFrequencies.slice(0, numLocations);
  return locations.map((locationObj) => {
    const location = locationObj.location;
    const characterAppearances = {};

    allData.seasons.forEach((season) => {
      season.episodes.forEach((episode) => {
        episode.scenes.forEach((scene) => {
          if (scene.location === location) {
            const charactersInScene = new Set();
            scene.lines.forEach((line) => {
              if (namedCharacters.includes(line.character)) {
                charactersInScene.add(line.character);
              }
            });
            charactersInScene.forEach((character) => {
              characterAppearances[character] =
                (characterAppearances[character] || 0) + 1;
            });
          }
        });
      });
    });

    const sortedCharacters = Object.entries(characterAppearances)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, numCharacters);

    return {
      location,
      characterAppearances: sortedCharacters.map(
        ([character, numAppearances]) => ({
          character,
          numAppearances,
        })
      ),
    };
  });
};

// Get the number of scenes each pair of the top characters are in together (for arc diagram)
const getArcDiagramData = (selectedSeason, numCharacters) => {
  // Can't have more than 10 characters per season because
  //   we've hard-coded only 10 in wordcloudCharacterOptions in helperVariables.js
  if (numCharacters > 10) numCharacters = 10;
  const season = allData.seasons[selectedSeason - 1];
  const wordcloudCharacters = wordcloudCharacterOptions[selectedSeason].slice(
    0,
    numCharacters
  );

  const interactionsMap = {};

  season.episodes.forEach((episode) => {
    episode.scenes.forEach((scene) => {
      const charactersInScene = scene.lines.reduce((characters, line) => {
        const character = line.character;
        if (!characters.includes(character)) {
          characters.push(character);
        }
        return characters;
      }, []);

      charactersInScene.forEach((characterA, indexA) => {
        charactersInScene.slice(indexA + 1).forEach((characterB) => {
          const interactionKey = [characterA, characterB].sort().join("-");
          if (
            wordcloudCharacters.includes(characterA) &&
            wordcloudCharacters.includes(characterB)
          ) {
            interactionsMap[interactionKey] =
              (interactionsMap[interactionKey] || 0) + 1;
          }
        });
      });
    });
  });

  return Object.entries(interactionsMap).map(([interaction, count]) => {
    const [characterA, characterB] = interaction.split("-");
    return { characterA, characterB, interactions: count };
  });
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

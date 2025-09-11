const generateConnection = (wordList) => {
  const connections = {};
  const words = [...new Set(wordList.map(w => w.toUpperCase()).filter(w => w.length > 1))];

  for (const keyWord of words) {
    connections[keyWord] = [];
    for (const otherWord of words) {
      if (keyWord === otherWord) continue;
      if (keyWord.slice(-2) === otherWord.slice(0, 2)) {
        connections[keyWord].push(otherWord);
      }
    }
  }
  
  return connections;
};

export const generateConnections = (lists) => {
  const connectionsByList = {};
  for (const listId in lists) {
    const wordList = lists[listId];
    if (wordList && Array.isArray(wordList)) {
      connectionsByList[listId] = generateConnection(wordList);
    }
  }

  return connectionsByList;
};

const checkQueue = (chain, queue, cellSet) => {
  const charMap = {};
  for (let i = 0; i < chain.length; i++) {
    const cellId = queue[i];
    const cell = cellSet[cellId];
    const charInChain = chain[i];

    if (cell && cell.char && cell.char.toUpperCase() !== charInChain) {
      return false;
    }

    if (charMap[cellId] && charMap[cellId] !== charInChain) {
      return false;
    }
    charMap[cellId] = charInChain;
  }
  return true;
};

export const findPaths = (connections, queue, cellSet) => {
  if (!queue || queue.length === 0) {
    return [];
  }

  const allPaths = [];
  const pathLength = queue.length;

  // The connections object is a dictionary of connection sets, keyed by listId.
  // We need to search for paths across all connection sets, so we merge them.
  const mergedConnections = Object.values(connections).reduce((acc, conn) => ({...acc, ...conn}), {});

  function find(currentWord, currentPath, currentChain) {
    if (currentChain.length > pathLength) {
      return;
    }

    if (!checkQueue(currentChain, queue, cellSet)) {
      return;
    }

    if (currentChain.length === pathLength) {
      allPaths.push({ path: currentPath, chain: currentChain });
      return;
    }

    const nextWords = mergedConnections[currentWord] || [];
    for (const nextWord of nextWords) {
      if (!currentPath.includes(nextWord)) {
        find(nextWord, [...currentPath, nextWord], currentChain + nextWord.slice(2));
      }
    }
  }

  // Iterate over all words as potential start words
  for (const startWord of Object.keys(mergedConnections)) {
    if (startWord.length <= pathLength) {
      find(startWord, [startWord], startWord);
    }
  }

  return allPaths;
};

export const solveAllQueues = (queues, connections, cellSet) => {
  const pathsPerQueue = queues.map(queue => findPaths(connections, queue, cellSet));

  if (pathsPerQueue.some(paths => paths.length === 0)) {
    return [];
  }

  const solutions = [];

  function findSolutions(queueIndex, currentSelectedPaths, usedWords, charMap) {
    if (queueIndex === queues.length) {
      solutions.push(currentSelectedPaths);
      return;
    }

    const currentQueue = queues[queueIndex];
    const pathsForCurrentQueue = pathsPerQueue[queueIndex];

    for (const path of pathsForCurrentQueue) {
      const wordsInPath = path.path;
      const chain = path.chain;
      
      let wordConflict = false;
      for (const word of wordsInPath) {
        if (usedWords.has(word)) {
          wordConflict = true;
          break;
        }
      }
      if (wordConflict) {
        continue;
      }

      let charConflict = false;
      const nextCharMap = { ...charMap };
      for (let i = 0; i < chain.length; i++) {
        const cellId = currentQueue[i];
        const charInChain = chain[i];
        if (nextCharMap[cellId] && nextCharMap[cellId] !== charInChain) {
          charConflict = true;
          break;
        }
        nextCharMap[cellId] = charInChain;
      }

      if (charConflict) {
        continue;
      }
      
      const newUsedWords = new Set([...usedWords, ...wordsInPath]);
      findSolutions(
        queueIndex + 1,
        [...currentSelectedPaths, path],
        newUsedWords,
        nextCharMap
      );
    }
  }

  findSolutions(0, [], new Set(), {});
  return solutions;
};
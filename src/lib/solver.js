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
    const charInChain = chain[i];

    if (cellSet[i] && cellSet[i].char && cellSet[i].char.toUpperCase() !== charInChain) {
      return false;
    }

    if (charMap[cellId] && charMap[cellId] !== charInChain) {
      return false;
    }
    charMap[cellId] = charInChain;
  }
  return true;
};

export const findPaths = (startWord, connections, queue, cellSet) => {
  if (!queue || queue.length === 0) {
    return [];
  }
  const paths = [];
  const pathLength = queue.length;
  const upperCaseStartWord = startWord.toUpperCase();

  function find(currentWord, currentPath, currentChain) {
    if (currentChain.length > pathLength) {
      return;
    }

    if (!checkQueue(currentChain, queue, cellSet)) {
      return;
    }

    if (currentChain.length === pathLength) {
      paths.push({ path: currentPath, chain: currentChain });
      return;
    }

    const nextWords = connections[currentWord] || [];
    for (const nextWord of nextWords) {
      if (!currentPath.includes(nextWord)) {
        find(nextWord, [...currentPath, nextWord], currentChain + nextWord.slice(2));
      }
    }
  }

  if (connections[upperCaseStartWord] && upperCaseStartWord.length <= pathLength) {
    find(upperCaseStartWord, [upperCaseStartWord], upperCaseStartWord);
  }

  return paths;
};

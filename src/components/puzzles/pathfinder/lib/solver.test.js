
import { findPaths, generateConnections } from './solver';

describe('Solver', () => {
  describe('generateConnections', () => {
    it('should generate as many connections as word lists are provided', () => {
      const wordList1 = ['word1', 'word2', 'word3'];
      const wordList2 = ['word4', 'word5', 'word6'];
      const wordList3 = ['word7', 'word8', 'word9'];
      const listsOfOneList = { 'list1': wordList1 };
      const listsOfThreeLists = { 'list1': wordList1, 'list2': wordList2, 'list3': wordList3 };

      const connections1 = generateConnections(listsOfOneList);
      const connections2 = generateConnections(listsOfThreeLists);

      expect(Object.keys(connections1).length).toBe(1);
      expect(Object.keys(connections2).length).toBe(3);
    });
    it('keys of lists provided should match keys of connections', () => {
      const lists = {
        'listA': ['word1', 'word2', 'word3'],
        'listB': ['word4', 'word5', 'word6']
      };
      const connections = generateConnections(lists);
      expect(Object.keys(connections)).toEqual(Object.keys(lists));
    });
    it('should form connections based on the last two and first two characters', () => {
      const lists = {
        list1: ['apple', 'lemon', 'onion', 'leo']
      };
      const connections = generateConnections(lists);
      expect(connections.list1).toEqual({
        'APPLE': ['LEMON', 'LEO'],
        'LEMON': ['ONION'],
        'ONION': [],
        'LEO': []
      });
    });
  });

  describe('findPaths', () => {
    const list1 = ['apple', 'lemon', 'onion', 'leo'];
    const list2 = ['egg', 'leg', 'salsa', 'sadle', 'sand'];
    const list3 = ['stone', 'neon', 'never', 'error', 'amber'];
    const connectionsSingleList = generateConnections({ 'list1': list1 });
    const connectionsMultipleLists = generateConnections({ 'list1': list1, 'list2': list2, 'list3': list3 });

    it('should return an empty array for an empty queue', () => {
      const result = findPaths(connectionsSingleList, [], {});
      expect(result).toEqual([]);
    });

    it('should return an empty array when connections are empty', () => {
      // Case where queue is of length 4, but words in word lists are
      // of length 3 or 5
      const queue1 = ['id1', 'id2', 'id3', 'id4'];
      const result1 = findPaths(connectionsSingleList, queue1, {});
      expect(result1).toEqual([]);
      // Case where queue is too long to form a valid path
      // Logest possible queue is 11
      const queue2 = ['id1', 'id2', 'id3', 'id4', 'id5', 'id6', 'id7', 'id8', 'id9', 'id10', 'id11', 'id12'];
      const result2 = findPaths(connectionsSingleList, queue2, {});
      expect(result2).toEqual([]);
    });

    it('should return a single valid path of a single word', () => {
      // Case where queue is length 3, and word list has a single word
      // of length 3
      const queue = ['id1', 'id2', 'id3'];
      const result = findPaths(connectionsSingleList, queue, {});
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ path: ['LEO'], chain: 'LEO' });
    });

    it('should return multiple valid paths of multiple words', () => {
      // Case where queue is length 5, there are 3 words in the word list
      // of length 5
      const queue = ['id1', 'id2', 'id3', 'id4', 'id5'];
      const result = findPaths(connectionsSingleList, queue, {});
      expect(result).toHaveLength(3);
    });

    it('should return multiple valid paths of multi word list connections', () => {
      // Case where queue is length 3, there are 3 words of that length
      // in multi path connections
      const queue1 = ['id1', 'id2', 'id3'];
      const result1 = findPaths(connectionsMultipleLists, queue1, {});
      expect(result1).toHaveLength(3);

      // Case where queue is length 5, there are 9 words of that length
      // in multi path connections
      const queue2 = ['id1', 'id2', 'id3', 'id4', 'id5'];
      const result2 = findPaths(connectionsMultipleLists, queue2, {});
      expect(result2).toHaveLength(9);
    });

    it('should return find a valid path chaining 3 words', () => {
      // Case queue length 11
      const queue = ['id1', 'id2', 'id3', 'id4', 'id5', 'id6', 'id7', 'id8', 'id9', 'id10', 'id11'];
      const result = findPaths(connectionsSingleList, queue, {});
      expect(result).toHaveLength(1);
      const path = result[0];
      expect(path.path).toEqual(['APPLE', 'LEMON', 'ONION']);
      expect(path.chain).toEqual('APPLEMONION');
    });

    it('should find all valid paths in a single list', () => {
      // Case queue length is 8
      const queue = ['id1', 'id2', 'id3', 'id4', 'id5', 'id6', 'id7', 'id8'];
      const result = findPaths(connectionsSingleList, queue, {});
      expect(result).toHaveLength(2);
      const chains = result.map(path => path.chain);
      expect(chains).toContain('APPLEMON');
      expect(chains).toContain('LEMONION');
      const paths = result.map(path => path.path);
      expect(paths).toContainEqual(['APPLE', 'LEMON']);
      expect(paths).toContainEqual(['LEMON', 'ONION']);
    });

    it('should find all valid paths in a multi list', () => {
      const queue = ['id1', 'id2', 'id3', 'id4', 'id5', 'id6', 'id7', 'id8'];
      const result = findPaths(connectionsMultipleLists, queue, {});
      expect(result).toHaveLength(6);
    });
  });
  describe('findPaths with constraints', () => {
    const list = ['cheese', 'second', 'seat', 'attack'];
    const connections = generateConnections({ 'list': list });

    it('should find valid paths with repeating character constraints, short chain (6 chars)', () => {

      const queueNoConstraints = ['id1', 'id2', 'id3', 'id4', 'id5', 'id6'];
      const resultNoConstraint = findPaths(connections, queueNoConstraints, {});
      expect(resultNoConstraint).toHaveLength(3);
      expect(resultNoConstraint.map(path => path.chain)).toContain('CHEESE');
      expect(resultNoConstraint.map(path => path.chain)).toContain('SECOND');
      expect(resultNoConstraint.map(path => path.chain)).toContain('ATTACK');

      const queueWithConstraints1 = ['id1', 'id2', 'id3', 'id3', 'id5', 'id3'];
      const resultWithConstraints1 = findPaths(connections, queueWithConstraints1, {});
      expect(resultWithConstraints1).toHaveLength(1);
      expect(resultWithConstraints1.map(path => path.chain)).toContain('CHEESE');

      const queueWithConstraints2 = ['id1', 'id2', 'id2', 'id1', 'id5', 'id6'];
      const resultWithConstraints2 = findPaths(connections, queueWithConstraints2, {});
      expect(resultWithConstraints2).toHaveLength(1);
      expect(resultWithConstraints2.map(path => path.chain)).toContain('ATTACK');
    });

    it('should find valid paths with repeating character constraints, long chain (12 chars)', () => {

      const queueNoConstraints = ['id1', 'id2', 'id3', 'id4', 'id5', 'id6', 'id7', 'id8', 'id9', 'id10', 'id11', 'id12'];
      const resultNoConstraint = findPaths(connections, queueNoConstraints, {});
      expect(resultNoConstraint).toHaveLength(1);
      expect(resultNoConstraint.map(path => path.chain)).toContain('CHEESEATTACK');

      const queueWithConstraints = ['id1', 'id2', 'id3', 'id4', 'id5', 'id6', 'id7', 'id8', 'id9', 'id10', 'id1', 'id12'];
      const resultWithConstraints = findPaths(connections, queueWithConstraints, {});
      expect(resultWithConstraints).toHaveLength(1);
      expect(resultWithConstraints.map(path => path.chain)).toContain('CHEESEATTACK');
    });

    // it('should find valid paths with character at specific position in chain constraints', () => {
    //   const queue = ['id1', 'id2', 'id3', 'id4', 'id5', 'id6'];
    //   const cellSet = { 'id1': { char: 'C' } };
    //   const result = findPaths(connections, queue, cellSet);
    //   expect(result).toHaveLength(1);
    //   expect(result.map(path => path.chain)).toContain('CHEESE');

    // })
  });
});
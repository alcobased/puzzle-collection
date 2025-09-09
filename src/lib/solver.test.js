import { findPaths, generateConnections } from './solver';

describe('Solver', () => {
  describe('findPaths', () => {
    it('should return an empty array when the start word is longer than the queue', () => {
      const connections = {
        'WORD': ['TEST'],
      };
      const queue = [1, 2, 3];
      const cellSet = {};
      const result = findPaths('WORD', connections, queue, cellSet);
      expect(result).toEqual([]);
    });

    it('should find a simple path with a single word', () => {
        const connections = {
          'WORD': ['TEST'],
        };
        const queue = [1, 2, 3, 4];
        const cellSet = {};
        const result = findPaths('WORD', connections, queue, cellSet);
        expect(result).toEqual([{ path: ['WORD'], chain: 'WORD' }]);
    });

    it('should find a path with two words', () => {
        const connections = {
            'WORD': ['RIDE'],
        };
        const queue = [1, 2, 3, 4, 5, 6];
        const result = findPaths('WORD', { 'WORD': ['RIDE'] }, queue, {});
        expect(result).toEqual([{ path: ['WORD', 'RIDE'], chain: 'WORDDE' }]);
    });

    it('should fail to find a path due to queue constraints', () => {
        const connections = {
            'WORD': ['RIDE'],
        };
        const queue = [1, 2, 3, 1, 5, 6]; // W != R
        const cellSet = {};
        const result = findPaths('WORD', connections, queue, cellSet);
        expect(result).toEqual([]);
    });

    it('should find a path that satisfies queue constraints', () => {
        const connections = {
            'LEVEL': ['LUCK'],
        };
        const queue = [1, 2, 3, 2, 1];
        const cellSet = {};
        const result = findPaths('LEVEL', connections, queue, cellSet);
        expect(result).toEqual([{ path: ['LEVEL'], chain: 'LEVEL' }]);
    });

    it('should fail to find a path due to cellSet constraints', () => {
        const connections = {
            'WORD': ['RIDE'],
        };
        const queue = [1, 2, 3, 4, 5, 6];
        const cellSet = { 1: { char: 'X' } };
        const result = findPaths('WORD', connections, queue, cellSet);
        expect(result).toEqual([]);
    });

    it('should find a path that satisfies cellSet constraints', () => {
        const connections = {
            'WORD': ['RIDE'],
        };
        const queue = [1, 2, 3, 4, 5, 6];
        const cellSet = { 2: { char: 'R' } };
        const result = findPaths('WORD', { 'WORD': ['RIDE'] }, queue, cellSet);
        expect(result).toEqual([{ path: ['WORD', 'RIDE'], chain: 'WORDDE' }]);
    });

    it('should not reuse words in a path', () => {
      const connections = {
        'A': ['B'],
        'B': ['A'],
      };
      const queue = [1, 2, 3, 4];
      const result = findPaths('A', connections, queue, {});
      expect(result).toEqual([]);
    });
  });

  describe('generateConnections', () => {
    it('should generate connections correctly', () => {
      const lists = {
        list1: ['APPLE', 'LEMON', 'ONION', 'ONSET']
      };
      const connections = generateConnections(lists);
      expect(connections.list1).toEqual({
        'APPLE': ['LEMON'],
        'LEMON': ['ONION', 'ONSET'],
        'ONION': ['ONSET'],
        'ONSET': []
      });
    });
  });
});

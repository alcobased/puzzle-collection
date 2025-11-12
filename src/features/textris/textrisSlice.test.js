import {
  updateGrid,
  validShapePosition,
  findValidShapePosition,
} from "./textrisSlice";

describe("updateGrid", () => {
  const initialGrid = {
    width: 5,
    height: 5,
    occupiedCells: [
      [false, false, false, false, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
      [false, false, false, true, false],
      [false, false, false, false, false],
    ],
  };

  it("should expand the grid correctly", () => {
    const newGrid = updateGrid(initialGrid, 7, 7);
    expect(newGrid.width).toBe(7);
    expect(newGrid.height).toBe(7);
    expect(newGrid.occupiedCells.length).toBe(7);
    expect(newGrid.occupiedCells[0].length).toBe(7);
    expect(newGrid.occupiedCells[1][2]).toBe(true);
    expect(newGrid.occupiedCells[3][3]).toBe(true);
    expect(newGrid.occupiedCells[6][6]).toBe(false);
  });

  it("should contract the grid correctly when no occupied cells are trimmed", () => {
    const newGrid = updateGrid(initialGrid, 4, 4);
    expect(newGrid.width).toBe(4);
    expect(newGrid.height).toBe(4);
    expect(newGrid.occupiedCells[1][2]).toBe(true);
    expect(newGrid.occupiedCells.length).toBe(4);
    expect(newGrid.occupiedCells[0].length).toBe(4);
  });

  it("should not contract the grid if occupied cells would be trimmed", () => {
    const newGrid = updateGrid(initialGrid, 3, 5);
    expect(newGrid).toEqual(initialGrid);

    const newGrid2 = updateGrid(initialGrid, 5, 3);
    expect(newGrid2).toEqual(initialGrid);
  });

  it("should handle mixed expansion and contraction", () => {
    const newGrid = updateGrid(initialGrid, 6, 4);
    expect(newGrid.width).toBe(6);
    expect(newGrid.height).toBe(4);
    expect(newGrid.occupiedCells.length).toBe(4);
    expect(newGrid.occupiedCells[0].length).toBe(6);
  });

  it("should return the same grid if dimensions are the same", () => {
    const newGrid = updateGrid(initialGrid, 5, 5);
    expect(newGrid).toEqual(initialGrid);
  });
});

describe("validShapePosition", () => {
  const grid = {
    width: 10,
    height: 10,
    occupiedCells: [
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, true, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
    ],
  };

  const shape = {
    grid: [
      ["T", "T"],
      [null, "T"],
    ],
  };

  const concaveShape = {
    grid: [
      ["T", "T", "T"],
      ["T", null, null],
      ["T", "T", "T"],
    ],
  };

  it("should return true for a valid placement", () => {
    const position = { x: 0, y: 0 };
    expect(validShapePosition(grid, shape, position)).toBe(true);
  });

  it("should return false for an out-of-bounds placement", () => {
    const position = { x: 9, y: 0 };
    expect(validShapePosition(grid, shape, position)).toBe(false);
  });

  it("should return false for a placement that collides with an occupied cell", () => {
    const position = { x: 3, y: 1 };
    expect(validShapePosition(grid, shape, position)).toBe(false);
  });

  it("concave shape should fit in grid", () => {
    const position = { x: 3, y: 1 };
    expect(validShapePosition(grid, concaveShape, position)).toBe(true);
  });
});

describe("findValidShapePosition", () => {
  const shape = {
    grid: [
      ["T", "T"],
      [null, "T"],
    ],
  };

  it("should find a valid position in an empty grid", () => {
    const grid = {
      width: 5,
      height: 5,
      occupiedCells: Array.from({ length: 5 }, () => Array(5).fill(false)),
    };
    expect(findValidShapePosition(grid, shape)).toEqual({ x: 0, y: 0 });
  });

  it("should return null if no valid position is found", () => {
    const grid = {
      width: 2,
      height: 2,
      occupiedCells: [
        [true, true],
        [true, true],
      ],
    };
    expect(findValidShapePosition(grid, shape)).toBeNull();
  });

  it("should find the first available position", () => {
    const grid = {
      width: 5,
      height: 5,
      occupiedCells: [
        [true, true, true, true, true],
        [true, true, true, true, true],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
      ],
    };
    expect(findValidShapePosition(grid, shape)).toEqual({ x: 0, y: 2 });
  });
});

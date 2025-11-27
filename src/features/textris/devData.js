export const devShapes = [
  {
    id: "shape-1",
    boardName: "shapesBoard",
    locationOnBoard: { x: 0, y: 0 },
    grid: [
      ["A", null],
      ["B", "C"],
      [null, "D"],
    ],
    color: 2,
  },
  {
    id: "shape-2",
    boardName: "shapesBoard",
    locationOnBoard: { x: 2, y: 0 },
    grid: [
      ["A", "B", "C"],
      [null, "D", null],
    ],
    color: 4,
  },
  {
    id: "shape-3",
    boardName: "shapesBoard",
    locationOnBoard: { x: 0, y: 3 },
    grid: [
      [null, "B"],
      ["A", "C"],
    ],
    color: 1,
  },
  {
    id: "shape-4",
    boardName: "shapesBoard",
    locationOnBoard: { x: 0, y: 0 },
    grid: [
      ["A", null],
      ["B", "C"],
    ],
    color: 7,
  },
  {
    id: "shape-5",
    boardName: "shapesBoard",
    locationOnBoard: { x: 0, y: 0 },
    grid: [["A", "B"]],
    color: 3,
  },
];

export const devSolutionBoard = {
  width: 10,
  height: 10,
  occupiedCells: [
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
  ],
  name: "solutionBoard",
};

export const devShapesBoard = {
  width: 16,
  height: 9,
  occupiedCells: [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ],
  name: "shapesBoard",
};

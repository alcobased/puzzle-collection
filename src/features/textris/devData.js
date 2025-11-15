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
    boardName: "solutionBoard",
    locationOnBoard: { x: 1, y: 1 },
    grid: [
      [null, "A", null],
      [null, "B", "F"],
      [null, "C", null],
      ["E", "D", null],
    ],
    color: 7,
  },
];

export const devSolutionBoard = {
  width: 5,
  height: 5,
  grid: [
    [false, false, false, false, false],
    [false, false, true, false, false],
    [false, false, true, true, false],
    [false, false, true, false, false],
    [false, true, true, false, false],
  ],
  name: "solutionBoard",
};

export const devShapesBoard = {
  width: 9,
  height: 5,
  grid: [
    [true, false, true, true, true, false, false, false, false],
    [true, true, false, true, false, false, false, false, false],
    [false, true, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, false, false],
    [true, true, false, false, false, false, false, false, false],
  ],
  name: "shapesBoard",
};

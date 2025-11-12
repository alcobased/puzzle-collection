export const devShapes = [
  {
    id: "shape-1",
    location: "shapesGrid",
    position: { x: 0, y: 0 },
    grid: [
      ["A", null],
      ["B", "C"],
      [null, "D"],
    ],
    color: 2,
  },
  {
    id: "shape-2",
    location: "shapesGrid",
    position: { x: 2, y: 0 },
    grid: [
      ["A", "B", "C"],
      [null, "D", null],
    ],
    color: 4,
  },
  {
    id: "shape-3",
    location: "shapesGrid",
    position: { x: 0, y: 3 },
    grid: [
      [null, "B"],
      ["A", "C"],
    ],
    color: 1,
  },
  {
    id: "shape-4",
    location: "boardGrid",
    position: { x: 1, y: 1 },
    grid: [
      [null, "A", null],
      [null, "B", "F"],
      [null, "C", null],
      ["E", "D", null],
    ],
    color: 7,
  },
];

export const devBoardGrid = {
  width: 5,
  height: 5,
  occupiedCells: [
    [false, false, false, false, false],
    [false, false, true, false, false],
    [false, false, true, true, false],
    [false, false, true, false, false],
    [false, true, true, false, false],
  ],
  name: "boardGrid",
};

export const devShapesGrid = {
  width: 9,
  height: 5,
  occupiedCells: [
    [true, false, true, true, true, false, false, false, false],
    [true, true, false, true, false, false, false, false, false],
    [false, true, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, false, false],
    [true, true, false, false, false, false, false, false, false],
  ],
  name: "shapesGrid",
};

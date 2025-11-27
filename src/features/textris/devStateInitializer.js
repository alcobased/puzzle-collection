import { addShape, updateShapeLocation } from "./textrisSlice";

// Define your dummy project objects
const DUMMY_SHAPES = [
  {
    id: "dev-shape-1",
    grid: [
      ["A", null],
      ["B", "C"],
      [null, "D"],
    ],
    color: 2,
    locationOnBoard: { x: 0, y: 0 },
    boardName: "shapesBoard",
  },
  {
    id: "dev-shape-2",
    grid: [
      ["A", "B", "C"],
      [null, "D", null],
    ],
    color: 4,
    locationOnBoard: { x: 2, y: 0 },
    boardName: "shapesBoard",
  },
  {
    id: "dev-shape-3",
    grid: [
      [null, "B"],
      ["A", "C"],
    ],
    color: 3,
    locationOnBoard: { x: 0, y: 3 },
    boardName: "shapesBoard",
  },
];

export const initializeTextrisDevData = () => (dispatch, getState) => {
  console.log("Dispatching multiple addProject actions...");

  DUMMY_SHAPES.forEach((shape) => {
    dispatch(addShape({ id: shape.id, grid: shape.grid, color: shape.color }));
    dispatch(
      updateShapeLocation({
        shapeId: shape.id,
        newBoardName: shape.boardName,
        newLocationOnBoard: shape.locationOnBoard,
      })
    );
  });
};

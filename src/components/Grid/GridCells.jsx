import { useSelector } from "react-redux";
import Cell from "./GridCell";

const GridCells = () => {

  const cells = useSelector((state) => state.cells);
  const { width, height } = useSelector((state) => state.image.dimensions);
  const { x, y } = useSelector((state) => state.image.position);

  for (let i = 0; i < cells.length; i++) {}
  return (
    <div id="cells">
      {cells.map((cell) => {
        const absoluteX = x + cell.normalizedPosition.x * width;
        const absoluteY = y + cell.normalizedPosition.y * height;
        const cellStyle = {
          left: absoluteX,
          top: absoluteY,
        }
        return (
          <Cell
            key={cell.id}
            style={cellStyle}
          />
        );
      })}
    </div>
  );
};

export default GridCells;

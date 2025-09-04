import { useSelector } from "react-redux";

const GridCells = () => {
  // const { cells } = useSelector((state) => state.grid);
  const { image } = useSelector((state) => state.image);
  console.log("image", image);

  const dummyCells = Array.from({ length: 10 }, () => ({
    x: Math.random(),
    y: Math.random(),
  }));
  console.log(dummyCells);

  return (
    <div id="cells">
      {dummyCells.map((cell, index) => (
        <div
          key={index}
          className="cell"
          style={{ left: `${cell.x * 100}%`, top: `${cell.y * 100}%` }}
        />
      ))}
    </div>
  );
};

export default GridCells;

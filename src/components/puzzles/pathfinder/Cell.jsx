import "../../common/Cell.css";

const Cell = ({
  style,
  char,
  additionalClassList,
  solutionChar,
  onClick,
  onContextMenu,
  onMouseOver,
}) => {
  // additionalClassList is an array of strings.
  // This array might contain empty strings,
  // this means that this class will not be added
  const filteredClassList = additionalClassList
    .filter((className) => className)
    .join(" ");
  const className = `cell ${filteredClassList}`;
  return (
    <div
      className={className}
      style={style}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseOver={onMouseOver}
    >
      {solutionChar || char}
    </div>
  );
};

export default Cell;

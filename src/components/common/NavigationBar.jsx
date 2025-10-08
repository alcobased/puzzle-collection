import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <div className="navigation">
      <Link to="/">Home</Link>
      <Link to="/pathfinder">Pathfinder</Link>
      <Link to="/about">About</Link>
    </div>
  );
};

export default NavigationBar;

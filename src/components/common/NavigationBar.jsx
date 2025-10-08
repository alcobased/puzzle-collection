import { NavLink } from "react-router-dom";
import './NavigationBar.css';

const NavigationBar = () => {
  return (
    <nav className="navigation-bar">
      <div className="logo">
        <NavLink to="/">Word Games</NavLink>
      </div>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/pathfinder" className={({ isActive }) => (isActive ? 'active' : '')}>Pathfinder</NavLink>
        </li>
        <li>
          <NavLink to="/word-chains" className={({ isActive }) => (isActive ? 'active' : '')}>Word Chains</NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;

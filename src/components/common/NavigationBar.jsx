import { NavLink } from "react-router-dom";
import './NavigationBar.css';

const NavigationBar = () => {
  return (
    <nav className="navigation-bar">
      <NavLink to="/" className="logo">Word Games</NavLink>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/pathfinder" className={({ isActive }) => (isActive ? 'active' : '')}>Pathfinder</NavLink>
        </li>
        <li>
          <NavLink to="/domino" className={({ isActive }) => (isActive ? 'active' : '')}>Domino</NavLink>
        </li>
        <li>
          <NavLink to="/textris" className={({ isActive }) => (isActive ? 'active' : '')}>Textris</NavLink>
        </li>
        <li>
          <NavLink to="/manual-processing" className={({ isActive }) => (isActive ? 'active' : '')}>Manual Processing</NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;

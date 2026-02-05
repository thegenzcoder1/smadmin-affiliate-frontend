import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Kancheepuram SM Silks
      </div>

      <div className="navbar-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Create PromoCode
        </NavLink>
      </div>
    </nav>
  );
}

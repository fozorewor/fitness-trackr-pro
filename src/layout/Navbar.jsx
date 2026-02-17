import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

/** Navbar with site navigation links */
export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <header className="navbar">
      <h3 className="logo">Fitness Trackr</h3>

      <nav className="nav-links">
        <NavLink to="/activities">Activities</NavLink>
        <NavLink to="/routines">Routines</NavLink>

        {!token ? (
          <>
            <NavLink to="/register">Register</NavLink>{" | "}
            <NavLink to="/login">Login</NavLink>
          </>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </nav>
    </header>
  );
}

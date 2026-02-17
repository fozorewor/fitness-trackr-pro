import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav>
      <NavLink to="/activities">Activities</NavLink>{" | "}
      <NavLink to="/routines">Routines</NavLink>{" | "}

      {!token ? (
        <>
          <NavLink to="/register">Register</NavLink>{" | "}
          <NavLink to="/login">Login</NavLink>
        </>
      ) : (
        <>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}

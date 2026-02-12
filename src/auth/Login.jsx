import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

/** A form that allows users to log into an existing account. */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const tryLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      await login(username, password);
      navigate("/activities");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h1>Log in to your account</h1>

      <form onSubmit={tryLogin}>
        <label>
          Username
          <input type="text" name="username" required />
        </label>

        <label>
          Password
          <input type="password" name="password" required />
        </label>

        <button type="submit">Login</button>

        {error && <p role="alert">{error}</p>}
      </form>

      <p>
        Need an account? <Link to="/register">Register here.</Link>
      </p>
    </>
  );
}

import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

/** A form that allows users to register for a new account */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const tryRegister = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      await register(username, password);
      navigate("/activities"); // redirect after successful registration
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h1>Register</h1>

      <form onSubmit={tryRegister}>
        <label>
          Username
          <input name="username" required />
        </label>

        <label>
          Password
          <input type="password" name="password" required />
        </label>

        <button type="submit">Register</button>
      </form>

      {error && <p role="alert">{error}</p>}

      <p>
        Already have an account? <Link to="/login">Login Here</Link>
      </p>
    </>
  );
}

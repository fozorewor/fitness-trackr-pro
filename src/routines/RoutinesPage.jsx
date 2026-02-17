import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getRoutines, createRoutine } from "../api/routines";

export default function RoutinesPage() {
  const { token } = useAuth();

  const [routines, setRoutines] = useState([]);
  const [error, setError] = useState(null);

  // create form state
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");

  async function loadRoutines() {
    setError(null);
    try {
      const data = await getRoutines();
      setRoutines(data);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    loadRoutines();
  }, []);

  const submitRoutine = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await createRoutine(token, { name, goal });
      setName("");
      setGoal("");
      await loadRoutines();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section>
      <h1>Routines</h1>

      {error && <p role="alert">{error}</p>}

      {/* Create routine form (only if logged in) */}
      {token && (
        <form onSubmit={submitRoutine}>
          <h2>Create a Routine</h2>

          <label>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Goal
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
          </label>

          <button type="submit">Create</button>
        </form>
      )}

      <h2>All Routines</h2>
      <ul>
        {routines.map((r) => (
          <li key={r.id}>
            <Link to={`/routines/${r.id}`}>{r.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getActivities } from "../api/activities";
import { addSet, deleteRoutine, deleteSet, getRoutines } from "../api/routines";

export default function RoutineDetails() {
  const { id } = useParams();
  const routineId = Number(id);
  const navigate = useNavigate();
  const { token } = useAuth();

  const [routine, setRoutine] = useState(null);
  const [activities, setActivities] = useState([]);

  const [error, setError] = useState(null);
  const [setErrorMsg, setSetErrorMsg] = useState(null);

  // add set form state
  const [activityId, setActivityId] = useState("");
  const [count, setCount] = useState(1);

  async function loadRoutine() {
    setError(null);
    try {
      // API does not provide get routine by id; fetch all and pick one :contentReference[oaicite:6]{index=6}
      const routines = await getRoutines();
      const found = routines.find((r) => r.id === routineId);
      setRoutine(found || null);
    } catch (e) {
      setError(e.message);
    }
  }

  async function loadActivities() {
    try {
      const list = await getActivities();
      setActivities(list || []);
      if (!activityId && list?.length) setActivityId(String(list[0].id));
    } catch (e) {
      // keep this separate; routines can still render even if activities fail
      setSetErrorMsg(e.message);
    }
  }

  useEffect(() => {
    loadRoutine();
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routineId]);

  const sets = useMemo(() => routine?.sets || [], [routine]);

  const tryDeleteRoutine = async () => {
    setError(null);
    try {
      await deleteRoutine(token, routineId);
      navigate("/routines");
    } catch (e) {
      setError(e.message);
    }
  };

  const submitSet = async (e) => {
    e.preventDefault();
    setSetErrorMsg(null);

    try {
      await addSet(token, { activityId, routineId, count });
      //refresh sets after add
      await loadRoutine(); 
    } catch (e) {
      setSetErrorMsg(e.message);
    }
  };

  const tryDeleteSet = async (setId) => {
    setSetErrorMsg(null);
    try {
      await deleteSet(token, setId);
      // refresh sets after delete
      await loadRoutine(); 
    } catch (e) {
      setSetErrorMsg(e.message);
    }
  };

  if (error) return <p role="alert">{error}</p>;
  if (!routine) return <p>Loading...</p>;

  return (
    <section>
      <h1>{routine.name}</h1>
      <p>{routine.goal}</p>
      <p>Created by: {routine.creatorName}</p>

      {/* delete routine */}
      {token && <button onClick={tryDeleteRoutine}>Delete routine</button>}

      <hr />

      <h2>Sets</h2>

      {/* no sets message */}
      {sets.length === 0 && (
        <p>This routine has no sets yet. Add one below!</p>
      )}

      {/* list sets */}
      {sets.length > 0 && (
        <ul>
          {sets.map((s) => (
            <li key={s.id}>
              <strong>{s.name}</strong> — {s.count} reps
              {token && (
                <>
                  {" "}
                  <button onClick={() => tryDeleteSet(s.id)}>Delete set</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* errors for add/delete set */}
      {setErrorMsg && <p role="alert">{setErrorMsg}</p>}

      {/* add set form */}
      {token && (
        <form onSubmit={submitSet}>
          <h3>Add a set</h3>

          <label>
            Activity
            <select
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
              required
            >
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Reps
            <input
              type="number"
              min="1"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              required
            />
          </label>

          <button type="submit">Add set</button>
        </form>
      )}
    </section>
  );
}

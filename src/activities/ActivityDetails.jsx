import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getActivity, deleteActivity } from "../api/activities";
import { useAuth } from "../auth/AuthContext";

export default function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const found = await getActivity(id);
        setActivity(found);
      } catch (e) {
        setError(e.message);
      }
    }

    fetchActivity();
  }, [id]);

  const tryDelete = async () => {
    setError(null);

    try {
      await deleteActivity(token, id);
      navigate("/activities");
    } catch (e) {
      setError(e.message);
    }
  };

  if (error) return <p role="alert">{error}</p>;
  if (!activity) return <p>Loading...</p>;

  return (
    <section>
      <h2>{activity.name}</h2>
      <p>{activity.description}</p>
      <p>Created by: {activity.creatorName}</p>

      {token && (
        <button onClick={tryDelete}>
          Delete
        </button>
      )}
    </section>
  );
}

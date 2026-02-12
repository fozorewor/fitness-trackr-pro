import { Link } from "react-router-dom";

export default function ActivityList({ activities = [] }) {
  if (!activities.length) {
    return <p>No activities found.</p>;
  }

  return (
    <ul>
      {activities.map((activity) => (
        <li key={activity.id}>
          <Link to={`/activities/${activity.id}`}>
            {activity.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

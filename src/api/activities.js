const API = import.meta.env.VITE_API;

/** Fetches an array of activities from the API. */
export async function getActivities() {
  try {
    const response = await fetch(API + "/activities");
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/** Fetch a single activity by ID */
export async function getActivity(id) {
  try {
    const response = await fetch(API + "/activities/" + id);
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Sends a new activity to the API to be created.
 * A valid token is required.
 */
export async function createActivity(token, activity) {
  if (!token) {
    throw Error("You must be signed in to create an activity.");
  }

  const response = await fetch(API + "/activities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(activity),
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}


/**
 * Requests the API to delete the activity with the given ID.
 * A valid token is required.
 */
export async function deleteActivity(token, id) {
  if (!token) {
    throw Error("You must be signed in to delete an activity.");
  }

  const response = await fetch(API + "/activities/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });
  if (response.status === 204) {
    return;
  }

  const text = await response.text();
  if (!text) {
    return;
  }
  const result = JSON.parse(text);

  if (!response.ok) {
    throw Error(result.message);
  }
  return result;
}

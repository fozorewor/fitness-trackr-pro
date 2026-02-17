const API = import.meta.env.VITE_API;

// Safely parse JSON even when server returns 204/empty body
async function safeJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** GET /routines, return array of routines (each routine includes associated sets) */
export async function getRoutines() {
  const response = await fetch(API + "/routines");
  const result = await safeJson(response);

  if (!response.ok) {
    throw Error(result?.message || "Failed to load routines");
  }

  return result || [];
}

/** POST /routines, create a routine (valid token required) */
export async function createRoutine(token, routine) {
  if (!token) throw Error("You must be signed in to create a routine.");

  const response = await fetch(API + "/routines", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      name: routine.name,
      goal: routine.goal,
    }),
  });

  const result = await safeJson(response);

  if (!response.ok) {
    throw Error(result?.message || "Failed to create routine");
  }

  return result;
}

/** DELETE /routines/:id return 204 no content (token required; must be creator) */
export async function deleteRoutine(token, id) {
  if (!token) throw Error("You must be signed in to delete a routine.");

  const response = await fetch(API + "/routines/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  
  if (response.status === 204) return;

  const result = await safeJson(response);
  if (!response.ok) {
    throw Error(result?.message || "Failed to delete routine");
  }
  return result;
}

/** POST /sets, add a new set to routine (token required; must be routine creator) */
export async function addSet(token, { activityId, routineId, count }) {
  if (!token) throw Error("You must be signed in to add a set.");

  const response = await fetch(API + "/sets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      activityId: Number(activityId),
      routineId: Number(routineId),
      count: Number(count),
    }),
  });

  const result = await safeJson(response);

  if (!response.ok) {
    throw Error(result?.message || "Failed to add set");
  }

  return result;
}

/** DELETE /sets/:id return 204 no content (token required) */
export async function deleteSet(token, setId) {
  if (!token) throw Error("You must be signed in to delete a set.");

  const response = await fetch(API + "/sets/" + setId, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

 
  if (response.status === 204) return;

  const result = await safeJson(response);
  if (!response.ok) {
    throw Error(result?.message || "Failed to delete set");
  }
  return result;
}

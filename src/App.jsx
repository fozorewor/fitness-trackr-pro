import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Activities from "./activities/ActivitiesPage";
import ActivityDetails from "./activities/ActivityDetails";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Error404 from "./Error404";

/**
 * Fitness Trackr is a platform where fitness enthusiasts can share their workouts and
 * discover new routines. Anyone can browse the site and make an account, and users with an
 * account will be able to upload and manage their own activities.
 */


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* Activities List (Home Page) */}
        <Route index element={<Activities />} />
        <Route path="activities" element={<Activities />} />

        {/* Single Activity Page (Dynamic Route) */}
        <Route path="activities/:id" element={<ActivityDetails />} />

        {/* Authentication Pages */}
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />

        {/* 404 Page */}
        <Route path="*" element={<Error404 />} />

      </Route>
    </Routes>
  );
}
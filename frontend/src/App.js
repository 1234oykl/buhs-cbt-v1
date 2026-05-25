import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ExamPage from "./pages/ExamPage";
import Leaderboard from "./pages/Leaderboard";
import AdminLogin from "./pages/AdminLogin";
import AdminExamPage from "./pages/AdminExamPage";
import ExamSubmitted from "./pages/ExamSubmitted";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route element={<Layout />}>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/exam-submitted"
          element={<ExamSubmitted />}
        />

        {/* STUDENT DASHBOARD */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* EXAM PAGE */}
        <Route
          path="/exam/:id"
          element={
            <ProtectedRoute role="student">
              <ExamPage />
            </ProtectedRoute>
          }
        />

        {/* LEADERBOARD */}
        <Route
          path="/leaderboard/:examId"
          element={
            <ProtectedRoute role="student">
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        {/* CREATE EXAM */}
        <Route
          path="/admin-add-exam"
          element={
            <ProtectedRoute role="admin">
              <AdminExamPage />
            </ProtectedRoute>
          }
        />

      </Route>
    </Routes>
  );
}

export default App;
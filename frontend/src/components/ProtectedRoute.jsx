import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const user = JSON.parse(localStorage.getItem("user"));

  // ADMIN ROUTE
  if (role === "admin") {
    if (!admin || !admin.token || !admin.isAdmin) {
      return <Navigate to="/admin-login" replace />;
    }
    return children;
  }

  // STUDENT ROUTE
  if (role === "student") {
    if (!user || !user.token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
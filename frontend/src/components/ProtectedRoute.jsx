import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // NO USER
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // ADMIN ROUTE
  if (role === "admin" && !user.isAdmin) {
    return (
      <Navigate
        to="/admin-login"
        replace
      />
    );
  }

  // STUDENT ROUTE
  if (role === "student" && user.isAdmin) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Navbar";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import MealPlanner from "./pages/MealPlanner";
import ForgotPassword from "./pages/forgot-password";
import LogIn from "./pages/log-in";
import SignUp from "./pages/sign-in";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Header on every page*/}
        <Header />

        {/* Pages */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />

          {/* Auth routes - redirect to dashboard if already logged in */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LogIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes - require authentication */}
          <Route
            path="/mealplanner"
            element={
              <ProtectedRoute>
                <MealPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

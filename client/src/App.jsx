
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import ConfirmSignup from "./pages/confirmSignup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import MealPlanner from "./pages/MealPlanner";
import SignUp from "./pages/SignIn";

import GroceryList from "./pages/GroceryList";
import IngredientPage from "./pages/IngredientPage";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        {/* Header on every page*/}
        <Header />

        {/* Pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mealplanner" element={<MealPlanner />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/confirm-signup" element={<ConfirmSignup />} />
          <Route path="/login" element={<LogIn />} />

          <Route path="/recipe/:id" element={<IngredientPage />} />
          <Route path="/grocery" element={<GroceryList />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
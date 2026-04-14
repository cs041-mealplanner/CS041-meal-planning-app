import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

import ConfirmSignup from "./pages/confirmSignup";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import GroceryList from "./pages/GroceryList";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import MealPlanner from "./pages/MealPlanner";
import RecipeDetail from "./pages/RecipeDetail";
import Recipes from "./pages/Recipes";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Header />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/confirm-signup" element={<ConfirmSignup />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/meal-planner"
                element={
                  <ProtectedRoute>
                    <MealPlanner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recipes"
                element={
                  <ProtectedRoute>
                    <Recipes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recipes/:id"
                element={
                  <ProtectedRoute>
                    <RecipeDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/grocery"
                element={
                  <ProtectedRoute>
                    <GroceryList />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

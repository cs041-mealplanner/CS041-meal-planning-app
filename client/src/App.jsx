import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Navbar";

<<<<<<< HEAD
=======
import ConfirmSignup from "./pages/confirmSignup";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import GroceryList from "./pages/GroceryList";
import IngredientPage from "./pages/IngredientPage";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import MealPlanner from "./pages/MealPlanner";
import Recipes from "./pages/Recipes";
import SignUp from "./pages/SignUp";

>>>>>>> main
export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirm-signup" element={<ConfirmSignup />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipe/:id" element={<IngredientPage />} />
        <Route path="/grocery" element={<GroceryList />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Navbar";
import ConfirmSignup from "./pages/confirmSignup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import MealPlanner from "./pages/MealPlanner";
import SignUp from "./pages/SignIn";


import GroceryList from "./pages/GroceryList";
import IngredientPage from "./pages/IngredientPage";

export default function App() {
  return ( 
    <BrowserRouter>

      {/* Header on every page (navbar)*/}
      <Header />

      {/* Pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mealplanner" element={<MealPlanner />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/confirm-signup" element={<ConfirmSignup />} />

        <Route path="/recipe/:id" element={<IngredientPage />} />
        <Route path="/grocery" element={<GroceryList />} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
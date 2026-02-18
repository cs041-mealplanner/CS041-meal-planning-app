
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Navbar";
import ConfirmSignup from "./pages/confirmSignup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import MealPlanner from "./pages/MealPlanner";
import SignUp from "./pages/sign-in";

import GroceryList from './pages/grocery-list';
import IngredientPage from './pages/ingredient-page';

export default function App() {
  return ( 
    <BrowserRouter>

      {/* Header on every page*/}
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
    </BrowserRouter>
  );
}
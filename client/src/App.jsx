
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import MealPlanner from "./pages/MealPlanner";

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

        <Route path="/recipe/:id" element={<IngredientPage />} />
        <Route path="/grocery" element={<GroceryList />} />

      </Routes>
    </BrowserRouter>
  );
}
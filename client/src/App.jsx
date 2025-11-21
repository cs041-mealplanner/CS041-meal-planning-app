import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MealPlanner from "./pages/MealPlanner";

export default function App() {
  return (
    <BrowserRouter>

      {/* Navbar on every page*/}
      <Navbar />

      {/* Pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mealplanner" element={<MealPlanner />} />
      </Routes>
    </BrowserRouter>
  );
}

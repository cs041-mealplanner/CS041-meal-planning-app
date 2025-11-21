import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import MealPlanner from "./pages/MealPlanner";

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
      </Routes>
    </BrowserRouter>
  );
}

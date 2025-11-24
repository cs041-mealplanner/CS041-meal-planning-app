import { useState } from 'react';
import '../styles/MealPlanner.css';

export default function MealPlanner() {

    // const date = new Date();

    const [breakfastPlan, setBreakfastPlan] = useState([]);
    const [lunchPlan, setLunchPlan] = useState([]);
    const [dinnerPlan, setDinnerPlan] = useState([]);

    const [breakfastItem, setBreakfastItem] = useState("");
    const [lunchItem, setLunchItem] = useState("");
    const [dinnerItem, setDinnerItem] = useState("");


    return (
        <div className='mealplanner-page-container'>
            <div className='header-container'>
                <h1 className="text-4xl font-bold mb-4">Selected Meal Plan</h1>
            </div>

            <div className="table-container">
                <table className='mealplan-table'>
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Breakfast</th>
                            <th className="px-4 py-2">Lunch</th>
                            <th className="px-4 py-2">Dinner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: Math.max(breakfastPlan.length, lunchPlan.length, dinnerPlan.length) }).map((_, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{breakfastPlan[index] || ""}</td>
                                <td className="border px-4 py-2">{lunchPlan[index] || ""}</td>
                                <td className="border px-4 py-2">{dinnerPlan[index] || ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <div className='meal-item-inputs-container'>
                <h3 className='add-items-header'>Add Meal Items</h3>

                <div className="input-container">
                    <input type="text" placeholder="Enter breakfast Item" className="meal-item-input" value={breakfastItem} onChange={(e) => setBreakfastItem(e.target.value)} />
                    <button className="add-button" onClick={() => {
                        if (breakfastItem.trim() === "") return;
                        setBreakfastPlan([...breakfastPlan, breakfastItem]);
                        setBreakfastItem("");
                    }}>Add</button>
                </div>

                <div className="input-container">
                    <input type="text" placeholder="Enter lunch Item" className="meal-item-input" value={lunchItem} onChange={(e) => setLunchItem(e.target.value)} />
                    <button className="add-button" onClick={() => {
                        if (lunchItem.trim() === "") return;
                        setLunchPlan([...lunchPlan, lunchItem]);
                        setLunchItem("");
                    }}>Add</button>
                </div>

                <div className="input-container">
                    <input type="text" placeholder="Enter dinner Item" className="meal-item-input" value={dinnerItem} onChange={(e) => setDinnerItem(e.target.value)} />
                    <button className="add-button" onClick={() => {
                        if (dinnerItem.trim() === "") return;
                        setDinnerPlan([...dinnerPlan, dinnerItem]);
                        setDinnerItem("");
                    }}>Add</button>
                </div>

            </div>
        </div >
    );
}


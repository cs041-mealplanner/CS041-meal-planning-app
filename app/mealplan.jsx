import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

// arrays to hold meal items and date selection
const selectedDate = new Date();
const breakfastPlan = [];
const lunchPlan = [];
const dinnerPlan = [];


// Meal Plan Component
export default function CreateMealPlan() {

  // State to hold new meal item inputs
  const [breakfastPlan, setBreakfastPlan] = useState([]);
  const [breakfastItem, setBreakfastItem] = useState("");


  const [lunchItem, setLunchItem] = useState("");
  const [lunchPlan, setLunchPlan] = useState([]);

  const [dinnerPlan, setDinnerPlan] = useState([]);
  const [dinnerItem, setDinnerItem] = useState("");

    // Render meal plan table
    return(
        <View style={styles.container}>
            <h1>Create a Meal Plan</h1>
            <div>
              <label htmlFor="add_breakfast_item">New Breakfast Item: </label>
              <input type="text" value={breakfastItem} onChange={(e) => setBreakfastItem(e.target.value)}/>
              <button onClick={() =>  {
                setBreakfastPlan([...breakfastPlan, breakfastItem]);
                setBreakfastItem("");
              }}>Add</button>
            </div>
            
            <div>
              <label htmlFor="add_lunch_item">New Lunch Item: </label>
              <input type="text" value={lunchItem} onChange={(e) => setLunchItem(e.target.value)} />
              <button onClick={() =>  {
                setLunchPlan([...lunchPlan, lunchItem]);
                setLunchItem("");
              }}>Add</button>
            </div>
            <div>
              <label htmlFor="add_dinner_item">New Dinner Item: </label>
              <input type="text" value={dinnerItem} onChange={(e) => setDinnerItem(e.target.value)} />
              <button onClick={() =>  {
                setDinnerPlan([...dinnerPlan, dinnerItem]);
                setDinnerItem("");
              }}>Add</button>
            </div>


            <table>
              <thead>
                <tr>
                  <th>Breakfast</th>
                  <th>Lunch</th>
                  <th>Dinner</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.max(breakfastPlan.length, lunchPlan.length, dinnerPlan.length) }).map((_, index) => (
                  <tr key={index}>
                    <td>{breakfastPlan[index] || ""}</td>
                    <td>{lunchPlan[index] || ""}</td>
                    <td>{dinnerPlan[index] || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </View>
        
    );
}






const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#f9e4bc',
  },
  table: {
    width: '80%',
    borderCollapse: 'tcollapse',
    marginTop: 20,
    border: '1px solid #ccc',
  }
});
import '../styles/MealPlanner.css';

export default function MealPlanner() {

    const date = new Date();

    const breakfast = ["Oatmeal with Fruits", "Scrambled Eggs", "Yogurt Parfait", "Pancakes", "Smoothie Bowl"];
    const lunch = ["Grilled Chicken Salad", "Turkey Sandwich", "Veggie Wrap", "Quinoa Bowl", "Sushi"];
    const dinner = ["Baked Salmon with Veggies", "Pasta Primavera", "Stir-fried Tofu", "Beef Tacos", "Chicken Curry"];

    class MealPlan {
        constructor(breakfast, lunch, dinner) {
            this.breakfast = breakfast;
            this.lunch = lunch;
            this.dinner = dinner;
        }
    }

    return (
        <div className="px-8 py-12">
            <section className="text-center">
                <h1 className="text-4xl font-bold mb-4">Selected Meal Plan</h1>
                <button>Add</button>
                <table>
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Breakfast</th>
                            <th className="px-4 py-2">Lunch</th>
                            <th className="px-4 py-2">Dinner</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2" >Oatmeal with Fruits</td>
                            <td className="border px-4 py-2">Grilled Chicken Salad</td>
                            <td className="border px-4 py-2">Baked Salmon with Veggies</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Scrambled Eggs</td>
                            <td className="border px-4 py-2">Turkey Sandwich</td>
                            <td className="border px-4 py-2">Pasta Primavera</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}


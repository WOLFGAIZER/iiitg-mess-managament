import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const FoodMenu = () => {
  const { api } = useAuth();
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await api.get("/meals/");
        setMeals(res.data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };
    fetchMenus();
  }, [api]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Food & Menu</h1>
      <div className="grid gap-4">
        {meals.map((meal) => (
          <div key={meal._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2>
              {meal.mealType} - {new Date(meal.date).toLocaleDateString()}
            </h2>
            <ul>
              {meal.menu.map((item, idx) => (
                <li key={idx}>
                  {item.itemName} ({item.category}) - {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodMenu;
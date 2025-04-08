import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FoodMenu = () => {
  const { api, user, logout } = useAuth();
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Select an option");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch meal data from backend
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const response = await api.get("/meals");
        if (response.data.success) {
          setMeals(response.data.data);
        } else {
          setError("Failed to fetch meals");
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [api]);

  // Prepare menu data by day and meal type
  const getMenuByDay = (day) => {
    return meals
      .filter((meal) => {
        const mealDate = new Date(meal.date).toLocaleDateString("en-US", { weekday: "long" });
        return mealDate === day;
      })
      .reduce(
        (acc, meal) => {
          meal.menu.forEach((item) => {
            acc[meal.mealType].push(`${item.itemName} ${item.quantity || ""}`);
          });
          return acc;
        },
        { BREAKFAST: [], LUNCH: [], DINNER: [] }
      );
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <span role="img" aria-label="home" className="text-2xl mr-2">
            🏠
          </span>
          <h1 className="text-2xl font-bold text-red-600">MyMess</h1>
          <p className="text-sm text-gray-600 ml-2">the destination for your mess needs</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Menu Here</h2>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="Select an option">Select an option</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-red-500 text-white">DAY</th>
                <th className="border p-2 bg-red-500 text-white">BREAKFAST</th>
                <th className="border p-2 bg-red-500 text-white">LUNCH</th>
                <th className="border p-2 bg-red-500 text-white">DINNER</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => {
                const menu = getMenuByDay(day);
                return (
                  <tr key={day}>
                    <td className="border p-2 text-center">{day}</td>
                    <td className="border p-2">
                      {menu.BREAKFAST.length > 0
                        ? menu.BREAKFAST.join(", ")
                        : "No menu available"}
                    </td>
                    <td className="border p-2">
                      {menu.LUNCH.length > 0 ? menu.LUNCH.join(", ") : "No menu available"}
                    </td>
                    <td className="border p-2">
                      {menu.DINNER.length > 0 ? menu.DINNER.join(", ") : "No menu available"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FoodMenu;
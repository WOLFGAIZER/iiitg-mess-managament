import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ title, color, icon }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/page/${encodeURIComponent(title)}`); // Navigate to dynamic page
  };

  return (
    <div
      className="p-4 rounded-xl shadow-md text-white flex items-center justify-center cursor-pointer"
      style={{ backgroundColor: color }}
      onClick={handleClick}
    >
      <span className="text-2xl mr-2">{icon}</span>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
};

export default Card;

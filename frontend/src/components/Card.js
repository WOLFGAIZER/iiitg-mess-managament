import React from "react";
import { Link } from "react-router-dom";

const Card = ({ title, color, icon, path }) => {
  return (
    <Link to={path}>
      <div
        className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center transition-all hover:shadow-lg"
        style={{ borderTop: `4px solid ${color}` }}
      >
        <span className="text-3xl mb-2">{icon}</span>
        <h3 className="text-lg font-medium text-gray-900 text-center">{title}</h3>
      </div>
    </Link>
  );
};

export default Card;

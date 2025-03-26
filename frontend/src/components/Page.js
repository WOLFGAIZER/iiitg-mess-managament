import React from "react";
import { useParams } from "react-router-dom";

const Page = () => {
  const { name } = useParams();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Welcome to {decodeURIComponent(name)}</h1>
      <p className="mt-4 text-gray-600">This is the {name} page.</p>
    </div>
  );
};

export default Page;

import React from "react";
import Dashboard from "../components/Dashboard";

const DashboardPage = () => {
  const token = "your_token_here"; // Replace this with the actual token
  const email = "your_email@example.com"; // Replace with the actual user email

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Dashboard token={token} email={email} />
    </div>
  );
};

export default DashboardPage;

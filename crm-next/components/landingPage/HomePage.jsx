import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-teal-50 px-4">
    <h1 className="text-3xl sm:text-5xl font-bold text-slate-800 mb-4 text-center">
      Welcome to CRM Billing System
    </h1>
    <p className="text-base sm:text-lg text-slate-700 mb-8 text-center">
      Manage your customers, challans, and billing with ease.
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <Link
        to="/login"
        className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition text-center"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition text-center"
      >
        Register
      </Link>
    </div>
  </div>
);

export default HomePage;
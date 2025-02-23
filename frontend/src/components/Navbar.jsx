import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center no-print sticky top-0 z-50">
      <NavLink
        to="/"
        className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition"
      >
        EduDoc
      </NavLink>
      <div className="flex gap-6">
        <NavLink
          to="/dmcIntro"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md font-medium transition ${
              isActive
                ? "bg-blue-500 text-white shadow-lg"
                : "text-blue-600 hover:text-blue-800"
            }`
          }
        >
          DMC Generator
        </NavLink>
        <NavLink
          to="/papers"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md font-medium transition ${
              isActive
                ? "bg-blue-500 text-white shadow-lg"
                : "text-blue-600 hover:text-blue-800"
            }`
          }
        >
          Papers Making
        </NavLink>
        <NavLink
          to="/rollno-slip"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md font-medium transition ${
              isActive
                ? "bg-blue-500 text-white shadow-lg"
                : "text-blue-600 hover:text-blue-800"
            }`
          }
        >
          Roll No Slip
        </NavLink>
        <NavLink
          to="/student-cards"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md font-medium transition ${
              isActive
                ? "bg-blue-500 text-white shadow-lg"
                : "text-blue-600 hover:text-blue-800"
            }`
          }
        >
          Student Cards
        </NavLink>
        <NavLink
          to="/certificate-generator"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md font-medium transition ${
              isActive
                ? "bg-blue-500 text-white shadow-lg"
                : "text-blue-600 hover:text-blue-800"
            }`
          }
        >
          Certificate Generator
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;

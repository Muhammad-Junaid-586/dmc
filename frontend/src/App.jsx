import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Upload from "./components/Upload";
import Dmc from "./components/Dmc";
import NewDmc from "./components/NewDmc";
import NewDmcLayout from "./components/NewDmcLayout";
import Home from "./components/Home";
import Navbar from "./components/Navbar"; // Import the Navbar component
import DmcIntro from "./components/DmcIntro";
import ComingSoon from "./components/ComingSoon"; // Import Coming Soon Page
import Footer from "./components/Footer";
import SingleDesigns from "./components/SingleDesigns";
import TwoDesigns from "./components/TwoDesigns";
// import DMCComponent from "./components/DmcComponent";

const App = () => {
  const [students, setStudents] = useState(() => {
    const savedData = localStorage.getItem("students");
    return savedData ? JSON.parse(savedData) : [];
  });

  const handleDataFetched = (data) => {
    setStudents(data);
    localStorage.setItem("students", JSON.stringify(data));
  };

  useEffect(() => {
    const savedData = localStorage.getItem("students");
    if (savedData) {
      setStudents(JSON.parse(savedData));
    }
  }, []);

  return (
    <Router>
      {/* Navbar is rendered outside the Routes to appear on all pages */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/upload"
          element={<Upload onDataFetched={handleDataFetched} />}
        />
        <Route path="/singledesign" element={<SingleDesigns />} />
        <Route path="/twodesign" element={<TwoDesigns />} />
        {/* <Route path="/kb" element={<DMCComponent students={students} />} /> */}
        <Route path="/it" element={<Dmc students={students} />} />
        <Route path="/dmcIntro" element={<DmcIntro students={students} />} />
        <Route path="/dmc" element={<NewDmc students={students} />} />

        <Route path="/newdmc" element={<NewDmcLayout students={students} />} />
        <Route path="*" element={<ComingSoon />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

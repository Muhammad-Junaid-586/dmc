import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DmcIntro = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleDesignSelection = (design) => {
  //   localStorage.setItem("selectedDesign", design);
  //   navigate("/upload");
  // };
  const handleDesignPage = (designType) => {
    if (designType === "single") {
      navigate("/singledesign");
    } else if (designType === "two") {
      navigate("/twodesign");
    }
  };

  const cardStyle = {
    color: "white",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center py-10 px-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
          DMC Generator
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto mt-2">
          Generate and print your Digital Marks Certificate (DMC) with ease.
          Choose a design, upload your data, and download the final document.
        </p>
      </div>

      {/* Instructions Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg cursor-pointer hover:bg-indigo-700 transition-all duration-300"
      >
        Show Instructions
      </button>

      {/* Modal for Instructions */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-[30rem] w-full relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Instructions
            </h2>
            <p className="text-gray-600 mb-4">
              Follow these steps to generate your DMC:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Select a DMC design.</li>
              <li>Upload your data using the provided Excel template.</li>
              <li>Fill out all the inputs.</li>
              <li>Download or print the final DMCs.</li>
            </ul>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition cursor-pointer w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Download Excel Template Section */}
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold text-gray-800">Download Template</h2>
        <p className="text-gray-600 max-w-lg mx-auto">
          Download the Excel template to format your data correctly for DMC
          generation.
        </p>
        <a
          href="https://docs.google.com/spreadsheets/d/14lWxoIC1sVgmR5eJfry94j4N72YMd75m/export?format=xlsx"
          download="DMC_Upload_Template.xlsx"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Download Excel Template
        </a>
      </div>

      {/* Design Selection Section */}
      <div className="text-center mt-16">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Select Your DMC Design
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-lg mt-2">
          Choose between a{" "}
          <span className="font-semibold text-gray-700">single-page DMC</span>{" "}
          or a{" "}
          <span className="font-semibold text-gray-700">
            layout with two DMCs per page
          </span>
          .
        </p>
      </div>

      {/* Design Cards */}

      <div className="grid grid-cols-2 gap-6 mt-12">
        {/* Single DMC Design */}
        <div
          className="w-full p-3 text-center cursor-pointer border border-gray-400 rounded-lg bg-white shadow-lg hover:bg-gray-100 transition"
          onClick={() => handleDesignPage("single")}
        >
          <h3 className="text-gray-900 font-bold text-xl">Single DMC Design</h3>
        </div>

        {/* Two DMCs Layout */}
        <div
          className="w-full p-3 text-center cursor-pointer border border-gray-400 rounded-lg bg-white shadow-lg hover:bg-gray-100 transition"
          onClick={() => handleDesignPage("two")}
        >
          <h3 className="text-gray-900 font-bold text-xl">
            Two DMCs on One Page
          </h3>
        </div>
      </div>

      {/* Footer */}
    </div>
  );
};

export default DmcIntro;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa"; // Import an upload icon from react-icons

const Upload = ({ onDataFetched }) => {
  const [file, setFile] = useState(null);
  const [schoolName, setSchoolName] = useState("");
  const [session, setSession] = useState("");
  const [className, setClassName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState("");
  const [marks, setMarks] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [buttonText, setButtonText] = useState("Add");
  const [passingCriteria, setPassingCriteria] = useState("");
  const [passingPercentage, setPassingPercentage] = useState("");
  const [failedPapers, setFailedPapers] = useState("");
  const [passedPapers, setPassedPapers] = useState("");
  const [declarationDate, setDeclarationDate] = useState("");
  const [examType, setExamType] = useState("");
  const [logo, setLogo] = useState(null);
  const [excel, setExcel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const examTypes = [
    "Monthly Test",
    "1st Term Exam",
    "Mid Term Exam",
    "Pre-Final Exam",
    "Final/Annual Exam",
  ];

  const papers = [
    "Computer Science",
    "HPE",
    "Mathematics",
    "Pashto",
    "Drawing",
    "Arabic",
    "Islamiat",
    "General Science",
    "English",
    "Muthalia-Quran Hakeem",
    "Nazria Quran Hakeem",
    "Geography",
    "History",
    "Physics",
    "Chemistry",
    "Biology",
    "Urdu",
    "Pak Study",
  ];

  const navigate = useNavigate();

  const generateSessionOptions = () => {
    return Array.from({ length: 26 }, (_, i) => `${2024 + i}-${2025 + i}`);
  };

  const handlePaperSelection = (e) => {
    setSelectedPaper(e.target.value);
    setButtonText(e.target.value ? "Confirm" : "Add");
  };

  const handleAddPaper = () => {
    if (
      selectedPaper &&
      marks &&
      !subjects.some((subj) => subj.paper === selectedPaper)
    ) {
      setButtonText("Added");
      setTimeout(() => {
        setSubjects([
          ...subjects,
          { paper: selectedPaper, marks, passingMarks },
        ]);
        setSelectedPaper("");
        setMarks("");
        setPassingMarks("");
        setButtonText("Add");
      }, 1500);
    }
  };

  const getOrdinalSuffix = (num) => {
    if (num === 1) return "1st";
    if (num === 2) return "2nd";
    if (num === 3) return "3rd";
    return `${num}th`;
  };

  const uploadFiles = async (e) => {
    e.preventDefault();

    if (!logo || !excel) {
      alert("Please select both an image and an Excel file.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("logo", logo);
    formData.append("excel", excel);
    formData.append("schoolName", schoolName);
    formData.append("session", session);
    formData.append("class_level", className);
    formData.append("passingCriteria", passingCriteria);
    formData.append("passingPercentage", passingPercentage);
    formData.append("failedPapers", JSON.stringify(failedPapers || []));
    formData.append("passedPapers", JSON.stringify(passedPapers || []));
    formData.append("subjects", JSON.stringify(subjects));
    formData.append("declarationDate", declarationDate);
    formData.append("examType", examType);

    try {
      const response = await axios.post(
        "https://dmc-iz4d.vercel.app/api/uploadFiles",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Upload Success:", response.data);

      if (response.data.data) {
        onDataFetched(response.data.data, subjects);
      } else {
        console.warn("No student data received in response!");
      }

      alert("Files uploaded successfully!");

      const selectedDesign = localStorage.getItem("selectedDesign");

      if (selectedDesign) {
        if (selectedDesign === "NewDmc") {
          navigate("/dmc", { state: response.data });
        } else if (selectedDesign === "NewDmcLayout") {
          navigate("/newdmc", { state: response.data });
        }
      } else {
        navigate("/dmc");
      }
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-[600px]">
        <h2 className="text-xl font-semibold text-center uppercase text-gray-800 mb-4">
          Fill out the Form
        </h2>

        <form onSubmit={uploadFiles} className="space-y-4">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Logo
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex gap-4 items-center justify-between px-4 py-2 w-full bg-white  rounded-lg shadow-lg tracking-wide uppercase border border-black-500 cursor-pointer hover:bg-black hover:text-white">
                <span className=" text-base leading-normal">Select a Logo</span>
                <FaUpload className="text-2xl" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogo(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Excel Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Excel File
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex  items-center justify-between gap-4 w-full px-4 py-2 bg-white rounded-lg shadow-lg tracking-wide uppercase border border-black cursor-pointer hover:bg-black hover:text-white">
                <span className=" text-base leading-normal">
                  Select a excel file
                </span>
                <FaUpload className="text-2xl" />
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => setExcel(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* School Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School Name
            </label>
            <input
              type="text"
              placeholder="School Name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Session */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session
            </label>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Session</option>
              {generateSessionOptions().map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {getOrdinalSuffix(i + 1)}
                </option>
              ))}
            </select>
          </div>

          {/* Declaration Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Declaration Date
            </label>
            <input
              type="date"
              value={declarationDate}
              onChange={(e) => setDeclarationDate(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Exam Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Type
            </label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Exam Type</option>
              {examTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Passing Criteria */}
          <div className="w-full">
            <div className="flex w-full items-center space-x-4">
              {/* Passing Criteria Dropdown */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passing Criteria
                </label>
                <select
                  value={passingCriteria}
                  onChange={(e) => setPassingCriteria(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Passing Criteria</option>
                  <option value="Percentage">Percentage</option>
                  <option value="No of Papers Failed">
                    No of Papers Failed
                  </option>
                  <option value="No of Papers Passed">
                    No of Papers Passed
                  </option>
                </select>
              </div>

              {/* Conditional Input Field */}
              {passingCriteria && (
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {passingCriteria === "Percentage"
                      ? "Passing Percentage"
                      : passingCriteria === "No of Papers Failed"
                      ? "No of Papers Failed"
                      : "No of Papers Passed"}
                  </label>
                  <input
                    type="number"
                    value={
                      passingCriteria === "Percentage"
                        ? passingPercentage
                        : passingCriteria === "No of Papers Failed"
                        ? failedPapers
                        : passedPapers
                    }
                    onChange={(e) =>
                      passingCriteria === "Percentage"
                        ? setPassingPercentage(e.target.value)
                        : passingCriteria === "No of Papers Failed"
                        ? setFailedPapers(e.target.value)
                        : setPassedPapers(e.target.value)
                    }
                    placeholder="Enter Value"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Paper Selection */}
          <div className="w-full">
            <div className="flex w-full items-center space-x-4">
              {/* Paper Selection Dropdown */}
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paper Selection
                </label>
                <select
                  value={selectedPaper}
                  onChange={handlePaperSelection}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a Paper</option>
                  {papers.map((paper, index) => (
                    <option key={index} value={paper}>
                      {paper}
                    </option>
                  ))}
                </select>
              </div>

              {/* Marks Input */}
              <div className="w-1/4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marks
                </label>
                <input
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="Marks"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Passing Marks Input (Conditional) */}
              {(passingCriteria === "No of Papers Failed" ||
                passingCriteria === "No of Papers Passed") && (
                <div className="w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passing Marks
                  </label>
                  <input
                    type="number"
                    value={passingMarks}
                    onChange={(e) => setPassingMarks(e.target.value)}
                    placeholder="P/Marks"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Add Paper Button */}
              <div className="w-1/5 self-end">
                <button
                  type="button"
                  onClick={handleAddPaper}
                  className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded transition-all duration-300"
                  disabled={!selectedPaper || !marks}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>

          {/* Display Added Papers */}
          {subjects.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Added Papers
              </label>
              <ul className="mt-4 border rounded p-3">
                {subjects.map((subj, index) => (
                  <li key={index} className="flex justify-between p-2 border-b">
                    <span className="w-1/2">{subj.paper}</span>
                    <span>{subj.marks} Marks</span>
                    {subj.passingMarks && (
                      <span>Pass: {subj.passingMarks}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            } transition`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Generate DMCs"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;

import React, { useRef, useState, useEffect } from "react";
import { FaStar, FaMedal, FaThumbsUp, FaRegSadTear } from "react-icons/fa";
import "./DmcComponent.css";

const DMCComponent = ({ students }) => {
  console.log(students);
  const [logoUrl, setLogoUrl] = useState("");

  const dmcRefs = useRef([]);
  const [obtainedMarks, setObtainedMarks] = useState({});
  const [grades, setGrades] = useState({});
  const [studentPositions, setStudentPositions] = useState({});
  const [statuses, setStatuses] = useState({});
  const [performances, setPerformances] = useState({});

  useEffect(() => {
    const calculateTotalMarks = () => {
      const newMarks = {};
      const newGrades = {};
      const newStatuses = {};
      const newPerformances = {};
      const studentPercentages = [];

      students.forEach((student, index) => {
        console.log(
          `\n🔹 Processing Student ${index + 1}: ${student["Student-Name"]}`
        );

        const totalMarks = student.Subjects.reduce(
          (acc, subject) => acc + (Number(subject.marks) || 0),
          0
        );

        const obtained = student.Subjects.reduce(
          (acc, subject) =>
            acc +
            (Number(student[subject.paper.toLowerCase().replace(" ", "")]) ||
              0),
          0
        );

        console.log(`  📌 Total Marks: ${totalMarks}, Obtained: ${obtained}`);

        newMarks[index] = obtained;

        // Calculate percentage
        const percentage = totalMarks > 0 ? (obtained / totalMarks) * 100 : 0;
        studentPercentages.push({ index, percentage });

        console.log(`  📌 Percentage: ${percentage.toFixed(2)}%`);

        // Check passing criteria
        const passingCriteria = student["Passing Criteria"];
        const passingPercentage = Number(student["Passing Percentage"]) || 0;
        const failedPapersAllowed = Number(student["Failed Papers"]) || 0;
        const passedPapersRequired = Number(student["Passed Papers"]) || 0;

        let status = "Pass"; // Default status
        let grade = "F"; // Default grade

        if (passingCriteria === "Percentage") {
          status = percentage >= passingPercentage ? "Pass" : "Fail";

          if (percentage >= 90) grade = "A+";
          else if (percentage >= 80) grade = "A";
          else if (percentage >= 70) grade = "B";
          else if (percentage >= 60) grade = "C";
          else if (percentage >= 33) grade = "D";
          else grade = "F";

          console.log(`  ✅ Status by Percentage: ${status}, Grade: ${grade}`);
        } else if (passingCriteria === "No of Papers Failed") {
          // Calculate number of failed papers
          const failedPapersCount = student.Subjects.filter((subject) => {
            const obtainedMarks =
              Number(student[subject.paper.toLowerCase().replace(" ", "")]) ||
              0;
            const passingMarks = Number(subject.passingMarks) || 0;
            return obtainedMarks < passingMarks;
          }).length;

          console.log(
            `  📌 Failed Papers: ${failedPapersCount}, Allowed: ${failedPapersAllowed}`
          );

          // FIX: Ensure students fail if they exceed the allowed failed papers
          if (failedPapersCount >= failedPapersAllowed) {
            status = "Fail";
          } else {
            status = "Pass";
          }

          console.log(`  ✅ Final Status by Papers: ${status}`);

          if (status === "Pass") {
            if (percentage >= 90) grade = "A+";
            else if (percentage >= 80) grade = "A";
            else if (percentage >= 70) grade = "B";
            else if (percentage >= 60) grade = "C";
            else if (percentage >= 33) grade = "D";
          } else grade = "F";
        } else if (passingCriteria === "No of Papers Passed") {
          // Calculate number of passed papers
          const passedPapersCount = student.Subjects.filter((subject) => {
            const obtainedMarks =
              Number(student[subject.paper.toLowerCase().replace(" ", "")]) ||
              0;
            const passingMarks = Number(subject.passingMarks) || 0;
            return obtainedMarks >= passingMarks;
          }).length;

          console.log(
            `  📌 Passed Papers: ${passedPapersCount}, Required: ${passedPapersRequired}`
          );

          // FIX: Ensure students pass only if they meet the required passed papers
          if (passedPapersCount >= passedPapersRequired) {
            status = "Pass";
          } else {
            status = "Fail";
          }

          console.log(`  ✅ Final Status by Papers: ${status}`);

          if (status === "Pass") {
            if (percentage >= 90) grade = "A+";
            else if (percentage >= 80) grade = "A";
            else if (percentage >= 70) grade = "B";
            else if (percentage >= 60) grade = "C";
            else if (percentage >= 33) grade = "D";
          } else grade = "F";
        }

        // Assign performance based on grade
        let performance;
        if (grade === "A+") performance = "Excellent";
        else if (grade === "A") performance = "Outstanding";
        else if (grade === "B") performance = "Very Good";
        else if (grade === "C") performance = "Good";
        else if (grade === "D") performance = "Satisfactory";
        else performance = "Poor";

        newGrades[index] = grade;
        newStatuses[index] = status;
        newPerformances[index] = performance;
      });

      // Calculate positions based on percentages
      studentPercentages.sort((a, b) => b.percentage - a.percentage);
      const positions = {};
      studentPercentages.forEach((student, i) => {
        positions[student.index] = i + 1;
      });

      console.log("\n🎯 Final Results:", {
        newMarks,
        newGrades,
        newStatuses,
        newPerformances,
      });

      setObtainedMarks(newMarks);
      setGrades(newGrades);
      setStudentPositions(positions);
      setStatuses(newStatuses);
      setPerformances(newPerformances);
    };

    if (students.length > 0) {
      calculateTotalMarks();
    }
  }, [students]);

  const getOrdinalSuffix = (num) => {
    if (!num) return "N/A";

    num = Number(num); // Convert to number

    let lastDigit = num % 10;
    let lastTwoDigits = num % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return `${num}th`;
    if (lastDigit === 1) return `${num}st`;
    if (lastDigit === 2) return `${num}nd`;
    if (lastDigit === 3) return `${num}rd`;

    return `${num}th`;
  };

  const getSuffixOnly = (num) => {
    const number = parseInt(num, 10); // Convert to number
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return "th";
    if (lastDigit === 1) return "st";
    if (lastDigit === 2) return "nd";
    if (lastDigit === 3) return "rd";

    return "th";
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container">
      <h2 className="no-print">Digital Mark Sheets</h2>
      <div className="no-print text-center my-4">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Print DMC
        </button>
      </div>

      <div className="dmc-grid">
        {students.map((student, index) => (
          <div
            key={index}
            ref={(el) => (dmcRefs.current[index] = el)}
            className="dmc-card"
          >
            {/* Decorative Shapes */}
            <div className="decorative-shape top-left"></div>
            <div className="decorative-shape top-right"></div>
            <div className="decorative-shape bottom-left"></div>
            <div className="decorative-shape bottom-right"></div>
            <div className="flex items-center justify-center gap-4 w-full mb-[-30px]">
              {/* School Logo */}
              <div className="w-[180px] h-[180px] flex justify-center items-center">
                <img
                  src={student.Logo}
                  alt="School Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* School Name */}
              <h2
                style={{ fontFamily: "Merriweather, serif" }}
                className="relative z-40 text-center"
              >
                <strong>{student["School Name"]}</strong>
              </h2>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
              {/* Header */}
              <h3 className="text-2xl font-bold text-center text-gray-700 mb-4">
                🎓 Detailed Marks Certificate
              </h3>

              {/* Student Information */}
              <div className="bg-white shadow-md rounded-lg  mb-4">
                <table className="w-full border-collapse border border-gray-400 text-left">
                  <tbody>
                    {[
                      [
                        "Name",
                        student["Student-Name"],
                        "Father Name",
                        student["Father Name"],
                        "Roll Number",
                        student["Roll No"],
                      ],
                      [
                        "Exam Type",
                        student["Exam Type"],
                        "Class/Section",
                        getOrdinalSuffix(student["Class Level"]),
                        "Session/Year",
                        student["Session"],
                      ],
                    ].map((row, rowIndex) => (
                      <tr key={rowIndex} className="border border-gray-300">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`p-2 border border-gray-300 ${
                              cellIndex % 2 === 0
                                ? "font-semibold bg-gray-100 text-gray-700"
                                : "text-black underline"
                            }`}
                          >
                            {cell || "N/A"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Marks Table */}
              <div className="overflow-x-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <table className="w-full border-collapse text-gray-700">
                    {/* Table Header */}
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg">
                        {[
                          "S.No",
                          "Subjects",
                          "Total Marks",
                          "Obtained Marks",
                        ].map((heading, i) => (
                          <th key={i} className="border px-6 py-3">
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="text-center text-base">
                      {student.Subjects && student.Subjects.length > 0 ? (
                        student.Subjects.map((subject, i) => (
                          <tr
                            key={i}
                            className={`${
                              i % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-indigo-100 transition`}
                          >
                            <td className="border px-6 py-3">{i + 1}</td>
                            <td className="border px-6 py-3">
                              {subject.paper}
                            </td>
                            <td className="border px-6 py-3">
                              {subject.marks}
                            </td>
                            <td className="border px-6 py-3 font-bold text-indigo-700">
                              {student[
                                subject.paper.toLowerCase().replace(" ", "")
                              ] || "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="border px-6 py-3 text-red-500"
                          >
                            No subjects found
                          </td>
                        </tr>
                      )}

                      {/* Total Marks Row */}
                      <tr className="bg-gray-100 font-semibold">
                        <td
                          colSpan={2}
                          className="border px-6 py-3 text-center"
                        >
                          Total Marks
                        </td>
                        <td className="border px-6 py-3">
                          {student.Subjects.reduce(
                            (acc, subject) =>
                              acc + (Number(subject.marks) || 0),
                            0
                          )}
                        </td>
                        <td className="border px-6 py-3 text-indigo-700 font-bold">
                          {obtainedMarks[index] || 0}
                        </td>
                      </tr>

                      {/* Status Row */}
                      <tr className="bg-gray-200 font-semibold">
                        <td
                          colSpan={2}
                          className="border px-6 py-3 text-center"
                        >
                          Status
                        </td>
                        <td colSpan={2} className="p-3 border text-center">
                          <span
                            className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${
                              statuses[index] === "Pass"
                                ? "bg-green-500"
                                : statuses[index] === "Fail"
                                ? "bg-red-500"
                                : "bg-gray-500"
                            }`}
                          >
                            {statuses[index] || "N/A"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Information */}
              <div className="mt-6 footer">
                <table className="w-full border text-center bg-white shadow-md rounded-lg overflow-hidden">
                  <tbody>
                    <tr className="bg-gray-200">
                      <td className="border px-4 py-2 font-semibold text-gray-700">
                        Percentage
                      </td>
                      <td className="p-2 border font-bold text-indigo-700">
                        {(
                          (obtainedMarks[index] /
                            student.Subjects.reduce(
                              (acc, subject) =>
                                acc + (Number(subject.marks) || 0),
                              0
                            )) *
                          100
                        ).toFixed(2) || "0"}{" "}
                        %
                      </td>

                      <td className="p-2 border font-semibold text-gray-700">
                        Grade
                      </td>
                      <td className="p-2 border text-indigo-700 font-bold">
                        {grades[index] || "N/A"}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2 border font-semibold text-gray-700">
                        Position
                      </td>
                      <td className="p-2 border font-bold text-indigo-700">
                        {studentPositions[index] || "N/A"}
                      </td>
                      <td className="p-2 border font-semibold text-gray-700">
                        Performance
                      </td>
                      <td className="p-2 border font-bold text-indigo-700">
                        {performances[index] || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Result Declaration Date */}
              <div className="flex justify-end mt-4">
                <span className="text-gray-600 font-medium">
                  📅 Result Declaration Date: {student["Declaration Date"]}
                </span>
              </div>
            </div>

            {/* Grading System */}
            <div className="grading-wrapper">
              <div className="grading-system-promotion mt-2 flex flex-nowrap justify-between items-center px-2 py-1 rounded-xl bg-white transition-all duration-300 ease-in-out overflow-hidden">
                {/* Grading System Section */}
                <div className="grading-system flex items-center p-6 rounded-2xl w-[40%] min-w-0">
                  {/* Image Section */}
                  <img
                    src="/grade bee.PNG"
                    alt="Grading System"
                    className="w-40 h-auto object-contain rounded-xl transition-transform duration-300 hover:scale-105"
                  />

                  {/* Grading System Content */}
                  <div className="flex-1 ml-6 text-left grading-system-text">
                    <h4 className="font-bold text-3xl text-gray-800 mb-2 pb-1 whitespace-nowrap">
                      Grading System
                    </h4>
                    <ul className="space-y-1 text-lg font-semibold text-gray-700">
                      <li className=" px-4 hover:text-yellow-600 transition">
                        A+ - Excellent
                      </li>
                      <li className=" px-4 hover:text-blue-600 transition">
                        A - Outstanding
                      </li>
                      <li className=" px-4 hover:text-green-600 transition">
                        B - Very Good
                      </li>
                      <li className=" px-4 hover:text-orange-600 transition">
                        C - Good
                      </li>

                      <li className=" px-4 hover:text-orange-600 transition">
                        D - Satisfactory
                      </li>
                      <li className=" px-4 hover:text-red-600 transition">
                        F - Poor
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Promotion Message Section */}
                <div className="promotion-message text-center relative w-[40%] h-52 min-w-0">
                  {/* Background Image */}
                  <img
                    src="/comments.PNG"
                    alt="Comments"
                    className="w-full h-full object-contain rounded-2xl"
                  />

                  {/* Overlay Text */}
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-bold z-10 px-6 pb-2 text-center rounded-2xl">
                    {statuses[index] !== "Fail" ? (
                      <p style={{ fontFamily: "Merriweather, serif" }}>
                        🎉 Congratulations! You have been promoted to Class{" "}
                        <span className="inline-flex items-baseline font-extrabold">
                          {parseInt(student["Class Level"]) + 1}
                          <sup className="text-sm">
                            {getSuffixOnly(
                              parseInt(student["Class Level"]) + 1
                            )}
                          </sup>
                        </span>
                      </p>
                    ) : (
                      <p
                        style={{ fontFamily: "Merriweather, serif" }}
                        className="text-red-300"
                      >
                        Unfortunately! You have not met the required standards
                        to pass the exam.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div
                  className="flex justify-between mt-3"
                  style={{
                    marginTop: student.Subjects.length < 7 ? "6rem" : "2.5rem",
                  }}
                >
                  <div className="text-center">
                    <hr className="border-t border-black w-40 mx-auto mt-1" />
                    <p className="font-semibold">Exam Controller Signature</p>
                  </div>

                  <div className="text-center">
                    <hr className="border-t border-black w-40 mx-auto mt-1" />
                    <p className="font-semibold">Principal Signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DMCComponent;

<div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
  {/* Single DMC Design */}
  <div
    onClick={() => handleDesignSelection("NewDmc")}
    className="relative w-80 h-96 cursor-pointer rounded-xl shadow-2xl overflow-hidden transition-transform transform hover:scale-105 bg-white group"
  >
    <img
      src="https://i.pinimg.com/736x/3a/e7/c6/3ae7c69e90dde62803bb48c23b8ab1f2.jpg"
      alt="Single DMC Design"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
    />
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <h3
        className="text-2xl font-semibold text-white txtWhite"
        style={cardStyle}
      >
        Single DMC Design
      </h3>
      <p
        className="text-sm text-center mt-2 text-white txtWhite"
        style={cardStyle}
      >
        Standard layout for individual DMCs.
      </p>
      <button className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md cursor-pointer hover:bg-blue-600 transition-all">
        Select Design
      </button>
    </div>
  </div>

  {/* Two DMCs Layout */}
  <div
    onClick={() => handleDesignSelection("NewDmcLayout")}
    className="relative w-80 h-96 cursor-pointer rounded-xl shadow-2xl overflow-hidden transition-transform transform hover:scale-105 bg-white group"
  >
    <img
      src="https://i.pinimg.com/474x/32/ee/68/32ee68b6efd50485d0c77e117e52fe5b.jpg"
      alt="Two DMCs Layout"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
    />
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <h3
        className="text-2xl font-semibold text-white txtWhite"
        style={cardStyle}
      >
        Two DMCs on One Page
      </h3>
      <p
        className="text-sm text-center mt-2 text-white txtWhite"
        style={cardStyle}
      >
        Print two DMCs per page for efficiency.
      </p>
      <button className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md cursor-pointer hover:bg-blue-600 transition-all">
        Select Design
      </button>
    </div>
  </div>
</div>;

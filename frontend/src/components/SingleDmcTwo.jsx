import React, { useRef, useState, useEffect } from "react";
import { FaStar, FaMedal, FaThumbsUp, FaRegSadTear } from "react-icons/fa";
import "./SingleDmcTwo.css";

const SingleDmcTwo = ({ students }) => {
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

  const getOrdinal = (num) => {
    const number = parseInt(num, 10); // Convert to integer
    if (isNaN(number)) return ""; // Handle invalid input

    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return `${number}th`;
    if (lastDigit === 1) return `${number}st`;
    if (lastDigit === 2) return `${number}nd`;
    if (lastDigit === 3) return `${number}rd`;

    return `${number}th`;
  };

  // Example Usage:
  console.log(getOrdinal(1)); // "1st"
  console.log(getOrdinal(2)); // "2nd"
  console.log(getOrdinal(3)); // "3rd"
  console.log(getOrdinal(4)); // "4th"
  console.log(getOrdinal(11)); // "11th"
  console.log(getOrdinal(21)); // "21st"
  console.log(getOrdinal(42)); // "42nd"
  console.log(getOrdinal(100)); // "100th"
  console.log(getOrdinal(101)); // "101st"
  console.log(getOrdinal(111)); // "111th"
  console.log(getOrdinal(122)); // "122nd"

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
            <div className="flex items-center justify-center gap-1 w-full mb-[-30px]">
              {/* School Logo */}
              <div className="w-[240px] h-[240px] ">
                <img
                  src={student.Logo}
                  alt="School Logo"
                  className="w-[240px] h-full object-cover"
                />
              </div>
              {/* School Name */}
              <div className="ml-[-30px]">
                <h2
                  style={{ fontFamily: "Merriweather, serif" }}
                  className="relative z-40 text-center"
                >
                  <strong>{student["School Name"]}</strong>
                </h2>
                <h3 className="relative z-40">
                  <strong>Detailed Marks Certificate</strong>
                </h3>
              </div>
            </div>

            {/* Student Information */}
            <div className=" mx-4 bg-white shadow-md rounded-lg  mb-4 relative z-40">
              <table className="w-full border-collapse overflow-hidden rounded-lg shadow-md bg-white">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-1 text-[14px] border border-gray-700">
                      Name
                    </th>
                    <th className="p-1 text-[14px] border border-gray-700">
                      Father Name
                    </th>
                    <th className="p-1 text-[14px] border border-gray-700">
                      Roll NO
                    </th>
                    <th className="p-1 text-[14px] border border-gray-700">
                      Exam Type
                    </th>
                    <th className="p-1 text-[14px] border border-gray-700">
                      Class
                    </th>
                    <th className="p-1 text-[14px] border border-gray-700">
                      Session/Year
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white hover:bg-gray-100 transition">
                    <td className="px-2 py-1 text-[14px] border border-gray-300 text-gray-900">
                      {student["Student-Name"] || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[14px] border border-gray-300 text-gray-900">
                      {student["Father Name"] || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[14px] border border-gray-300 text-gray-900">
                      {student["Roll No"] || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[14px] border border-gray-300 text-gray-900">
                      {student["Exam Type"] || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[14px] border border-gray-300 text-gray-900">
                      {getOrdinalSuffix(student["Class Level"]) || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[14px] border border-gray-300 text-gray-900">
                      {student["Session"] || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto p-4 ">
              <table className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-700 to-gray-900 text-white text-sm uppercase">
                    <th className="border border-gray-500 px-4 py-1">S.No</th>
                    <th className="border border-gray-500 px-4 py-1">
                      Subjects
                    </th>
                    <th className="border border-gray-500 px-4 py-1">
                      Total Marks
                    </th>
                    <th className="border border-gray-500 px-4 py-1">
                      Obtained Marks
                    </th>
                  </tr>
                </thead>
                <tbody
                  style={{
                    fontSize: student.Subjects.length > 8 ? ".9rem" : "1rem",
                  }}
                  className="bg-white text-gray-800"
                >
                  {student.Subjects && student.Subjects.length > 0 ? (
                    student.Subjects.map((subject, i) => (
                      <tr
                        key={i}
                        className={`border-b border-gray-300 ${
                          i % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-200 transition-all`}
                      >
                        <td className="border px-4 py-1 text-center font-medium">
                          {i + 1}
                        </td>
                        <td className="border px-4 py-1">{subject.paper}</td>
                        <td className="border px-4 py-1 text-center font-semibold">
                          {subject.marks}
                        </td>
                        <td className="border px-4 py-1 text-center font-semibold text-blue-600">
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
                        className="border px-4 py-3 text-center text-red-500"
                      >
                        No subjects found
                      </td>
                    </tr>
                  )}
                  {/* Total Marks Row */}
                  <tr className="bg-gray-100 text-gray-900 font-semibold border-t-2 border-gray-400">
                    <td colSpan={2} className="border px-4 py-1 text-center">
                      Total Marks
                    </td>
                    <td className="border px-4 py-1 text-center">
                      {student.Subjects.reduce(
                        (acc, subject) => acc + (Number(subject.marks) || 0),
                        0
                      )}
                    </td>
                    <td className="border px-4 py-1 text-center text-blue-600">
                      {obtainedMarks[index] || 0}
                    </td>
                  </tr>
                  {/* Status Row */}
                  <tr className="bg-gray-200 text-gray-900 font-bold border-t-2 border-gray-400">
                    <td colSpan={2} className="border px-4 py-1 text-center">
                      Status
                    </td>
                    <td
                      colSpan={2}
                      className="border px-4 py-1 text-center text-lg"
                    >
                      {statuses[index] || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="footer  mt-4 pt-1">
              <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg bg-white">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                    <th className="px-2 py-1 text-[14px] border border-gray-600 ">
                      Percentage
                    </th>
                    <th className="px-2 py-1 text-[14px] border border-gray-600 ">
                      Grade
                    </th>
                    <th className="px-2 py-1 text-[14px] border border-gray-600 ">
                      Position
                    </th>
                    <th className="px-2 py-1 text-[14px] border border-gray-600 ">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-100 transition">
                    <td className="px-2 py-1 text-[14px] border border-gray-300 font-semibold text-gray-900">
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
                    <td className="px-2 py-1 text-[14px] border border-gray-300 font-semibold text-gray-900">
                      {grades[index] || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-[14px] border border-gray-300 font-semibold text-gray-900">
                      {getOrdinal(studentPositions[index] || "N/A")}
                    </td>
                    <td className="px-2 py-1 text-[14px] border border-gray-300 font-semibold text-gray-900">
                      {performances[index] || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mr-[20px] m-0 p-0">
              <span className="text-gray-600 font-medium">
                Result Declaration Date : {student["Declaration Date"]}
              </span>
            </div>

            {/* Grading System */}
            <div className="grading-wrapper">
              <div className="grading-system-promotion mt-2 flex flex-nowrap justify-between items-center px-2 py-1 rounded-xl bg-white transition-all duration-300 ease-in-out overflow-hidden">
                {/* Grading System Section */}
                <div className="grading-system flex items-center p-6 rounded-2xl w-[40%] min-w-0">
                  {/* Image Section */}
                  <img
                    src="/congrats1.jpg"
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
                  {/* Overlay Text */}
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-bold z-10 px-6 pb-2 text-center rounded-2xl">
                    {statuses[index] !== "Fail" ? (
                      <img src="/congrats8.png" alt="" />
                    ) : (
                      <img src="/try1-removebg-preview.png" alt="" />
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

export default SingleDmcTwo;

import React, { useRef, useState, useEffect } from "react";
import { FaStar, FaMedal, FaThumbsUp, FaRegSadTear } from "react-icons/fa";
import "./Dmc.css";

const NewDmc = ({ students }) => {
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
            <h2
              style={{ fontFamily: "Merriweather, serif" }}
              className="relative z-40"
            >
              <strong>{student["School Name"]}</strong>
            </h2>
            {/* Centered School Logo */}

            <div className="flex justify-center items-center w-full h-[180px] object-cover my-1 p-0 mt-[-40px] mb-[-40px] relative ">
              <img
                src={student.Logo}
                alt="School Logo"
                className="w-auto h-full m-0 p-0 z-20 object-cover"
              />
            </div>
            <h3 className="relative z-40">
              <strong>Detailed Marks Certificate</strong>
            </h3>
            <div className="flex flex-col items-center">
              {/* <div className="border p-1 rounded-lg w-full max-w-[300px] text-center mb-2 rollNo">
                <strong>Roll Number:</strong> {student["Roll No"] || "N/A"}
              </div> */}

              <div className="flex flex-wrap justify-center text-left gap-4  studentInfo">
                <div className="border p-1 rounded-lg w-full max-w-[300px] px-2 relative z-40">
                  <strong>Roll Number:</strong> {student["Roll No"] || "N/A"}
                </div>
                <div className="border p-1 rounded-lg w-full max-w-[300px] px-2 relative z-40">
                  <strong>Exam Type: </strong> {student["Exam Type"] || "N/A"}
                </div>
                <div className="border p-1 rounded-lg w-full max-w-[300px] px-2">
                  <strong>Name: </strong> {student["Student-Name"] || "N/A"}
                </div>
                <div className="border p-1 rounded-lg w-full max-w-[300px] px-2">
                  <strong>F/Name: </strong> {student["Father Name"] || "N/A"}
                </div>
                <div className="border p-1 rounded-lg w-full max-w-[300px] px-2">
                  <strong>Class/Section: </strong>{" "}
                  {getOrdinalSuffix(student["Class Level"])}
                </div>
                <div className="border p-1 rounded-lg w-full max-w-[300px] px-2">
                  <strong>Session/year: </strong> {student["Session"] || "N/A"}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto p-4 ">
              <table className="w-full border text-center">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-1">S.No</th>
                    <th className="border px-4 py-1">Subjects</th>
                    <th className="border px-4 py-1">Total Marks</th>
                    <th className="border px-4 py-1">Obtained Marks</th>
                  </tr>
                </thead>
                <tbody
                  style={{
                    fontSize: student.Subjects.length > 8 ? ".9rem" : "1rem",
                  }}
                >
                  {student.Subjects && student.Subjects.length > 0 ? (
                    student.Subjects.map((subject, i) => (
                      <tr key={i} className="hover:bg-gray-100">
                        <td className="border px-4 py-1">{i + 1}</td>
                        <td className="border px-4 py-1">{subject.paper}</td>
                        <td className="border px-4 py-1">{subject.marks}</td>
                        <td className="border px-4 py-1">
                          {
                            student[
                              subject.paper.toLowerCase().replace(" ", "")
                            ]
                          }
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="border px-4 py-1 text-center text-red-500"
                      >
                        No subjects found
                      </td>
                    </tr>
                  )}
                  <tr className="hover:bg-gray-100">
                    <td
                      colSpan={2}
                      className="border px-4 py-1 font-semibold text-center"
                    >
                      Total Marks
                    </td>
                    <td className="border px-4 py-1">
                      {student.Subjects.reduce(
                        (acc, subject) => acc + (Number(subject.marks) || 0),
                        0
                      )}
                    </td>
                    <td className="border px-4 py-1">
                      {obtainedMarks[index] || 0}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td
                      colSpan={2}
                      className="border px-4 py-1 font-semibold text-center"
                    >
                      Status
                    </td>
                    <td className="p-2 border text-center" colSpan={2}>
                      {statuses[index] || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="footer  mt-4 pt-1">
              <table className="w-full border text-center">
                <tbody>
                  <tr className="bg-gray-200">
                    <td className="border px-4 py-1 font-semibold text-center">
                      Percentage
                    </td>
                    <td className="p-2 border">
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

                    <td className="p-2 border font-semibold">Grade</td>
                    <td className="p-2 border">{grades[index] || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-semibold">Position</td>
                    <td className="p-2 border">
                      {getOrdinal(studentPositions[index] || "N/A")}
                    </td>
                    <td className="p-2 border font-semibold">Performance</td>
                    <td className="p-2 border">
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

export default NewDmc;

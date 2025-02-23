import React, { useRef, useState, useEffect } from "react";
import { FaStar, FaMedal, FaThumbsUp, FaRegSadTear } from "react-icons/fa";
import "./newDmcLayout.css";
import clsx from "clsx";
const NewDmcLayout = ({ students }) => {
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

        newMarks[index] = obtained;

        const percentage = totalMarks > 0 ? (obtained / totalMarks) * 100 : 0;
        studentPercentages.push({ index, percentage });

        const passingCriteria = student["Passing Criteria"];
        const passingPercentage = Number(student["Passing Percentage"]) || 0;
        const failedPapersAllowed = Number(student["Failed Papers"]) || 0;
        const passedPapersRequired = Number(student["Passed Papers"]) || 0;

        let status = "Pass";
        let grade = "F";

        if (passingCriteria === "Percentage") {
          status = percentage >= passingPercentage ? "Pass" : "Fail";

          if (percentage >= 90) grade = "A+";
          else if (percentage >= 80) grade = "A";
          else if (percentage >= 70) grade = "B";
          else if (percentage >= 60) grade = "C";
          else if (percentage >= 33) grade = "D";
          else grade = "F";
        } else if (passingCriteria === "No of Papers Failed") {
          const failedPapersCount = student.Subjects.filter((subject) => {
            const obtainedMarks =
              Number(student[subject.paper.toLowerCase().replace(" ", "")]) ||
              0;
            const passingMarks = Number(subject.passingMarks) || 0;
            return obtainedMarks < passingMarks;
          }).length;

          if (failedPapersCount >= failedPapersAllowed) {
            status = "Fail";
          } else {
            status = "Pass";
          }

          if (status === "Pass") {
            if (percentage >= 90) grade = "A+";
            else if (percentage >= 80) grade = "A";
            else if (percentage >= 70) grade = "B";
            else if (percentage >= 60) grade = "C";
            else if (percentage >= 33) grade = "D";
          } else grade = "F";
        } else if (passingCriteria === "No of Papers Passed") {
          const passedPapersCount = student.Subjects.filter((subject) => {
            const obtainedMarks =
              Number(student[subject.paper.toLowerCase().replace(" ", "")]) ||
              0;
            const passingMarks = Number(subject.passingMarks) || 0;
            return obtainedMarks >= passingMarks;
          }).length;

          if (passedPapersCount >= passedPapersRequired) {
            status = "Pass";
          } else {
            status = "Fail";
          }

          if (status === "Pass") {
            if (percentage >= 90) grade = "A+";
            else if (percentage >= 80) grade = "A";
            else if (percentage >= 70) grade = "B";
            else if (percentage >= 60) grade = "C";
            else if (percentage >= 33) grade = "D";
          } else grade = "F";
        }

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

      studentPercentages.sort((a, b) => b.percentage - a.percentage);
      const positions = {};
      studentPercentages.forEach((student, i) => {
        positions[student.index] = i + 1;
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

    num = Number(num);

    let lastDigit = num % 10;
    let lastTwoDigits = num % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return `${num}th`;
    if (lastDigit === 1) return `${num}st`;
    if (lastDigit === 2) return `${num}nd`;
    if (lastDigit === 3) return `${num}rd`;

    return `${num}th`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container print:w-full">
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
          <div key={index} className="dmc-card">
            <h2
              style={{ fontFamily: "Merriweather, serif" }}
              className="relative z-40"
            >
              <strong>{student["School Name"]}</strong>
            </h2>

            <div className="flex justify-center items-center w-full h-[180px] object-cover my-1 p-0 mt-[-40px] mb-[-40px] relative">
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
              <div className=" grid grid-cols-[1fr_1fr_210px] gap-1  studentInfoNewLayout">
                <div className="border p-1 rounded-lg  px-2">
                  <strong>Name: </strong> {student["Student-Name"] || "N/A"}
                </div>

                <div className="border p-1 rounded-lg  px-2 relative z-40">
                  <strong>Exam Type: </strong> {student["Exam Type"] || "N/A"}
                </div>

                <div className="border p-1 rounded-lg  px-2 relative z-40">
                  <strong>Roll No:</strong> {student["Roll No"] || "N/A"}
                </div>
                <div className="border p-1 rounded-lg  px-2">
                  <strong>F/Name: </strong> {student["Father Name"] || "N/A"}
                </div>
                <div className="border p-1 rounded-lg  px-2">
                  <strong>Class/Section: </strong>{" "}
                  {getOrdinalSuffix(student["Class Level"])}
                </div>
                <div className="border p-1 rounded-lg w-full max-w-[200px] px-2">
                  <strong>Session/year: </strong> {student["Session"] || "N/A"}
                </div>
              </div>
            </div>
            <div className="flex justify-center flex-row gap-4 p-4">
              <div className="overflow-x-auto max-w-fit marksTable">
                <table
                  className="w-full border text-center"
                  style={{
                    marginBottom:
                      student.Subjects.length > 6 ? "0rem" : "1.8rem",
                  }}
                >
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-4 py-1">S.No</th>
                      <th className="border px-4 py-1">Subjects</th>
                      <th className="border px-4 py-1">Total Marks</th>
                      <th className="border px-4 py-1">Obtained Marks</th>
                    </tr>
                  </thead>
                  <tbody
                    className={clsx({
                      "print:text-xs": student.Subjects.length === 8,
                      "print:text-[9px]": student.Subjects.length > 8,
                      "print:text-sm": student.Subjects.length < 8,
                    })}
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
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto w-fit">
                <table className="w-full border text-center percentageTable">
                  <tbody>
                    <tr className="bg-gray-200">
                      <td className="border px-1 py-1 font-semibold text-center print:px-0">
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
                    </tr>

                    <tr>
                      <td className="p-2 border font-semibold">Position</td>
                      <td className="p-2 border">
                        {studentPositions[index] || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Status</td>
                      <td className="p-2 border">{statuses[index] || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-start  m-0 p-0">
                  <span className="text-gray-600 text-[10px] resultDate">
                    <strong>Result Declaration Date</strong> :{" "}
                    {student["Declaration Date"]}
                  </span>
                </div>

                <div className="text-center mt-10 print:mt-5">
                  <p
                    className="font-semibold print:pt-6"
                    style={{
                      marginTop: student.Subjects.length > 6 ? "6rem" : "2rem",
                    }}
                  >
                    Principal Signature
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewDmcLayout;

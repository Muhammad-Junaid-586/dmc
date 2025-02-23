import React from "react";
import { FaStar, FaMedal, FaThumbsUp, FaRegSadTear } from "react-icons/fa";
import "./Dmc.css";

const Dmc = () => {
  const students = [
    { name: "Ali Ahmed", rollNumber: "101", marks: 90, position: 1 },
    { name: "Sara Khan", rollNumber: "102", marks: 80, position: 2 },
    { name: "Usman Tariq", rollNumber: "103", marks: 70, position: 3 },
    { name: "Hira Ali", rollNumber: "104", marks: 60, position: 4 },
    { name: "Bilal Zafar", rollNumber: "105", marks: 40, position: 5 },
  ];

  const getSuffix = (num) => {
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return `${num}th`;
    if (lastDigit === 1) return `${num}st`;
    if (lastDigit === 2) return `${num}nd`;
    if (lastDigit === 3) return `${num}rd`;
    return `${num}th`;
  };

  return (
    <div className="dmc-container">
      <div className="dmc-border">
        <div className="dmc-content">
          <h1 className="dmc-title">Student DMC Report</h1>
          <table className="dmc-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Marks</th>
                <th>Position</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.marks}</td>
                  <td>{getSuffix(student.position)}</td>
                  <td>
                    {student.marks >= 85 ? (
                      <FaStar className="gold-icon" title="Excellent" />
                    ) : student.marks >= 75 ? (
                      <FaMedal className="silver-icon" title="Good" />
                    ) : student.marks >= 60 ? (
                      <FaThumbsUp className="green-icon" title="Average" />
                    ) : (
                      <FaRegSadTear
                        className="red-icon"
                        title="Needs Improvement"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dmc;

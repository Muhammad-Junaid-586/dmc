import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useState } from "react";

const DMCGenerator = ({ students }) => {
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Digital Mark Sheet", 14, 10);
    doc.autoTable({
      head: [["Name", "Roll No", "Marks", "Grade", "Status"]],
      body: filteredStudents.map((s) => [
        s.name,
        s.rollNo,
        s.marks,
        s.grade,
        s.status,
      ]),
    });
    doc.save("DMC_Report.pdf");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">DMC Generator</h1>
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Roll No</th>
              <th className="border p-2">Marks</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.rollNo}</td>
                <td className="border p-2">{student.marks}</td>
                <td className="border p-2">{student.grade}</td>
                <td
                  className={`border p-2 font-semibold ${
                    student.status === "Pass"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {student.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          onClick={exportPDF}
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default DMCGenerator;

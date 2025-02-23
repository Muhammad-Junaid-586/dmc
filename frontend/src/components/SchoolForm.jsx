import React, { useState } from "react";

const SchoolForm = ({ onSubmit }) => {
  const [schoolName, setSchoolName] = useState("");
  const [logo, setLogo] = useState(null);
  const [session, setSession] = useState("");
  const [declarationDate, setDeclarationDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { schoolName, logo, session, declarationDate };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="School Name"
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
        style={styles.input}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setLogo(e.target.files[0])}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Session"
        value={session}
        onChange={(e) => setSession(e.target.value)}
        style={styles.input}
      />
      <input
        type="date"
        placeholder="Declaration Date"
        value={declarationDate}
        onChange={(e) => setDeclarationDate(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        Submit
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
};

export default SchoolForm;

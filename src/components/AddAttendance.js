import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import XLSX to read Excel files
import "./dstyles.css";

const AddAttendance = ({ setShowAddAttendance }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      if (
        uploadedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        uploadedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(uploadedFile);
        setError(""); // Clear any previous error
      } else {
        setError("Please upload a valid Excel file (.xlsx or .xls).");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the input fields
    if (!file) {
      setError("Please upload an Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const binaryString = reader.result;
      try {
        const workbook = XLSX.read(binaryString, { type: "binary" });

        // Assuming the first sheet contains the attendance data
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert to 2D array

        if (data.length === 0) {
          setError("The Excel file is empty. Please check the file and try again.");
          return;
        }

        // Here we only send the file to the backend
        const formData = new FormData();
        formData.append("file", file);

        // Send the file to the backend
        try {
          await axios.post("http://34.136.221.248:8000/api/attendance/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // Close the add attendance form after successful submission
          setShowAddAttendance(false);
        } catch (error) {
          setError("Error uploading the attendance file.");
        }
      } catch (error) {
        setError("Error processing the Excel file. Please make sure the file is valid.");
      }
    };

    reader.onerror = () => {
      setError("Error reading the Excel file.");
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="add-attendance-modal">
      <div className="modal-content">
        <span
          className="close-btn"
          onClick={() => setShowAddAttendance(false)}
        >
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <label>Upload Excel File</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            required
          />

          <button type="submit">Add Attendance</button>
          <button type="button" onClick={() => setShowAddAttendance(false)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAttendance;

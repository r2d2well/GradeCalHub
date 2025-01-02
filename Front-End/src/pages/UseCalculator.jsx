import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/UseCalculator.css";
import NavigationBar from "../components/NavigationBar";

function UseCalculator() {
  const location = useLocation();
  const { calculator } = location.state || {};

  // Check if calculator is available and has the expected structure
  const gradeCategories = calculator?.grades || []; // Assuming `grades` is directly under `calculator`
  const [grades, setGrades] = useState(
    gradeCategories.map(() => 0) // Initialize grades with 0
  );

  // Calculate the final grade
  const finalGrade =
    grades.length > 0
      ? grades.reduce((acc, grade) => acc + parseFloat(grade || 0), 0) /
        grades.length
      : 0;

  // Handle input changes
  const handleInputChange = (index, value) => {
    const updatedGrades = [...grades];
    updatedGrades[index] = value;
    setGrades(updatedGrades);
  };

  if (!calculator) {
    return (
      <div>
        <NavigationBar />
        <p>No calculator data available.</p>
      </div>
    );
  }

  return (
    <div>
      <NavigationBar />
      <div className="use-calculator-container">
        <h1>{calculator.name}</h1>

        {gradeCategories.map((category, index) => (
          <div className="grade-input" key={index}>
            <label htmlFor={`grade-${index}`}>
              Enter {category.name || `Category ${index + 1}`} Grade:
            </label>
            <input
              id={`grade-${index}`}
              type="number"
              value={grades[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          </div>
        ))}

        <h2>Final Grade: {finalGrade.toFixed(2)}</h2>
      </div>
    </div>
  );
}

export default UseCalculator;

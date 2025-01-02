import React, { useState, useEffect, useRef } from "react";
import "../styles/CategoryGradeCalculator.css";
import NavigationBar from "../components/NavigationBar";

function CategoryGradeCalculator() {
  const [grades, setGrades] = useState([]);
  const [inputGrade, setInputGrade] = useState("");
  const [average, setAverage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const gradesListRef = useRef(null);

  // Function to add a new grade
  const addGrade = (e) => {
    e.preventDefault();

    const newGrade = parseFloat(inputGrade);
    if (!isNaN(newGrade)) {
      const updatedGrades = [...grades, newGrade];
      setGrades(updatedGrades);
      calculateAverage(updatedGrades);
      setInputGrade("");
    }
  };

  // Function to calculate the average grade
  const calculateAverage = (gradesList) => {
    const total = gradesList.reduce((sum, grade) => sum + grade, 0);
    const avg =
      gradesList.length > 0 ? (total / gradesList.length).toFixed(2) : 0;
    setAverage(avg);
  };

  // Function to select a grade
  const selectGrade = (index) => {
    setSelectedIndex(index);
  };

  // Function to remove the selected grade
  const removeSelectedGrade = () => {
    if (selectedIndex !== null) {
      const updatedGrades = grades.filter(
        (_, index) => index !== selectedIndex
      );
      setGrades(updatedGrades);
      calculateAverage(updatedGrades);
      setSelectedIndex(null);
    }
  };

  // Handle click outside the grades list to deselect the entry
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (gradesListRef.current && !gradesListRef.current.contains(e.target)) {
        setSelectedIndex(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div>
      <NavigationBar />
      <div className="container">
        <div className="grades-list" ref={gradesListRef}>
          <ul>
            {grades.map((grade, index) => (
              <li
                key={index}
                className={index === selectedIndex ? "selected" : ""}
                onClick={() => selectGrade(index)}
              >
                {grade}
              </li>
            ))}
          </ul>
        </div>

        <div className="form-section">
          <form onSubmit={addGrade}>
            <label htmlFor="gradeInput">Enter Grade: </label>
            <input
              type="number"
              id="gradeInput"
              value={inputGrade}
              onChange={(e) => setInputGrade(e.target.value)}
            />
            <button type="submit">Add Grade</button>
          </form>

          <button
            onClick={removeSelectedGrade}
            disabled={selectedIndex === null}
          >
            Remove Selected Grade
          </button>

          <h2>Average Grade: {average}</h2>
        </div>
      </div>
    </div>
  );
}

export default CategoryGradeCalculator;

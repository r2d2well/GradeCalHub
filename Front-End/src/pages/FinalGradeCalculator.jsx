import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import "../styles/FinalGradeCalculator.css"; // Import the CSS file

function FinalGradeCalculator() {
  const [currentGrade, setCurrentGrade] = useState("");
  const [desiredGrade, setDesiredGrade] = useState("");
  const [percentage, setPercentage] = useState("");
  const [min, setMin] = useState(0);

  // Calculate the minimum grade when state values change
  useEffect(() => {
    if (currentGrade && desiredGrade && percentage) {
      const gradePercent = currentGrade * (1 - percentage / 100);
      const points = desiredGrade - gradePercent;
      const minGrade = points / (percentage / 100);
      setMin(minGrade.toFixed(2));
    } else {
      setMin(0);
    }
  }, [currentGrade, desiredGrade, percentage]);

  const handleChange = (event, setter) => {
    setter(parseFloat(event.target.value) || "");
  };

  return (
    <div>
      <NavigationBar />

      <div className="center-container">
        <p>Current Grade in Class:</p>
        <input
          type="number"
          value={currentGrade}
          onChange={(e) => handleChange(e, setCurrentGrade)}
          placeholder="Enter current grade"
        />

        <p>Desired Grade in Class:</p>
        <input
          type="number"
          value={desiredGrade}
          onChange={(e) => handleChange(e, setDesiredGrade)}
          placeholder="Enter desired grade"
        />

        <p>What percentage is your final worth:</p>
        <input
          type="number"
          value={percentage}
          onChange={(e) => handleChange(e, setPercentage)}
          placeholder="Enter final exam weight"
        />

        <h2 className="h2">Minimum Final Needed: {min}</h2>
      </div>
    </div>
  );
}

export default FinalGradeCalculator;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import "../styles/CalculatorList.css"; // Import the CSS file

function CalculatorList() {
  const [calculators, setCalculators] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCalculator, setSelectedCalculator] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCalculators = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "https://gradecalhub-backend.onrender.com/calculators",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCalculators(response.data);
        } catch (err) {
          setError(err.message);
        }
      }
    };

    fetchCalculators();
  }, []);

  const handleSelect = (calculator) => {
    setSelectedCalculator(calculator);
  };

  const handleUseCalculator = () => {
    if (selectedCalculator) {
      navigate("/use-calculator", {
        state: { calculator: selectedCalculator },
      });
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete the calculator "${selectedCalculator.name}"?`
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `https://gradecalhub-backend.onrender.com/calculators/${selectedCalculator.name}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCalculators((prev) =>
          prev.filter((calc) => calc.name !== selectedCalculator.name)
        );
        setSelectedCalculator(null);
        alert("Calculator deleted successfully.");
      } catch (error) {
        console.error("Error deleting calculator:", error);
        alert("Failed to delete calculator.");
      }
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="calculator-list-container">
        {error && <p className="error">{error}</p>}
        <ul className="calculator-list">
          {calculators.map((calculator, index) => (
            <li
              key={index}
              className={`calculator-item ${
                selectedCalculator === calculator ? "selected" : ""
              }`}
              onClick={() => handleSelect(calculator)}
            >
              <h3>{calculator.name}</h3>
              <p>{calculator.description}</p>
            </li>
          ))}
        </ul>
        <button
          className={`use-button ${!selectedCalculator ? "disabled" : ""}`}
          onClick={handleUseCalculator}
        >
          Use Calculator
        </button>
        <button
          className={`use-button ${!selectedCalculator ? "disabled" : ""}`}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default CalculatorList;

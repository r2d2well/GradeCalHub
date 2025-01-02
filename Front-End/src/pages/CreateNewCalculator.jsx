import React, { useState } from "react";
import axios from "axios";
import "../styles/CreateNewCalculator.css";
import NavigationBar from "../components/NavigationBar";

function CreateNewCalculator() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [percent, setPercent] = useState("");
  const [totalPercent, setTotalPercent] = useState(0);
  const [calculatorName, setCalculatorName] = useState("");
  const [calculatorDescription, setCalculatorDescription] = useState("");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);

  // Handle adding a new category
  const handleAddCategory = () => {
    if (!categoryName || !percent) {
      alert("Please provide both a category name and percentage.");
      return;
    }

    const newPercent = parseFloat(percent);

    if (isNaN(newPercent) || newPercent <= 0) {
      alert("Please provide a valid positive percentage.");
      return;
    }

    setCategories((prev) => [
      ...prev,
      { name: categoryName, percent: newPercent },
    ]);
    setTotalPercent((prev) => prev + newPercent);
    setCategoryName("");
    setPercent("");
  };

  const handleRemoveCategory = () => {
    if (selectedCategoryIndex === null) {
      alert("No category selected.");
      return;
    }

    const newCategories = [...categories];
    const removedCategory = newCategories.splice(selectedCategoryIndex, 1);

    setCategories(newCategories);
    setTotalPercent((prev) => prev - removedCategory[0].percent);
    setSelectedCategoryIndex(null);
    setIsDisabled(true);
  };

  // Handle saving the calculator to the backend
  const handleCreateCalculator = async () => {
    if (!calculatorName || !calculatorDescription) {
      alert("Please provide both a name and description for the calculator.");
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.post("/calculators", {
          headers: { Authorization: `Bearer ${token}` },
          name: calculatorName,
          description: calculatorDescription,
          grades: categories,
        });
        alert("Calculator created successfully!");
        setCategories([]);
        setTotalPercent(0);
        setCalculatorName("");
        setCalculatorDescription("");
      } catch (error) {
        console.error("Error saving calculator:", error);
        alert("Failed to save calculator.");
      }
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="create-calculator-container">
        {/* Calculator Name and Description Section */}
        <div className="calculator-info">
          <label>Calculator Name</label>
          <br />
          <input
            type="text"
            value={calculatorName}
            onChange={(e) => setCalculatorName(e.target.value)}
            placeholder="Enter calculator name"
          />
          <br />

          <label>Calculator Description</label>
          <textarea
            value={calculatorDescription}
            onChange={(e) => setCalculatorDescription(e.target.value)}
            placeholder="Enter calculator description"
            rows={4}
          ></textarea>
        </div>

        <div className="categories-section">
          <div className="categories-list">
            <table>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Percent</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      setSelectedCategoryIndex(index);
                      setIsDisabled(false);
                    }}
                    className={
                      selectedCategoryIndex === index ? "selected-row" : ""
                    }
                  >
                    <td>{category.name}</td>
                    <td>{category.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Total Percent: {totalPercent}%</p>
          </div>

          <div className="input-container">
            <label>Category Name</label>
            <br />
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <br />
            <label>Percent</label>
            <br />
            <input
              type="number"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
            />
            <br />
            <button onClick={handleAddCategory}>Add Category</button>
            <button onClick={handleRemoveCategory} disabled={isDisabled}>
              Remove Selected
            </button>
          </div>
        </div>

        <button className="create-button" onClick={handleCreateCalculator}>
          Create Calculator
        </button>
      </div>
    </div>
  );
}

export default CreateNewCalculator;

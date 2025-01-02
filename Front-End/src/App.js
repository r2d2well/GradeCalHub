import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import Login from "./pages/Login";
import Register from "./pages/Register";
import FinalGradeCalculator from './pages/FinalGradeCalculator';
import CategoryGradeCalculator from './pages/CategoryGradeCalculator';
import CreateNewCalculator from './pages/CreateNewCalculator';
import CalculatorList from './pages/CalculatorList';
import UseCalculator from './pages/UseCalculator';
import RequireAuth from './components/withAuth';
import axios from "axios";


function App() {
  axios.defaults.baseURL = "http://localhost:5000";

  // Add an interceptor to include the token in every request
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Retrieve token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
    }
    return config; // Proceed with the request
  }, (error) => {
    return Promise.reject(error); // Handle request error
  });
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/final-grade-calculator" element={<FinalGradeCalculator />} />
        <Route path="/category-grade-calculator" element={<CategoryGradeCalculator />} />
        <Route path="/create-new-calculator" element={
          <RequireAuth>
            <CreateNewCalculator />
          </RequireAuth>
          } />
        <Route path="/calculator-list" element={
          <RequireAuth>
            <CalculatorList />
          </RequireAuth>
          } />
        <Route path="/use-calculator" element={<UseCalculator />} />
      </Routes>
    </Router>
  );
}

export default App;
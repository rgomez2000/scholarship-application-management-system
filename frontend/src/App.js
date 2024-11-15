import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header';          
import ScholarshipsList from './components/scholarshipsList';  
import LoginPage from './components/loginPage'; 

function App() {
  return (
      <div>
          <Header />  {/* Ensures the header is on all pages */}
          
          <Routes>
              {/* This is the routes for each page */}
              <Route path="/" element={<ScholarshipsList />} />  {/* Home page displaying scholarships */}
              <Route path="/login" element={<LoginPage />} />    {/* Login page route */}
          </Routes>
      </div>
  );
}


export default App;

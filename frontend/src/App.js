import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Header from './components/header';          
import ScholarshipsList from './components/scholarshipsList';  
import LoginPage from './components/loginPage'; 

function App() {
  return (
    <BrowserRouter>
      <div>
          <Header />  {/* Ensures the header is on all pages */}
          
          
            <Routes>
                {/* This is the routes for each page */}
                <Route path="/" element={<ScholarshipsList />} /> 
                <Route path="/login" element={<LoginPage />} />    
            </Routes>
        
      </div>
    </BrowserRouter>
  );
}


export default App;

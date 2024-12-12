import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Header from './components/header';          
import ScholarshipsList from './components/scholarshipsList';  
import LoginPage from './components/loginPage'; 
import RegisterPage from './components/registerPage';
import ScholarshipDetails from './components/scholarshipDetails';
import ApplicationPage from './components/applicationDetails';
import Profile from './components/profilePage';
import AddScholarship from "./components/addScholarship";
import ProfilePage from "./components/profilePage";
import ProfilePageNew from "./components/profilePageNew";
import ApplicationsList from "./components/applicationsList";
import AddApplication from "./components/addApplication";

function App() {
  return (
    <BrowserRouter>
      <div>
          <Header />  {/* Ensures the header is on all pages */}
          
          
            <Routes>
                {/* This is the routes for each page */}
                <Route path="/" element={<ScholarshipsList />} /> 
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/scholarship/:id" element={<ScholarshipDetails />} />
                <Route path="/addScholarship" element={<AddScholarship />}></Route>
                <Route path="/apply/:id" element={<AddApplication />} />
                <Route path="/profile" element={<ProfilePageNew />} />
                <Route path="/applications" element={<ApplicationsList />} />
            </Routes>
        
      </div>
    </BrowserRouter>
  );
}


export default App;
import React from "react";
import "./App.css";
import SideMenu from "./components/SideMenu";
import Footer from "./components/Footer";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Bag from "./pages/Bag";
import Signup from "./pages/Signup";

import Products from "./pages/Products";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Owner from "./pages/Owner";

function App() {
  return (
    
    <Router>
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <SideMenu />

        {/* Main Content */}
        <div className="flex flex-col flex-1">

          {/* Page Content */}
          <div className="flex-1 pl-20 md:pl-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bag" element={<Bag />} />
               <Route path="/signup" element={<Signup />} />
                <Route path="/products" element={<Products />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/owner" element={<Owner />} />
            </Routes>
          </div>

          {/* Footer INSIDE layout */}
          <Footer />

        </div>
      </div>
    </Router>
  );
}

export default App;
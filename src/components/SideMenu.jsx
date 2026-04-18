import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  ShoppingBag,
  PlusCircle,
  UserPlus,
  Camera,
  Send,
  Menu,
  X,
  LogOut,
  Heart
} from "lucide-react";

function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // ✅ Add this state
  const navigate = useNavigate();

  // ✅ DEFINE handleLogout FIRST (before useEffect that might use it)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Check login status and role
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token && userStr && userStr !== "undefined" && userStr !== "null") {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setUserRole(user.role); // ✅ Store the user's role
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // ✅ handleLogout is NOT in dependencies, so no issue

  return (
    <>
      {/* Mobile Top Bar with Dropdown Effect */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:hidden ${
          scrolled ? "bg-pink-500 shadow-lg py-2" : "bg-pink-200 py-4"
        }`}
      >
        <div className="flex items-center justify-between px-6">
          <h1 className={`font-bold transition-colors ${scrolled ? "text-white" : "text-pink-600"}`}>
            JHAIR
          </h1>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 rounded-lg transition-colors ${
              scrolled ? "text-white hover:bg-pink-600" : "text-pink-600 hover:bg-pink-100"
            }`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full z-50
          bg-gradient-to-b from-pink-50 to-white shadow-2xl
          flex flex-col justify-between transition-all duration-300
          hidden md:flex
          ${isOpen ? "w-64" : "w-20"}
        `}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Logo Section */}
        <div className="pt-8 pb-6">
          <div className="flex justify-center">
            <div
              className={`flex items-center justify-center bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl text-white font-bold transition-all duration-300 shadow-lg ${
                isOpen ? "w-12 h-12 text-lg" : "w-10 h-10 text-sm"
              }`}
            >
              {isOpen ? "JH" : "J"}
            </div>
          </div>
          {isOpen && (
            <p className="text-center text-xs text-gray-400 mt-2">JHAIR</p>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-2">
          <MenuItem icon={<Home size={20} />} text="Home" isOpen={isOpen} to="/" />
          <MenuItem icon={<ShoppingBag size={20} />} text="Products" isOpen={isOpen} to="/products" />
          
          {isLoggedIn ? (
            <>
              {/* Show different menu based on role */}
              {userRole === "owner" ? (
                <MenuItem icon={<PlusCircle size={20} />} text="Add Product" isOpen={isOpen} to="/owner" />
              ) : (
                <MenuItem icon={<User size={20} />} text="Profile" isOpen={isOpen} to="/profile" />
              )}
              
              <MenuItem icon={<Heart size={20} />} text="Saved" isOpen={isOpen} to="/profile" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                {isOpen && <span className="text-sm font-medium">Logout</span>}
              </button>
            </>
          ) : (
            <MenuItem icon={<UserPlus size={20} />} text="Signup" isOpen={isOpen} to="/signup" />
          )}
          
          <MenuItem icon={<PlusCircle size={20} />} text="My Bag" isOpen={isOpen} to="/bag" />
        </nav>

        {/* Bottom Icons */}
        <div className="pb-8 flex flex-col items-center gap-4">
          <IconOnly icon={<Camera size={18} />} isOpen={isOpen} />
          <IconOnly icon={<Send size={18} />} isOpen={isOpen} />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-pink-50 to-white shadow-2xl z-50 md:hidden animate-slide-in">
            <div className="pt-20 pb-6 px-4">
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  JH
                </div>
              </div>
              <nav className="space-y-2">
                <MobileMenuItem icon={<Home size={20} />} text="Home" to="/" onClick={() => setMobileOpen(false)} />
                <MobileMenuItem icon={<ShoppingBag size={20} />} text="Products" to="/products" onClick={() => setMobileOpen(false)} />
                
                {isLoggedIn ? (
                  <>
                    {userRole === "owner" ? (
                      <MobileMenuItem icon={<PlusCircle size={20} />} text="Add Product" to="/owner" onClick={() => setMobileOpen(false)} />
                    ) : (
                      <MobileMenuItem icon={<User size={20} />} text="Profile" to="/profile" onClick={() => setMobileOpen(false)} />
                    )}
                    
                    <MobileMenuItem icon={<Heart size={20} />} text="Saved" to="/profile" onClick={() => setMobileOpen(false)} />
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={20} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <MobileMenuItem icon={<UserPlus size={20} />} text="Signup" to="/signup" onClick={() => setMobileOpen(false)} />
                )}
                
                <MobileMenuItem icon={<PlusCircle size={20} />} text="My Bag" to="/bag" onClick={() => setMobileOpen(false)} />
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SideMenu;

// Desktop Menu Item
function MenuItem({ icon, text, isOpen, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-pink-100 to-pink-50 text-pink-600 shadow-sm"
            : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
        }`
      }
    >
      {icon}
      {isOpen && <span className="text-sm font-medium">{text}</span>}
    </NavLink>
  );
}

// Icon Only Component
function IconOnly({ icon, isOpen }) {
  return (
    <div
      className={`p-2 rounded-full text-gray-400 hover:bg-pink-100 hover:text-pink-500 cursor-pointer transition-all duration-200 ${
        isOpen ? "mx-4" : ""
      }`}
    >
      {icon}
    </div>
  );
}

// Mobile Menu Item
function MobileMenuItem({ icon, text, to, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-pink-100 to-pink-50 text-pink-600"
            : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
        }`
      }
    >
      {icon}
      <span className="text-sm font-medium">{text}</span>
    </NavLink>
  );
}
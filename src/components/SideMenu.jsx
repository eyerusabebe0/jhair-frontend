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
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

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

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr && userStr !== "undefined" && userStr !== "null") {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setUserRole(user.role);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Top Bar — shorter now */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 h-12 transition-all duration-300 md:hidden ${
          scrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-white/70 backdrop-blur-sm"
        }`}
      >
        <div className="flex h-full items-center justify-between px-4">
          <h1 className="!m-0 !text-base !leading-none font-bold text-pink-600">JHAIR</h1>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-0.5 rounded-lg text-pink-600 hover:bg-pink-50 active:scale-95 transition"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-pink-100 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around py-2 px-1">
          <BottomTab icon={<Home size={20} />} label="Home" to="/" />
          <BottomTab icon={<ShoppingBag size={20} />} label="Shop" to="/products" />
          <BottomTab icon={<PlusCircle size={20} />} label="Bag" to="/bag" />
          {isLoggedIn ? (
            userRole === "owner" ? (
              <BottomTab icon={<PlusCircle size={20} />} label="Add" to="/owner" />
            ) : (
              <BottomTab icon={<User size={20} />} label="Profile" to="/profile" />
            )
          ) : (
            <BottomTab icon={<UserPlus size={20} />} label="Sign Up" to="/signup" />
          )}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full z-50
          bg-gradient-to-b from-pink-50 to-white shadow-2xl
          flex-col justify-between transition-all duration-300
          hidden md:flex
          ${isOpen ? "w-64" : "w-20"}
        `}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
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

        <nav className="flex-1 px-3 space-y-2">
          <MenuItem icon={<Home size={20} />} text="Home" isOpen={isOpen} to="/" />
          <MenuItem icon={<ShoppingBag size={20} />} text="Products" isOpen={isOpen} to="/products" />

          {isLoggedIn ? (
            <>
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

        <div className="pb-8 flex flex-col items-center gap-4">
          <IconOnly icon={<Camera size={18} />} isOpen={isOpen} />
          <IconOnly icon={<Send size={18} />} isOpen={isOpen} />
        </div>
      </div>

      {/* Mobile Overlay Menu (secondary items) */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 w-72 max-w-[80vw] h-full bg-white shadow-2xl z-50 md:hidden animate-slide-in">
            <div className="pt-6 pb-6 px-5">
              <div className="flex justify-between items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold">
                  JH
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-400">
                  <X size={22} />
                </button>
              </div>
              <nav className="space-y-1">
                {isLoggedIn ? (
                  <>
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
                  <MobileMenuItem icon={<User size={20} />} text="Login" to="/login" onClick={() => setMobileOpen(false)} />
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SideMenu;

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

function BottomTab({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
          isActive ? "text-pink-600" : "text-gray-500"
        }`
      }
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}
import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-black/90 to-black text-white">
      {/* Main Footer Content - ALL CENTERED */}
      <div className="px-6 py-14 flex flex-col items-center justify-center text-center">
        
        {/* BRAND SECTION - CENTERED */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold !text-pink-500 mb-2">
            JHAIR
          </h2>
          <p className="text-gray-400 text-sm tracking-wide">
            PRIMUM DASHIO
          </p>
        </div>

        {/* NEWSLETTER + SOCIAL SECTION - CENTERED */}
        <div className="flex flex-col items-center max-w-md w-full">
          <h3 className="font-semibold mb-3 text-gray-300">Stay Updated</h3>
          
          {/* Input + Button - Centered */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
            <button className="bg-pink-500 hover:bg-pink-600 px-6 py-2 rounded-md text-sm transition">
              Join
            </button>
          </div>

          {/* SOCIAL ICONS - Centered */}
          <div className="flex gap-4 mt-6">
            <SocialIcon icon={<FaInstagram />} />
            <SocialIcon icon={<FaFacebook />} />
            <SocialIcon icon={<FaTwitter />} />
            <SocialIcon icon={<Mail size={18} />} />
          </div>
        </div>
      </div>

      {/* DIVIDER & BOTTOM BAR - Centered */}
      <div className="border-t border-white/10 py-6">
        <div className="flex flex-col items-center justify-center text-center text-sm text-gray-500">
          <p>© 2026 JHAIR. All rights reserved.</p>
          
          <div className="flex gap-6 mt-2">
            <span className="hover:text-pink-400 cursor-pointer transition">Privacy</span>
            <span className="hover:text-pink-400 cursor-pointer transition">Terms</span>
            <span className="hover:text-pink-400 cursor-pointer transition">Shipping</span>
          </div>
          
          {/* Admin Link - Goes to login page */}
          <Link 
            to="/admin" 
            className="text-gray-600 hover:text-pink-400 text-xs mt-3 transition"
          >
            🔐 Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

/* Social Icon Component */
function SocialIcon({ icon }) {
  return (
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-pink-500 hover:text-white cursor-pointer transition">
      {icon}
    </div>
  );
}
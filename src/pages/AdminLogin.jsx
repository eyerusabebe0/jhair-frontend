import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import API_URL from '../config/api';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

 const ALLOWED_ADMIN_EMAIL = "eyeru@gmail.com";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ FIRST CHECK: Is this the correct email?
    if (email.toLowerCase() !== ALLOWED_ADMIN_EMAIL.toLowerCase()) {
      setError("❌ Access denied. Only authorized admin can login.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        // ✅ Store admin info
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', email);
        onLogin(true);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-2">Admin Panel</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Restricted Access</p>
        
        <input
          type="email"
          placeholder="Admin Email"
          className="w-full p-3 border rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded-lg pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        {error && (
          <p className="text-red-500 mb-4 text-sm text-center">{error}</p>
        )}
        
        <button 
          type="submit" 
          className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
        >
          Login to Admin Panel
        </button>
        
        <p className="text-center text-xs text-gray-400 mt-4">
          ⚠️ Authorized Personnel Only
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const Signup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(form.name)) {
      newErrors.name = "Name should contain only letters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATE FIRST
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      // ✅ INCLUDE ROLE
      const userData = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      };

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message });
        return;
      }

      // ✅ SAVE TO LOCALSTORAGE
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccessMessage(`✅ Signup successful! Redirecting to ${data.user.role} dashboard...`);

      // ✅ REDIRECT BASED ON ROLE
      setTimeout(() => {
        if (data.user.role === "owner") {
          navigate("/owner");  // Goes to Owner Dashboard
        } else {
          navigate("/profile"); // Goes to User Profile
        }
      }, 1500);

    } catch (error) {
      console.error(error);
      setErrors({ general: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#f5f5f5" }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 border border-pink-100">

        <h2 className="text-2xl font-bold text-center text-pink-500 mb-4">
          Create Account
        </h2>

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-3 text-sm text-center">
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <div className="flex items-center border border-gray-200 focus-within:border-pink-400 rounded-lg px-3 py-2">
              <User size={18} className="text-pink-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full outline-none ml-2"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          <div>
            <div className="flex items-center border border-gray-200 focus-within:border-pink-400 rounded-lg px-3 py-2">
              <Mail size={18} className="text-pink-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full outline-none ml-2"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          <div>
            <div className="flex items-center border border-gray-200 focus-within:border-pink-400 rounded-lg px-3 py-2">
              <Lock size={18} className="text-pink-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full outline-none ml-2"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          <div>
            <div className="flex items-center border border-gray-200 focus-within:border-pink-400 rounded-lg px-3 py-2">
              <Lock size={18} className="text-pink-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full outline-none ml-2"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Register as:
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-400"
            >
              <option value="user">👤 Regular User (Shop & Save)</option>
              <option value="owner">👑 Owner (Add & Manage Products)</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {form.role === "owner" 
                ? "Owners can add, edit, and delete products" 
                : "Users can browse, save, and purchase products"}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-pink-500 hover:underline"
            >
              Login
            </button>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Signup;
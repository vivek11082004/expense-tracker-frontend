import React, { useState } from 'react';
import { profileStyles, signupStyles } from '../assets/dummyStyles.js';
import axios from 'axios';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = ({ API_URL = "https://expense-tracker-backend-m0xl.onrender.com", onSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchProfile = async (token) => {
    if (!token) return null;
    const res = await axios.get(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  };

  const persistAuth = (profile, token) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    try {
      if (token) storage.setItem("token", token);
      if (profile) storage.setItem("user", JSON.stringify(profile));
    } catch (err) {
      console.error("Storage error:", err);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";
    if (!password) newErrors.password = "Password required";
    else if (password.length < 6) newErrors.password = "Min 6 chars";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await axios.post(`${API_URL}/api/user/register`, {
        name,
        email,
        password
      });

      const data = res.data || {};
      const token = data.token || null;
      let profile = data.user || null;

      if (!profile && token) {
        profile = await fetchProfile(token);
      }

      if (!profile) profile = { name, email };

      persistAuth(profile, token);

      if (typeof onSignup === "function") {
        onSignup(profile, rememberMe, token);
      }

      navigate('/');
      setPassword('');

    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Signup failed";
      setErrors({ api: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50 py-8 px-2">
      <div className="w-full max-w-md rounded-2xl shadow-lg bg-white">
        <div className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-t-2xl px-8 pt-8 pb-6 flex flex-col items-center relative">
          <button className="absolute left-6 top-6 text-white" onClick={() => navigate(-1)}>
            <ArrowLeft size={28} />
          </button>
          <div className="w-20 h-20 rounded-full bg-teal-300 flex items-center justify-center mb-2 mt-2">
            <User size={44} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mt-2">Create Account</h1>
          <p className="text-white/90 mt-1 mb-2 text-center">Join ExpenseTracker to manage your finances</p>
        </div>
        <div className="px-8 py-8">
          {errors.api && <p className="text-red-600 text-sm mb-2">{errors.api}</p>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><User size={20} /></span>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-300 focus:border-teal-500 bg-gray-50 text-gray-800"
                />
              </div>
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={20} /></span>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-300 focus:border-teal-500 bg-gray-50 text-gray-800"
                />
              </div>
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={20} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-300 focus:border-teal-500 bg-gray-50 text-gray-800"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 accent-teal-500"
                id="rememberMe"
              />
              <label htmlFor="rememberMe" className="text-gray-700 text-sm">Remember Me</label>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-3 rounded-xl shadow-md hover:from-teal-600 hover:to-cyan-600 transition-all text-lg mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <div className={signupStyles.signInContainer}>
            <p className={signupStyles.signInText}>
              Already have an account?{' '}
              <Link to="/login" className={signupStyles.signInLink} className="text-teal-500 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;







































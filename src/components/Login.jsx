import {React,useState} from 'react'
// import { loginStyles } from '../assets/dummyStyles.js'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'



const Login = ({ onLogin, API_URL = "http://localhost:5000"}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // To fetch profile
  const fetchProfile = async (token) => {
    if(!token) return null;
    const res = await axios.get(`${API_URL}/api/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
   return res.data;
  };

  const persistAuth = (profile, token) => {
    const Storage = rememberMe ? localStorage : sessionStorage;
    try {
      if(token) Storage.setItem("token", token);
      if(profile) Storage.setItem("user", JSON.stringify(profile));
      // onLogin(profile, rememberMe, token);
    } catch (error) {
      console.error("Error persisting authentication:", error);

    }
  };

  // To login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      // Debug log for credentials
      console.log("Login attempt:", { email, password });

      const res = await axios.post(
        `${API_URL}/api/user/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const data = res.data || {};
      const token = data.token || null;

      // to derive user profile
      let profile = data.user ?? null;
      if (!profile) {
        const copy = { ...data };
        delete copy.token;
        delete copy.user;
        if (Object.keys(copy).length) {
          profile = copy;
        }
      }

      if (!profile && token) {
        try {
          profile = await fetchProfile(token);
        } catch (fetcherr) {
          console.warn("could not fetch profile with token:", fetcherr);
          profile = { email };
        }
      }

      if (!profile) profile = { email };
      persistAuth(profile, token);

      if (typeof onLogin === "function") {
        try {
          onLogin(profile, rememberMe, token);
          navigate("/");
        } catch (callErr) {
          console.warn("Error occurred while calling onLogin:", callErr);
          navigate("/");
        }
      } else {
        navigate("/");
      }

      setPassword("");
    } catch (err) {
      // Improved error logging
      console.error("Login error:", err?.response || err);
      if (err.response) {
        console.error("Backend error data:", err.response.data);
      }
      const serverMsg =
        err.response?.data?.message ||
        (err.response?.data ? JSON.stringify(err.response.data) : null) ||
        err.message ||
        "Login failed";
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50 py-8 px-2 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl shadow-lg bg-white">
        <div className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-t-2xl px-8 pt-8 pb-6 flex flex-col items-center relative">
          <div className="w-20 h-20 rounded-full bg-teal-300 flex items-center justify-center mb-2 mt-2">
            <User size={44} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mt-2">Welcome Back</h1>
          <p className="text-white/90 mt-1 mb-2 text-center">Sign in to your ExpenseTracker account</p>
        </div>
        <div className="px-8 py-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 mb-4 animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={20} /></span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-300 focus:border-teal-500 bg-gray-50 text-gray-800"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={20} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-300 focus:border-teal-500 bg-gray-50 text-gray-800"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 accent-teal-500"
              />
              <label htmlFor="rememberMe" className="text-gray-700 text-sm">Remember Me</label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-3 rounded-xl shadow-md hover:from-teal-600 hover:to-cyan-600 transition-all text-lg mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : null}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="mt-8 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/signup" className="text-teal-600 font-medium hover:underline">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

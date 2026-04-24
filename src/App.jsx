import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Income from './pages/income.jsx';
import Expense from './pages/Expense.jsx';
import Profile from './pages/Profile.jsx';
import ContactUs from './components/ContactUs.jsx';
import axios from 'axios';

const API_URL = "https://expense-tracker-backend-m0xl.onrender.com";

// To get trnsaction from localStorage
const getTransactionsFromStorage = () => {
  const saved = localStorage.getItem("transactions");
  return saved ? JSON.parse(saved) : [];
};

// To protect the routes
const ProtectedRoute = ({ user, children }) => {
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");
  const hasToken = localToken || sessionToken;
  if (!user || !hasToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// To scroll to top when page gets reload or new page is visited
const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);
  return null;
}

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // To save inside Token
  const persistAuth = (userObj, tokenStr, remember = false) => {
    try {
      if (remember) {
        if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) localStorage.setItem("token", tokenStr);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      } else {
        if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) sessionStorage.setItem("token", tokenStr);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      setUser(userObj || null);
      setToken(tokenStr || null);
    } catch (err) {
      console.error("persistAuth error:", err);
    }
  };

  const clearAuth = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    } catch (error) {
      console.error('Error clearing authentication data:', error);
    }
    setUser(null);
    setToken(null);
  };

  // to update user data both in state and storage
  const updateUserData = (updatedUser) => {
    setUser(updatedUser);

    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("token");


    if (localToken) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else if (sessionToken) {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // Try to load user with token when mounted
  useEffect(() => {
    (async () => {
      try {
        const loaclUserRaw = localStorage.getItem("user");
        const sessionUserRaw = sessionStorage.getItem("user");
        const localToken = localStorage.getItem("token");
        const sessionToken = sessionStorage.getItem("token");

        const storedUser = loaclUserRaw ? JSON.parse(loaclUserRaw) : (sessionUserRaw ? JSON.parse(sessionUserRaw) : null);
        const storedToken = localToken || sessionToken || null;

        if (storedUser) {
          setUser(storedUser);
          setToken(storedToken);
          setIsLoading(false);
          return;
        }
        if (storedToken) {
          try {
            const res = await axios.get(`${API_URL}/user/me`, { Headers: { Authorization: `Bearer ${storedToken}` } });
            const profile = res.data;
            persistAuth(profile, storedToken, !!localToken);
          } catch (fetcherr) {
            console.warn("could not fetch user profile:", fetcherr);
            clearAuth();
          }
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setIsLoading(false);
        try {
          setTransactions(getTransactionsFromStorage());
        } catch (txErr) {
          console.error("Error loading transactions from storage:", txErr);
        }
      }

    })();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    } catch (err) {
      console.error("Error saving transactions to storage:", err);
    }
  }, [transactions]);

  const handleLogin = (userData, remember = false, tokenFromApi = null) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate('/');
  }

  const handleSignup = (userData, remember = false, tokenFromApi = null) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate('/');
  }


  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  }


  // transaction helpers
  const addTransaction = (newTransaction) =>
    setTransactions((p) => [newTransaction, ...p]);
  const editTransaction = (id, updatedTransaction) =>
    setTransactions((p) =>
      p.map((t) => (t.id === id ? { ...updatedTransaction, id } : t)),
    );
  const deleteTransaction = (id) =>
    setTransactions((p) => p.filter((t) => t.id !== id));
  const refreshTransactions = () =>
    setTransactions(getTransactionsFromStorage());


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      < ScrollToTop />

      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/Signup" element={<Signup onSignup={handleSignup} />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={handleLogout} transactions={transactions} addTransaction={addTransaction} editTransaction={editTransaction} deleteTransaction={deleteTransaction} refreshTransactions={refreshTransactions} />
          </ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} transactions={transactions} addTransaction={addTransaction} editTransaction={editTransaction} deleteTransaction={deleteTransaction} refreshTransactions={refreshTransactions} />

          <Route path="/income" element={<Income transactions={transactions} addTransaction={addTransaction} editTransaction={editTransaction} deleteTransaction={deleteTransaction} refreshTransactions={refreshTransactions} />} />
          <Route path="/expense" element={<Expense transactions={transactions} addTransaction={addTransaction} editTransaction={editTransaction} deleteTransaction={deleteTransaction} refreshTransactions={refreshTransactions} />} />

          <Route path="/profile" element={<Profile user={user} onUpdatedProfile={updateUserData} onLogout={handleLogout} />} />
        </Route>
        <Route path='*' element={<Navigate to={user ? "/": "/login"} replace />}/>
      </Routes>
    </>
  );
};

export default App;
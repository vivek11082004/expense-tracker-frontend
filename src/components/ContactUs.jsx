import React, { useState } from 'react';
import { Mail, User, MessageSquare } from 'lucide-react';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Message sent successfully!');
        setForm({ name: '', email: '', message: '' });
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 py-8 px-2">
      <div className="w-full max-w-lg rounded-2xl shadow-2xl bg-white">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-t-2xl px-8 pt-8 pb-6 flex flex-col items-center relative">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-2 mt-2 shadow-lg">
            <Mail size={36} className="text-teal-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mt-2 tracking-wide">Contact Us</h2>
          <p className="text-white/90 mt-1 mb-2 text-center text-sm">We'd love to hear from you! Fill out the form below and we'll get back to you soon.</p>
        </div>
        <div className="px-8 py-8">
          {success && <div className="mb-4 text-green-600 text-center font-medium animate-fade-in">{success}</div>}
          {error && <div className="mb-4 text-red-600 text-center font-medium animate-shake">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-300 focus:border-teal-500 bg-gray-50 text-gray-800 peer"
                required
                placeholder=" "
                autoComplete="off"
              />
              <label className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 bg-gray-50 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-3 peer-focus:text-xs peer-focus:text-teal-600 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-teal-600">
                Name
              </label>
            </div>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-300 focus:border-teal-500 bg-gray-50 text-gray-800 peer"
                required
                placeholder=" "
                autoComplete="off"
              />
              <label className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 bg-gray-50 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-3 peer-focus:text-xs peer-focus:text-teal-600 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-teal-600">
                Email
              </label>
            </div>
            <div className="relative">
              <MessageSquare size={20} className="absolute left-3 top-4 text-gray-400" />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-300 focus:border-teal-500 bg-gray-50 text-gray-800 min-h-[100px] peer resize-none"
                required
                placeholder=" "
                autoComplete="off"
              />
              <label className="absolute left-10 top-4 text-gray-500 bg-gray-50 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-3 peer-focus:text-xs peer-focus:text-teal-600 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-teal-600">
                Message
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-3 rounded-xl shadow-md hover:from-teal-600 hover:to-cyan-600 transition-all text-lg mt-2 focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

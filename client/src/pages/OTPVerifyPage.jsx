import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';


function OTPVerifyPage() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [resendMsg, setResendMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Extract email on mount
  useEffect(() => {
    const queryEmail = new URLSearchParams(location.search).get('email');
    if (queryEmail) {
      setEmail(queryEmail);
    } else {
      alert('Email not found in URL');
      navigate('/');
    }
  }, [location.search, navigate]);

  // ✅ Auto-submit if OTP is 6 digits
  useEffect(() => {
    if (otp.length === 6) {
      handleSubmit();
    }
  }, [otp]); // runs every time `otp` changes

  // ✅ Cooldown timer for resend
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async () => {
    try {
      await axios.post('/auth/verify-otp', { email, otp });
      navigate('/profile');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Invalid or expired OTP');
    }
  };

  const handleResend = async () => {
    try {
      await axios.post('/auth/resend-otp', { email });
      setResendMsg('OTP sent successfully');
      setCooldown(30); // 30 second cooldown
      setTimeout(() => setResendMsg(''), 3000);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Unexpected error';
      console.error('🔴 Resend OTP Error:', message);
      toast.error(`❌ ${message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          Enter OTP sent to your mail
          <span className="block mt-1 text-sm text-blue-400 font-medium break-words">
            {email}
          </span>
        </h2>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="Enter OTP"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg mb-4"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Verify
        </button>

        <div className="mt-4 text-sm text-gray-600">
          Didn’t get the OTP?
          <button
            className={`ml-1 font-semibold ${cooldown === 0 ? 'text-blue-600 hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
            onClick={handleResend}
            disabled={cooldown !== 0}
          >
            Resend {cooldown > 0 && `(${cooldown}s)`}
          </button>
        </div>

        {resendMsg && (
          <p className="mt-2 text-green-500 text-sm font-medium">{resendMsg}</p>
        )}
      </div>
    </div>
  );
}

export default OTPVerifyPage;

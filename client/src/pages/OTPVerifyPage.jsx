import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserInfo } from '../context/UserInfoContext';

function OTPVerifyPage() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [resendMsg, setResendMsg] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('verify'); // 'verify', 'choose', 'nic-post'
  const [Nic, setNic] = useState('');
  const [choosePost, setChoosePost] = useState('');
  const [previousDate, setPreviousDate] = useState('');
  const [availablePosts, setAvailablePosts] = useState({}); // Posts grouped by date
  const [dates, setDates] = useState([]); // Advertisement dates

  const { setPrefillUser } = useUserInfo();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from query params
  useEffect(() => {
    const queryEmail = new URLSearchParams(location.search).get('email');
    if (queryEmail) {
      setEmail(queryEmail);
    } else {
      toast.error('Email not found. Redirecting...');
      navigate('/');
    }
  }, [location.search, navigate]);

  // Handle OTP submission
  const handleSubmit = async () => {
    try {
      const res = await axios.post('/auth/verify-otp', { email, otp });
      if (res.data.askAction) {
        setStep('choose');
      } else {
        navigate(res.data.redirectTo || '/');
      }
    } catch (err) {
      toast.error('Invalid or expired OTP');
    }
  };

  // Handle the "new" or "continue" action choice
  const handleActionChoice = (choice) => {
    if (choice === 'new') {
      handleReturningUser({ action: 'new' });
    } else {
      setStep('nic-post');
    }
  };

  // Fetch available advertisement dates and posts
  useEffect(() => {
    if (step === 'nic-post') {
      const fetchPosts = async () => {
        try {
          const res = await axios.get('/admin/get-posts');
          const fetchedPosts = res.data.addPosts || [];
          setDates(fetchedPosts.map(post => post.createddate)); // Dates
          setAvailablePosts(fetchedPosts.reduce((acc, post) => {
            acc[post.createddate] = post.createdposts; // Group posts by date
            return acc;
          }, {}));
        } catch (err) {
          toast.error('Error fetching posts');
        }
      };

      fetchPosts();
    }
  }, [step]);

  // Handle continuing with an existing application
  const handleContinueExisting = () => {
    if (!Nic || !choosePost || !previousDate) {
      toast.error('Please fill both NIC, Selected Post, and Advertisement Date');
      return;
    }

    // Include the email, selected post, and previous date in the request
    handleReturningUser({
      action: 'continue',
      Nic: Nic.trim().toLowerCase(),
      choosePost,
      previousDate,
      email, // Include the email here to continue with the existing application
    });
  };

  // Handle returning user (both new and continue)
  const handleReturningUser = async (data) => {
    try {
      const res = await axios.post('/auth/handle-returning-user', {
        ...data
      });

      // Prefill data if it's a new application
      if (data.action === 'new' && res.data.prefillUser) {
        setPrefillUser(res.data.prefillUser);
      }

      // Navigate to the next page (or continue with their existing application)
      if (data.action === 'continue' && res.data.user) {
        setPrefillUser(res.data.user); // Set the user info (can be used to prefill form data)
      }

      // Redirect user to the appropriate form
      navigate(res.data.redirectTo);
    } catch (err) {
      const message = err.response?.data?.message || 'Error processing decision';
      setError(message);
      toast.error(message);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      await axios.post('/auth/resend-otp', { email });
      setResendMsg('OTP resent successfully');
      setCooldown(30);
      setTimeout(() => setResendMsg(''), 3000);
    } catch (err) {
      toast.error('Error resending OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">

        {/* Step 1: OTP Verification */}
        {step === 'verify' && (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
              Enter OTP sent to your mail
              <span className="block mt-1 text-sm text-blue-400 font-medium break-words">{email}</span>
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
          </>
        )}

        {/* Step 2: Choose Action */}
        {step === 'choose' && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Are you applying for a new post or continuing a previous one?
            </h2>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleActionChoice('new')}
                className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                Apply for a New Post
              </button>

              <button
                onClick={() => handleActionChoice('continue')}
                className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
              >
                Continue Previous Application
              </button>
            </div>
          </>
        )}

        {/* Step 3: Provide NIC and Selected Post */}
        {step === 'nic-post' && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Enter details of your existing application
            </h2>

            <input
              type="text"
              value={Nic}
              onChange={(e) => setNic(e.target.value)}
              placeholder="NIC"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />

            <select
              value={previousDate}
              onChange={(e) => setPreviousDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            >
              <option value="">Select Advertisement Date</option>
              {dates.map((date) => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>

            {previousDate && (
              <select
                value={choosePost}
                onChange={(e) => setChoosePost(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              >
                <option value="">Select Post</option>
                {availablePosts[previousDate]?.map((post, index) => (
                  <option key={index} value={post}>{post}</option>
                ))}
              </select>
            )}

            <button
              onClick={handleContinueExisting}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Continue
            </button>

            {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default OTPVerifyPage;

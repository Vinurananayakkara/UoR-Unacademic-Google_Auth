import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-xl shadow-md p-8 max-w-sm w-full text-center border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Login with Google</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
        >
          <FcGoogle className="w-5 h-5 bg-white rounded-full p-[1px]" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default App;

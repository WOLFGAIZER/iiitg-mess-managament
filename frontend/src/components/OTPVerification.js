import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../services/api';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, contact } = location.state || {};

  useEffect(() => {
    if (!userId || !contact) {
      navigate('/signup');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [userId, contact, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOTP({ userId, otp });
      alert('Phone number verified successfully!');
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      await resendOTP({ contact });
      setTimer(60);
      alert('OTP resent successfully');
    } catch (error) {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Phone Number
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP sent to {contact}
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify OTP
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`text-indigo-600 hover:text-indigo-500 ${
              timer > 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 
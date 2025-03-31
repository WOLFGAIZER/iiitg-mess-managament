import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '']); // Changed to 4 digits
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30); // 30 seconds cooldown
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const refs = [useRef(), useRef(), useRef(), useRef()];
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, maskedPhone } = location.state || {};

  // Add validation state
  const [isValid, setIsValid] = useState(false);

  // Validate OTP format
  const validateOTP = (otpArray) => {
    return otpArray.every(digit => /^[0-9]$/.test(digit));
  };

  // Handle paste functionality
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setIsValid(validateOTP(newOtp));
      refs[3].current?.focus();
    }
  };

  // Improved input change handler
  const handleChange = (index, value) => {
    if (value.match(/^[0-9]?$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setIsValid(validateOTP(newOtp));

      if (value && index < 3) {
        refs[index + 1].current?.focus();
      }
    }
  };

  // Handle key navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        refs[index - 1].current?.focus();
        setIsValid(false);
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        setIsValid(false);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      refs[index + 1].current?.focus();
    }
  };

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear any pending timers
      if (resendTimer > 0) {
        clearInterval(resendTimer);
      }
    };
  }, []);

  // Prevent direct URL access
  useEffect(() => {
    const state = location.state;
    if (!state?.userId || !state?.maskedPhone) {
      navigate('/signin', { 
        replace: true,
        state: { error: 'Invalid access. Please sign in first.' }
      });
    }
  }, [location.state, navigate]);

  // Timer for resend button
  useEffect(() => {
    if (!userId || !maskedPhone) {
      navigate('/signin');
      return;
    }

    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer, userId, maskedPhone, navigate]);

  const handleResendOTP = async () => {
    if (isResendDisabled) return;

    try {
      setIsResendDisabled(true);
      setResendTimer(30); // Reset timer
      setError('');

      const response = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Failed to resend OTP');
      } else {
        // Clear existing OTP fields
        setOtp(['', '', '', '']);
        refs[0].current.focus();
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  // Handle OTP verification
  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          otp: otpString
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate('/dashboard');
      } else {
        setError('Invalid OTP. Try again.');
        // Clear OTP fields on error
        setOtp(['', '', '', '']);
        refs[0].current.focus();
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enter Verification Code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a code to {maskedPhone}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
            {error}
          </div>
        )}

        <div className="mt-8">
          <div className="flex justify-center space-x-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={refs[index]}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isLoading}
                className={`w-16 h-16 text-center text-2xl border-2 rounded-lg 
                  ${error ? 'border-red-300' : 'border-gray-300'}
                  focus:border-indigo-500 focus:ring-indigo-500
                  disabled:bg-gray-100 disabled:cursor-not-allowed`}
                style={{ aspectRatio: '1' }}
              />
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={handleVerify}
              disabled={!isValid || isLoading || otp.some(digit => !digit)}
              className={`w-full flex justify-center py-3 px-4 border border-transparent 
                rounded-md shadow-sm text-sm font-medium text-white
                ${(!isValid || isLoading || otp.some(digit => !digit))
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
                } transition-colors duration-200`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify Code'
              )}
            </button>
          </div>

          <div className="mt-4 text-center space-y-2">
            <button
              onClick={handleResendOTP}
              disabled={isResendDisabled}
              className={`text-sm ${
                isResendDisabled 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-indigo-600 hover:text-indigo-500'
              }`}
            >
              {isResendDisabled 
                ? `Resend code in ${resendTimer}s` 
                : 'Resend code'}
            </button>

            <div>
              <button
                type="button"
                onClick={() => navigate('/signin')}
                className="text-sm text-gray-500 hover:text-gray-400"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;


import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OTPVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const timerRef = useRef(null);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (!location.state?.userId || !location.state?.maskedPhone) {
      navigate('/signin');
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (resendTimer > 0) {
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resendTimer, location.state, navigate]);

  const handleResendOTP = async () => {
    if (isResendDisabled) return;

    try {
      setIsResendDisabled(true);
      setError('');

      const response = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: location.state?.userId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResendTimer(30);
        setOtp(['', '', '', '']);
        refs[0].current?.focus();
      } else {
        throw new Error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError(error.message || 'Failed to resend OTP. Please try again.');
      setIsResendDisabled(false);
    }
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default OTPVerificationPage; 
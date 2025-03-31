import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/solid';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentId, amount } = location.state || {};

  if (!paymentId) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-2xl font-medium text-gray-900">
              Payment Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your payment of ₹{amount?.toFixed(2)} has been processed successfully.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Payment ID: {paymentId}
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 
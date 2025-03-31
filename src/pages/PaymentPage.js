import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paymentDetails = location.state || {};

  useEffect(() => {
    if (!location.state) {
      navigate('/dashboard');
    }
  }, [location.state, navigate]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create order
      const { data } = await axios.post('/api/payment/create-order', {
        amount: paymentDetails.amount,
        notes: {
          type: paymentDetails.type,
          description: paymentDetails.description
        }
      });

      if (!data.success) {
        throw new Error(data.message);
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: 'INR',
        name: 'College Mess',
        description: paymentDetails.description,
        order_id: data.order.id,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone
        },
        handler: async function(response) {
          try {
            const verifyResponse = await axios.post('/api/payment/verify-payment', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              navigate('/payment-success', {
                state: {
                  amount: paymentDetails.amount,
                  transactionId: response.razorpay_payment_id
                }
              });
            } else {
              setError('Payment verification failed');
            }
          } catch (error) {
            setError('Payment verification failed');
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        theme: {
          color: '#4F46E5'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      setError(error.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Mess Bill Payment</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount</span>
                <span className="text-xl font-semibold">₹{paymentDetails.amount}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{paymentDetails.description}</p>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 
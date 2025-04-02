import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Token = () => {
  const { api } = useAuth();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleBuyToken = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/payment/create-order", {
        amount,
        notes: { purpose: "Token Purchase" },
      });
      const { order, key } = res.data;
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        handler: async (response) => {
          const verifyRes = await api.post("/payment/verify-payment", {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          if (verifyRes.data.success) {
            const tokenRes = await api.post("/tokens/", {
              mealType: "lunch",
              date: new Date(),
            });
            setMessage(tokenRes.data.message);
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error buying token");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Tokens</h1>
      <form onSubmit={handleBuyToken} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label>Amount (INR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-red-500 text-white p-2 rounded">Buy Token</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Token;
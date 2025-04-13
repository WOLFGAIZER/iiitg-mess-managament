import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TokensPage = () => {
  const navigate = useNavigate();
  const [billAmount, setBillAmount] = useState(0);
  const [tokenData, setTokenData] = useState([]);
  const [month, setMonth] = useState("JULY");

  useEffect(() => {
    // Fetch token data and bill from backend
    const fetchTokens = async () => {
      try {
        const response = await axios.get("/api/tokens?month=" + month);
        setTokenData(response.data.tokens);
        setBillAmount(response.data.totalBill);
      } catch (err) {
        console.error("Failed to fetch token data:", err);
      }
    };

    fetchTokens();
  }, [month]);

  const handleBuyClick = async () => {
    try {
      const res = await axios.post("/api/razorpay/create-order", { amount: billAmount });
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: "INR",
        name: "IIITG Mess",
        description: "Mess Bill Payment",
        order_id: res.data.orderId,
        handler: function (response) {
          alert("Payment successful: " + response.razorpay_payment_id);
        },
        prefill: {
          name: "Student",
          email: "student@iiitg.ac.in",
          contact: "9999999999"
        },
        theme: {
          color: "#f56565"
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  const handleSettingsClick = () => {
    navigate("/view-profile");
  };

  return (
    <div className="p-4 text-center bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center">
          <button className="text-red-400 text-3xl font-bold mr-2">←</button>
          <span className="text-red-400 text-2xl font-bold">TOKENS</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-red-400">🔔</button>
          <button className="text-red-400" onClick={handleSettingsClick}>⚙️</button>
          <button className="text-red-400 text-lg font-bold">☰</button>
        </div>
      </div>

      {/* Bill Info */}
      <div className="mt-6 flex justify-center items-center gap-4">
        <div className="bg-red-100 px-4 py-2 rounded-full font-bold">{month}</div>
        <div className="bg-red-100 px-4 py-2 rounded-full font-bold">₹{billAmount}/-</div>
        <div className="bg-red-100 px-4 py-2 rounded-full font-bold">History</div>
      </div>

      {/* Token Table */}
      <div className="overflow-x-auto mt-6">
  <table className="min-w-full border text-center">
    <thead>
      <tr className="bg-gray-100">
        <th className="border px-4 py-2 font-bold">DAY</th>
        <th className="border px-4 py-2 font-bold">Breakfast</th>
        <th className="border px-4 py-2 font-bold">Lunch</th>
        <th className="border px-4 py-2 font-bold">Dinner</th>
        <th className="border px-4 py-2 font-bold">PRICE</th>
      </tr>
    </thead>
    <tbody>
      {tokenData.length > 0 ? (
        tokenData.map((token, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">
              {token.date
                ? new Date(token.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })
                : `Day ${index + 1}`}
            </td>
            <td className="border px-4 py-2">{token.breakfast ? "✅" : "❌"}</td>
            <td className="border px-4 py-2">{token.lunch ? "✅" : "❌"}</td>
            <td className="border px-4 py-2">{token.dinner ? "✅" : "❌"}</td>
            <td className="border px-4 py-2">₹{token.price || 0}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="border px-4 py-4 text-gray-400">
            No data available
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      {/* Buy Button */}
      <div className="mt-6">
        <button
          onClick={handleBuyClick}
          className="bg-red-200 hover:bg-red-300 text-black font-bold py-2 px-10 rounded-xl text-xl"
        >
          BUY
        </button>
      </div>

      {/* Payment Options */}
      <div className="flex justify-center gap-4 mt-10 flex-wrap">
        <a href="upi://pay?pa=yourupiid@upi&pn=YourName" target="_blank" rel="noopener noreferrer">
          <img src="/images/bhim.png" alt="BHIM" className="h-10 hover:scale-110 transition" />
        </a>
        <a href="https://www.phonepe.com/" target="_blank" rel="noopener noreferrer">
          <img src="/images/phonepe.png" alt="PhonePe" className="h-10 hover:scale-110 transition" />
        </a>
        <a href="https://paytm.com/" target="_blank" rel="noopener noreferrer">
          <img src="/images/paytm.png" alt="Paytm" className="h-10 hover:scale-110 transition" />
        </a>
        <a href="https://gpay.app.goo.gl/" target="_blank" rel="noopener noreferrer">
          <img src="/images/gpay.png" alt="Google Pay" className="h-10 hover:scale-110 transition" />
        </a>
      </div>
    </div>
  );
};

export default TokensPage;

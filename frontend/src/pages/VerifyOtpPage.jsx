import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpGenerated, setOtpGenerated] = useState(location.state?.otpGenerated || "");
  const [otpExpiresAt, setOtpExpiresAt] = useState(location.state?.otpExpiresAt || Date.now() + 15 * 60 * 1000);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (Date.now() > otpExpiresAt) {
      setMessage("❌ OTP expired. Please request a new one.");
      return;
    }

    if (fullOtp === otpGenerated) {
      setMessage("✅ OTP Verified!");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setMessage("❌ Invalid OTP.");
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiry = Date.now() + 15 * 60 * 1000;

    try {
      await emailjs.send(
        "service_s25m4aj",     // Replace with actual service ID
        "template_k53p01a",    // Replace with actual template ID
        {
          to_email: email,
          otp: newOtp,
        },
        "gOaI7YEzkhqWclO8M"      // Replace with actual public key
      );

      setOtpGenerated(newOtp);
      setOtpExpiresAt(newExpiry);
      setOtp(["", "", "", "", "", ""]);
      setMessage("✅ A new OTP has been sent to your email.");
    } catch (error) {
      console.error("EmailJS error:", error);
      setMessage("❌ Failed to resend OTP. Try again later.");
    }

    setLoading(false);
  };

//     <div className="min-h-screen bg-black text-white hero-bg">
//       {/* Header with logo */}
//       <header className="max-w-6xl mx-auto p-4">
//         <Link to="/">
//           <img src="/netflix-logo.png" alt="logo" className="w-48 md:w-56" />
//         </Link>
//       </header>

//       {/* Form centered */}
//       <div className="flex justify-center items-center px-4">
//         <form
//           onSubmit={handleVerifyOtp}
//           className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-xl shadow-xl text-white space-y-5"
//         >
//           <h2 className="text-2xl font-bold text-center">Enter the code we just sent</h2>
//           <p className="text-sm text-center text-gray-300">
//             We sent a sign-in code to <span className="text-white font-semibold">{email}</span>.<br />
//             The code will expire in 15 minutes.
//           </p>

//           <label className="block text-gray-300 text-sm font-medium text-center">Enter a PIN code</label>
//           <div className="flex justify-center space-x-2">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 id={`otp-${index}`}
//                 type="text"
//                 maxLength="1"
//                 className="w-12 h-12 text-xl text-center text-black rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                 value={digit}
//                 onChange={(e) => handleChange(e.target.value, index)}
//               />
//             ))}
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 bg-green-600 hover:bg-green-700 font-semibold rounded-md"
//           >
//             Verify
//           </button>

//           {message && <p className="text-center text-sm">{message}</p>}

//           <div className="flex justify-between text-sm mt-4 text-gray-400">
//             <button
//               type="button"
//               onClick={() => navigate("/login")}
//               className="hover:underline text-blue-400"
//             >
//               Use password instead
//             </button>

//             <button
//               type="button"
//               onClick={handleResendCode}
//               className="hover:underline text-blue-400"
//               disabled={loading}
//             >
//               {loading ? "Resending..." : "Resend code"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white hero-bg flex flex-col">
      {/* Header with logo */}
      <header className="w-full max-w-6xl mx-auto p-6">
        <Link to="/">
          <img src="/netflix-logo.png" alt="logo" className="w-40 md:w-48" />
        </Link>
      </header>
  
      {/* Form centered */}
      <div className="flex-grow flex justify-center items-center px-4">
        <form
          onSubmit={handleVerifyOtp}
          className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-green-600 p-10 rounded-2xl shadow-2xl text-white space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-green-400">Verify Your Email</h2>
            <p className="text-sm text-gray-300">
              We’ve sent a 6-digit code to <span className="text-white font-semibold">{email}</span><br />
              Code expires in 15 minutes.
            </p>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-center mb-2 text-gray-300">
              Enter the OTP
            </label>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="w-12 h-14 text-xl text-center text-black rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                />
              ))}
            </div>
          </div>
  
          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 transition-all font-semibold rounded-lg shadow-md"
          >
            Verify OTP
          </button>
  
          {message && <p className="text-center text-sm mt-2">{message}</p>}
  
          <div className="flex justify-between text-sm mt-4 text-gray-400">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="hover:underline text-blue-400"
            >
              Use password instead
            </button>
  
            <button
              type="button"
              onClick={handleResendCode}
              className="hover:underline text-blue-400"
              disabled={loading}
            >
              {loading ? "Resending..." : "Resend code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  


};

export default VerifyOtpPage;






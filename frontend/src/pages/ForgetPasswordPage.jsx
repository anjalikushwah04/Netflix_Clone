import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from 'react-router-dom';


const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendReset = async (e) => {
    e.preventDefault();
    setLoading(true);


    


    try {
      // Call backend to generate token
      const res = await fetch("/api/v1/auth/forgetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message);
        setLoading(false);
        return;
      }
      const resetLink = `http://localhost:8000/resetpassword/${data.token}/${data.email}`;
      // Use EmailJS to send the reset link
      await emailjs.send(
        "service_s25m4aj",        // your EmailJS service ID
        "template_fq731qn",    // your EmailJS template ID
        {
          to_email: data.email,
          reset_link: resetLink,
        },
        "gOaI7YEzkhqWclO8M"        // your public API key
      );

      

      setMessage("✅ Reset link sent to your email.");
      navigate("/emailsent", { state: { email } });
    } catch (error) {
      console.error("Reset email error:", error);
      setMessage("❌ Failed to send reset email.");
    }

    setLoading(false);
  };

  return (
<div className="min-h-screen flex flex-col justify-center items-center bg-black text-white hero-bg">
  <form onSubmit={handleSendReset} className="bg-black/60 p-6 rounded space-y-4 w-full max-w-sm">
    <h2 className="text-2xl font-bold text-center">Update Password</h2>
    <p className="text-sm text-center text-gray-300">
      We will send you an email with instructions on how to reset your password.
    </p>
    <input
      type="email"
      className="w-full p-2 text-white rounded bg-gray-700 placeholder-gray-400"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <button
      type="submit"
      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
      disabled={loading}
    >
      {loading ? "Sending..." : "Email Me"}
    </button>
    {message && <p className="text-sm text-center">{message}</p>}
    <div className="text-sm text-center text-gray-400">
      Don’t have an account?{" "}
      <a href="/signup" className="text-green-400 hover:underline">Sign Up</a>
    </div>
  </form>
</div>


  );
};

export default ForgetPasswordPage;



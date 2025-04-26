/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { useAuthStore } from '../store/authUser';
import axios from 'axios';


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useOtp, setUseOtp] = useState(false);
  const [message, setMessage] = useState("");

  const [rememberMe, setRememberMe] = useState(false);


  const {login}=useAuthStore();
  const navigate = useNavigate();



  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email.");
      return;
    }

    const otpGenerated = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 15 * 60 * 1000;

    const templateParams = {
      user_name: email,
      otp: otpGenerated,
      to_email: email,
    };

    try {
      await emailjs.send(
        'service_s25m4aj',
        'template_k53p01a',
        templateParams,
        'gOaI7YEzkhqWclO8M'
      );
      setMessage("✅ OTP has been sent to your email.");
      navigate("/verifyotp", { state: { email, otpGenerated, otpExpiresAt } });
    } catch (error) {
      console.error('Failed to send OTP:', error);
      setMessage("❌ Failed to send OTP. Try again.");
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    login({email,password});

    if (rememberMe) {
      localStorage.setItem("rememberEmail", email);
      localStorage.setItem("rememberPassword", password);
    } else {
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("rememberPassword");
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });

      if (response.status === 200) {
        setMessage("✅ Login successful.");
        navigate("/home");
      }
    } catch (error) {
      // setMessage("❌ Invalid credentials.");
      console.log("❌ Invalid credentials.")
    }
  };

  return (
    <div className='h-screen w-full hero-bg'>
      <header className='max-w-6xl mx-auto flex items-center justify-between p-4'>
        <Link to={'/'}>
          <img src='/netflix-logo.png' alt='logo' className='w-52' />
        </Link>
      </header>
      <div className="flex justify-center items-center mt-0 mx-3">
        <div className="w-full max-w-md p-4 space-y-6 bg-black/60 rounded-lg shadow-md">
          <h1 className='text-center text-white text-2xl font-bold mb-4'>Sign In</h1>

          {useOtp ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className='text-sm font-medium text-gray-300 block'>Email</label>
                <input
                  type='email'
                  className='w-full px-3 py-2 mt-1 border-gray-600  bg-gray-200 text-black rounded-md '
                  placeholder='you@example.com'
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button className='w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700'>
                Send Sign-In Code
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className='text-sm font-medium text-gray-300 block'>Email</label>
                <input
                  type='email'
                  className='w-full px-3 py-2 mt-1 border-gray-600 rounded-md  bg-gray-200 text-black'
                  placeholder='you@example.com'
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className='text-sm font-medium text-gray-300 block'>Password</label>
                <input
                  type='password'
                  className='w-full px-3 py-2 mt-1 border-gray-600 rounded-md  bg-gray-200 text-black'
                  placeholder='********'
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center text-gray-300 space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>


              <button type="submit" className='w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700'>
                Sign In
              </button>
            </form>
          )}

          <div className='text-center text-white'>OR</div>
          <button
            onClick={() => setUseOtp(!useOtp)}
            className='w-full py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600'>
            {useOtp ? "Use password instead" : "Use a sign-in code"}
          </button>

          <div className='text-gray-400 text-center'>
            <Link to={"/forgetpassword"} className='text-white'>Forget password?</Link>
            <br /><br/>

            New to Netflix? <Link to={"/signup"} className='text-white'>Sign Up</Link>
          </div>

          <div className='text-white'>
            <h6>This page is protected by Google reCAPTCHA to ensure you're not a bot.</h6>
          </div>

          {message && <p className="text-center text-blue-400">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;



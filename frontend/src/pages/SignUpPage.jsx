import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authUser';


const SignUpPage = () => {
  const {searchParams}=new URL(document.location);
  const emailValue=searchParams.get("email");
  const [email,setEmail]=useState(emailValue || "");
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { signup }=useAuthStore();
  

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedUsername = localStorage.getItem("rememberUsername");
    const savedPassword = localStorage.getItem("rememberPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSignUp =(e)=>{
    e.preventDefault();
    signup({email,username,password});
    if (rememberMe) {
      localStorage.setItem("rememberEmail", email);
      localStorage.setItem("rememberUsername", username);
      localStorage.setItem("rememberPassword",password );
    } else {
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("rememberUsername");
      localStorage.setItem("rememberPassword");
    }
  }



  // const handlePasswordLogin = async (e) => {
  //   e.preventDefault();
  //   login({email,password});

  //   if (rememberMe) {
  //     localStorage.setItem("rememberEmail", email);
  //     localStorage.setItem("rememberPassword", password);
  //   } else {
  //     localStorage.removeItem("rememberEmail");
  //     localStorage.removeItem("rememberPassword");
  //   }

  //   try {
  //     const response = await axios.post('http://localhost:5000/api/login', {
  //       email,
  //       password
  //     });

  //     if (response.status === 200) {
  //       setMessage("✅ Login successful.");
  //       navigate("/home");
  //     }
  //   } catch (error) {
  //     // setMessage("❌ Invalid credentials.");
  //     console.log("❌ Invalid credentials.")
  //   }
  // };
  return (
    <div className='h-screen w-full hero-bg'>
      <header className='max-w-6xl mx-auto flex items-center justify-between p-4'>
        <Link to={'/'}>
        <img src='/netflix-logo.png' alt='logo' className='w-52 '/>
        </Link>
      </header>
      <div className="flex justify-center items-center mt-20 mx-3">
        <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
        <h1 className='text-center text-white text-2xl font-bold mb-4'> Sign Up </h1>
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label htmlFor='email' className='text-sm font-medium text-gray-300 block'>Email</label>
            <input type='email' className='w-full px-3 py-2 mt-1 border-gray-600 rounded-md bg-gray-200 text-black focus:outline-none focus-ring' placeholder='you@example.com' id='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div>
            <label htmlFor='username' className='text-sm font-medium text-gray-300 block'>Username</label>
            <input type='type' className='w-full px-3 py-2 mt-1 border-gray-600 rounded-md bg-gray-200 text-black focus:outline-none focus-ring' placeholder='Johndoe' id='username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
          </div>
          <div>
            <label htmlFor='password' className='text-sm font-medium text-gray-300 block'>Password</label>
            <input type='password' className='w-full px-3 py-2 mt-1 border-gray-600 rounded-md bg-gray-200 text-black focus:outline-none focus-ring' placeholder='********' id='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
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


          <button className='w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700'>Sign Up</button>
        </form>
        <div className="text-center text-gray-400">
          Already a member? {" "}
          <Link to={"/login"} className='text-white hover-underline'>
          Sign in
          </Link>
        </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
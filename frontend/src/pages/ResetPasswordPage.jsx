import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const { token,email } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setMessage("❌ Passwords do not match.");
        }

        try {
            setLoading(true);
            const response = await axios.post(`/api/v1/auth/resetpassword/${token}/${email}`, {
                password,
                confirmPassword,
                email  // 👉 Include email if needed
            });

            if (response.data.success) {
                setTimeout(() => navigate("/login"), 3000);
                setMessage("✅ Password updated successfully.");
                // setTimeout(() => navigate("/login"), 3000);
            } else {
                setMessage(response.data.message || "❌ Failed to reset password.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "❌ Failed to reset password.";
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 hero-bg">
            <form onSubmit={handleReset} className="bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-xl space-y-6">
                <h2 className="text-2xl font-bold text-center">Reset Your Password</h2>
                {message && <p className="text-center text-red-500">{message}</p>}
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full py-2 bg-green-600 hover:bg-green-700 font-semibold rounded"
                    disabled={loading}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
                {/* <Link to={"/signup"} className='text-red-500 hover-underline'>
                   Sign Up
                </Link> */}


            </form>
        </div>
    );
};

export default ResetPasswordPage;





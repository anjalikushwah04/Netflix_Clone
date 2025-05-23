/* eslint-disable no-unused-vars */
import axios from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    user: null,
    isSigningUp: false,
    isCheckingAuth: true,
    isLoggingIn: false,
    isLoggingOut: false,

    signup: async (credentials) => {
        set({ isSigningUp: true })
        try {
            const response = await axios.post("/api/v1/auth/signup", credentials);
            set({ user: response.data.user, isSigningUp: false });
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Signup Failed");
            set({ isSigningUp: false, user: null });
        }
    },
    login: async (credentials) => {
        set({ isLoggingIn: true });
        try {
            const response = await axios.post("/api/v1/auth/login", credentials);
            set({ user: response.data.user, isLoggingIn: false });
            toast.success("Login successfully");

        } catch (error) {
            toast.error(error.response.data.message || "Login Failed");
            set({ isLoggingIn: false, user: null });

        }
    },

    forgetpassword: async (credentials) => {
        set({ isForgetPassword: true });
        try {
            const response = await axios.post("/api/v1/auth/forgetpassword", credentials);
            set({ user: response.data.user, isForgetPassword: false });
            toast.success("Reset successfully");

        } catch (error) {
            toast.error(error.response.data.message || "Failed to Reset Password");
            set({ isForgetPassword: false, user: null });

        }
    },

    verifyOtp: async (credentials) => {
        set({ isVerifyOtp: true });
        try {
            const response = await axios.post("/api/v1/auth/verifyOtp", credentials);
            set({ user: response.data.user, isVerifyOtp: false });
            toast.success("Verified successfully");

        } catch (error) {
            toast.error(error.response.data.message || "Failed to verify");
            set({ isVerifyOtp: false, user: null });

        }
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axios.post("/api/v1/auth/logout");
            set({ user: null, isLoggingOut: false });
            toast.success("Logged out successfully")

        } catch (error) {
            set({ isLoggingOut: false });
            toast.error(error.response.data.message || "Logout failed")

        }
    },
    authCheck: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axios.get("/api/v1/auth/authCheck");
            set({ user: response.data.user, isCheckingAuth: false });
        }
        catch (error) {
            set({ isCheckingAuth: false, user: null });
            // toast.error(error.response.data.message || "An error occurred");     
        }
    },
}))
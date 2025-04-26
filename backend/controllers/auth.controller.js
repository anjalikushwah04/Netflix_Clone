import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import crypto from "crypto";

export async function signup(req, res) {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "All Field are required" });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|example)\.(com|net|in|org|co|info|biz)$/i;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" })
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters, contain one uppercase letter, one number, and one special character (!@#$%^&*).",
            });
        }


        const existingUserByEmail = await User.findOne({ email: email })
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
        const existingUserByUsername = await User.findOne({ username: username })
        if (existingUserByUsername) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const PROFILE_PICS = ['/avtar1.png', '/avtar2.png', '/avtar3.png'];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            image,
        });

        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();
        //remove password from the response 
        res.status(201).json({
            success: true,
            user: {
                ...newUser._doc,
                password: "",
            },
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Password is not correct" })
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: ""
            }
        })

    } catch (error) {
        console.log("Error in login Controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" })

    }
}

export async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // ✅ Mark user as verified
        user.isVerified = true;
        user.otp = null; // clear OTP after verification
        await user.save();

        // ✅ Send success response with redirection info
        res.status(200).json({
            success: true, message: "OTP Verified successfully",
            redirectTo: "/"
        });

    } catch (error) {
        console.log("Error in verifyOTP Controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const forgetpassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "❌ Email not found." });

        // Generate reset token
        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 1000 * 60 * 15; // 15 mins
        await user.save();

        // Return token and email to frontend
        return res.status(200).json({
            message: "✅ Token generated",
            email: user.email,
            token,
        });

    } catch (error) {
        console.error("Error in forgotPassword:", error);
        return res.status(500).json({ message: "❌ Server error" });
    }
};

export async function logout(req, res) {
    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function authCheck(req, res) {
    try {
        res.status(200).json({ success: true, user: req.user })

    } catch (error) {
        console.log("Error in authCheck controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" })

    }
}

export async function resetPassword(req, res) {
    const { token, email } = req.params;
    const { password, confirmPassword } = req.body;
    const rawToken = decodeURIComponent(token); // decode token

    if (!rawToken || !email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Email not found." });
        }
        user.resetPasswordToken = password;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
        console.log("User token:", user.password);

        if (!user.resetPasswordToken || user.resetPasswordExpires <= Date.now()) {
            return res.status(400).json({ success: false, message: "Token has expired. Please request a new reset link." });
        }

        if (user.resetPasswordToken === rawToken) {
            return res.status(400).json({ success: false, message: "Password already Exist.Enter New Password" });
        }


        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);
        console.log("user.password", user.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({ success: true, message: "Password updated successfully." });

    } catch (err) {
        console.error("Reset password error:", err);
        return res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
}


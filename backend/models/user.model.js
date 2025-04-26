import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:""
    },
    searchHistory:{
        type:Array,
        default:[]
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }

},{ timestamps: true });

export const User=mongoose.model('User',userSchema);
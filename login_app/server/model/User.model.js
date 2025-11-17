import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide unique Username"],
        unique: [true, "Username exists"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    email: {
        type: String,
        required: [true, "Please provide unique email"],
        unique: true
    },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: Number },
    address: { type: String },
    profile: { type: String },

    // ✅ OTP related fields
    otp: { type: String },                  // stores the generated OTP
    otpExpiresAt: { type: Number },         // timestamp when OTP expires
    resetSession: { type: Boolean, default: false } // flag to allow password reset
});

// ✅ Correct export syntax
export default mongoose.models.Users || mongoose.model('Users', UserSchema);

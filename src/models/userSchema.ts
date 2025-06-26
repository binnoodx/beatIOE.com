import mongoose, { Collection } from "mongoose"
const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: false,
        default: "user"
    },
    fullName: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false, // ✅ Now password is optional (for Google users)
        default: null,
    },
    profileImage: {
        type: String, // Cloudinary image URL
        default: "",  // Can also use a placeholder image
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    forgetPasswordToken: {
        type: Number,
    },
    forgetPasswordExpiry: {
        type: Date,
    },
    verifyToken: {
        type: Number,
    },
    verifyTokenExpiry: {
        type: Date,
    },
    seenQuestons: {
        type: [String],
        default: []
    },
    userPoints: {
        type: Number,
        default: 0
    },
    questionAttempt: {
        type: Number,
        default: 0
    },
    questionSolved: {
        type: Number,
        default: 0
    },

})

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
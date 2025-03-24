const { z } = require("zod");

// 🔹 Manual Login Schema (Mobile Number + Password)
const loginSchema = z.object({
    mobileNumber: z
        .string({ required_error: "Phone Number is required" })
        .trim()
        .length(10, { message: "Phone Number must be exactly 10 digits." })
        .regex(/^\d+$/, { message: "Phone Number must contain only numbers." }),
    
    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(8, { message: "Password must be at least 8 characters." })
        .max(1024, { message: "Password must not be more than 1024 characters." }),

    authProvider: z.literal("manual") // ✅ Ensures that this is a manual login
});

// 🔹 Manual Signup Schema (Username, Mobile Number, Email, Password)
const signupSchema = z.object({
    username: z
        .string({ required_error: "Username is required" })
        .trim()
        .min(3, { message: "Username must be at least 3 characters." })
        .max(255, { message: "Username must not be more than 255 characters." }),

    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid email format." })
        .max(255, { message: "Email must not be more than 255 characters." }),

    mobileNumber: z
        .string()
        .trim()
        .length(10, { message: "Phone Number must be exactly 10 digits." })
        .regex(/^\d+$/, { message: "Phone Number must contain only numbers." })
        .optional(), // ✅ Mobile number is now optional (OAuth users don't need it)

    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(8, { message: "Password must be at least 8 characters." })
        .max(1024, { message: "Password must not be more than 1024 characters." }),

    authProvider: z.literal("manual"), // ✅ Ensures that this is a manual signup

    otp: z
        .string({ required_error: "OTP is required" })
        .trim()
        .length(4, { message: "OTP must be exactly 4 digits." })
        .regex(/^\d+$/, { message: "OTP must contain only numbers." })
});


// 🔹 OAuth Signup/Login Schema (Google/GitHub)
const oauthSchema = z.object({
    username: z
        .string({ required_error: "Username is required" })
        .trim()
        .min(3, { message: "Username must be at least 3 characters." })
        .max(255, { message: "Username must not be more than 255 characters." }),
    
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid email format." })
        .max(255, { message: "Email must not be more than 255 characters." }),

    googleId: z.string().optional(),  
    githubId: z.string().optional(),  

    authProvider: z.enum(["google", "github"]), // ✅ Ensures only Google/GitHub login

}).refine(data => data.googleId || data.githubId, {
    message: "Either Google ID or GitHub ID is required for OAuth login.",
    path: ["googleId", "githubId"]
});

module.exports = { signupSchema, loginSchema, oauthSchema };

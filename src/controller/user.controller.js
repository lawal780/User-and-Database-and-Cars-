const bcrypt = require('bcrypt'); 
const User = require('../models/user.schema');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");
const {sendEmail, sentTemplateEmail } = require("../config/email");
const emailTemplate = require("../templates/emailTemplates");
const {OAuth2Client } = require ('google-auth-library');
const {google} = require('googleapis');
const emailTemplates = require('../templates/emailTemplates');
const { createSearchIndex } = require('../models/car.schema');

//  Initialize Google OAuth client 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Salts rounds for hashing
const saltRounds = 10; 

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input 
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash the password 
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const token = jwt.sign({ email : email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            token: token
        });

        await newUser.save();

        // Send Welcome Email Template with Template 

        const welcomeTemplate = emailTemplate.welcomeTemplate(name, emailToken);
        await sendTemplateEmail(
            email,
            welcomeTemplate.subject,
            welcomeTemplate.html,
            welcomeTemplate.text
        );

        return res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const verifyEmail = async (req,res) => {
    const token = req.params.token;
    if (!token) {
        return res.status(400).json({message: 'No Token'});
    }
    try{
        const user = await User.findOne({emailToken: token})
        if(!user){
            return res.status(404).json({message: "User with this token dosen't Exist"})
        }
        user.isVerified = true;
        user.emailtoken = null;
        await user.save();

    // Send email verification success notification
        const successTemplate = emailTemplates.emailVerificationSuccessTemplate(user.name);
        await sendTemplateEmail(
            user.email,
            successTemplate.subject,
            successTemplate.html,
            successTemplate.text
        );
        return res.status(200).json({message: 'user verified Successfully'})
    }catch(err){
        console.log(err);
        return res.status(500).json({message: 'Internal Server error'})
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const payload = {
            id: user._id,
            email: user.email,
        };
        const token = await jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
        })

        // send login notification with template

        const loginTime = new Date().toLocaleString();
        const loginTemplate = emailTemplates.loginNotificationTemplate(user.name, loginTime);
        await sendTemplateEmail(
            email,
            loginTemplate.subject,
            loginTemplate.html,
            loginTemplate.text
        );

        return res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const makeadmin = async (req,res) => {
    const { userId } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {    
            return res.status(404).json({ message: "User not found" });
        }
        user.isAdmin = true; // Set the isAdmin field to true
        await user.save(); // Save the updated user
        return res.status(200).json({ message: "User is now an admin", user });
    } catch (error) {
        console.error("Error making user an admin:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const forgotPassword = async (req,res) => {
    const{email} = req.body;
    // validate input
    if (!email){
        return res.status(400).json({message: "Email is required"})
    }
    try{
        // check if user exists 
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message: 'user not found'})
        }
        // Generate A 6 Digit OTP with math.random()
        const otp = Math.floor(100000 + Math.random() * 99999).toString();

        user.otp = otp;
        await user.save();

        // Send OTP with email Template
        const otpTemplate = emailTemplate.forgotPasswordTemplate(user.name, otp);
        await sendTemplateEmail(
            email,
            otpTemplate.subject,
            otpTemplate.html,
            otpTemplate.text
        );
        return res.status(200).json({message: "Password reset sent to your Email"});
    }catch(err){
        console.err("Error generating reset token", err)
        return res.status(500).json({message: "interbal Server Error"})
    }
};

const verifyOtp = async (req, res)=>{
    const {otp} = req.body;
    try{
        const user = await User.findOne({otp: otp});
        if(!user){
            return res.status(404).json({message: "Invalid Otp"})
        }
        user.otpVerified = true;
        user.otp = null;
        await user.save();

        // Otp is valid, you can process with password reset
        return res.status(200).json({message: "Otp verified successfullt", userId: user._id});
    }catch(error){
        console.error("Error verifying OTP", error)
        return res.status(500).json({message: "Interal Server Error"})
    }
};
const resetPassword = async (req,res) =>{
    const {confirmPassword, newPassword} = req.body;
    const {userId} = req.params;
    console.log(userId);
    // validate input
    if(!userId || !newPassword){
        return res.status(400).json({message: "User ID and new password are required"})
    }
    if(newPassword !== confirmPassword){
        return res.status(400).json({message: "Password do not match"})
    }
    try{
        const user = await User.findById({_id: userId});
        if (!user){
            return res.status(404).json({message: "User not found"})
        }
        if (user.otpVerified !== true){
            return res.status(403).json({message: "OTP not verified Please verify your OTP"})
        }
        // Hash the Password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        user.otpVerified = false;
        await user.save()

        // Send password reset confirmation email
        const confirmationTemplate = emailTemplate.passwordResetConfirmationTemplate(user.name);
        await sendTemplateEmail(
            user.email,
            confirmationTemplate.subject,
            confirmationTemplate.html,
            confirmationTemplate.text
        )
        return res.status(200).json({message: "Password reset successfully"})
    }catch(error){
        console.error("Error resettign password:", error);
        return res.status(500).json({message: "Iternal Server Error"})
    }
};
// initialize Google OAuth - Generate OAuth URL
const initiategoogleAuth = async (req,res)=> {
    try{
        // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
    );

    // Generate the url that will be used for the consent dialog
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      include_granted_scopes: true,
      state: JSON.stringify({
        timestamp: Date.now(),
        // Add any additional state data you need
      })
    });

    return res.status(200).json({
      message: "Google OAuth URL generated",
      authUrl: authorizeUrl
    });

  } catch (error) {
    console.error("Error generating Google OAuth URL:", error);
    return res.status(500).json({ message: "Failed to generate OAuth URL" });
  }
};
// Handle OAuth Callback
const handleGoogleCallback = async(req,res)=>{
    const {code, state, error} = req.query;
    if(error){
        return res.status(400).json({message: "OAuth authorization denied ", error})
    }
    if(!code){
        return res.status(400).json({message: "Authorization code is required"})
    }
    try{
        // Create OAuth2 client 
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
    );
        //  Exchange authorization code for access token 
        const {tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(token);

        // Get user information
        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        const {data} = await oauth2.getuserinfo.get();

        const {
            id: googleId,
            email,
            name,
            picture: avatar,
            verified_email: emailVerified
        } = data;

        if (!emailVerified) {
            return res.status(400).json({message: "Google email not verified"})
        }

        // Check if user exists with this Google ID
        let user = await User.findOne({googleId});
        let isNewUser = false;

        if(!user){
            // check if user exists with this email
            user = await User.findOne({email});

            if (user){
                // Link Google account to existing user
                user.googleId = googleId;
                user.provider = 'google';
                user.avatar = avatar;
                user.isVerified = true;
                await user.save();
            }else{
                // Create new user with google OAuth
                user = new User({
                    name,
                    email,
                    googleId,
                    provider: 'google',
                    avatar,
                    isVerified: true
                });
                await user.save();
                isNewUser = true;

                // Send welcome email for new Google Users
                const welcomeTemplate = emailTemplate.googleWelcomeTemplate(name);
                await sendTemplateEmail(
                    email,
                    welcomeTemplate.subject,
                    welcomeTemplate.html,
                    welcomeTemplate.text
                );
            };
        }
        // Generate JWT token 
        const jwtpayload = {
            id: user._id,
            email: user.email,
            provider: user.provider
        };
        const token = await jwt.sign(jwtpayload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
        });
        // Send login nottification (only for existing user)
        if (!isNewUser){
            const loginTime = new Date().toLocaleString();
            const loginTemplate = emailTemplates.loginNotificationTemplate(user.name, loginTime);
            await sendTemplateEmail(
                email,
                loginTemplate.subject,
                loginTemplate.html,
                loginTemplate.text
            );
        }

        return res.status(200).json({
            message: "Google Authentication Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                provider: user.provider,
                isVerified: user.isVerified
            }
        });
    }catch(err){
        console.error("Google OAuth callback error:", err);
        return res.status(500).json({message: "Google Authentication failed"})
    } 
};

// Unlink google Account 
const unlinkGoogle = async (req,res)=>{
    const {userId} = req.params;

    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not Found "})
        }

        if (user.provider === 'google' && !user.password){
            return res.status(400).json({message: "Cannot Unlink Google Account without setting a password first "})
        }

        // Remove google Association 
        user.googleId = undefined;
        user.provider = 'local';
        user.avatar = undefined();
        await user.save();

        return res.status(200).json({message: 'Google Account unlinked Successfully'})
    }catch(e){
console.error("Error unlinking Google account:", error);
    return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Set password for Google Users who wants to add local Authentication
const setpasswordForGoogleUser = async (req, res) =>{
    const {userId} = req.params;
    const { password, confirmPassword} = req.body;

    if(!password || !confirmPassword){
        return res.status(400).json({message: "Password and confirm password are required"})
    }
    if(password !== confirmPassword){
        return res.status(400).json({message: "Passwords do not match"})
    }
    if(password.length < 6){
        return res.status(400).json({message: "Password must be more than 6 Characters "})
    }
    try{
        const user = await User.findById(userId);
        if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.provider !== 'google') {
      return res.status(400).json({ message: "This endpoint is only for Google users" });
    }

    // Hash and set password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    await user.save();

    // send confirmation email
    const confirmationTemplate = emailTemplates.passwordResetConfirmationTemplate(user.name);
    await sendTemplateEmail(
        user.email,
        confirmationTemplate.subject,
        confirmationTemplate.html,
        confirmationTemplate.text
    );
    return res.status(200).json({message: "Password set successfully. you can now use both Google and email/password login."});
   } catch(j){
    console.error({message: "Error setting password for googlr user ", j})
    return res.status(500).json({message: "Internal Server Error"})
   }  
};
module.exports = {
    signup,
    login,
    makeadmin,
    forgotPassword,
    verifyOtp,
    resetPassword,
    verifyEmail,
    initiategoogleAuth,
    handleGoogleCallback,
    unlinkGoogle,
    setpasswordForGoogleUser,
};




























































































// // // const express = require('express');
// // // const { addNumbers, subtractNumbers, multiplyNumbers, divideNumbers, decimalNumbers} = require('./function');

// // // const app = express(); 

// // // app.use(express.json());

// // // app.get('/', (req, res) => {
// // //     res.send("This is samad ")
// // // })

// // // app.delete('/delete', (req, res) => {
// // //     res.send("this is a delete post ")
// // // })

// // // app.post('/add', (req, res)=>{
// // //     const{a, b} = req.body;
// // //     const addition = addNumbers(a,b);
// // //     res.json({result: `The sum of these numbers are  ${addition}`})
// // // });

// // // app.post('/subtract', (req, res)=>{
// // //     const{a, b} = req.body;
// // //     const subtract = subtractNumbers(a,b);
// // //     res.json({result: `The subtraction of these numbers are  ${subtract}`})
// // // });

// // // app.post('/multiply', (req, res)=>{
// // //     const{a, b} = req.body;
// // //     const multiply = multiplyNumbers(a,b);
// // //     res.json({result: `The multiplication of these numbers are  ${multiply}`})
// // // });
// // // app.post('/divide', (req, res)=>{
// // //     const{a, b} = req.body;
// // //     const divide = divideNumbers(a,b);
// // //     res.json({result: `The Division of these numbers are  ${divide}`})
// // // });

// // // app.post('/decimal', (req,res)=>{
// // //     const {a,b} = req.body;
// // //     const decimal = decimalNumbers(a,b);
// // //     res.json({result: `The decimal is ${decimal}`})
// // // });

// // // app.listen(3000, ()=>{
// // //     console.log("Its running on port 3000 ");
    

// // // })

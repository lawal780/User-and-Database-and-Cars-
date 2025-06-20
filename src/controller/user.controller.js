const bcrypt = require('bcrypt'); 
const User = require('../models/user.schema');
const jwt = require('jsonwebtoken');

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

        return res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ message: "Internal server error", error });
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
module.exports = {
    signup,
    login,
    makeadmin,
};



// const bcrypt = require('bcrypt');
// const User = require('../models/user.schema');

// const saltRounds = 10; // define this if you haven't already

// const signup = async (req, res) => {
//     const { name, email, password } = req.body;

//     // Validate input 
//     if (!name || !email || !password) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password.length < 6) {
//         return res.status(400).json({ message: "Password must be at least 6 characters long" });
//     }

//     try {
//         // Check if user exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(409).json({ message: "User already exists" });
//         }

//         // Hash the password 
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // Create new user
//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword,
//         });

//         await newUser.save();

//         return res.status(201).json({ message: "User created successfully", user: newUser });

//     } catch (error) {
//         return res.status(500).json({ message: "Internal Server Error", error });
//     }
// };


// const login = async (req, res) => {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     try {
//         // Check if user exists 
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Compare password 
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         return res.status(200).json({ message: "User logged in successfully", user });

//     } catch (error) {
//         return res.status(500).json({ message: 'Internal Server Error', error });
//     }
// };

// module.exports = {
//     signup,
//     login
// };






// // const User = require('../models/user.schema');

// // const signup = async (req, res)=>{
// //     const{name, email, password} = req.body;
// //     // Validate input 
// //     if(!name || !email || !password){
// //         return res.status(400).json({message: "All fields are required "});
// //     }
// //     if(password.length < 6){
// //         return res.status(400).json({message: "Password must be at least 6 charecter long"});
// //     }
// //     try{
// //         // check if user  exists
// //         const existingUser = await User.findOne({email});
// //         if(!existingUser){
// //             return res.status(404).json({message: "User already exists "})
// //         }
// //         // Hash the password 
// //         const hashedPassword = await bcrypt.bash(password, saltRounds);
// //          // // create new user
// //          const newuser = new User ({
// //              name,   
// //              email,
// //             password: hashedPassword,
// //         });
// //          await newuser.save();
// //           return res.status(200).json({message: "User created successully", newUser});
// //      }catch(error){
// //         return res.status(500).json({message: "Internal Server error", error});
// // }
// // const login = async (req, res)=>{
// //     const {email, password} = req.body;
// //     // validate input
// //     if(!email || !password){
// //         return res.status(400).json({message: " All fields are required "});
// //     }
// //     try{
// //         // check if user exist 
// //         const user = await User.findOne({ email });
// //         if(!user){
// //             return res.status(404).json({message: "User not found"});
// //         }
// //         // check password
// //          // compare password 
// //         const isPasswordValid = await bcrypt.compare(password, user.password);
// //         if(!isPasswordValid){
// //             return res.status(401).json({message:"Invalid credentials"});
// //         }

// //         }
// //         return res.status(200).json({message: "User Logged in successfully ", user});
// //     }catch(error){
// //         return res.status(500).json({message: 'internal server error'})
// //     }
// // }
// // module.exports = {
// //     signup,
// //     login
// // }
// // // // Create a new student
// // // const register =  async (req, res) => {
// // //     const { firstName, lastName, age, studentClass } = req.body;
// // //     if( !firstName || !lastName || !age || !studentClass ) {
// // //         return res.status(400).json({message: 'All fields are required '})
// // //     }
// // //     const student = new Student({
// // //         firstName, lastName, age, studentClass
// // //     });
// // //     await student.save();
// // //     res.status(201).json({ message: 'student created successfully', student });
// // // };

// // // // Get all students
// // // const getStudents =  async (req, res) => {

// // //     const students = await Student.find();
// // //     res.status(200).json({ students, length: students.length });
// // // };

// // // // Get a student by ID
// // // const getStudentById  =  async (req, res) => {

// // //     const { id } = req.params;
// // //     const student = await Student.findById(id);
// // //     res.status(200).json({ student });
// // // };

// // // // Update a student
// // // const updateStudentsById =  async (req, res) => {

// // //     const { id } = req.params;
// // //     const { firstName, lastName, age, studentClass } = req.body;
// // //     const updatedStudent = await Student.findByIdAndUpdate(id,{ firstName, lastName, age, studentClass },{ new: true });
// // //     res.status(200).json({ message: 'Student updated successfully', updatedStudent });


// // // };

// // // // Delete a student
// // // const deleteStudents = async (req, res) => {
// // //     const { id } = req.params;
// // //     const deletedStudent = await Student.findByIdAndDelete(id);
// // //     res.status(200).json({ message: 'Student deleted successfully', deletedStudent });

// // // };


// // // // Search for students 
// // // const searchStudents = async (req, res) =>{
// // //     const {firstName} = req.query;
// // //     const students = await Student.find({firstName: firstName });
// // //     res.status(200).json({students});
// // // };


// // // module.exports = {
// // //     register,
// // //     getStudents,
// // //     getStudentById,
// // //     updateStudentsById,
// // //     deleteStudents,
// // //     searchStudents
// // // };

// // // // Start the server
// // // app.listen(port, () => {
// // //   connectDB();
// // //   console.log(`🚀 Server is running on http://localhost:${port}`);
// // // });



























































































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

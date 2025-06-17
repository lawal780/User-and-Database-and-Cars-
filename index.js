const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./src/config/db.js'); 
const userRoutes = require('./src/routes/user.routes');
dotenv.config();
const app = express();


app.use(morgan('dev'))
app.use(express.json());
const PORT = process.env.PORT || 4500;

app.get('/', (req,res) =>{
    res.send("Welcome to my OnlyFans Page. Do well to Subscribe  ");
});

app.use('/api/users', userRoutes);

app.listen(PORT, () =>{
    connectDB();
    console.log(`Server is running on http://localhost:${PORT} `);
    
});






// const express = require('express');
// const  mongoose  = require('mongoose');


// const app = express();

// app.use(express.json());
// const port = 3500;

// app.get('/', (req,res) => {
//     res.send("Hello world");
// });

// const connectDB = () =>{
//     mongoose.connect('mongodb://localhost:27017/samad');
//     console.log('connected to MongoDB');
// }

// //Define a simple schema and model 
// const studentSchema = new mongoose.Schema({
//     firstName:String,
//     lastName: String,
//     age : Number,
//     studentClass : String
// });

// const Student = mongoose.model('Student', studentSchema);

// //Create a new student 

// app.post('/students', async (req,res)=>{
//     const {firstName, lastName, age, studentClass} = req.body;
//     const student = new Student ({ firstName, lastName, age, studentClass: studentClass });
//     await student.save();
//     res.status(201).json({message: 'student created successfully ', student});
// });

// app.get('/get-students', async (req, res)=>{
//     const students = await
//     students.find();
//     res.status(200).json({students,length: students.length});
// });

// app.get('get-students/:id', async(req,res)=>{
//     const {id} = req.params;
//     const students = await
//     students.findByid(id);
//     res.status(200).json({student});

// });

// app.put('/update-student/:id', async (req,res)=>{
//     const {id} = req.params;
//     const {firstName, lastName, age, studentClass} = req.body;
//     const updatedStudent = await student.findByidAndupdate(id,{firstName, lastName, age, studentClass}, {new:true});

//     res.status(200).json({message: 'Student updated successfully', updatedStudent});
// });

// app.delete('/delete-student/:id', async (req, res)=>{
//     const {id} = req.paramsms;
//     const deleteStudent = await student.findByidAndDelete(id);

//     res.status(200).json({message: 'Student deleted successfully', deletedStudent});
// })

// app.listen(port, ()=>{
//     connectDB();
//     console.log(`Server is running on http://localhost:${port}`);
    
// })

// const express = require('express');
// const mongoose = require('mongoose');

// const app = express();
// const port = 3500;

// // Middleware
// app.use(express.json());

// // Connect to MongoDB
// const connectDB = async () => {
// try {
//     await mongoose.connect('mongodb://localhost:27017/samad');
//     console.log('✅ Connected to MongoDB');
// } catch (error) {
//     console.error('❌ MongoDB connection failed:', error);
//     process.exit(1);
// }
// };

// // Student Schema and Model
// const studentSchema = new mongoose.Schema({
//     firstName: String,
//     lastName: String,
//     age: Number,
//     studentClass: String,
// },{
//     timestamps: true,
//     versionKey: false

// });

// const Student = mongoose.model('Student', studentSchema);

// // Routes

// // Root route
// app.get('/', (req, res) => {
// res.send('Hello world');
// });

// // Create a new student
// app.post('/students', async (req, res) => {
// try {
//     const { firstName, lastName, age, studentClass } = req.body;
//     const student = new Student({ firstName, lastName, age, studentClass });
//     await student.save();
//     res.status(201).json({ message: 'Student created successfully', student });
// } catch (error) {
//     res.status(500).json({ error: 'Failed to create student' });
// }
// });

// // Get all students
// app.get('/get-students', async (req, res) => {
// try {
//     const students = await Student.find();
//     res.status(200).json({ students, length: students.length });
// } catch (error) {
//     res.status(500).json({ error: 'Failed to retrieve students' });
// }
// });

// // Get a student by ID
// app.get('/get-student/:id', async (req, res) => {
// try {
//     const { id } = req.params;
//     const student = await Student.findById(id);
//     if (!student) {
// return res.status(404).json({ error: 'Student not found' });
//     }
//     res.status(200).json({ student });
// } catch (error) {
//     res.status(500).json({ error: 'Failed to retrieve student' });
// }
// });

// // Update a student
// app.put('/update-student/:id', async (req, res) => {
// try {
//     const { id } = req.params;
//     const { firstName, lastName, age, studentClass } = req.body;
//     const updatedStudent = await Student.findByIdAndUpdate(
//     id,
//       { firstName, lastName, age, studentClass },
//       { new: true }
//     );
//     if (!updatedStudent) {
//       return res.status(404).json({ error: 'Student not found' });
//     }
//     res.status(200).json({ message: 'Student updated successfully', updatedStudent });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update student' });
//   }
// });

// // Delete a student
// app.delete('/delete-student/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedStudent = await Student.findByIdAndDelete(id);
//     if (!deletedStudent) {
//       return res.status(404).json({ error: 'Student not found' });
//     }
//     res.status(200).json({ message: 'Student deleted successfully', deletedStudent });
//   } catch (error) {
//     console.error('Delete error:', error);
//     res.status(500).json({ error: 'Failed to delete student' });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   connectDB();
//   console.log(`🚀 Server is running on http://localhost:${port}`);
// });

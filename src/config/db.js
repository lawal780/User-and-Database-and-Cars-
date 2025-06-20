const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { log } = require('console');

dotenv.config()

const connectDB =async () =>{
   await mongoose.connect(process.env.MONGO_URL)
   .then(() =>{
     console.log('✅ Connected to MongoDB')
    
   }) .catch((error) =>{
    console.error('❌ MongoDB connection failed', error.message);
    process.exit(1)  //Exit the process with failure 
    
   })
 
}
module.exports = connectDB;


// const mongoose = require('mongoose')
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

const Car = require('../models/car.schema');
const User = require('../models/user.schema');

// Add a car
const addCar = async (req, res) => {
  const { make, model, year, price, description, color, brand } = req.body;
  const id = req.user.id;

  if (!make || !model || !year || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findById(id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Only admins can add cars' });
    }

    const newCar = new Car({
      make,
      model,
      year,
      price,
      description,
      color,
      brand,
    });

    await newCar.save();

    return res.status(201).json({ message: 'Car added successfully' });
  } catch (error) {
    console.error('Error adding car:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Edit a car
const editCar = async (req, res) => {
  const { carId } = req.params;
  const id = req.user.id;
  const { make, model, year, price, description, color, brand } = req.body;

  try {
    const user = await User.findById(id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Only admins can edit cars' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    car.make = make || car.make;
    car.model = model || car.model;
    car.year = year || car.year;
    car.price = price || car.price;
    car.description = description || car.description;
    car.color = color || car.color;
    car.brand = brand || car.brand;

    await car.save();

    return res.status(200).json({ message: 'Car updated successfully', car });
  } catch (error) {
    console.error('Error updating car:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a car
const deleteCar = async (req, res) => {
  const { carId } = req.params;
  const id = req.user.id;

  try {
    const user = await User.findById(id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Only admins can delete cars' });
    }

    const car = await Car.findByIdAndDelete(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    return res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all cars
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    return res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Search cars by make
const searchCars = async (req, res) => {
  const { make } = req.query;
  try {
    const cars = await Car.find({ make });
    if (cars.length === 0) {
      return res.status(404).json({ message: 'No cars found with that make' });
    }
    return res.status(200).json({ cars });
  } catch (error) {
    console.error('Error searching cars:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addCar,
  editCar,
  deleteCar,
  getAllCars,
  searchCars,
};


// const Car = require('../models/car.schema');
// const User = require('../models/user.schema');
// const user = require('../models/user.schema');

// const addCar = async(req, res)=>{
//     const {make, model, year, price,description,color,brand } = req.body;
//     const id = req.user.id;

//     // validate input

//     if(!make || !model || !year || !price) {
//         return res.status(400).json({message: 'All fields are requires'})
//     }
//     try{
//         const user = await User.findById(id);
//         if(user.isAdmin !== true){
//             return res.status(403).json({message: 'only admins can add cars '});    
//         }

//         // Create new car 
//         const newCar = new Car({
//             make,
//             model,
//             year,
//             price,
//             description,
//             color,
//             brand,
//         });
//         await newcar.save();
    
//         return res.status(201).json({message: 'Car added successfully'});
// }catch(error){
//     console.error('Error adding car:', error)
//     return res.status(500).json({message: "Internal server error"})
// }
// };

// //  Edit a car
// const editCar = async (req,res) =>{
//     const {carId} = req.params;
//     const id = req.user.id;
//     const {make, model, year, price, description, color, brand} = req.body;

//     try{
//         const user = await User.findById(id);
//         if (user.isAdmin !== true){
//             return res.status(403).json({message: 'only admins can edit cars  '})
//         }
//         const car = await Car.findById(carId);
//         if (!car){
//             return res.status(404).json({message: ' Car not found'});
        
// }
//         // Update car details
//         car.make = make || car.make;    
//         car.model = model || car.model;
//         car.year = year || car.year;
//         car.price = price || car.price;
//         car.description = description || car.description;
//         car.color = color || car.color;
//         car.brand = brand || car.brand;
//         await car.save();
//         return res.status(200).json({message: 'Car updated successfully', car});
// } catch(error) {
//     console.error('Error updating car:', error);
//     return res.status(500).json({message: 'Internal server error'});
// };
// }

// // Delete a car
// const deleteCar = async (req, res) => {
//     const { carId } = req.params;
//     const id = req.user.id;

//     try {
//         const user = await User.findById(id);
//         if (user.isAdmin !== true) {
//             return res.status(403).json({ message: 'Only admins can delete cars' });
//         }

//         const car = await Car.findByIdAndDelete(carId);
//         if (!car) {
//             return res.status(404).json({ message: 'Car not found' });
//         }

//         return res.status(200).json({ message: 'Car deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting car:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // Get all cars
// const getAllCars = async (req, res) => {
//     try {
//         const cars = await Car.find();
//         return res.status(200).json(cars);
//     } catch (error) {
//         console.error('Error fetching cars:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// }
// // Search cars by make or model
// const searchCars = async (req, res) => {
//     const {make} = req.query;
//     try {
//         const cars = await Car.find({make: make});
//         if (!car) {
//             return res.status(404).json({ message: 'No cars found with that make' });
//         }
//         return res.status(200).json({cars});
//     } catch (error) {
//         console.error('Error searching cars:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };

// module.exports = {
//     addCar,
//     editCar,
//     deleteCar,
//     getAllCars,
//     searchCars
// };
const Car = require('../models/car.schema');

exports.rentCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const userId = req.user.id;
    const { startDate, endDate, totalPrice } = req.body;

    // Find the car by ID
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if car is already rented
    if (car.isRented) {
      return res.status(400).json({ message: 'Car is already rented' });
    }

    // Update the car's rental status
    car.isRented = true;
    car.rentedBy = userId;
    car.startDate = startDate; // corrected typo
    car.endDate = endDate;
    car.totalPrice = totalPrice;
    car.status = 'pending';

    await car.save();

    return res.status(200).json({ message: 'Car rented successfully' });

  } catch (error) {
    console.error('Error renting car', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


// const Car = require('../models/car.schema');

// exports.rentCar = async (req,res)=>{
//     const {carId} = req.params;
//     const userId = req.user.id;
//     const {startDate, endDate, totalPrice} = req.body;   
// }

// try{
//     // Find the car by ID
//     const car = await Car.findById(carId);
//     if (!car) {
//         return res.status(404).json({message: 'Car not found'})
//     }

//     // check if car is already rented
//     if (car.isRented) {
//         return res.status(400).json({message: "car is Already rented"})
//     }

//     // update the car's rental status
//     car.isRented = true;
//     car.rentedBy = userId;
//     car.starDate = startDate;
//     car.endDate = endDate;
//     car.totalPrice = totalPrice;
//     car.status = 'pending';
//     await car.save();

//     return res.status(200).json({message: 'Car rented successfully'})
// }catch (error){{
//     console.error('Error renting car', error);
//     return res.status(500).json({message: 'Internal Server Error'})
// }};
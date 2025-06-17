// const addNumbers = (a, b)=>{
//     return a + b;

// }

// const subtractNumbers = (a,b)=>{
//     return a -b;

// }
// const multiplyNumbers = (a, b)=>{
//     return a * b;
// }

// const divideNumbers =(a,b)=>{
//     return a / b;
// }
// const decimalNumbers = (a,b)=>{
//     return a * 3.142 /b;
// }

// module.exports = {
//     addNumbers,
//     subtractNumbers,
//     multiplyNumbers,
//     decimalNumbers
// };

function calculateDaysBetweenDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
}
console.log(calculateDaysBetweenDates('2023-01-01', '2023-01-31')); // Output: 30
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}
const birthDate = '1990-05-15'; 
console.log(`Age: ${calculateAge(birthDate)}`); // Output: Age: 33 (as of 2023)
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
} 
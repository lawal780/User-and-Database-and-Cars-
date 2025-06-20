const express = require('express');
const { signup, login, makeadmin} = require('../controller/user.controller');

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch('/make-admin/:userId', makeadmin);

module.exports = router;



// const express = require ('express');
// const {
//     register,
//     getStudents,
//     getStudentById,
//     deleteStudents,
//     searchStudents,
//     updateStudentsById,
//     updateStudentsById,
// } = require('./student.controller');

// const router = express.Router();

// router.post("/register", register);
// router.get("/get-students", getStudents);
// router.get("/get-studnts/:id", getStudentById);
// router.put("/update-students/:id", updateStudentsById);
// router.delete("/delete-students/:id", deleteStudents);
// router.get("/search-students", searchStudents);

// module.exports = router;
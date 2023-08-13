//Back-End/routes/routes.js

const express = require('express');
const router = express.Router();
const userAuthenticationController = require('../controllers/userAuthentication');
const employeeController = require('../controllers/employee')
const jobController = require('../controllers/job')
const departmentController = require('../controllers/department')

//Routes for userAuthentication
router.post("/registerUser", userAuthenticationController.register);
router.post("/login", userAuthenticationController.login);
router.get("/logout", userAuthenticationController.logout);

//Routes for employees page
router.post("/employee/create", employeeController.addEmployee); //Create the record through the form
router.get("/employee", employeeController.getAllEmployees);// View all the records from hr_employees table
router.put("/employee/update/:EMPLOYEE_ID", employeeController.updateEmployee); // Update records in hr_employees table
router.delete("/employee/delete/:EMPLOYEE_ID", employeeController.deleteEmployee); // Delete records in hr_employees table
router.get("/employee/search/:searchInput", employeeController.searchEmployee); //getting an employee record by employee_id or first_name or last_name

// //Routes for jobs page
router.post("/job/add", jobController.addJob); //Create the record through the form
router.get("/job", jobController.getAllJobs);// View all the records from hr_jobs table
router.put("/job/update/:JOB_ID", jobController.updateJob); // Update records in hr_jobs table
router.delete("/job/delete/:JOB_ID", jobController.deleteJob); // Delete records in hr_jobs table
router.get("/job/search/:searchInput", jobController.searchJob); //getting a job record by job_id or job_title

// //Routes for jobs page
router.post("/department/add", departmentController.addDepartment); //Create the record through the form
router.get("/department", departmentController.getAllDepartments);// View all the records from hr_departments table
router.put("/department/update/:DEPARTMENT_ID", departmentController.updateDepartment); // Update records in hr_departments table
router.delete("/department/delete/:DEPARTMENT_ID", departmentController.deleteDepartment); // Delete records in hr_departments table
router.get("/department/search/:searchInput", departmentController.searchDepartment); //getting a department record by department_id or department_name
router.get("/location", departmentController.getAllLocations); //getting all the locations from HR_LOCATIONS Table to used them in the Department page

module.exports = router;

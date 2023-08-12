// controllers/employee.js

const oracledb = require("oracledb");
const dbModule = require('../oracledb'); // Import the oracledb module

// Controller that call the Employee_hire_sp PROCEDURE from Oracle and create a new record employee
exports.addEmployee = async (req, res) => {
    let details = [
        req.body.FIRST_NAME, 
        req.body.LAST_NAME, 
        req.body.EMAIL, 
        req.body.PHONE_NUMBER, 
        req.body.JOB_ID, 
        req.body.SALARY, 
        req.body.COMMISSION_PCT,
        req.body.MANAGER_ID, 
        req.body.DEPARTMENT_ID,
      ];
    
      let sql = `BEGIN Employee_hire_sp(:1, :2, :3, :4, :5, :6, :7, :8, :9); END;`;
    
      try {
        const result = await dbModule.connection().execute(sql, details);
        res.send({ status: true, message: "Employee created successfully" });
    } catch (err) {
        if (err.code === 'ORA-20001') {
            res.status(400).json({ message: 'The salary is outside the acceptable range for this job.' });
        } else {
            res.status(500).json({ message: 'Internal server error.' });
        }
    }};

//Controller for viewing all records from hr_employees table
exports.getAllEmployees = async (req, res) => {
    let sql = `SELECT * FROM HR_EMPLOYEES`;
  const columnNames = ['EMPLOYEE_ID','FIRST_NAME', 'LAST_NAME', 'EMAIL', 'PHONE_NUMBER', 'HIRE_DATE', 'JOB_ID', 'SALARY', 'COMMISSION_PCT', 'MANAGER_ID', 'DEPARTMENT_ID']; 

  try {
      const result = await dbModule.connection().execute(sql);
      const data = result.rows.map(row => {
          let obj = {};
          row.forEach((item, index) => {
              obj[columnNames[index]] = item;
          });
          return obj;
      });
      res.send({ status: true, data: data });
  } catch (err) {
      console.error(err);
      res.send({ status: false, message: "Failed to retrieve employee records" });
  }
};

// Controller for updating salary, phone_number, and email fields from an existing employee record
exports.updateEmployee = async (req, res) => {
    let details = {
        EMAIL: req.body.EMAIL, 
        PHONE_NUMBER: req.body.PHONE_NUMBER, 
        SALARY: req.body.SALARY,
        EMPLOYEE_ID: req.params.EMPLOYEE_ID
      };
    
      let sql = `UPDATE HR_EMPLOYEES 
                 SET EMAIL = :EMAIL, 
                     PHONE_NUMBER = :PHONE_NUMBER, 
                     SALARY = :SALARY 
                 WHERE EMPLOYEE_ID = :EMPLOYEE_ID`;
    
      try {
          const result = await dbModule.connection().execute(sql, details);
          res.send({ status: true, message: "Employee Updated successfully" });
        } catch (err) {
            if (err.code === 'ORA-20001') {
                res.status(400).json({ message: 'The salary is outside the acceptable range for this job.' });
            } else {
                res.status(500).json({ message: 'Internal server error.' });
            }
        }};

// Controller for deleting an employee record by employee_id
exports.deleteEmployee = async (req, res) => {
    let sql = `DELETE FROM HR_EMPLOYEES WHERE EMPLOYEE_ID = :EMPLOYEE_ID`;

    try {
        const result = await dbModule.connection().execute(sql, { EMPLOYEE_ID: req.params.EMPLOYEE_ID });
        
        // Check if the deletion was successful
        if (result.rowsAffected && result.rowsAffected > 0) {
            res.send({ status: true, message: "Employee Deleted Successfully" });
        } else {
            res.send({ status: false, message: "Employee Deletion Failed: No such employee exists." });
        }
    } catch (err) {
        console.error(err);

        // Check for ORA-02292 error
        if (err.code === 'ORA-02292') {
            res.send({
                status: false,
                message: "Cannot delete the employee as they are linked to another record in the system."
            });
        } else {
            res.send({ status: false, message: "Employee Deletion Failed" });
        }
    }
};

// Controller for getting an employee record by employee_id or first_name or last_name
exports.searchEmployee = async (req, res) => {
    let searchInput = req.params.searchInput;
  const columnNames = ['EMPLOYEE_ID', 'FIRST_NAME', 'LAST_NAME', 'EMAIL', 'PHONE_NUMBER', 'HIRE_DATE', 'JOB_ID', 'SALARY', 'COMMISSION_PCT', 'MANAGER_ID', 'DEPARTMENT_ID'];
  
  let sql = `SELECT * FROM HR_EMPLOYEES 
             WHERE UPPER(FIRST_NAME) LIKE UPPER(:searchInput)
             OR UPPER(LAST_NAME) LIKE UPPER(:searchInput) 
             OR UPPER(EMAIL) LIKE UPPER(:searchInput)
             OR EMPLOYEE_ID = :employeeId`;

  try {
      let employeeId = parseInt(searchInput, 10); // Try to convert the input to a number
      if (isNaN(employeeId)) { // If it's not a number, set it to null
          employeeId = null;
      }

      const result = await dbModule.connection().execute(sql, { 
          searchInput: `%${searchInput}%`, 
          employeeId: employeeId 
      });

      const data = result.rows.map(row => {
          let obj = {};
          row.forEach((item, index) => {
              obj[columnNames[index]] = item;
          });
          return obj;
      });

      res.send({ status: true, data: data });
  } catch (err) {
      console.error(err);
      res.send({ status: false, message: "Failed to retrieve employee records" });
  }
};
// controllers/department.js

const oracledb = require("oracledb");
const dbModule = require('../oracledb'); // Import the oracledb module

// Controller that call the New_department_sp PROCEDURE from Oracle and create a new record department
exports.addDepartment = async (req, res, next) => {
    let details = [
        req.body.DEPARTMENT_NAME, 
        req.body.MANAGER_ID, 
        req.body.LOCATION_ID, 
      ];
  
      let sql = `BEGIN New_department_sp(:DEPARTMENT_NAME, 
                      :MANAGER_ID, 
                      :LOCATION_ID); 
                 END;`;
    
      try {
        const result = await dbModule.connection().execute(sql, details);
        res.send({ status: true, message: "Department created successfully" });
      } catch (err) {
        console.error(err);
        res.send({ status: false, message: "Department creation failed" });
      }
    };


//Controller for viewing all records from hr_departments table
exports.getAllDepartments = async (req, res, next) => {
    let sql = `SELECT * FROM HR_DEPARTMENTS`;
  const columnNames = ['DEPARTMENT_ID','DEPARTMENT_NAME','MANAGER_ID', 'LOCATION_ID', ]; 

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
          res.send({ status: false, message: "Failed to retrieve department records" });
      }
    };

// Controller for updating an existing department record
  exports.updateDepartment = async (req, res, next) => {
    let details = {
        MANAGER_ID: req.body.MANAGER_ID, 
        LOCATION_ID: req.body.LOCATION_ID,
        DEPARTMENT_ID: req.params.DEPARTMENT_ID
      };
  
      let sql = `UPDATE HR_DEPARTMENTS SET 
                      MANAGER_ID = :MANAGER_ID, 
                      LOCATION_ID = :LOCATION_ID 
                 WHERE DEPARTMENT_ID = :DEPARTMENT_ID`;
  
      try {
          const result = await dbModule.connection().execute(sql, details);
          res.send({ status: true, message: "Department Updated successfully" });
      } catch (err) {
          console.error(err);
          res.send({ status: false, message: "Department Update Failed" });
      }
  };
  

// Controller for deleting an employee record by department_id
  exports.deleteDepartment = async (req, res, next) => {
        let sql = `DELETE FROM HR_DEPARTMENTS WHERE DEPARTMENT_ID = :DEPARTMENT_ID`;

    try {
        const result = await dbModule.connection().execute(sql, { DEPARTMENT_ID: req.params.DEPARTMENT_ID });
        res.send({ status: true, message: "Department Deleted Successfully" });
    } catch (err) {
        console.error(err);
        res.send({ status: false, message: "Department Deletion Failed" });
    }
};

// Controller for getting a department record by department_id or department_name 
exports.searchDepartment = async (req, res, next) => {
    let searchInput = req.params.searchInput;
    const columnNames = ['DEPARTMENT_ID', 'DEPARTMENT_NAME', 'MANAGER_ID', 'LOCATION_ID'];
    
    let sql = `SELECT * FROM HR_DEPARTMENTS 
               WHERE UPPER(DEPARTMENT_NAME) LIKE UPPER(:searchInput)
               OR DEPARTMENT_ID = :departmentId`;
  
    try {
        let departmentId = parseInt(searchInput, 10); // Try to convert the input to a number
        if (isNaN(departmentId)) { // If it's not a number, set it to null
            departmentId = null;
        }
  
        const result = await dbModule.connection().execute(sql, { 
            searchInput: `%${searchInput}%`, 
            departmentId: departmentId 
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
        res.send({ status: false, message: "Failed to retrieve department records" });
    }
  };

  // Controller for getting all the locations from the HR_LOCATIONS Table
exports.getAllLocations = async (req, res, next) => {
    let sql = `SELECT * FROM HR_LOCATIONS`;
  const columnNames = ['LOCATION_ID','STREET_ADDRESS','POSTAL_CODE', 'CITY','STATE_PROVINCE', 'COUNTRY' ]; 

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
          res.send({ status: false, message: "Failed to retrieve locations" });
      }
    };
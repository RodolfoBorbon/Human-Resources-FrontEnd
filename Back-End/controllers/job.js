// controllers/job.js

const oracledb = require("oracledb");
const dbModule = require('../oracledb'); // Import the oracledb module

// Controller that call the new_job_sp procedure from Oracle and add a new job record
exports.addJob = async (req, res) => {
    let details = [
        req.body.JOB_TITLE, 
        req.body.MIN_SALARY, 
        req.body.MAX_SALARY, 
      ];
  
      let sql = `BEGIN New_job_sp(:1, :2, :3); END;`;
    
      try {
        const result = await dbModule.connection().execute(sql, details);
        res.send({ status: true, message: "Job created successfully" });
      } catch (err) {
        console.error(err);
        res.send({ status: false, message: "Job creation failed" });
      }
    };


//Controller for viewing all Jobs records from hr_jobs table
exports.getAllJobs = async (req, res) => {
    let sql = `SELECT * FROM HR_JOBS`;
  const columnNames = ['JOB_ID','JOB_TITLE','MIN_SALARY', 'MAX_SALARY']; 

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
        res.send({ status: false, message: "Failed to retrieve job records" });
    }
  };

/// Controller for updating job_title, min_salary, and max_salary fields from an existing job record
exports.updateJob = async (req, res) => {
    let details = {
        JOB_TITLE: req.body.JOB_TITLE, 
        MIN_SALARY: req.body.MIN_SALARY, 
        MAX_SALARY: req.body.MAX_SALARY,
        JOB_ID: req.params.JOB_ID
      };
  
      let sql = `UPDATE HR_JOBS SET 
                      JOB_TITLE = :JOB_TITLE,
                      MIN_SALARY = :MIN_SALARY, 
                      MAX_SALARY = :MAX_SALARY 
                 WHERE JOB_ID = :JOB_ID`;
  
      try {
          const result = await dbModule.connection().execute(sql, details);
          res.send({ status: true, message: "Job Updated successfully" });
      } catch (err) {
          console.error(err);
          res.send({ status: false, message: "Job Update Failed" });
      }
  };
  

// Controller for deleting a job record by job_id
exports.deleteJob = async (req, res) => {
    let sql = `DELETE FROM HR_JOBS WHERE JOB_ID = :JOB_ID`;

    try {
        const result = await dbModule.connection().execute(sql, { JOB_ID: req.params.JOB_ID });
       
    // Check if the deletion was successful
    if (result.rowsAffected && result.rowsAffected > 0) {
        res.send({ status: true, message: "Job Deleted Successfully" });
    } else {
        res.send({ status: false, message: "Job Deletion Failed: No such job exists." });
    }
} catch (err) {
    console.error(err);

    // Check for ORA-02292 error
    if (err.code === 'ORA-02292') {
        res.send({
            status: false,
            message: "Cannot delete the Job as they are linked to another record in the system."
        });
    } else {
        res.send({ status: false, message: "Job Deletion Failed" });
    }
}
};

// Controller for searching a job record by job_id or job_title
exports.searchJob = async (req, res) => {
    let searchInput = req.params.searchInput;
  const columnNames = ['JOB_ID', 'JOB_TITLE', 'MAX_SALARY', 'MIN_SALARY'];

  let sql = `SELECT * FROM HR_JOBS 
             WHERE UPPER(JOB_TITLE) LIKE UPPER(:searchInput) 
             OR UPPER(JOB_ID) LIKE UPPER(:searchInput)`;

  try {
      const result = await dbModule.connection().execute(sql, { 
          searchInput: `%${searchInput}%`
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
      res.send({ status: false, message: "Failed to retrieve job records" });
  }
};
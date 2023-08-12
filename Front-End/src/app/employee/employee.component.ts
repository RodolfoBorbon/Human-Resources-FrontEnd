//app/employee/employee.component.ts

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {

  EmployeeArray : any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  FIRST_NAME: string ="";
  LAST_NAME: string ="";
  EMAIL: string ="";
  PHONE_NUMBER: string ="";
  HIRE_DATE: string | Date = undefined!;
  JOB_ID: string ="";
  SALARY= "";
  MANAGER_ID= "";
  DEPARTMENT_ID= "";
  EMPLOYEE_ID = "";
  COMMISSION_PCT = "";

  jobTouched: boolean = false;
  lastNameTouched: boolean = false; 
  firstNameTouched: boolean = false;
  managerTouched: boolean = false;

  SearchInput: string = ''; //searchInput property

  JobArray: any[] = []; 
  DepartmentArray: any[] = []; 

  constructor(private http: HttpClient ) 
  {
    this.getAllEmployee();
    this.getAllJobs();
    this.getAllDepartments();
  }
  ngOnInit(): void {
  }

  //View all the employee 
  getAllEmployee()
  { 
    this.http.get("http://localhost:8080/employee/")
    .subscribe((resultData: any)=>
    {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.EmployeeArray = resultData.data;
    });
  }
  
  //Reset Form
resetForm() {
  this.FIRST_NAME = '';
  this.LAST_NAME = '';
  this.EMAIL = '';
  this.PHONE_NUMBER = '';
  this.JOB_ID = '';
  this.SALARY = '';
  this.MANAGER_ID = '';
  this.DEPARTMENT_ID = '';
  this.EMPLOYEE_ID = '';
  this.COMMISSION_PCT = '';
}

//Create a record
createEmployee()
{
  let bodyData = {
    "FIRST_NAME" : this.FIRST_NAME,
    "LAST_NAME" : this.LAST_NAME,
    "EMAIL" : this.EMAIL,
    "PHONE_NUMBER": this.PHONE_NUMBER,
    "JOB_ID": this.JOB_ID,
    "SALARY": this.SALARY,
    "MANAGER_ID": this.MANAGER_ID,
    "DEPARTMENT_ID": this.DEPARTMENT_ID,
    "COMMISSION_PCT": this.COMMISSION_PCT
  };
  this.http.post("http://localhost:8080/employee/create",bodyData).subscribe((resultData: any)=>
  {
      console.log(resultData);
      alert("Employee Registered Successfully")
      this.resetForm();
      this.getAllEmployee();
    },
    (error: any) => {
      console.error(error);
      if (error.error && error.error.message) {
          alert(error.error.message);
      } else {
          alert('An unknown error occurred.');
      }
  }
  );
}

  //Update a record
  setUpdate(data: any) 
  {
   this.EMAIL = data.EMAIL;
   this.PHONE_NUMBER = data.PHONE_NUMBER;
   this.SALARY = data.SALARY;
   this.EMPLOYEE_ID = data.EMPLOYEE_ID;
   this.FIRST_NAME = data.FIRST_NAME;
   this.LAST_NAME = data.LAST_NAME;
  this.JOB_ID = data.JOB_ID;
  this.MANAGER_ID = data.MANAGER_ID;
  this.DEPARTMENT_ID = data.DEPARTMENT_ID;
  this.COMMISSION_PCT = data.COMMISSION_PCT;
  }

  //Update a record
updateEmployee()
{
  let bodyData = {
    "FIRST_NAME" : this.FIRST_NAME,
    "LAST_NAME" : this.LAST_NAME,
    "EMAIL" : this.EMAIL,
    "PHONE_NUMBER": this.PHONE_NUMBER,
    "HIRE_DATE": this.HIRE_DATE,
    "JOB_ID": this.JOB_ID,
    "SALARY": this.SALARY,
    "MANAGER_ID": this.MANAGER_ID,
    "DEPARTMENT_ID": this.DEPARTMENT_ID,
    "COMMISSION_PCT": this.COMMISSION_PCT // Here
  };
  
  this.http.put("http://localhost:8080/employee/update"+ "/"+ this.EMPLOYEE_ID,bodyData).subscribe((resultData: any)=>
  {
      console.log(resultData);
      alert("Employee record Updated successfully")
      this.getAllEmployee();
      this.resetForm();
    },
    (error: any) => {
      console.error(error);
      if (error.error && error.error.message) {
          alert(error.error.message);
      } else {
          alert('Ups, Try again please');
      }
  }
  );
}
 
  save()
  {
    if(this.EMPLOYEE_ID == '')
    {
        this.createEmployee();
          this.jobTouched = false;
          this.lastNameTouched = false;
          this.firstNameTouched = false;
          this.managerTouched = false;
    }
      else
      {
       this.updateEmployee();
          this.jobTouched = false;
          this.lastNameTouched = false;
          this.firstNameTouched = false;
          this.managerTouched = false;
      }       
  }

  //Delete employee
  deleteEmployee(data: any) {
    const isConfirmed = window.confirm('Are you sure you want to delete this employee?'); // Confirm the deletion
    if (isConfirmed) {
        this.http.delete("http://localhost:8080/employee/delete" + "/" + data.EMPLOYEE_ID).subscribe({
            next: (resultData: any) => {
                console.log(resultData);
                if (resultData.status) {
                    alert(resultData.message);  // Display success message from backend
                } else {
                    alert(resultData.message);  // Display error message from backend
                }
                this.resetForm();
                this.getAllEmployee();
            },
            error: (error) => {
                console.error('Error:', error);
                alert('An error occurred while deleting the employee. Please try again.');
            }
        });
    } else {
        console.log('Deletion cancelled by user.');
    }
}

    //View all Jobs
    getAllJobs()
    { 
      this.http.get("http://localhost:8080/job/")
      .subscribe((resultData: any)=>
      {
          this.isResultLoaded = true;
          console.log(resultData.data);
          this.JobArray = resultData.data;
      });
    }

    //View all Departments
    getAllDepartments()
    { 
      this.http.get("http://localhost:8080/department/")
      .subscribe((resultData: any)=>
      {
          this.isResultLoaded = true;
          console.log(resultData.data);
          this.DepartmentArray = resultData.data;
      });
    }

    // Add a new searchEmployee function
  searchEmployee() {
    this.http.get("http://localhost:8080/employee/search/" + this.SearchInput)
    .subscribe((resultData: any) => {
      console.log(resultData.data);
      this.EmployeeArray = resultData.data;
    });
  }
}

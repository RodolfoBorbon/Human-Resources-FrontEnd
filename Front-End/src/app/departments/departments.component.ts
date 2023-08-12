//app/departments/departments.component.ts

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-employee',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent {

  DepartmentArray : any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  DEPARTMENT_ID = "";
  DEPARTMENT_NAME: string ="";
  MANAGER_ID = "";
  LOCATION_ID = "";

  EmployeeArray : any[] = [];
  LocationArray : any[] = [];

  departmentNameTouched: boolean = false;
  managerIdTouched: boolean = false; 
  locationIdTouched: boolean = false;

  SearchInput: string = ''; //searchInput property

  constructor(private http: HttpClient ) 
  {
    this.getAllDepartment();
    this.getAllEmployee();
    this.getAllLocation();
  }
  ngOnInit(): void {
  }

  //View all the employee 
  getAllDepartment()
  { 
    this.http.get("http://localhost:8080/department/")
    .subscribe((resultData: any)=>
    {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.DepartmentArray = resultData.data;
    });
  }
  
  //Reset Form
resetForm() {
  this.DEPARTMENT_ID = '';
  this.DEPARTMENT_NAME = '';
  this.MANAGER_ID = '';
  this.LOCATION_ID = '';
}

//Create a record
createDepartment()
{
  let bodyData = {
    "DEPARTMENT_NAME" : this.DEPARTMENT_NAME,
    "MANAGER_ID" : this.MANAGER_ID,
    "LOCATION_ID" : this.LOCATION_ID,
  };
  this.http.post("http://localhost:8080/department/add",bodyData).subscribe((resultData: any)=>
  {
      console.log(resultData);
      alert("Department Registered Successfully")
      this.getAllDepartment();
      this.resetForm();
  });
}

  //Update a record
  setUpdate(data: any) 
  {
   this.DEPARTMENT_NAME = data.DEPARTMENT_NAME;
   this.MANAGER_ID = data.MANAGER_ID;
   this.LOCATION_ID = data.LOCATION_ID;
  }

  //Update a record
updateDepartment()
{
  let bodyData = {
    "DEPARTMENT_NAME" : this.DEPARTMENT_NAME,
    "MANAGER_ID" : this.MANAGER_ID,
    "LOCATION_ID" : this.LOCATION_ID,
  };
  
  this.http.put("http://localhost:8080/department/update"+ "/"+ this.DEPARTMENT_ID,bodyData).subscribe((resultData: any)=>
  {
      console.log(resultData);
      alert("Department Registered Updateddd")
      this.getAllDepartment();
      this.resetForm();
  });
}
 
  save()
  {
    if(this.DEPARTMENT_ID == '')
    {
        this.createDepartment();
        this.departmentNameTouched = false;
        this.managerIdTouched = false;
        this.locationIdTouched = false;
    }
      else
      {
       this.updateDepartment();
        this.departmentNameTouched = false;
        this.managerIdTouched = false;
        this.locationIdTouched = false;
      }       
  }

  //Delete a department
  deleteDepartment(data: any)
  {
    const isConfirmed = window.confirm('Are you sure you want to delete this department?');  // Confirm the deletion
    if (isConfirmed) {
    this.http.delete("http://localhost:8080/department/delete"+ "/"+ data.DEPARTMENT_ID).subscribe({
      next: (resultData: any) => {
        console.log(resultData);
        if (resultData.status) {
            alert(resultData.message);  // Display success message from backend
        } else {
            alert(resultData.message);  // Display error message from backend
        }
        this.resetForm();
        this.getAllDepartment();
    },
    error: (error) => {
        console.error('Error:', error);
        alert('An error occurred while deleting the department. Please try again.');
    }
  });
  } else {
  console.log('Deletion cancelled by user.');
  }
  }

    // Search a department
  searchDepartment() {
    this.http.get("http://localhost:8080/department/search/" + this.SearchInput)
    .subscribe((resultData: any) => {
      console.log(resultData.data);
      this.DepartmentArray = resultData.data;
    });
  }

  //View all Departments
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

  //View all locations
  getAllLocation()
  { 
    this.http.get("http://localhost:8080/location/")
    .subscribe((resultData: any)=>
    {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.LocationArray = resultData.data;
    });
  }
}



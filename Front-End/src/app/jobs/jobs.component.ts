//app/jobs/jobs.component.ts

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-employee',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent {

  JobArray : any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  JOB_ID: string ="";
  JOB_TITLE: string ="";
  MAX_SALARY = "";
  MIN_SALARY = "";

  jobTitleTouched: boolean = false;
  maxSalaryTouched: boolean = false; 
  minSalaryTouched: boolean = false;

  SearchInput: string = ''; //searchInput property

  constructor(private http: HttpClient ) 
  {
    this.getAllJob();
  }
  ngOnInit(): void {
  }

  //View all the employee 
  getAllJob()
  { 
    this.http.get("http://localhost:8080/job/")
    .subscribe((resultData: any)=>
    {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.JobArray = resultData.data;
    });
  }
  
  //Reset Form
resetForm() {
  this.JOB_ID = '';
  this.JOB_TITLE = '';
  this.MAX_SALARY = '';
  this.MIN_SALARY = '';
}

//Create a record
createJob()
{
  let bodyData = {
    "JOB_TITLE" : this.JOB_TITLE,
    "MAX_SALARY" : this.MAX_SALARY,
    "MIN_SALARY" : this.MIN_SALARY,
  };
  this.http.post("http://localhost:8080/job/add",bodyData).subscribe((resultData: any)=>
  {
      console.log(resultData);
      alert("Job Registered Successfully")
      this.getAllJob();
      this.resetForm();
  });
}

  //Update a record
  setUpdate(data: any) 
  {
   this.MAX_SALARY = data.MAX_SALARY;
   this.MIN_SALARY = data.MIN_SALARY;
   this.JOB_ID = data.JOB_ID;
   this.JOB_TITLE = data.JOB_TITLE;
  }

  //Update a record
updateEmployee()
{
  let bodyData = {
    "JOB_TITLE" : this.JOB_TITLE,
    "MAX_SALARY" : this.MAX_SALARY,
    "MIN_SALARY" : this.MIN_SALARY,
  };
  
  this.http.put("http://localhost:8080/job/update"+ "/"+ this.JOB_ID,bodyData).subscribe((resultData: any)=>
  {
      console.log(resultData);
      alert("Job Registered Updateddd")
      this.getAllJob();
      this.resetForm();
  });
}
 
  save()
  {
    if(this.JOB_ID == '')
    {
        this.createJob();
        this.jobTitleTouched = false;
        this.maxSalaryTouched = false;
        this.minSalaryTouched = false;
    }
      else
      {
       this.updateEmployee();
          this.jobTitleTouched = false;
          this.maxSalaryTouched = false;
          this.minSalaryTouched = false;
      }       
  }

  //Delete a job
  deleteJob(data: any)
  {
    const isConfirmed = window.confirm('Are you sure you want to delete this job?');  // Confirm the deletion
    if (isConfirmed) {
    this.http.delete("http://localhost:8080/job/delete"+ "/"+ data.JOB_ID).subscribe({
    next: (resultData: any) => {
      console.log(resultData);
      if (resultData.status) {
          alert(resultData.message);  // Display success message from backend
      } else {
          alert(resultData.message);  // Display error message from backend
      }
      this.resetForm();
      this.getAllJob();
  },
  error: (error) => {
      console.error('Error:', error);
      alert('An error occurred while deleting the job. Please try again.');
  }
});
} else {
console.log('Deletion cancelled by user.');
}
}

    // Search a job
  searchJob() {
    this.http.get("http://localhost:8080/job/search/" + this.SearchInput)
    .subscribe((resultData: any) => {
      console.log(resultData.data);
      this.JobArray = resultData.data;
    });
  }
}

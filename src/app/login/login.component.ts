//app/login/login.component.ts

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    username: '',
    password: ''
};

errorMessage = '';

constructor(
  private authService: AuthService,
  private router: Router,
  private snackBar: MatSnackBar // Inject MatSnackBar
) { }

loginUser() {
  this.authService.login(this.user.username, this.user.password)
      .subscribe({
          next: (res: any) => {
              console.log(res.message);
          },
          error: (err) => {
              console.error(err);

              // Check if err.error is defined and if it has a 'message' property
              let errorMessage = 'Invalid username or password, try again';
              if (err.error && err.error.message) {
                errorMessage = err.error.message;
              }
              
              // Show a message on login page using MatSnackBar
              this.snackBar.open(errorMessage, '', {
                duration: 7000, // Display duration (in milliseconds)
                //panelClass: 'error-snackbar' // Optional CSS class for styling the snackbar
              });
          }
      });
}
}


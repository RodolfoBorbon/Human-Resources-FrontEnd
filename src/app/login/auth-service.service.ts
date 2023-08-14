// app/auth-service.component.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser') as string) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.backendUrl}/login`, { username, password })
        .pipe(map(user => {
            // login successful if there's a user in the response
            if (user && user.message === 'Logged in successfully.') { 
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);

                console.log(user);  // This line logs the user details to the console
                
                // navigate to the incidents dashboard
                this.router.navigate(['/employees']);
            }
            return user;
          }),
          catchError(err => {
            console.error(err);
            let errorMsg = 'Login failed';
            if (err.error && err.error.message) {
              errorMsg = err.error.message;
            }
            return throwError(() => new Error(errorMsg)); 
          })
      );
    }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    // Redirect to the home page after logout
    this.router.navigate(['/home']);
  }

  isLoggedIn() {
    return !!this.currentUserValue;
  }

  isAuthenticated(): Promise<boolean> {
    return Promise.resolve(this.currentUserValue !== null);
  }  
}


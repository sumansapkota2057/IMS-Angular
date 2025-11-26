import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { LoginRequest, RegisterRequest } from '../model/user.model';
import { ApiResponse } from '../model/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<string | null>(this.getStoredUser());

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(request: RegisterRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<ApiResponse> {
    const credentials = btoa(`${request.username}:${request.password}`);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`
    });

    return this.http.post<ApiResponse>(`${this.apiUrl}/login`, request, { headers }).pipe(
      tap(() => {
        sessionStorage.setItem('currentUser', request.username);
        sessionStorage.setItem('credentials', credentials);
        this.currentUserSubject.next(request.username);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('credentials');
    sessionStorage.removeItem('userRoles');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('credentials');
  }

  getCurrentUser(): string | null {
    return sessionStorage.getItem('currentUser');
  }

  getCredentials(): string | null {
    return sessionStorage.getItem('credentials');
  }

  hasRole(role: string): boolean {
    const roles = sessionStorage.getItem('userRoles');
    if (!roles) return false;
    return roles.includes(role);
  }

  setUserRoles(roles: string[]): void {
    sessionStorage.setItem('userRoles', JSON.stringify(roles));
  }

  private getStoredUser(): string | null {
    return sessionStorage.getItem('currentUser');
  }
}

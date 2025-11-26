import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ApiResponse, DashboardStats } from '../model/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class Dashboard {
   private apiUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/stats`);
  }
  
}

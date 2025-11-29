import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

import { Observable } from 'rxjs';
import { PostCreateRequest, PostUpdateRequest } from '../model/post.model';
import { ApiResponse } from '../model/api-response.model';


@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/api/posts`;

  constructor(private http: HttpClient) {}

  createPost(request: PostCreateRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, request);
  }

  submitForApproval(id: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}/submit`, {});
  }

  approvePost(id: number, notes?: string): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (notes) params = params.set('notes', notes);

    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/${id}/approve`,
      {},
      { params }
    );
  }

  rejectPost(id: number, notes?: string): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (notes) params = params.set('notes', notes);

    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/${id}/reject`,
      {},
      { params }
    );
  }

  resolvePost(id: number, notes?: string): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (notes) params = params.set('notes', notes);

    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/${id}/resolve`,
      {},
      { params }
    );
  }

  updatePost(id: number, request: PostUpdateRequest): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, request);
  }

  getMyPosts(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/my-posts`);
  }

  getApprovedPosts(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/approved`);
  }

  getAllPosts(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/all`);
}


  getPostById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}

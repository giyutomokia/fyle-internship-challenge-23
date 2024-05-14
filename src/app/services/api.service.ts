import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }
  repositories: any[] = [];

  getUser(username: string): Observable<any> {
    if (!username) {
      return throwError('Username is empty.');
    }
    return this.httpClient.get(`https://api.github.com/users/${username}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user data:', error);
        return throwError('Error fetching user data. Please try again later.');
      })
    );
  }
  
  getData(): Observable<any> {
    return this.httpClient.get<any>('https://api.example.com/data').pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching data:', error);
        return throwError('Error fetching data. Please try again later.');
      })
    );
  }

  getRepos(username: string): Observable<any[]> {
    if (!username) {
      return throwError('Username is empty.');
    }
    return this.httpClient.get<any[]>(`https://api.github.com/users/${username}/repos`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching repositories:', error);
        return throwError('Error fetching repositories. Please try again later.');
      })
    );
  }
  
  // Pagination properties and methods
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  pagedRepositories: any[] = [];

  setPage(page: number){
    this.currentPage = page;
    this.getRepos('username').subscribe(
      (repos: any[]) => {
        this.pagedRepositories = repos;
      },
      error => {
        console.error('Error fetching paged repositories:', error);
      }
    );
    // Logic to fetch paged repositories based on the current page
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.setPage(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPage(this.currentPage);
    }
  }
}

import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface User {
  login: string;
  avatar_url: string;
  name: string;
  userbio: string;
  html_url: string;
}

interface Repository {
  name: string;
  description: string;
  languages_url?: string;
  languages?: string[];
  topLanguage: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  username: string = '';
  user: User | null = null;
  repositories: Repository[] = [];
  pagedRepositories: Repository[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private http: HttpClient) { }

  search() {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<User>(`https://api.github.com/users/${this.username}`)
      .subscribe(
        userData => {
          this.user = userData;
          this.loading = false;
          this.fetchRepositories();
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.errorMessage = 'User not found';
          } else {
            this.errorMessage = 'Error fetching user data. Please try again later.';
          }
          this.loading = false;
          this.user = null;
          this.repositories = [];
        }
      );
  }

  fetchRepositories() {
    this.http.get<Repository[]>(`https://api.github.com/users/${this.username}/repos`)
      .subscribe(
        reposData => {
          this.repositories = reposData;
          this.totalPages = Math.ceil(this.repositories.length / this.pageSize);
          this.setPage(1);
        },
        error => {
          this.repositories = [];
          this.loading = false;
          this.errorMessage = 'Error fetching repositories. Please try again later.';
        }
      );
  }

  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.repositories.length);
    this.pagedRepositories = this.repositories.slice(startIndex, endIndex);
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

  onPageSizeChange(event: any) {
    this.pageSize = parseInt(event?.target?.value || '10', 10);
    this.totalPages = Math.ceil(this.repositories.length / this.pageSize);
    this.setPage(1);
  }
}

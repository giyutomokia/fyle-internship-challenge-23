import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  location: string;
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

  constructor(private http: HttpClient) {}

  // Function to search for a GitHub user and their repositories
  search() {
    this.loading = true;
    this.errorMessage = '';

    // Fetch GitHub user data
    this.http.get<User>(`https://api.github.com/users/${this.username}`)
      .subscribe(
        userData => {
          this.user = userData;
          this.loading = false;
        },
        error => {
          this.user = null;
          this.repositories = [];
          this.loading = false;
          this.errorMessage = 'No user found';
        }
      );

    // Fetch repositories for the GitHub user
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
          this.errorMessage = 'Error fetching repositories';
        }
      );
  }

  // Function to set the current page of repositories
  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.repositories.length);
    this.pagedRepositories = this.repositories.slice(startIndex, endIndex);

    this.pagedRepositories.forEach(repo => {
      if (repo.languages_url) {
        this.http.get<any>(repo.languages_url).subscribe(
          data => {
            const languages: string[] = Object.keys(data);
            repo.languages = languages;
            repo.topLanguage = languages[0] || '';
          },
          error => {
            console.error('Error fetching languages:', error);
            repo.languages = [];
            repo.topLanguage = '';
          }
        );
      } else {
        repo.languages = [];
        repo.topLanguage = '';
      }
    });
  }

  // Function to navigate to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }

  // Function to navigate to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  // Function to handle page size change
  onPageSizeChange(event: any) {
    this.pageSize = parseInt(event?.target?.value || '10', 10);
    this.totalPages = Math.ceil(this.repositories.length / this.pageSize);
    this.setPage(1);
  }
}

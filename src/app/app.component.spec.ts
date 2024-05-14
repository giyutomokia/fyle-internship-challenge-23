import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [AppComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should search for a user and repositories when search() is called', () => {
    spyOn(component, 'search');
    const button = fixture.nativeElement.querySelector('.search-button');
    button.click();
    expect(component.search).toHaveBeenCalled();
  });

  it('should fetch user data and repositories when search() is called', fakeAsync(() => {
    const userData = { login: 'testuser', avatar_url: 'testavatar', name: 'Test User', userbio: 'Test Bio', html_url: 'testurl' };
    const repoData = [
      { name: 'Repo1', description: 'Description1', topLanguage: 'TypeScript' }, 
      { name: 'Repo2', description: 'Description2', topLanguage: 'JavaScript' }
    ];
    
    component.username = 'testuser';
    component.search();

    const userRequest = httpMock.expectOne(`https://api.github.com/users/testuser`);
    expect(userRequest.request.method).toBe('GET');
    userRequest.flush(userData);

    const repoRequest = httpMock.expectOne(`https://api.github.com/users/testuser/repos`);
    expect(repoRequest.request.method).toBe('GET');
    repoRequest.flush(repoData);

    tick();

    expect(component.user).toEqual(userData);
    expect(component.repositories).toEqual(repoData);
  }));

  it('should set the current page of repositories when setPage() is called', () => {
    const repos = [
      { name: 'Repo1', description: 'Description1', topLanguage: 'TypeScript', languages: ['TypeScript'] },
      { name: 'Repo2', description: 'Description2', topLanguage: 'JavaScript', languages: ['JavaScript'] },
    ];
    component.repositories = repos;

    component.setPage(1);

    expect(component.pagedRepositories.length).toBe(2);
    expect(component.pagedRepositories[0].name).toBe('Repo1');
    expect(component.pagedRepositories[1].name).toBe('Repo2');
  });
  
 it('should navigate to the next page when nextPage() is called', () => {
    component.currentPage = 1;
    component.totalPages = 3;
    spyOn(component, 'setPage');
  
    component.nextPage();
  
    expect(component.currentPage).toBe(2);
    expect(component.setPage).toHaveBeenCalledWith(2);
  });
  
  it('should not navigate to the next page if already on the last page when nextPage() is called', () => {
    component.currentPage = 3;
    component.totalPages = 3;
    spyOn(component, 'setPage');
  
    component.nextPage();
  
    expect(component.currentPage).toBe(3);
    expect(component.setPage).not.toHaveBeenCalled();
  });
  
  it('should navigate to the previous page when previousPage() is called', () => {
    component.currentPage = 2;
    spyOn(component, 'setPage');
  
    component.previousPage();
  
    expect(component.currentPage).toBe(1);
    expect(component.setPage).toHaveBeenCalledWith(1);
  });
  
  it('should not navigate to the previous page if already on the first page when previousPage() is called', () => {
    component.currentPage = 1;
    spyOn(component, 'setPage');
  
    component.previousPage();
  
    expect(component.currentPage).toBe(1);
    expect(component.setPage).not.toHaveBeenCalled();
  });
  
  it('should update page size and recalculate total pages when onPageSizeChange() is called', () => {
    spyOn(component, 'setPage');
    const event = { target: { value: '20' } };
  
    component.repositories = [
      { name: 'Repo1', description: 'Description1', topLanguage: 'TypeScript', languages: ['TypeScript'] },
      { name: 'Repo2', description: 'Description2', topLanguage: 'JavaScript', languages: ['JavaScript'] },
    ];
    component.totalPages = 1;
  
    component.onPageSizeChange(event);
  
    expect(component.pageSize).toBe(20);
    expect(component.totalPages).toBe(1);
    expect(component.setPage).toHaveBeenCalledWith(1);
  });
  it('should navigate to the previous page when previousPage() is called', () => {
    component.currentPage = 2;
    component.totalPages = 3;
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });
  
  it('should not navigate to the previous page when on the first page', () => {
    component.currentPage = 1;
    component.totalPages = 3;
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });
  
  it('should navigate to the next page when nextPage() is called', () => {
    component.currentPage = 2;
    component.totalPages = 3;
    component.nextPage();
    expect(component.currentPage).toBe(3);
  });
  
  it('should not navigate to the next page when on the last page', () => {
    component.currentPage = 3;
    component.totalPages = 3;
    component.nextPage();
    expect(component.currentPage).toBe(3);
  });
  it('should update the page size and reset to the first page when onPageSizeChange() is called', () => {
    component.repositories = [
      { name: 'Repo1', description: 'Description1', topLanguage: 'TypeScript' },
      { name: 'Repo2', description: 'Description2', topLanguage: 'JavaScript' },
      { name: 'Repo3', description: 'Description3', topLanguage: 'Python' }
    ];
    const event = { target: { value: '2' } };
    component.onPageSizeChange(event);
    expect(component.pageSize).toBe(2);
    expect(component.currentPage).toBe(1);
    expect(component.totalPages).toBe(2);
  });
  it('should navigate to the next page when nextPage() is called', () => {
    component.currentPage = 1;
    component.totalPages = 3; // Assuming there are 3 total pages
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });
  
  it('should not navigate to the next page if already on the last page', () => {
    component.currentPage = 3;
    component.totalPages = 3; // Assuming there are 3 total pages
    component.nextPage();
    expect(component.currentPage).toBe(3);
  });
  
  it('should navigate to the previous page when previousPage() is called', () => {
    component.currentPage = 2;
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });
  
  it('should not navigate to the previous page if already on the first page', () => {
    component.currentPage = 1;
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });
  
  it('should update page size and recalculate total pages when onPageSizeChange() is called', () => {
    const event = { target: { value: '15' } }; // Assuming the user selects a page size of 15
    component.repositories = Array(30).fill({}); // Assuming there are 30 repositories
    component.onPageSizeChange(event);
    expect(component.pageSize).toBe(15);
    expect(component.totalPages).toBe(2);
  });
  it('should handle page size change and update paged repositories accordingly', () => {
    const repos = [
      { name: 'Repo1', description: 'Description1', topLanguage: 'TypeScript', languages: ['TypeScript'] },
      { name: 'Repo2', description: 'Description2', topLanguage: 'JavaScript', languages: ['JavaScript'] },
      { name: 'Repo3', description: 'Description3', topLanguage: 'Python', languages: ['Python'] }
    ];
    component.repositories = repos;
    component.onPageSizeChange({ target: { value: '2' }});
    expect(component.pageSize).toBe(2);
    expect(component.totalPages).toBe(2);
    expect(component.pagedRepositories.length).toBe(2);
  });

  it('should handle page size change and update paged repositories accordingly', () => {
    const repos = [
      { name: 'Repo1', description: 'Description1', topLanguage: 'TypeScript', languages: ['TypeScript'] },
      { name: 'Repo2', description: 'Description2', topLanguage: 'JavaScript', languages: ['JavaScript'] },
      { name: 'Repo3', description: 'Description3', topLanguage: 'Python', languages: ['Python'] }
    ];
    component.repositories = repos;
    component.onPageSizeChange({ target: { value: '2' }});
    expect(component.pageSize).toBe(2);
    expect(component.totalPages).toBe(2);
    expect(component.pagedRepositories.length).toBe(2);
  });

  

  it('should fetch user data and repositories when search() is called', fakeAsync(() => {
    const userData = { login: 'testuser', avatar_url: 'testavatar', name: 'Test User', userbio: 'Test Bio', html_url: 'testurl' };
    const repoData = [
      { name: 'Repo1', description: 'Description1', topLanguage: 'TypeScript' }, 
      { name: 'Repo2', description: 'Description2', topLanguage: 'JavaScript' }
    ];
    
    component.username = 'testuser';
    component.search();

    const userRequest = httpMock.expectOne(`https://api.github.com/users/testuser`);
    expect(userRequest.request.method).toBe('GET');
    userRequest.flush(userData);

    const repoRequest = httpMock.expectOne(`https://api.github.com/users/testuser/repos`);
    expect(repoRequest.request.method).toBe('GET');
    repoRequest.flush(repoData);

    tick();

    expect(component.user).toEqual(userData);
    expect(component.repositories).toEqual(repoData);
  }));
  
 
  it('should search for a user and repositories when search() is called', () => {
    spyOn(component, 'search');
    const button = fixture.nativeElement.querySelector('.search-button');
    button.click();
    expect(component.search).toHaveBeenCalled();
  });

  it('should fetch user data and repositories when search() is called', fakeAsync(() => {
    const userData = { login: 'testuser', avatar_url: 'testavatar', name: 'Test User', userbio: 'Test Bio', html_url: 'testurl' };
    const repoData = [
      { name: 'Repo1', description: 'Description1', topLanguage: 'TypeScript' }, 
      { name: 'Repo2', description: 'Description2', topLanguage: 'JavaScript' }
    ];
    
    component.username = 'testuser';
    component.search();

    const userRequest = httpMock.expectOne(`https://api.github.com/users/testuser`);
    expect(userRequest.request.method).toBe('GET');
    userRequest.flush(userData);

    const repoRequest = httpMock.expectOne(`https://api.github.com/users/testuser/repos`);
    expect(repoRequest.request.method).toBe('GET');
    repoRequest.flush(repoData);

    tick();

    expect(component.user).toEqual(userData);
    expect(component.repositories).toEqual(repoData);
  }));

  it('should set the current page of repositories when setPage() is called', () => {
    const repos = [
      { name: 'Repo1', description: 'Description1', topLanguage: 'TypeScript', languages: ['TypeScript'] },
      { name: 'Repo2', description: 'Description2', topLanguage: 'JavaScript', languages: ['JavaScript'] },
    ];
    component.repositories = repos;

    component.setPage(1);

    expect(component.pagedRepositories.length).toBe(2);
    expect(component.pagedRepositories[0].name).toBe('Repo1');
    expect(component.pagedRepositories[1].name).toBe('Repo2');
  });
  
it('should handle different page sizes', () => {
    const repos = [
      { name: 'Repo1', description: 'Description1', topLanguage: 'TypeScript' },
      { name: 'Repo2', description: 'Description2', topLanguage: 'JavaScript' },
      { name: 'Repo3', description: 'Description3', topLanguage: 'Python' }
    ];
    component.repositories = repos;
    component.onPageSizeChange({ target: { value: '2' } });
    expect(component.pageSize).toBe(2);
    expect(component.currentPage).toBe(1);
    expect(component.totalPages).toBe(2);
  });
  it('should handle empty repositories', fakeAsync(() => {
    component.username = 'testuser';
    component.search();
    const userRequest = httpMock.expectOne(`https://api.github.com/users/testuser`);
    userRequest.flush({ login: 'testuser', avatar_url: 'testavatar', name: 'Test User', html_url: 'testurl' });
    const repoRequest = httpMock.expectOne(`https://api.github.com/users/testuser/repos`);
    repoRequest.flush([]);
    tick();
    expect(component.repositories.length).toBe(0);
    expect(component.totalPages).toBe(1); // Assuming total pages is 1 when no repositories are returned
}));

it('should handle empty response when retrieving user data', fakeAsync(() => {
    component.username = 'testuser';
    component.search();
    const userRequest = httpMock.expectOne(`https://api.github.com/users/testuser`);
    userRequest.flush(null);
    tick();
    expect(component.user).toBeNull();
    expect(component.errorMessage).toBe('Error fetching user data. Please try again later.');
}));

it('should handle errors when searching for user data', fakeAsync(() => {
    spyOn(console, 'error');
    component.username = 'nonexistentuser';
    component.search();
    const userRequest = httpMock.expectOne(`https://api.github.com/users/nonexistentuser`);
    userRequest.error(new ErrorEvent('Network Error'));
    tick();
    expect(console.error).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.user).toBeNull();
    expect(component.errorMessage).toBe('Error fetching user data. Please try again later.');
}));

it('should handle errors when fetching repositories', fakeAsync(() => {
    spyOn(console, 'error');
    component.username = 'testuser';
    component.search();
    const userRequest = httpMock.expectOne(`https://api.github.com/users/testuser`);
    userRequest.flush({ login: 'testuser', avatar_url: 'testavatar', name: 'Test User', html_url: 'testurl' });
    const repoRequest = httpMock.expectOne(`https://api.github.com/users/testuser/repos`);
    repoRequest.error(new ErrorEvent('Network Error'));
    tick();
    expect(console.error).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.user).toBeTruthy();
    expect(component.errorMessage).toBe('Error fetching repositories. Please try again later.');
}));

  
// Inside your test case

  
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve user data from API via GET', () => {
    const testData = { name: 'TestUser' };
    const username = 'testuser';
    service.getUser(username).subscribe(data => {
      expect(data).toEqual(testData);
    });
    const req = httpMock.expectOne(`https://api.github.com/users/${username}`);
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

  it('should handle HTTP errors when retrieving user data', () => {
    const username = 'testuser';
    service.getUser(username).subscribe(
      () => fail('Expected the request to fail'),
      error => {
        expect(error).toBeTruthy();
        expect(error).toBe('Error fetching user data. Please try again later.');
      }
    );
    const req = httpMock.expectOne(`https://api.github.com/users/${username}`);
    req.error(new ErrorEvent('Network Error'));
  });

  it('should handle empty response when retrieving user data', () => {
    const username = 'testuser';
    service.getUser(username).subscribe(
      data => {
        expect(data).toBeNull();
      },
      () => fail('Expected the request to succeed')
    );
    const req = httpMock.expectOne(`https://api.github.com/users/${username}`);
    req.flush(null);
  });

  it('should handle empty username when retrieving user data', () => {
    const username = '';
    service.getUser(username).subscribe(
      () => fail('Expected the request to fail'),
      error => {
        expect(error).toBeTruthy();
        expect(error).toBe('Username is empty.');
      }
    );
  });

  it('should retrieve additional data from API via GET', () => {
    const testData = { id: 123, name: 'Test Data' };
    service.getData().subscribe(data => {
      expect(data).toEqual(testData);
    });
    const req = httpMock.expectOne('https://api.example.com/data');
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

  it('should handle HTTP errors when retrieving additional data', () => {
    service.getData().subscribe(
      () => fail('Expected the request to fail'),
      error => {
        expect(error).toBeTruthy();
        expect(error).toBe('Error fetching data. Please try again later.');
      }
    );
    const req = httpMock.expectOne('https://api.example.com/data');
    req.error(new ErrorEvent('Network Error'));
  });

  it('should handle empty response when retrieving additional data', () => {
    service.getData().subscribe(
      data => {
        expect(data).toEqual([]);
      },
      () => fail('Expected the request to succeed')
    );
    const req = httpMock.expectOne('https://api.example.com/data');
    req.flush([]); // Flush an empty array to simulate an empty response
  });

  it('should retrieve user repositories from API via GET', () => {
    const testData = [{ name: 'Repo1' }, { name: 'Repo2' }];
    const username = 'testuser';
    service.getRepos(username).subscribe(data => {
      expect(data).toEqual(testData);
    });
    const req = httpMock.expectOne(`https://api.github.com/users/${username}/repos`);
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

  it('should handle HTTP errors when retrieving user repositories', () => {
    const username = 'testuser';
    service.getRepos(username).subscribe(
      () => fail('Expected the request to fail'),
      error => {
        expect(error).toBeTruthy();
        expect(error).toBe('Error fetching repositories. Please try again later.');
      }
    );
    const req = httpMock.expectOne(`https://api.github.com/users/${username}/repos`);
    req.error(new ErrorEvent('Network Error'));
  });

  it('should handle empty response when retrieving user repositories', () => {
    const username = 'testuser';
    service.getRepos(username).subscribe(
      data => {
        expect(data).toEqual([]);
      },
      error => fail('Expected the request to succeed')
    );
    const req = httpMock.expectOne(`https://api.github.com/users/${username}/repos`);
    req.flush([]);
  });

  it('should handle invalid URL when retrieving user repositories', () => {
    const username = 'testuser';
    spyOn(console, 'error');
    service.getRepos(username).subscribe(
      () => fail('Expected the request to fail'),
      error => {
        expect(console.error).toHaveBeenCalledWith('Error fetching repositories:', jasmine.any(Object));
        expect(error).toBeTruthy();
        expect(error).toBe('Error fetching repositories. Please try again later.');
      }
    );
    const req = httpMock.expectOne(`https://api.github.com/users/${username}/repos`);
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('should not move to next page if already on last page', () => {
    service.currentPage = 3;
    service.totalPages = 3;
    service.nextPage();
    expect(service.currentPage).toBe(3);
  });

  it('should not move to previous page if already on first page', () => {
    service.currentPage = 1;
    service.previousPage();
    expect(service.currentPage).toBe(1);
  });

  it('should not move to next page if total pages is zero', () => {
    service.currentPage = 0;
    service.totalPages = 0;
    service.nextPage();
    expect(service.currentPage).toBe(0);
  });

  it('should not move to previous page if total pages is zero', () => {
    service.currentPage = 0;
    service.totalPages = 0;
    service.previousPage();
    expect(service.currentPage).toBe(0);
  });
  
  
  // Add more test cases for error handling, UI behavior, and functionality as needed
  
});

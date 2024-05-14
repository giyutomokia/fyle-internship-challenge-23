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
});

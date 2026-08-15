import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('stores the authenticated session after login', () => {
    service.login('mentor@example.com', 'secret').subscribe();
    const request = http.expectOne('/api/v1/auth/login');
    expect(request.request.method).toBe('POST');
    request.flush({ token: 'jwt-token', email: 'mentor@example.com' });
    expect(service.authenticated()).toBe(true);
    expect(service.token()).toBe('jwt-token');
    expect(sessionStorage.getItem('dev-mentor.token')).toBe('jwt-token');
  });

  it('clears the current session on logout', () => {
    sessionStorage.setItem('dev-mentor.token', 'jwt-token');
    service.logout();
    expect(service.authenticated()).toBe(false);
    expect(sessionStorage.getItem('dev-mentor.token')).toBeNull();
  });
});

import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../models/api.models';

const TOKEN_KEY = 'dev-mentor.token';
const EMAIL_KEY = 'dev-mentor.email';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenState = signal(sessionStorage.getItem(TOKEN_KEY));
  readonly email = signal(sessionStorage.getItem(EMAIL_KEY) ?? '');
  readonly authenticated = computed(() => Boolean(this.tokenState()));

  constructor(private readonly http: HttpClient) {}

  login(email: string, senha: string) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, senha }).pipe(
      tap(response => {
        sessionStorage.setItem(TOKEN_KEY, response.token);
        sessionStorage.setItem(EMAIL_KEY, response.email);
        this.tokenState.set(response.token);
        this.email.set(response.email);
      }),
    );
  }

  token() { return this.tokenState(); }

  logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EMAIL_KEY);
    this.tokenState.set(null);
    this.email.set('');
  }
}

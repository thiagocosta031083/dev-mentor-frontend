import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { errorMessage } from '../../shared/error-message';

@Component({ selector: 'app-login', imports: [ReactiveFormsModule], templateUrl: './login.html', styleUrl: './login.scss' })
export class Login {
  readonly loading = signal(false);
  readonly error = signal('');
  readonly showPassword = signal(false);
  readonly form;

  constructor(private readonly fb: FormBuilder, private readonly auth: AuthService, private readonly router: Router, private readonly route: ActivatedRoute) {
    this.form = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]], senha: ['', Validators.required] });
    if (auth.authenticated()) void router.navigate(['/dashboard']);
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.error.set(''); this.loading.set(true);
    const { email, senha } = this.form.getRawValue();
    this.auth.login(email, senha).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => void this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard'),
      error: error => this.error.set(errorMessage(error)),
    });
  }
}

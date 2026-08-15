import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  readonly menuOpen = signal(false);
  readonly links = [
    { route: '/dashboard', icon: '▦', label: 'Dashboard' },
    { route: '/tecnologias', icon: '⌘', label: 'Tecnologias' },
    { route: '/conteudos', icon: '☷', label: 'Conteúdos' },
    { route: '/planos', icon: '◫', label: 'Planos de estudo' },
    { route: '/registros', icon: '◷', label: 'Registros' },
    { route: '/projetos', icon: '◇', label: 'Projetos' },
  ];

  constructor(readonly auth: AuthService, private readonly router: Router) {}

  logout() {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { DashboardData, Tecnologia } from '../../models/api.models';
import { errorMessage } from '../../shared/error-message';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  readonly technologies = signal<Tecnologia[]>([]);
  readonly data = signal<DashboardData | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  selectedId: number | null = null;
  constructor(private readonly api: ApiService) {}
  ngOnInit() {
    this.api.listarTecnologias().subscribe({
      next: (items) => {
        this.technologies.set(items);
        const first = items.find((t) => t.status === 'ATIVA') ?? items[0];
        this.selectedId = first?.id ?? null;
        if (first) {
          this.load();
        } else {
          this.loading.set(false);
        }
      },
      error: (e) => {
        this.loading.set(false);
        this.error.set(errorMessage(e));
      },
    });
  }
  load() {
    if (!this.selectedId) return;
    this.loading.set(true);
    this.error.set('');
    this.api
      .dashboard(this.selectedId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.data.set(data),
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
  statusLabel(status: string) {
    return status.replaceAll('_', ' ');
  }
  statusClass(status: string) {
    return status === 'ACIMA_DO_ESPERADO'
      ? 'success'
      : status === 'ABAIXO_DO_ESPERADO'
        ? 'danger'
        : 'info';
  }
}

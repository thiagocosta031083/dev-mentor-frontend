import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Tecnologia, TecnologiaRequest, TipoTecnologia } from '../../models/api.models';
import { errorMessage } from '../../shared/error-message';

@Component({
  selector: 'app-tecnologias',
  imports: [ReactiveFormsModule],
  templateUrl: './tecnologias.html',
})
export class Tecnologias implements OnInit {
  readonly items = signal<Tecnologia[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly formOpen = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly tipos: TipoTecnologia[] = ['TECNOLOGIA', 'DISCIPLINA'];
  readonly form;
  constructor(
    private readonly api: ApiService,
    private readonly fb: FormBuilder
  ) {
    this.form = fb.nonNullable.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      tipo: ['TECNOLOGIA' as TipoTecnologia, Validators.required],
      descricao: [''],
      cargaHorariaPlanejada: [40, [Validators.required, Validators.min(0.1)]],
    });
  }
  ngOnInit() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.api
      .listarTecnologias()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.items.set(data),
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
  newItem() {
    this.editingId.set(null);
    this.form.reset({ nome: '', tipo: 'TECNOLOGIA', descricao: '', cargaHorariaPlanejada: 40 });
    this.formOpen.set(true);
  }
  edit(item: Tecnologia) {
    this.editingId.set(item.id);
    this.form.reset({
      nome: item.nome,
      tipo: item.tipo,
      descricao: item.descricao ?? '',
      cargaHorariaPlanejada: item.cargaHorariaPlanejada,
    });
    this.formOpen.set(true);
  }
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set('');
    const body = this.form.getRawValue() as TecnologiaRequest;
    const id = this.editingId();
    const request = id ? this.api.atualizarTecnologia(id, body) : this.api.criarTecnologia(body);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.formOpen.set(false);
        this.load();
      },
      error: (e) => this.error.set(errorMessage(e)),
    });
  }
  toggle(item: Tecnologia) {
    this.api
      .alterarStatusTecnologia(item.id, item.status !== 'ATIVA')
      .subscribe({ next: () => this.load(), error: (e) => this.error.set(errorMessage(e)) });
  }
  label(value: string) {
    return value.replaceAll('_', ' ');
  }
}

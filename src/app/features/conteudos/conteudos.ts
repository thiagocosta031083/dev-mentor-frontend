import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import {
  Conteudo,
  ConteudoRequest,
  NivelDominio,
  Tecnologia,
  TipoConteudo,
} from '../../models/api.models';
import { errorMessage } from '../../shared/error-message';

@Component({
  selector: 'app-conteudos',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './conteudos.html',
})
export class Conteudos implements OnInit {
  readonly technologies = signal<Tecnologia[]>([]);
  readonly items = signal<Conteudo[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly formOpen = signal(false);
  readonly editingId = signal<number | null>(null);
  selectedId: number | null = null;
  readonly tipos: TipoConteudo[] = ['CONCEITO', 'PRATICA', 'REVISAO'];
  readonly niveis: NivelDominio[] = ['NIVEL_1', 'NIVEL_2', 'NIVEL_3', 'NIVEL_4'];
  readonly form;
  constructor(
    private readonly api: ApiService,
    fb: FormBuilder
  ) {
    this.form = fb.nonNullable.group({
      titulo: ['', [Validators.required, Validators.maxLength(150)]],
      tipo: ['CONCEITO' as TipoConteudo, Validators.required],
      peso: [1, [Validators.required, Validators.min(1), Validators.max(3)]],
    });
  }
  ngOnInit() {
    this.api.listarTecnologias().subscribe({
      next: (techs) => {
        this.technologies.set(techs);
        this.selectedId = techs[0]?.id ?? null;
        if (this.selectedId) {
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
    this.api
      .listarConteudos(this.selectedId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.items.set(data),
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
  newItem() {
    if (!this.selectedId) return;
    this.editingId.set(null);
    this.form.reset({ titulo: '', tipo: 'CONCEITO', peso: 1 });
    this.formOpen.set(true);
  }
  edit(item: Conteudo) {
    this.editingId.set(item.id);
    this.form.reset({ titulo: item.titulo, tipo: item.tipo, peso: item.peso });
    this.formOpen.set(true);
  }
  save() {
    if (this.form.invalid || !this.selectedId) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const body: ConteudoRequest = { tecnologiaId: this.selectedId, ...this.form.getRawValue() };
    const id = this.editingId();
    const request = id ? this.api.atualizarConteudo(id, body) : this.api.criarConteudo(body);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.formOpen.set(false);
        this.load();
      },
      error: (e) => this.error.set(errorMessage(e)),
    });
  }
  start(item: Conteudo) {
    this.api
      .iniciarConteudo(item.id)
      .subscribe({ next: () => this.load(), error: (e) => this.error.set(errorMessage(e)) });
  }
  conclude(item: Conteudo) {
    const level = prompt(
      'Nível de domínio: NIVEL_1, NIVEL_2, NIVEL_3 ou NIVEL_4',
      item.nivelDominio ?? 'NIVEL_1'
    ) as NivelDominio | null;
    if (!level || !this.niveis.includes(level)) return;
    this.api
      .concluirConteudo(item.id, level)
      .subscribe({ next: () => this.load(), error: (e) => this.error.set(errorMessage(e)) });
  }
  label(value: string | null) {
    return value?.replaceAll('_', ' ') ?? '—';
  }
  badge(status: string) {
    return status === 'CONCLUIDO' ? 'success' : status === 'EM_ANDAMENTO' ? 'info' : '';
  }
}

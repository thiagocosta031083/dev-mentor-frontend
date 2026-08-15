import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Conteudo, Registro, RegistroRequest, Tecnologia, TipoEstudo } from '../../models/api.models';
import { errorMessage } from '../../shared/error-message';

@Component({ selector: 'app-registros', imports: [FormsModule, ReactiveFormsModule, DatePipe], templateUrl: './registros.html' })
export class Registros implements OnInit {
  readonly today = new Date().toISOString().slice(0, 10);
  readonly technologies = signal<Tecnologia[]>([]); readonly contents = signal<Conteudo[]>([]); readonly items = signal<Registro[]>([]); readonly loading = signal(true); readonly saving = signal(false); readonly error = signal(''); readonly formOpen = signal(false); selectedId: number | null = null; readonly tipos: TipoEstudo[] = ['AULA','PRATICA','REVISAO']; readonly form;
  constructor(private readonly api: ApiService, fb: FormBuilder) { this.form = fb.nonNullable.group({ conteudoId: [null as number | null], data: [this.today, Validators.required], tipo: ['PRATICA' as TipoEstudo, Validators.required], tempoMinutos: [60, [Validators.required, Validators.min(1)]], observacoes: [''] }); }
  ngOnInit() { this.api.listarTecnologias().subscribe({ next: t => { this.technologies.set(t); this.selectedId = t[0]?.id ?? null; this.selectedId ? this.load() : this.loading.set(false); }, error: e => { this.loading.set(false); this.error.set(errorMessage(e)); } }); }
  load() { if (!this.selectedId) return; this.loading.set(true); this.formOpen.set(false); this.api.listarConteudos(this.selectedId).subscribe({ next: c => this.contents.set(c), error: e => this.error.set(errorMessage(e)) }); this.api.listarRegistros(this.selectedId).pipe(finalize(() => this.loading.set(false))).subscribe({ next: r => this.items.set(r), error: e => this.error.set(errorMessage(e)) }); }
  open() { this.form.reset({ conteudoId: null, data: this.today, tipo: 'PRATICA', tempoMinutos: 60, observacoes: '' }); this.formOpen.set(true); }
  save() { if (this.form.invalid || !this.selectedId) { this.form.markAllAsTouched(); return; } this.saving.set(true); const raw = this.form.getRawValue(); const body: RegistroRequest = { tecnologiaId: this.selectedId, conteudoId: raw.conteudoId ? Number(raw.conteudoId) : null, data: raw.data, tipo: raw.tipo, tempoMinutos: raw.tempoMinutos, observacoes: raw.observacoes }; this.api.criarRegistro(body).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => { this.formOpen.set(false); this.load(); }, error: e => this.error.set(errorMessage(e)) }); }
  contentName(id: number | null) { return this.contents().find(c => c.id === id)?.titulo ?? 'Estudo geral'; }
  label(v: string) { return v.replaceAll('_',' '); }
}

import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Plano, PlanoRequest, Tecnologia } from '../../models/api.models';
import { errorMessage } from '../../shared/error-message';

@Component({ selector: 'app-planos', imports: [FormsModule, ReactiveFormsModule, DatePipe], templateUrl: './planos.html' })
export class Planos implements OnInit {
  readonly technologies = signal<Tecnologia[]>([]); readonly items = signal<Plano[]>([]); readonly loading = signal(true); readonly saving = signal(false); readonly error = signal(''); readonly formOpen = signal(false); readonly editingId = signal<number | null>(null); selectedId: number | null = null; readonly form;
  constructor(private readonly api: ApiService, fb: FormBuilder) { this.form = fb.nonNullable.group({ dataInicio: ['', Validators.required], dataFim: ['', Validators.required], horasPlanejadasTotais: [40, [Validators.required, Validators.min(.1)]], horasSemanais: [5, [Validators.required, Validators.min(.1)]], observacao: [''] }); }
  ngOnInit() { this.api.listarTecnologias().subscribe({ next: t => { this.technologies.set(t); this.selectedId = t[0]?.id ?? null; this.selectedId ? this.load() : this.loading.set(false); }, error: e => { this.loading.set(false); this.error.set(errorMessage(e)); } }); }
  load() { if (!this.selectedId) return; this.loading.set(true); this.api.listarPlanos(this.selectedId).pipe(finalize(() => this.loading.set(false))).subscribe({ next: d => this.items.set(d), error: e => this.error.set(errorMessage(e)) }); }
  newItem() { const today = new Date().toISOString().slice(0,10); this.editingId.set(null); this.form.reset({ dataInicio: today, dataFim: today, horasPlanejadasTotais: 40, horasSemanais: 5, observacao: '' }); this.formOpen.set(true); }
  edit(p: Plano) { this.editingId.set(p.id); this.form.reset({ dataInicio: p.dataInicio, dataFim: p.dataFim, horasPlanejadasTotais: p.horasPlanejadasTotais, horasSemanais: p.horasSemanais, observacao: p.observacao ?? '' }); this.formOpen.set(true); }
  save() { if (this.form.invalid || !this.selectedId) { this.form.markAllAsTouched(); return; } const raw = this.form.getRawValue(); if (raw.dataFim < raw.dataInicio) { this.error.set('A data final deve ser igual ou posterior à data inicial.'); return; } this.saving.set(true); const body: PlanoRequest = { tecnologiaId: this.selectedId, ...raw }; const id = this.editingId(); const req = id ? this.api.atualizarPlano(id, body) : this.api.criarPlano(body); req.pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => { this.formOpen.set(false); this.load(); }, error: e => this.error.set(errorMessage(e)) }); }
}

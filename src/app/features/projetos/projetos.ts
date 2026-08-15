import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Projeto, ProjetoRequest, StatusProjeto, Tecnologia } from '../../models/api.models';
import { errorMessage } from '../../shared/error-message';

@Component({ selector: 'app-projetos', imports: [ReactiveFormsModule], templateUrl: './projetos.html', styleUrl: './projetos.scss' })
export class Projetos implements OnInit {
  readonly technologies = signal<Tecnologia[]>([]); readonly items = signal<Projeto[]>([]); readonly loading = signal(true); readonly saving = signal(false); readonly error = signal(''); readonly formOpen = signal(false); readonly editingId = signal<number | null>(null); readonly statuses: StatusProjeto[] = ['IDEIA','EM_ANDAMENTO','CONCLUIDO']; readonly form;
  constructor(private readonly api: ApiService, fb: FormBuilder) { this.form = fb.nonNullable.group({ nome: ['', [Validators.required, Validators.maxLength(150)]], stack: ['', [Validators.required, Validators.maxLength(200)]], status: ['IDEIA' as StatusProjeto, Validators.required], proximoPasso: [''], tecnologiaId: [null as number | null] }); }
  ngOnInit() { this.api.listarTecnologias().subscribe({ next: t => this.technologies.set(t) }); this.load(); }
  load() { this.loading.set(true); this.api.listarProjetos().pipe(finalize(() => this.loading.set(false))).subscribe({ next: p => this.items.set(p), error: e => this.error.set(errorMessage(e)) }); }
  open() { this.editingId.set(null); this.form.reset({ nome:'',stack:'',status:'IDEIA',proximoPasso:'',tecnologiaId:null }); this.formOpen.set(true); }
  edit(p: Projeto) { this.editingId.set(p.id); this.form.reset({ nome:p.nome,stack:p.stack,status:p.status,proximoPasso:p.proximoPasso??'',tecnologiaId:p.tecnologiaId }); this.formOpen.set(true); }
  save() { if(this.form.invalid){this.form.markAllAsTouched();return;} this.saving.set(true); const raw=this.form.getRawValue(); const body:ProjetoRequest={...raw,tecnologiaId:raw.tecnologiaId?Number(raw.tecnologiaId):null}; const id=this.editingId(); const req=id?this.api.atualizarProjeto(id,body):this.api.criarProjeto(body); req.pipe(finalize(()=>this.saving.set(false))).subscribe({next:()=>{this.formOpen.set(false);this.load();},error:e=>this.error.set(errorMessage(e))}); }
  label(v:string){return v.replaceAll('_',' ');} techName(id:number|null){return this.technologies().find(t=>t.id===id)?.nome??'Sem vínculo';} badge(s:string){return s==='CONCLUIDO'?'success':s==='EM_ANDAMENTO'?'info':'warning';}
}

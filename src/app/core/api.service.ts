import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  Conteudo,
  ConteudoRequest,
  DashboardData,
  NivelDominio,
  Plano,
  PlanoRequest,
  Projeto,
  ProjetoRequest,
  Registro,
  RegistroRequest,
  Tecnologia,
  TecnologiaRequest,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.apiUrl;
  constructor(private readonly http: HttpClient) {}

  listarTecnologias() {
    return this.http.get<Tecnologia[]>(`${this.base}/tecnologias`);
  }
  criarTecnologia(body: TecnologiaRequest) {
    return this.http.post<Tecnologia>(`${this.base}/tecnologias`, body);
  }
  atualizarTecnologia(id: number, body: TecnologiaRequest) {
    return this.http.put<Tecnologia>(`${this.base}/tecnologias/${id}`, body);
  }
  alterarStatusTecnologia(id: number, ativa: boolean) {
    return this.http.put<Tecnologia>(
      `${this.base}/tecnologias/${id}/${ativa ? 'ativar' : 'inativar'}`,
      {}
    );
  }

  listarConteudos(tecnologiaId: number) {
    return this.http.get<Conteudo[]>(`${this.base}/conteudos/tecnologia/${tecnologiaId}`);
  }
  criarConteudo(body: ConteudoRequest) {
    return this.http.post<Conteudo>(`${this.base}/conteudos`, body);
  }
  atualizarConteudo(id: number, body: ConteudoRequest) {
    return this.http.put<Conteudo>(`${this.base}/conteudos/${id}`, body);
  }
  iniciarConteudo(id: number) {
    return this.http.put<Conteudo>(`${this.base}/conteudos/${id}/iniciar`, {});
  }
  concluirConteudo(id: number, nivelDominio: NivelDominio) {
    return this.http.put<Conteudo>(`${this.base}/conteudos/${id}/concluir`, { nivelDominio });
  }

  listarPlanos(tecnologiaId: number) {
    return this.http.get<Plano[]>(`${this.base}/planos/tecnologia/${tecnologiaId}`);
  }
  criarPlano(body: PlanoRequest) {
    return this.http.post<Plano>(`${this.base}/planos`, body);
  }
  atualizarPlano(id: number, body: PlanoRequest) {
    return this.http.put<Plano>(`${this.base}/planos/${id}`, body);
  }

  listarRegistros(tecnologiaId: number) {
    return this.http.get<Registro[]>(`${this.base}/registros/tecnologia/${tecnologiaId}`);
  }
  criarRegistro(body: RegistroRequest) {
    return this.http.post<Registro>(`${this.base}/registros`, body);
  }

  listarProjetos() {
    return this.http.get<Projeto[]>(`${this.base}/projetos`);
  }
  criarProjeto(body: ProjetoRequest) {
    return this.http.post<Projeto>(`${this.base}/projetos`, body);
  }
  atualizarProjeto(id: number, body: ProjetoRequest) {
    return this.http.put<Projeto>(`${this.base}/projetos/${id}`, body);
  }

  dashboard(tecnologiaId: number) {
    return this.http.get<DashboardData>(`${this.base}/dashboard/${tecnologiaId}`);
  }
}

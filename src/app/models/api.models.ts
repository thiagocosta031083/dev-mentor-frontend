export type TipoTecnologia = 'TECNOLOGIA' | 'DISCIPLINA';
export type StatusTecnologia = 'ATIVA' | 'INATIVA';
export type TipoConteudo = 'CONCEITO' | 'PRATICA' | 'REVISAO';
export type StatusConteudo = 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'CONCLUIDO';
export type NivelDominio = 'NIVEL_1' | 'NIVEL_2' | 'NIVEL_3' | 'NIVEL_4';
export type TipoEstudo = 'AULA' | 'PRATICA' | 'REVISAO';
export type StatusProjeto = 'IDEIA' | 'EM_ANDAMENTO' | 'CONCLUIDO';
export type StatusEvolucao = 'ABAIXO_DO_ESPERADO' | 'DENTRO_DO_ESPERADO' | 'ACIMA_DO_ESPERADO';

export interface LoginResponse {
  token: string;
  email: string;
}
export interface Tecnologia {
  id: number;
  nome: string;
  tipo: TipoTecnologia;
  descricao: string | null;
  cargaHorariaPlanejada: number;
  status: StatusTecnologia;
}
export type TecnologiaRequest = Pick<
  Tecnologia,
  'nome' | 'tipo' | 'descricao' | 'cargaHorariaPlanejada'
>;
export interface Conteudo {
  id: number;
  tecnologiaId: number;
  titulo: string;
  tipo: TipoConteudo;
  peso: number;
  status: StatusConteudo;
  nivelDominio: NivelDominio | null;
}
export type ConteudoRequest = Pick<Conteudo, 'tecnologiaId' | 'titulo' | 'tipo' | 'peso'>;
export interface Plano {
  id: number;
  tecnologiaId: number;
  dataInicio: string;
  dataFim: string;
  horasPlanejadasTotais: number;
  horasSemanais: number;
  observacao: string | null;
}
export type PlanoRequest = Omit<Plano, 'id'>;
export interface Registro {
  id: number;
  tecnologiaId: number;
  conteudoId: number | null;
  data: string;
  tipo: TipoEstudo;
  tempoMinutos: number;
  observacoes: string | null;
}
export type RegistroRequest = Omit<Registro, 'id'>;
export interface Projeto {
  id: number;
  nome: string;
  stack: string;
  status: StatusProjeto;
  proximoPasso: string | null;
  tecnologiaId: number | null;
}
export type ProjetoRequest = Omit<Projeto, 'id'>;
export interface DashboardData {
  tecnologia: string;
  horasPlanejadas: number;
  horasRealizadas: number;
  conteudosPlanejados: number;
  conteudosConcluidos: number;
  cobertura: number;
  esforco: number;
  pratica: number;
  evolucao: number;
  percentualEsperado: number;
  status: StatusEvolucao;
}
export interface ApiError {
  message?: string;
  fields?: Record<string, string>;
}

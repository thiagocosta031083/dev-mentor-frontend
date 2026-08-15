import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api.models';

export function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'Não foi possível conectar ao servidor.';
    const body = error.error as ApiError | undefined;
    if (body?.fields && Object.keys(body.fields).length) return Object.values(body.fields).join(' ');
    return body?.message || 'Não foi possível concluir a operação.';
  }
  return 'Ocorreu um erro inesperado.';
}

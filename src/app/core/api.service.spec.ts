import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('uses the versioned same-origin API for technologies', () => {
    service.listarTecnologias().subscribe();
    const request = http.expectOne('/api/v1/tecnologias');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('sends the selected mastery level when concluding content', () => {
    service.concluirConteudo(7, 'NIVEL_3').subscribe();
    const request = http.expectOne('/api/v1/conteudos/7/concluir');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ nivelDominio: 'NIVEL_3' });
    request.flush({});
  });
});

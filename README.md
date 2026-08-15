# Dev Mentor Frontend

Interface web do Dev Mentor para planejar tecnologias, acompanhar conteúdos, registrar estudos e medir evolução. O projeto é uma SPA Angular integrada à API `dev-mentor-backend`.

## Funcionalidades

- Login JWT e rotas protegidas
- Dashboard de evolução por tecnologia
- Cadastro, edição, ativação e inativação de tecnologias
- Gestão do ciclo de conteúdos: não iniciado, em andamento e concluído
- Planos de estudo por período e carga horária
- Registro de sessões de aula, prática e revisão
- Gestão de projetos pessoais
- Layout responsivo para desktop e celular
- Tratamento centralizado de erros da API

## Requisitos

- Node.js 26.7.0 (também compatível com as linhas 22.22.3+ e 24.15.0+ suportadas pelo Angular 22)
- npm 12
- `dev-mentor-backend` executando na porta `8080`

## Desenvolvimento local

No backend:

```bash
mvn spring-boot:run
```

No frontend:

```bash
npm ci
npm start
```

Acesse `http://localhost:4200`. O Angular encaminha `/api` para `http://localhost:8080` por meio de `proxy.conf.json`, portanto não é necessário liberar CORS no backend.

Em produção, o usuário inicial é definido pelas variáveis seguras do backend. Nenhuma credencial fica armazenada neste repositório frontend.

## Validação

```bash
npm run format:check
npm run lint
npm test
npm run build
```

## Padrões de código

O projeto usa EditorConfig para UTF-8, finais de linha LF e indentação de 2 espaços em
TypeScript, HTML, SCSS, JSON e YAML. O Prettier 3 realiza apenas a formatação, enquanto
ESLint 10, `typescript-eslint` e `angular-eslint` validam qualidade do TypeScript e dos
templates Angular.

```bash
# Formatar o código-fonte
npm run format

# Verificar formatação e qualidade sem alterar arquivos
npm run format:check
npm run lint
```

No VS Code, instale as extensões recomendadas pelo workspace: EditorConfig, Prettier,
ESLint e Angular Language Service. O arquivo `.vscode/settings.json` habilita formatação
ao salvar e correções explícitas do ESLint. No IntelliJ IDEA, habilite EditorConfig em
`Settings > Editor > Code Style`, configure o Prettier do projeto e execute os scripts
npm pela janela `package.json`.

## Produção com Docker

```bash
docker build -t dev-mentor-frontend .
docker run --rm -p 8081:8080 \
  -e BACKEND_UPSTREAM=http://endereco-interno-backend:8080 \
  dev-mentor-frontend
```

O Nginx serve a SPA e encaminha `/api/` para `BACKEND_UPSTREAM`. Em produção, publique somente o Nginx por HTTPS; mantenha backend e banco em rede privada. A configuração inclui CSP, bloqueio de iframe, proteção contra MIME sniffing e execução do container sem usuário root.

## Integração

O cliente usa URLs relativas sob `/api/v1`. Essa estratégia mantém frontend e API na mesma origem, evita expor endereço interno do servidor e permite trocar o destino do backend sem recompilar o Angular:

- desenvolvimento: `proxy.conf.json`
- produção: `BACKEND_UPSTREAM` no container Nginx

O token JWT é mantido em `sessionStorage`, é removido ao sair e não é persistido entre sessões do navegador. Respostas `401` encerram a sessão automaticamente.

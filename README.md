```markdown
# Desafio3 Physical Store

Este projeto é uma API para gerenciamento de lojas físicas, construída utilizando o framework NestJS. A API permite criar, listar, buscar e deletar lojas, além de calcular distâncias e preços de frete como SEDEX e PAC.

## Estrutura do Projeto

```
Desafio3/
    desafio3-physical-store/
        .env
        .eslintrc.js
        .gitignore
        .prettierrc
        nest-cli.json
        package.json
        src/
            app.module.ts
            common/
                filters/
                    http-exception.filter.ts
                utils/
                    distance.utils.ts
            config/
                product.config.ts
            database/
                database-cleaner.service.ts
                database.controller.ts
                database.module.ts
            main.ts
            stores/
                controllers/
                    stores.controller.ts
                dto/
                    create-store.dto.ts
                interfaces/
                    store.interface.ts
                schemas/
                    store.schema.ts
                services/
                    cep.service.ts
                    correios.service.ts
                    geocoding.service.ts
                    stores.service.ts
                stores.module.ts
        test/
            app.e2e-spec.ts
            jest-e2e.json
        tsconfig.json
```

## Instalação

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd desafio3-physical-store
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   MONGO_URI=<sua_uri_mongodb>
   GOOGLE_API_KEY=<sua_chave_api_google>
   PORT=<porta_da_aplicacao>
   ```

## Scripts Disponíveis

- **Iniciar a aplicação**:  
  ```bash
  npm run start
  ```
- **Iniciar a aplicação em modo de desenvolvimento**:  
  ```bash
  npm run start:dev
  ```
- **Executar os testes unitários**:  
  ```bash
  npm run test
  ```

## Endpoints

### Criar uma nova loja
**POST /stores**  
Body:  
```json
{
  "storeName": "Loja Teste",
  "takeOutInStore": true,
  "type": "LOJA",
  "address3": "123",
  "postalCode": "01001-000",
  "telephoneNumber": "99 12345678",
  "emailAddress": "emailteste@gmail.com"
}
```

### Listar todas as lojas
**GET /stores**

### Buscar lojas por CEP
**GET /stores/cep/:cep**

### Buscar loja por ID
**GET /stores/:storeID**

### Buscar lojas por estado
**GET /stores/state/:state**  
Exemplo: `/stores/state/SP`

### Deletar loja por ID
**DELETE /stores/:storeID**

### Limpar banco de dados
**DELETE /database/clean**

## Configuração

### ESLint
O projeto utiliza o ESLint com o plugin `@typescript-eslint` para garantir a qualidade do código. As regras de linting estão definidas no arquivo `.eslintrc.js`.

### Prettier
O Prettier é utilizado para formatação de código, com as configurações definidas no arquivo `.prettierrc`.

### Swagger
A documentação da API é gerada automaticamente pelo Swagger e pode ser acessada em `/api-docs`.

## Testes

Os testes unitários e de integração são escritos utilizando Jest. Os arquivos de teste estão localizados na pasta `test`.

Para executar os testes, utilize o comando:  
```bash
npm run test
```
```
# Remoto Brasil
Dicas e jobs remotos aqui :D

![StackOverflow Jobs](http://g.recordit.co/fsRjXHEkNu.gif)

## Install
```
npm install
```

## Run
```
npm start
```

## Deploy (WIP)
Estamos usando o [Serverless Framework](https://serverless.com) como ferramenta para gerenciar as funções lambdas, automatizar a infra e executar o crawler.

### Requisitos
* [AWS CLI](https://aws.amazon.com/pt/cli/)
* [Serverless CLI](https://serverless.com)

Após realizar a instalação dos requisitos acima, configure o `githubToken` no arquivo de configuração `config/lambda.dev.yml`. Veja [aqui](https://github.com/blog/1509-personal-api-tokens) como criar o seu próprio token.

Agora execute os comandos abaixo:

```
aws login
serverless deploy
```

## Roadmap
- [X] Cawlear a primeira página do Stack Overflow Jobs
- [X] Paginar os resultados de busca do Stack Overflow Jobs
- [X] Persistir os dados coletados no S3
- [X] Fazer um frontend básico para apresentar os últimos trabalhos remotos cadastrados
- [X] Fazer uma cron job para procurar por novos trabalhos remotos a cada x hrs ou minutos
- [X] Colocar o projeto online.  :)

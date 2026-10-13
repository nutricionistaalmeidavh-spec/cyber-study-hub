# Aula 47 — laboratório local com regressão

Node.js 24, npm e curl. Da raiz do pacote:

```sh
cd public/course-labs/aula-047
npm ci
npm test
```

O teste inicia servidores em portas livres e fecha todos ao terminar. Exige reprodução Alice/MISS → Bob/HIT com corpo de Alice, isolamento do proxy corrigido, MISS/HIT público, BYPASS de contexto após aquecimento, recusa de 404/Set-Cookie/Vary/private e expiração/Age com relógio controlado. São dois testes com vários cenários. Fontes próprias; nenhuma conta externa.

Para seguir manualmente, execute em terminais separados neste diretório:

```sh
npm run origin
```

```sh
npm run vulnerable
```

```sh
npm run fixed
```

Origin 3000, vulnerável 4000, corrigido 4001; listeners apenas em 127.0.0.1. Use **X-Lab-User**, não Cookie, para escolher a identidade fictícia:

```sh
curl -i -H 'X-Lab-User: alice' http://127.0.0.1:3000/account/profile.css
curl -i -H 'X-Lab-User: alice' http://127.0.0.1:4000/account/profile.css
curl -i -H 'X-Lab-User: bob' http://127.0.0.1:4000/account/profile.css
curl -i -H 'X-Lab-User: alice' http://127.0.0.1:4001/account/profile.css
curl -i -H 'X-Lab-User: bob' http://127.0.0.1:4001/account/profile.css
curl -i http://127.0.0.1:4001/assets/app.css
curl -i http://127.0.0.1:4001/assets/app.css
curl -i -H 'Cookie: session=ficticia' http://127.0.0.1:4001/assets/app.css
```

Resultados: origin Alice; vulnerável Alice/MISS e Alice/HIT para Bob; corrigido Alice/BYPASS e Bob/BYPASS; asset MISS/HIT; asset com Cookie BYPASS. O cookie não autentica ninguém neste origin: é um sinal de contexto para a política conservadora do cache.

A implementação modela um subconjunto de HTTP: apenas GET, namespace assets, status 200, public/max-age, TTL máxima de uma hora, sem variantes/revalidação. Não é um proxy de produção. `cache-policy.mjs` é usado pelo código e reproduzido na aula; não depende de snippets incompletos.

Pare com Ctrl+C. Os caches são Maps em memória; reiniciar o vulnerável limpa a entrada para repetir Alice → Bob. `EADDRINUSE` indica outro processo na porta: encerre apenas o processo que você iniciou ou use o teste automatizado em portas livres.

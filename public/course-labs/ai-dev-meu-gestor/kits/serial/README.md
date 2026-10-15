# Kit serial / balança — simulador e dispositivo opcional

**Origem real:** [artisys-serialport](https://github.com/nutricionistaalmeidavh-spec/utilidades/tree/main/modules/artisys-serialport), **implemented 0.1.0**, DevKitTools **DKT-DESK-003** em preparação. Usa `serialport` 13.0.0, Node 22+ e adaptador de balança. **Não foi homologado para todo modelo físico.**

## Primeiro sem balança

```sh
node serial/scale-simulator.cjs "1,250 kg"
node serial/scale-simulator.cjs "texto inválido" # negativo esperado
```

O resultado é um JSON tipado com `kg` e origem `simulated`. O limite de 300 kg é apenas um limite didático de exemplo, não especificação de produto. Não confunda leitura de peso com conversão de preços ou estoque.

## Hardware físico (só se possuir equipamento compatível)

1. Instale no consumidor `npm install /caminho/utilidades/modules/artisys-serialport`.
2. Use `createSerialTransport`, `createRequestResponseSession` e `createScaleAdapter`, conforme [README upstream](https://github.com/nutricionistaalmeidavh-spec/utilidades/tree/main/modules/artisys-serialport).
3. Declare o perfil real: porta, baudRate, protocolo de solicitação, delimitador e unidade. Não adivinhe `COM3` nem envie comandos arbitrários.
4. Faça leitura de massa conhecida com permissão e compare medição, unidade, timeout e desconexão.
5. Defina fallback para entrada manual e não faça o frontend depender de uma porta serial do servidor remoto.

**Entregável:** simulação que passa em caso válido/negativo; para hardware, evidência de modelo, driver, versão, porta e observações. Sem balança, o laboratório continua concluível.

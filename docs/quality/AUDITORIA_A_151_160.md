# Auditoria A editorial — aulas 151–160

**Data:** 14/10/2026. **Método:** revisão editorial técnica assistida por IA; nenhuma avaliação com estudantes humanos ou certificação por auditor humano foi realizada.

## Escopo e preservação

As aulas **151–159** receberam nove oficinas específicas e um gabarito por unidade. A aula **160** já tinha A editorial do piloto, permanece **sem edição** e com seu hash preexistente.

Antes da promoção havia **135 notas A** na main examinada. Após adicionar as nove avaliações novas, a branch terá **144 notas A**, ou mais caso a main evolua e haja compatibilização posterior. O registro canônico é `quality/registry.json`, que contém seis dimensões, seis evidências e SHA-256 do conteúdo de cada unidade.

| Aula | Oficina específica | Controle negativo |
| --- | --- | --- |
| 151 | Matching didático de marcador YARA | Marcador não correspondente / objeto grande |
| 152 | Evento Sigma com filtros de contexto | Automação aprovada / campo ausente |
| 153 | Regra de detecção de alteração inicial | Mudança autorizada / dado incompleto |
| 154 | Técnica ATT&CK T1053.005 candidata | Login / origem de evento ausente |
| 155 | Comparação de baseline de inicialização | Alteração aprovada / sem diff |
| 156 | Processo pai-filho em contexto | Fluxo autorizado / sensor falho |
| 157 | Telemetria de PowerShell | Parâmetro legítimo / fonte falha |
| 158 | Sinais de possível process injection | Ferramenta autorizada / sinal incompleto |
| 159 | Correlação SIEM com GUID e janela | Processo distinto / fora da janela |
| 160 | Investigação completa de amostra educacional | **Já classificada A, sem mudanças** |

## Reproduzir os testes

```sh
node --test public/course-labs/a151-159/lab.test.mjs
node scripts/test-grade-a-151-160.mjs
npm run build
```

As questões são abertas (6 × 9 = 54 novas), com respostas e rubricas separadas em `public/course-labs/a151-159/answer-keys`. O teste compara SHA-256 do texto com auditoria e registro, inspeciona seis competências e confirma que as 135 notas originais, inclusive a 160, não foram perdidas.

**Limites:** os modelos são sintéticos e offline, não executam ferramentas YARA/Sigma reais, PowerShell, manipulação de processos, infecção, inspeção de endpoint ou correlação em serviço SIEM. Não há custo de API, software pago nem execução externa. Uma nota A editorial por IA não atesta eficácia pedagógica real.

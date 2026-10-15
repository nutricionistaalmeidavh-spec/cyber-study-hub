/**
 * Rótulos de apresentação: chaves canônicas de módulo permanecem intactas para
 * rotas, busca, progresso e associação ao conteúdo.
 */
const moduleTitles: Record<string,string> = {
  "Fundamentos e Web Security": "Web Security",
  "APIs, lógica de negócio, tokens e OAuth": "APIs & OAuth",
  "Redes, Linux, memória, Assembly, RE e Malware": "Redes & Sistemas",
  "Metodologia de pentest e desenvolvimento seguro": "Pentest",
  "Web e AppSec avançado": "AppSec Avançado",
  "Systems Security": "Systems Security",
  "Active Directory": "Active Directory",
  "Blue Team & SOC": "Blue Team",
  "Antivírus, EDR e Detection": "EDR & Detection",
  "C aplicado à segurança e Windows Internals": "C & Windows",
  "Assembly e Engenharia Reversa": "Engenharia Reversa",
  "Malware Analysis & Detection": "Malware Analysis",
  "Exploit Development & Vulnerability Research": "Exploit Development",
  "Red Team & Purple Team": "Red & Purple Team",
  "Cloud, DevSecOps e Modern App Security": "Cloud & DevSecOps",
  "AI e LLM Security": "AI Security",
  "Projeto Final Integrado": "Projeto Final",
  "Lógica e Algoritmos": "Lógica e Algoritmos",
  "Python para Segurança": "Python",
  "JavaScript / TypeScript": "JavaScript & TypeScript",
  "C — Fundamentos Paralelos": "C",
  "Bash": "Bash",
  "PowerShell": "PowerShell",
  "Redes para Segurança": "Redes",
  "Linux": "Linux",
  "Windows": "Windows",
  "Web Development para AppSec": "Web Development",
  "Git e Engenharia de Software": "Git",
  "Laboratório e Ferramentas": "Laboratórios",
  "Cloud, Containers e Kubernetes": "Cloud & Kubernetes"
};

export function moduleDisplayTitle(canonicalName: string): string {
  return moduleTitles[canonicalName] ?? canonicalName;
}

/** A formação principal usa a soma das durações registradas no catálogo. */
export function mainStudyTime(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return 'Tempo a confirmar';
  const rounded = Math.max(30, Math.round(totalMinutes / 30) * 30);
  const hours = Math.floor(rounded / 60);
  const minutes = rounded % 60;
  return '≈ ' + (hours ? hours + 'h' : '') + (minutes ? (hours ? '30' : '30 min') : '') + ' de estudo';
}

/**
 * Trilhas paralelas ainda não têm duração canônica por unidade no catálogo.
 * Seus documentos v2 usam referência de 25–40 min + prática; apresentar uma
 * faixa arredondada e explicitamente estimada, não uma duração exata.
 */
export function parallelStudyTime(unitCount: number): string {
  if (!Number.isFinite(unitCount) || unitCount <= 0) return 'Tempo a confirmar';
  const lower = Math.max(1, Math.floor(unitCount * 25 / 60));
  const upper = Math.max(lower, Math.ceil(unitCount * 40 / 60));
  return '≈ ' + lower + '–' + upper + 'h + prática';
}

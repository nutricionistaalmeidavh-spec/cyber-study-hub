// A configuração é a mesma para Cloudflare e Node.
// A criação pública concede exclusivamente role='student'; convites continuam
// obrigatórios para perfis de staff e o bootstrap do primeiro admin é separado.
// Valores inválidos desabilitam o registro em vez de ampliar acesso.
export function registrationEnabled(value){
 return value===undefined||value===null||value===''||value==='1'||value==='true';
}

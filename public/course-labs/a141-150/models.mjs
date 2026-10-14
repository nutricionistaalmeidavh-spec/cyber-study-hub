/**
 * Exercícios inertes da trilha de análise defensiva de malware (141–150).
 * Não realiza I/O, chamadas de rede, coleta real nem executa amostras.
 */
const ensureArray=(value,label)=>{if(!Array.isArray(value))throw Error(label+' deve ser array');return value;};
export function processTree(events){
 ensureArray(events,'eventos');const keys=new Set();
 for(const e of events){if(!Number.isInteger(e.pid)||!e.start)throw Error('PID e início obrigatórios');const key=e.pid+'@'+e.start;if(keys.has(key))throw Error('identidade duplicada');keys.add(key);}
 const orphans=events.filter(e=>e.parentKey&&!keys.has(e.parentKey)).map(e=>e.pid+'@'+e.start);
 const linked=events.filter(e=>e.parentKey&&keys.has(e.parentKey)).length;
 return {linked,orphans,roots:events.filter(e=>!e.parentKey).length,malwareProven:false,
  note:'PID isolado não vincula pai e filho; exigir início, origem e command line com autorização.'};
}
export function diffArtifacts(before,after){
 ensureArray(before,'baseline');ensureArray(after,'resultado');
 const index=list=>new Map(list.map(x=>[x.type+':'+x.path,x]));
 const b=index(before),a=index(after);const added=[],removed=[],changed=[];
 for(const [key,now] of a){if(!b.has(key))added.push(key);else if(b.get(key).digest!==now.digest)changed.push(key);}
 for(const key of b.keys())if(!a.has(key))removed.push(key);
 return {added:added.sort(),removed:removed.sort(),changed:changed.sort(),malwareProven:false,
  note:'Mudanças devem ser relacionadas ao processo e à janela temporal; instaladores autorizados geram artefatos.'};
}
export function correlateFlows(flows,processes){
 ensureArray(flows,'fluxos');ensureArray(processes,'processos');
 const known=new Set(processes.map(p=>p.pid+'@'+p.start));
 const matched=flows.filter(f=>known.has(f.pid+'@'+f.processStart));
 const unmatched=flows.filter(f=>!known.has(f.pid+'@'+f.processStart));
 return {matched,unmatched,externalTrafficObserved:false,malwareProven:false,
  note:'DNS e fluxo são fixtures: nada foi capturado nem consultado fora do laboratório.'};
}
export function assessLabService({egressBlocked,dnsRedirect,syntheticFixture,externalListeners,realCredentials}={}){
 const findings=[];
 if(egressBlocked!==true)findings.push('external-egress-not-blocked');
 if(dnsRedirect!==true)findings.push('dns-not-contained');
 if(syntheticFixture!==true)findings.push('fixture-not-approved');
 if(externalListeners!==false)findings.push('external-listener-risk');
 if(realCredentials!==false)findings.push('credential-exposure-risk');
 return {ready:findings.length===0,findings,realServiceStarted:false,safeForLiveMalware:false,
  note:'Checklist sintético não valida a segurança do hipervisor, serviços ou host.'};
}
export function summarizeTraffic(events){
 ensureArray(events,'eventos');
 const sorted=[...events].sort((a,b)=>a.at-b.at);const byHost=new Map();
 for(const e of sorted){if(!Number.isFinite(e.at)||!e.host)throw Error('tempo e host obrigatórios');const h=e.host.toLowerCase();if(!byHost.has(h))byHost.set(h,[]);byHost.get(h).push(e.at);}
 const intervals=[];for(const a of byHost.values())for(let i=1;i<a.length;i++)intervals.push(a[i]-a[i-1]);
 return {hosts:[...byHost.keys()].sort(),intervals,malwareProven:false,actualPcapAnalyzed:false,
  note:'Cadência semelhante pode surgir em heartbeat de monitoramento autorizado.'};
}
export function filterPacketMetadata(packets,{protocol,streamId}={}){
 ensureArray(packets,'pacotes');
 return {packets:packets.filter(p=>(!protocol||p.protocol===protocol)&&(streamId===undefined||p.streamId===streamId)),
  parsedPcap:false,networkUsed:false,malwareProven:false,
  note:'Filtra objetos simulados, não bytes de captura; análise de payload exige autorização e parser.'};
}
export function assessBeaconing(timestamps,{approvedHeartbeat=false}={}){
 ensureArray(timestamps,'timestamps');const sorted=[...timestamps].sort((a,b)=>a-b);
 const intervals=sorted.slice(1).map((v,i)=>v-sorted[i]);if(sorted.some(t=>!Number.isFinite(t)))throw Error('timestamp inválido');
 const avg=intervals.length?intervals.reduce((a,b)=>a+b,0)/intervals.length:0;
 const span=intervals.length?Math.max(...intervals)-Math.min(...intervals):0;
 const periodicCandidate=sorted.length>=4&&avg>0&&span/avg<=0.15;
 return {intervals,periodicCandidate,approvedHeartbeat,c2Confirmed:false,
  note:'Periodicidade não identifica C2 sem destino, processo, configuração e evidência corroborada.'};
}
export function inspectMemoryRegions(regions){
 ensureArray(regions,'regiões');const review=regions.filter(r=>r.access?.includes('w')&&r.access?.includes('x')&&r.owner==='unknown');
 return {review,normal:regions.filter(r=>!review.includes(r)),malwareProven:false,realMemoryCollected:false,
  note:'RWX e origem desconhecida podem surgir em JIT ou depuração: investigar antes de concluir.'};
}
export function reconcilePluginViews({pslist=[],pstree=[],netscan=[]}={}){
 ensureArray(pslist,'pslist');ensureArray(netscan,'netscan');ensureArray(pstree,'pstree');
 const known=new Set(pslist.map(x=>x.pid+'@'+x.start));
 const correlated=netscan.filter(x=>known.has(x.pid+'@'+x.start));
 const unmatched=netscan.filter(x=>!known.has(x.pid+'@'+x.start));
 return {correlated,unmatched,processCount:pslist.length,treeCount:pstree.length,realDumpOpened:false,malwareProven:false,
  note:'Plugins têm cobertura e timestamps distintos; PID sem início causa falsa associação.'};
}
export function curateIOCs(entries,{asOf}={}){
 ensureArray(entries,'indicadores');if(!/^\d{4}-\d{2}-\d{2}$/.test(asOf??''))throw Error('data de referência obrigatória');
 const seen=new Set(),active=[],expired=[],rejected=[];
 for(const item of entries){
  const type=item.type,value=String(item.value??'').trim().toLowerCase().replace(/\.$/,'');
  if(!item.source||!item.expires||!['domain','sha256'].includes(type)||
   (type==='domain'&&!/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(value))||
   (type==='sha256'&&!/^[a-f0-9]{64}$/.test(value))){rejected.push(item);continue;}
  const key=type+':'+value;if(seen.has(key))continue;seen.add(key);
  const row={type,value,source:item.source,expires:item.expires,confidence:item.confidence??'unknown'};
  (row.expires<asOf?expired:active).push(row);
 }
 return {active,expired,rejected,malwareProven:false,realLookupPerformed:false,
  note:'IOC exige contexto, validade e proveniência: inclusão em lista não é confirmação de infecção.'};
}
export function runWorkshop(n){
 let allowed,contrast,limit;
 switch(n){
 case 141:
  allowed=processTree([{pid:10,start:'A',parentKey:null},{pid:11,start:'B',parentKey:'10@A'}]);
  contrast=processTree([{pid:11,start:'B',parentKey:'10@Z'}]);
  limit='Não coleta árvores reais, assinatura digital ou linha de comando; valida apenas vínculo temporal sintético.';break;
 case 142:
  allowed=diffArtifacts([{type:'file',path:'/lab/report',digest:'old'}],[{type:'file',path:'/lab/report',digest:'old'}]);
  contrast=diffArtifacts([],[{type:'registry',path:'HKCU\\Lab',digest:'new'}]);
  limit='Não modifica registro Windows nem arquivos; o diff é uma lista fixa sem prova de autoria.';break;
 case 143:
  allowed=correlateFlows([{pid:7,processStart:'t0',host:'lab.invalid',protocol:'dns'}],[{pid:7,start:'t0'}]);
  contrast=correlateFlows([{pid:7,processStart:'t1',host:'lab.invalid',protocol:'tls'}],[{pid:7,start:'t0'}]);
  limit='Não envia pacotes, captura DNS, nem investiga conexões externas; correlaciona apenas metadados simulados.';break;
 case 144:
  allowed=assessLabService({egressBlocked:true,dnsRedirect:true,syntheticFixture:true,externalListeners:false,realCredentials:false});
  contrast=assessLabService({egressBlocked:false,dnsRedirect:true,syntheticFixture:true,externalListeners:false,realCredentials:false});
  limit='Não instala FakeNet-NG nem valida isolamento real; é um checklist para cenário sintético.';break;
 case 145:
  allowed=summarizeTraffic([{at:0,host:'lab.invalid'},{at:100,host:'lab.invalid'},{at:200,host:'lab.invalid'}]);
  contrast=summarizeTraffic([{at:0,host:'updates.invalid'},{at:13,host:'updates.invalid'},{at:96,host:'updates.invalid'}]);
  limit='Sem PCAP, payload ou endpoint real; intervalos semelhantes não provam nem refutam malware.';break;
 case 146:
  allowed=filterPacketMetadata([{streamId:1,protocol:'dns',src:'127.0.0.1'},{streamId:2,protocol:'tcp',src:'127.0.0.1'}],{protocol:'dns'});
  contrast=filterPacketMetadata([{streamId:1,protocol:'dns'}],{protocol:'http'});
  limit='Não abre PCAP, não usa Wireshark nem interpreta TLS: filtra objetos estáticos sem conteúdo de rede.';break;
 case 147:
  allowed=assessBeaconing([0,60,120,180],{approvedHeartbeat:true});
  contrast=assessBeaconing([0,20,95,180],{approvedHeartbeat:false});
  limit='Não identifica servidores C2 ou campanhas; a classificação de cadência exige contexto de processo.';break;
 case 148:
  allowed=inspectMemoryRegions([{pid:5,access:'r-x',owner:'approved'}]);
  contrast=inspectMemoryRegions([{pid:7,access:'rwx',owner:'unknown'}]);
  limit='Não faz aquisição de memória nem triagem de infecção; região RWX é apenas sinal inespecífico.';break;
 case 149:
  allowed=reconcilePluginViews({pslist:[{pid:5,start:'t0'}],netscan:[{pid:5,start:'t0'}]});
  contrast=reconcilePluginViews({pslist:[{pid:5,start:'t1'}],netscan:[{pid:5,start:'t0'}]});
  limit='Não executa Volatility nem analisa imagem de memória; evidencia limites de junção por PID.';break;
 case 150:
  allowed=curateIOCs([{type:'domain',value:'LAB.INVALID',expires:'2026-12-01',source:'lab'}],{asOf:'2026-10-14'});
  contrast=curateIOCs([{type:'domain',value:'old.invalid',expires:'2026-01-01',source:'lab'}],{asOf:'2026-10-14'});
  limit='Não consulta feeds, resolve domínios ou bloqueia indicadores; validade e confiança dependem de triagem humana.';break;
 default:throw Error('aula fora de 141–150');
 }
 return {allowed,contrast,limit,liveMalwareExecuted:false};
}

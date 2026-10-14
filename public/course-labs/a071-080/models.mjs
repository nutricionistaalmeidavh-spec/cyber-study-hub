// Modelos locais de raciocínio defensivo. Não acessam AD, Windows, rede ou credenciais.
// Cenários sintéticos para treinamento; nunca classificam pessoas ou sistemas reais.
export function mapDirectoryProtocols(events) {
  const meanings={
    4768:['Kerberos TGT request',false],
    4769:['Kerberos service ticket request',false],
    4776:['NTLM credential validation',true],
    'ldap-search':['LDAP directory query',false]
  };
  return events.map(event=>{
    const [meaning,legacy]=meanings[event.eventId]??['Unclassified event',false];
    return {eventId:event.eventId,meaning,legacy};
  });
}

export function inventoryAd(objects, context) {
  if(context?.authorized!==true)throw new Error('Inventário somente em escopo autorizado');
  return objects.map(item=>{
    if(!item?.id || !['user','group','computer','trust'].includes(item.type))
      throw new Error('tipo inválido no objeto do diretório');
    return {
      id:item.id, type:item.type, ou:item.ou??'Unspecified',
      spns:[...(item.spns??[])], memberOf:[...(item.memberOf??[])]
    };
  }).sort((a,b)=>a.id.localeCompare(b.id));
}

export function auditAdAcl(aces,approvedPrincipals=[]) {
  return aces.filter(ace=>ace.sensitive===true
    && ['GenericAll','WriteDACL','WriteOwner'].includes(ace.right)
    && !approvedPrincipals.includes(ace.principal))
    .map(ace=>({principal:ace.principal,object:ace.object,right:ace.right,
      finding:'excessive delegated control — requires human validation'}));
}

export function findPrivilegePath(edges,start,goal) {
  if(start===goal)return [start];
  const queue=[[start]],visited=new Set([start]);
  while(queue.length){
    const path=queue.shift(),current=path[path.length-1];
    for(const edge of edges){
      if(edge.from!==current||visited.has(edge.to))continue;
      const next=[...path,edge.to];
      if(edge.to===goal)return next;
      visited.add(edge.to);queue.push(next);
    }
  }
  return null;
}

export function reviewRemoteAccess(events,approvedRoutes) {
  return events.map(event=>{
    const remote=[3,10].includes(event.logonType)&&event.from!==event.to;
    const approved=approvedRoutes.some(rule=>rule.actor===event.actor
      && rule.from===event.from&&rule.to===event.to);
    return {...event,status:!remote?'local':approved?'allowed':'review'};
  });
}

export function assessGpo(gpo,target,approvedEditors=[]) {
  const scoped=gpo.enabled===true && target.ous.includes(gpo.linkedOu);
  const filtered=gpo.securityFilter.some(group=>target.groups.includes(group));
  return {applies:scoped&&filtered,
    unapprovedEditors:gpo.editors.filter(editor=>!approvedEditors.includes(editor))};
}

export function hardeningReadiness(policy) {
  const controls=[
    ['laps','LAPS'],['gmsa','gMSA'],['tiering','admin tiering'],
    ['ntlmInventory','NTLM inventory'],['rollbackTested','rollback test']
  ];
  const gaps=controls.filter(([key])=>policy[key]!==true).map(([,name])=>name);
  return {gaps,readyForEnforcement:gaps.length===0,
    note:'Planejar implantação gradual e testar dependências; nunca desabilitar NTLM sem inventário'};
}

export function correlateAdEvents(events) {
  const changes=events.filter(e=>e.id===4728&&e.group==='Domain Admins');
  const logons=events.filter(e=>e.id===4624);
  const findings=[];
  for(const change of changes){
    const start=Date.parse(change.at);
    if(!Number.isFinite(start))continue;
    const correlated=logons.find(login=>login.user===change.member
      &&Number.isFinite(Date.parse(login.at))
      &&Date.parse(login.at)>=start
      &&Date.parse(login.at)-start<=10*60*1000);
    if(correlated){
      findings.push({member:change.member,group:change.group,host:correlated.host,
        windowMinutes:(Date.parse(correlated.at)-start)/60000,
        severity:change.ticket?'expected':'review',
        evidence:[4728,4624]});
    }
  }
  return findings;
}

export function normalizeLogs(events) {
  return events.map(event=>{
    if(typeof event.at!=='string'
       ||!/(?:Z|[+-][0-9]{2}:[0-9]{2})$/i.test(event.at))
      throw new Error('timestamp sem fuso explícito ou inválido');
    const ts=Date.parse(event.at);
    if(!Number.isFinite(ts))throw new Error('timestamp inválido');
    return {source:event.source,detail:event.detail,atUtc:new Date(ts).toISOString()};
  }).sort((a,b)=>a.atUtc.localeCompare(b.atUtc));
}

export function traceSysmon(events) {
  const processes=events.filter(e=>e.id===1&&e.guid).map(e=>({
    guid:e.guid,parentGuid:e.parentGuid??null,image:e.image,
    connections:events.filter(n=>n.id===3&&n.guid===e.guid).map(n=>n.destination)
  }));
  const known=new Set(processes.map(p=>p.guid));
  const unmatchedConnections=events.filter(e=>e.id===3&&!known.has(e.guid))
    .map(e=>e.destination);
  return {processes,unmatchedConnections,
    note:'ProcessGuid correlaciona ProcessCreate e NetworkConnect; ausência de Event 3 não prova ausência de rede'};
}

export function runLesson(id) {
  switch(id){
    case 71:{
      const legitimate=mapDirectoryProtocols([{eventId:4768},{eventId:4769}]);
      const contrast=mapDirectoryProtocols([{eventId:4776},{eventId:'ldap-search'}]);
      return {legitimate,contrast,retest:legitimate.every(e=>!e.legacy)&&contrast.filter(e=>e.legacy).length===1};
    }
    case 72:{
      const fixture=[{id:'svc-report',type:'user',ou:'Services',spns:['HTTP/reports.lab.test'],memberOf:['Readers'],password:'synthetic-secret'}];
      const legitimate=inventoryAd(fixture,{authorized:true});
      let contrast;try{inventoryAd(fixture,{authorized:false});}catch(e){contrast=e.message;}
      return {legitimate,contrast,retest:legitimate[0].password===undefined};
    }
    case 73:{
      const fixture=[{principal:'helpdesk',right:'WriteDACL',object:'OU=Admins',sensitive:true},
        {principal:'audit',right:'Read',object:'OU=Admins',sensitive:true}];
      const contrast=auditAdAcl(fixture,['domain-admin']);
      return {legitimate:auditAdAcl(fixture.filter(e=>e.right==='Read'),['domain-admin']),
        contrast,retest:auditAdAcl(fixture,['helpdesk','domain-admin']).length===0};
    }
    case 74:{
      const edges=[{from:'ana',to:'ops',relation:'memberOf'},{from:'ops',to:'admins',relation:'WriteDACL'}];
      return {legitimate:findPrivilegePath([{from:'ana',to:'ops'}],'ana','ops'),
        contrast:findPrivilegePath(edges,'ana','admins'),
        retest:findPrivilegePath(edges.filter(e=>e.relation!=='WriteDACL'),'ana','admins')===null};
    }
    case 75:{
      const routes=[{actor:'ops',from:'jump',to:'server-a'}];
      const legitimate=reviewRemoteAccess([{actor:'ops',from:'jump',to:'server-a',logonType:3}],routes);
      const contrast=reviewRemoteAccess([{actor:'ops',from:'workstation',to:'server-b',logonType:10}],routes);
      return {legitimate,contrast,retest:contrast[0].status==='review'&&legitimate[0].status==='allowed'};
    }
    case 76:{
      const gpo={linkedOu:'OU=Workstations',enabled:true,securityFilter:['Employees'],editors:['GPO-Admins','helpdesk']};
      const target={ous:['OU=Workstations'],groups:['Employees']};
      return {legitimate:assessGpo(gpo,target,['GPO-Admins']),
        contrast:assessGpo(gpo,{ous:['OU=Workstations'],groups:['Guests']},['GPO-Admins']),
        retest:assessGpo({...gpo,editors:['GPO-Admins']},target,['GPO-Admins']).unapprovedEditors.length===0};
    }
    case 77:{
      const contrast=hardeningReadiness({laps:true,gmsa:false,tiering:true,ntlmInventory:false,rollbackTested:false});
      const legitimate=hardeningReadiness({laps:true,gmsa:true,tiering:true,ntlmInventory:true,rollbackTested:true});
      return {legitimate,contrast,retest:legitimate.readyForEnforcement&&!contrast.readyForEnforcement};
    }
    case 78:{
      const change={id:4728,at:'2026-10-13T13:00:00Z',member:'ana',group:'Domain Admins'};
      const login={id:4624,at:'2026-10-13T13:05:00Z',user:'ana',host:'dc-1'};
      return {legitimate:correlateAdEvents([{...change,ticket:'CHG-27'},login]),
        contrast:correlateAdEvents([change,login]),
        retest:correlateAdEvents([change,{...login,at:'2026-10-13T14:00:00Z'}]).length===0};
    }
    case 79:{
      const legitimate=normalizeLogs([{source:'windows',at:'2026-10-13T13:00:00Z',detail:'logon'},
        {source:'linux',at:'2026-10-13T10:05:00-03:00',detail:'sudo'}]);
      let contrast;try{normalizeLogs([{source:'linux',at:'2026-10-13T10:00:00',detail:'missing tz'}]);}
      catch(e){contrast=e.message;}
      return {legitimate,contrast,retest:legitimate[0].atUtc<'2026-10-13T13:05:00.000Z'};
    }
    case 80:{
      const legitimate=traceSysmon([{id:1,guid:'P-7',image:'cmd.exe',parentGuid:'P-1'},
        {id:3,guid:'P-7',destination:'192.0.2.10:443'}]);
      const contrast=traceSysmon([{id:1,guid:'P-7',image:'cmd.exe',pid:123},
        {id:3,guid:'P-8',pid:123,destination:'192.0.2.10:443'}]);
      return {legitimate,contrast,retest:legitimate.processes[0].connections.length===1&&contrast.unmatchedConnections.length===1};
    }
    default:throw new Error('ID fora das oficinas 071–080');
  }
}

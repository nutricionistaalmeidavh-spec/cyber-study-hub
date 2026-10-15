import {ownersForPath,permitted} from './course-access.mjs';

// Shared authorization for Cloudflare and self-hosted runtimes.
export function contentRoute(path) {
  const lesson=/^\/api\/content\/lesson\/(\d{1,3})$/.exec(path);
  if(lesson){const id=Number(lesson[1]);return id>=43&&id<=100?{kind:'lesson',id}:null;}
  const trail=/^\/api\/content\/trail\/(ai-dev|channel-dark)$/.exec(path);
  if(trail)return {kind:'trail',id:trail[1]};
  if(path==='/api/content/games')return {kind:'games'};
  return null;
}
function allowedLesson(user,grants,subscriptionActive,id){
  return permitted(user,ownersForPath('/course-library/main/'+String(id).padStart(3,'0')+'.md'),grants,subscriptionActive);
}
export function securedPayload(route,user,grants,subscriptionActive,source){
  if(route.kind==='lesson'){
    if(!allowedLesson(user,grants,subscriptionActive,route.id))return null;
    return source.getLesson(route.id);
  }
  if(route.kind==='trail'){
    const path=route.id==='ai-dev'?'/course-labs/ai-dev-meu-gestor/start.md':'/course-labs/channel-dark/start.md';
    if(!permitted(user,ownersForPath(path),grants,subscriptionActive))return null;
    return source.getTrail(route.id);
  }
  if(route.kind==='games'){
    const all=source.getGames();
    const packs=all.reviewPacks.filter(pack=>{
      const [start,end]=pack.lessons;
      if(!Number.isInteger(start)||!Number.isInteger(end)||end<start||end-start>50)return false;
      for(let id=start;id<=end;id++)if(!allowedLesson(user,grants,subscriptionActive,id))return false;
      return true;
    });
    const ids=new Set(packs.flatMap(pack=>pack.scenarioIds));
    if(!packs.length)return null;
    return {reviewPacks:packs,scenarios:all.scenarios.filter(s=>ids.has(s.id))};
  }
  return null;
}
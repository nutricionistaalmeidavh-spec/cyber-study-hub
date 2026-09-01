import { useMemo, useRef, useState } from 'react';
import { reviewPacks, scenarios } from '../data/games';
import { buildCrossword, normalize, scoreFrom } from '../lib/gameEngine';
import { getGameProgress, pickWithRecency, saveGameProgress } from '../lib/storage';
import type { GameType, ReviewPack, Scenario } from '../types';

const gameLabels: Record<GameType,string> = {
  crossword:'Cruzadinha', matching:'Associação', ordering:'Ordenação', scenario:'Cenários'
};

export function GamesHub() {
  const [track,setTrack]=useState('Todas');
  const progress=getGameProgress();
  const tracks=['Todas','Web','Sistemas','Active Directory','Blue Team','Antivírus/EDR'];
  const packs=reviewPacks.filter(p=>track==='Todas'||p.track===track);
  const avg=progress.length?Math.round(progress.reduce((a,b)=>a+b.bestScore,0)/progress.length):0;
  const accuracy=progress.length?Math.round(progress.reduce((a,b)=>a+b.correct,0)/Math.max(1,progress.reduce((a,b)=>a+b.correct+b.mistakes,0))*100):0;
  return <div className="page stack-lg">
    <section className="page-title games-title"><div><span className="eyebrow">CYBER GAMES</span><h1>Jogue para lembrar. Decida para aprender.</h1><p>Quatro formatos com funções diferentes: vocabulário, relações, processos e julgamento técnico.</p></div></section>
    <section className="metrics-grid">
      <Metric label="Partidas registradas" value={String(progress.length)} />
      <Metric label="Média" value={`${avg}%`} />
      <Metric label="Accuracy" value={`${accuracy}%`} />
      <Metric label="Packs" value={String(reviewPacks.length)} />
    </section>
    <section className="panel stack">
      <div className="section-head"><div><span className="eyebrow">FILTROS</span><h2>Escolha uma trilha</h2></div></div>
      <div className="chips">{tracks.map(t=><button className={track===t?'chip active':'chip'} onClick={()=>setTrack(t)} key={t}>{t}</button>)}</div>
    </section>
    <section className="pack-grid">
      {packs.map(pack=><PackCard pack={pack} key={pack.id} progress={progress} />)}
    </section>
  </div>;
}

function Metric({label,value}:{label:string;value:string}) { return <div className="metric-card"><span>{label}</span><strong>{value}</strong><small>salvo neste dispositivo</small></div> }

function PackCard({pack,progress}:{pack:ReviewPack;progress:ReturnType<typeof getGameProgress>}) {
  const types:GameType[]=['crossword','matching','ordering','scenario'];
  const scores=types.map(t=>progress.find(g=>g.gameId===`pack-${pack.id}`&&g.gameType===t)?.bestScore||0);
  const avg=scores.some(Boolean)?Math.round(scores.reduce((a,b)=>a+b,0)/scores.filter(Boolean).length):0;
  return <article className="pack-card">
    <div className="pack-head"><div><span className="eyebrow">PACK {String(pack.id).padStart(2,'0')}</span><h2>{pack.title}</h2><p>Aulas {pack.lessons[0]}–{pack.lessons[1]} · {pack.track}</p></div><div className="score-ring"><strong>{avg}</strong><span>média</span></div></div>
    <div className="game-buttons">{types.map((t,i)=><a href={`#game/${pack.id}/${t}`} className="game-button" key={t}><span>{['⌨','↔','↕','◈'][i]}</span><div><strong>{gameLabels[t]}</strong><small>{scores[i]?`melhor ${scores[i]}%`:'não iniciado'}</small></div></a>)}</div>
  </article>
}

export function GamePlayer({packId,type,onRefresh}:{packId:number;type:GameType;onRefresh:()=>void}) {
  const pack=reviewPacks.find(p=>p.id===packId) || reviewPacks[0];
  return <div className="page stack-lg">
    <div className="game-topbar"><a href="#games">← Cyber Games</a><span>Pack {pack.id} · aulas {pack.lessons[0]}–{pack.lessons[1]}</span></div>
    {type==='crossword'&&<CrosswordGame pack={pack} onDone={onRefresh}/>} 
    {type==='matching'&&<MatchingGame pack={pack} onDone={onRefresh}/>} 
    {type==='ordering'&&<OrderingGame pack={pack} onDone={onRefresh}/>} 
    {type==='scenario'&&<ScenarioGame pack={pack} onDone={onRefresh}/>} 
  </div>;
}

function CrosswordGame({pack,onDone}:{pack:ReviewPack;onDone:()=>void}) {
  const start=useRef(Date.now());
  const selected=useMemo(()=>pickWithRecency(`cw-${pack.id}`,pack.crosswordPool,Math.min(14,pack.crosswordPool.length)),[pack.id]);
  const board=useMemo(()=>buildCrossword(selected),[selected]);
  const [cells,setCells]=useState<Record<string,string>>({});
  const [active,setActive]=useState(board.placements[0]?.id||'');
  const [mistakes,setMistakes]=useState(0);
  const [hints,setHints]=useState(0);
  const [result,setResult]=useState<number|null>(null);
  const placement=board.placements.find(p=>p.id===active);
  const used=Object.keys(board.cells).map(k=>k.split('-').map(Number));
  const minR=Math.min(...used.map(x=>x[0])),maxR=Math.max(...used.map(x=>x[0])),minC=Math.min(...used.map(x=>x[1])),maxC=Math.max(...used.map(x=>x[1]));
  const keyFor=(p:typeof board.placements[number],i:number)=>`${p.row+(p.dir==='down'?i:0)}-${p.col+(p.dir==='across'?i:0)}`;
  const wordValue=(p:typeof board.placements[number])=>p.answer.split('').map((_,i)=>cells[keyFor(p,i)]||'').join('');
  const setCell=(key:string,val:string)=>setCells(prev=>({...prev,[key]:normalize(val).slice(-1)}));
  const revealLetter=()=>{
    if(!placement) return;
    const missing=placement.answer.split('').map((_,i)=>keyFor(placement,i)).find(k=>cells[k]!==board.cells[k].answer);
    if(missing){setCell(missing,board.cells[missing].answer);setHints(h=>h+1)}
  };
  const revealWord=()=>{ if(!placement)return; const n={...cells};placement.answer.split('').forEach((ch,i)=>n[keyFor(placement,i)]=ch);setCells(n);setHints(h=>h+2); };
  const finish=()=>{
    let correct=0; board.placements.forEach(p=>{if(wordValue(p)===p.answer) correct++});
    const wrong=board.placements.length-correct; setMistakes(m=>m+wrong);
    const score=scoreFrom(correct,board.placements.length,mistakes+wrong,hints);
    setResult(score);
    saveGameProgress({gameId:`pack-${pack.id}`,gameType:'crossword',relatedLessons:[pack.lessons[0],pack.lessons[1]],score,attempts:1,correct,mistakes:mistakes+wrong,hintsUsed:hints,durationSec:Math.round((Date.now()-start.current)/1000),completedAt:new Date().toISOString(),bestScore:score,weakConcepts:board.placements.filter(p=>wordValue(p)!==p.answer).map(p=>p.answer)});
    onDone();
  };
  return <section className="game-shell panel stack-lg">
    <GameHeader icon="⌨" title="Cruzadinha" subtitle="Fixe vocabulário sem depender de decoreba isolada." />
    {result!==null&&<Result score={result} onReplay={()=>location.reload()} />}
    <div className="crossword-layout">
      <div className="crossword-scroll"><div className="crossword-grid" style={{gridTemplateColumns:`repeat(${maxC-minC+1}, minmax(28px, 38px))`}}>
        {Array.from({length:(maxR-minR+1)*(maxC-minC+1)},(_,idx)=>{
          const r=minR+Math.floor(idx/(maxC-minC+1)),c=minC+idx%(maxC-minC+1),key=`${r}-${c}`,cell=board.cells[key];
          if(!cell)return <div className="cw-blank" key={key}/>;
          const activeCell=placement?.answer.split('').some((_,i)=>keyFor(placement,i)===key);
          return <label className={`cw-cell ${activeCell?'active':''}`} key={key}>{cell.number&&<small>{cell.number}</small>}<input aria-label={`célula ${r} ${c}`} value={cells[key]||''} onChange={(e:any)=>setCell(key,e.target.value)} onFocus={()=>setActive(cell.wordIds[0])} maxLength={1}/></label>;
        })}
      </div></div>
      <div className="clue-panel stack"><div className="clue-actions"><button className="button ghost" onClick={revealLetter}>Dica: letra</button><button className="button ghost" onClick={revealWord}>Revelar palavra</button></div>
        <div className="clue-groups"><div><h3>Horizontais</h3>{board.placements.filter(p=>p.dir==='across').map(p=><button className={active===p.id?'clue active':'clue'} onClick={()=>setActive(p.id)} key={p.id}><b>{p.number}</b>{p.clue}</button>)}</div><div><h3>Verticais</h3>{board.placements.filter(p=>p.dir==='down').map(p=><button className={active===p.id?'clue active':'clue'} onClick={()=>setActive(p.id)} key={p.id}><b>{p.number}</b>{p.clue}</button>)}</div></div>
      </div>
    </div>
    <button className="button primary wide" onClick={finish}>Finalizar cruzadinha</button>
  </section>;
}

function MatchingGame({pack,onDone}:{pack:ReviewPack;onDone:()=>void}) {
  const start=useRef(Date.now());
  const pairs=useMemo(()=>pickWithRecency(`match-${pack.id}`,pack.matchingPool,Math.min(8,pack.matchingPool.length)),[pack.id]);
  const rights=useMemo(()=>[...pairs].sort(()=>Math.random()-.5),[pairs]);
  const [left,setLeft]=useState<string|null>(null);
  const [matched,setMatched]=useState<Record<string,string>>({});
  const [mistakes,setMistakes]=useState(0);
  const [message,setMessage]=useState('Escolha um conceito e depois a definição correspondente.');
  const [result,setResult]=useState<number|null>(null);
  const chooseRight=(rightId:string)=>{
    if(!left)return;
    if(left===rightId){const p=pairs.find(x=>x.id===left)!;const next={...matched,[left]:rightId};setMatched(next);setMessage(`Correto: ${p.explanation}`);setLeft(null);if(Object.keys(next).length===pairs.length){const score=scoreFrom(pairs.length,pairs.length,mistakes,0);setResult(score);saveGameProgress({gameId:`pack-${pack.id}`,gameType:'matching',relatedLessons:[pack.lessons[0],pack.lessons[1]],score,attempts:1,correct:pairs.length,mistakes,hintsUsed:0,durationSec:Math.round((Date.now()-start.current)/1000),completedAt:new Date().toISOString(),bestScore:score});onDone();}}
    else {setMistakes(m=>m+1);setMessage('Não encaixa. Compare função e contexto antes de tentar novamente.');}
  };
  return <section className="game-shell panel stack-lg"><GameHeader icon="↔" title="Associação" subtitle="Conecte conceito, função, ferramenta e defesa." />{result!==null&&<Result score={result} onReplay={()=>location.reload()} />}
    <div className="matching-board"><div className="match-col">{pairs.map(p=><button disabled={!!matched[p.id]} onClick={()=>setLeft(p.id)} className={`match-item ${left===p.id?'selected':''} ${matched[p.id]?'matched':''}`} key={p.id}>{p.left}</button>)}</div><div className="match-col">{rights.map(p=><button disabled={!!matched[p.id]} onClick={()=>chooseRight(p.id)} className={`match-item right ${matched[p.id]?'matched':''}`} key={p.id}>{p.right}</button>)}</div></div>
    <div className="feedback neutral">{message}</div><div className="game-mini-stats"><span>Acertos {Object.keys(matched).length}/{pairs.length}</span><span>Erros {mistakes}</span></div>
  </section>;
}

function OrderingGame({pack,onDone}:{pack:ReviewPack;onDone:()=>void}) {
  const start=useRef(Date.now());
  const challenge=useMemo(()=>pack.orderingPool[Math.floor(Math.random()*pack.orderingPool.length)],[pack.id]);
  const [steps,setSteps]=useState(()=>[...challenge.steps].sort(()=>Math.random()-.5));
  const [mistakes,setMistakes]=useState(0);
  const [feedback,setFeedback]=useState('Organize da primeira para a última etapa.');
  const [result,setResult]=useState<number|null>(null);
  const move=(i:number,d:number)=>{const j=i+d;if(j<0||j>=steps.length)return;const n=[...steps];[n[i],n[j]]=[n[j],n[i]];setSteps(n)};
  const verify=()=>{const ok=steps.every((s,i)=>s===challenge.steps[i]);if(ok){const score=Math.max(0,100-mistakes*7);setResult(score);setFeedback(challenge.explanation);saveGameProgress({gameId:`pack-${pack.id}`,gameType:'ordering',relatedLessons:[pack.lessons[0],pack.lessons[1]],score,attempts:1,correct:steps.length,mistakes,hintsUsed:0,durationSec:Math.round((Date.now()-start.current)/1000),completedAt:new Date().toISOString(),bestScore:score});onDone();}else{setMistakes(m=>m+1);setFeedback('Ainda há etapas fora de posição. Pense em pré-condições: o que precisa acontecer antes do quê?')}};
  return <section className="game-shell panel stack-lg"><GameHeader icon="↕" title="Ordenação" subtitle={challenge.title} />{result!==null&&<Result score={result} onReplay={()=>location.reload()} />}
    <div className="ordering-list">{steps.map((s,i)=><div className="order-item" key={s}><b>{i+1}</b><span>{s}</span><div><button aria-label="subir" onClick={()=>move(i,-1)}>↑</button><button aria-label="descer" onClick={()=>move(i,1)}>↓</button></div></div>)}</div>
    <div className="feedback neutral">{feedback}</div><button className="button primary wide" onClick={verify}>Verificar ordem</button>
  </section>;
}

function ScenarioGame({pack,onDone}:{pack:ReviewPack;onDone:()=>void}) {
  const start=useRef(Date.now());
  const pool=useMemo(()=>scenarios.filter(s=>pack.scenarioIds.includes(s.id)),[pack.id]);
  const [index,setIndex]=useState(0);const [selected,setSelected]=useState<number|null>(null);const [correct,setCorrect]=useState(0);const [mistakes,setMistakes]=useState(0);const [result,setResult]=useState<number|null>(null);
  const s:Scenario=pool[index%pool.length];
  const next=()=>{if(selected===null)return;const ok=selected===s.answer;const c=correct+(ok?1:0),m=mistakes+(ok?0:1);if(index===pool.length-1){const score=scoreFrom(c,pool.length,m,0);setCorrect(c);setMistakes(m);setResult(score);saveGameProgress({gameId:`pack-${pack.id}`,gameType:'scenario',relatedLessons:[pack.lessons[0],pack.lessons[1]],score,attempts:1,correct:c,mistakes:m,hintsUsed:0,durationSec:Math.round((Date.now()-start.current)/1000),completedAt:new Date().toISOString(),bestScore:score,weakConcepts:!ok?[s.title]:[]});onDone();}else{setCorrect(c);setMistakes(m);setIndex(i=>i+1);setSelected(null)}};
  return <section className="game-shell panel stack-lg"><GameHeader icon="◈" title="Cenários" subtitle="Decida com base em evidências, não em palavras-chave." />{result!==null&&<Result score={result} onReplay={()=>location.reload()} />}
    {result===null&&<><div className="scenario-meta"><span>{s.track}</span><span>{s.difficulty}</span><span>Aulas {s.relatedLessons.join(', ')}</span><span>{index+1}/{pool.length}</span></div><h2>{s.title}</h2><pre className="evidence">{s.evidence}</pre><h3>{s.question}</h3><div className="option-list">{s.options.map((o,i)=><button className={selected===i?'option selected':'option'} onClick={()=>setSelected(i)} key={o}>{o}</button>)}</div>{selected!==null&&<div className={selected===s.answer?'feedback ok':'feedback bad'}>{selected===s.answer?'Boa decisão. ':'Revise a hipótese. '}{s.explanation}</div>}<button disabled={selected===null} className="button primary" onClick={next}>{index===pool.length-1?'Finalizar cenário':'Próximo cenário'}</button></>}
  </section>;
}

function GameHeader({icon,title,subtitle}:{icon:string;title:string;subtitle:string}) { return <div className="game-header"><span className="game-icon">{icon}</span><div><span className="eyebrow">GAME MODE</span><h1>{title}</h1><p>{subtitle}</p></div></div> }
function Result({score,onReplay}:{score:number;onReplay:()=>void}) { return <div className="game-result"><div><span>RESULTADO</span><strong>{score}%</strong></div><p>{score>=85?'Domínio forte. Avance e retorne depois para retenção espaçada.':score>=65?'Bom progresso. Revise os erros antes de avançar.':'Vale revisar as aulas relacionadas e tentar novamente.'}</p><button className="button ghost" onClick={onReplay}>Jogar novamente</button></div> }

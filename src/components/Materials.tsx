import { useMemo, useState } from 'react';
import { driveFolderUrl, materials } from '../data/materials';

export function MaterialsHub() {
  const [category,setCategory]=useState('Todos');
  const categories=['Todos','Apostilas','Scanner','Laboratórios','Ferramentas','Projeto'];
  const filtered=useMemo(()=>category==='Todos'?materials:materials.filter(m=>m.category===category),[category]);

  return <div className="page stack-lg">
    <section className="page-title materials-title">
      <div><span className="eyebrow">BIBLIOTECA</span><h1>Materiais do curso</h1><p>Os arquivos que estavam organizados no Drive agora também fazem parte do Cyber Study Hub.</p></div>
      <a className="button ghost" href={driveFolderUrl} target="_blank" rel="noreferrer">Abrir pasta original no Drive</a>
    </section>

    <section className="filter-bar">
      <div className="chips">{categories.map(c=><button key={c} className={category===c?'chip active':'chip'} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    </section>

    <section className="materials-grid">
      {filtered.map(m=><article className="material-card" key={m.id}>
        <div className="material-top"><span className={`file-kind kind-${m.kind.toLowerCase()}`}>{m.kind}</span><span>{m.lessons || m.category}</span></div>
        <h3>{m.title}</h3>
        <p>{m.description}</p>
        <div className="material-footer"><small>{m.sizeLabel || m.category}</small><a className="button ghost compact" href={`#material/${m.id}`}>Abrir material</a></div>
      </article>)}
    </section>

    <section className="panel material-note">
      <span className="eyebrow">ORIGEM</span>
      <h2>Pasta recuperada do seu Drive</h2>
      <p>A estrutura original tinha Aulas e apostilas, Materiais Visuais, Scanner Defensivo, Aplicativos, Laboratórios e Códigos e Relatórios/Projeto Final. Os arquivos úteis disponíveis foram trazidos para esta versão; pastas vazias continuam representadas pelo conteúdo do aplicativo e podem receber novos materiais depois.</p>
    </section>
  </div>;
}

export function MaterialViewer({id}:{id:string}) {
  const material=materials.find(m=>m.id===id) || materials[0];
  return <div className="page stack-lg material-viewer-page">
    <div className="material-viewer-head">
      <div><a className="text-link" href="#materials">← Materiais</a><span className="eyebrow">{material.category}</span><h1>{material.title}</h1><p>{material.description}</p></div>
      <a className="button primary" href={material.href} target="_blank" rel="noreferrer">Abrir em tela cheia</a>
    </div>
    <section className="material-frame-panel">
      <iframe className="material-frame" src={material.href} title={material.title} />
    </section>
  </div>;
}

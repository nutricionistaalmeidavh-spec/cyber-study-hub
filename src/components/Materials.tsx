import { useMemo, useState } from 'react';
import { driveFolderUrl, materials } from '../data/materials';

export function MaterialsHub() {
  const [category,setCategory]=useState('Todos');
  const categories=['Todos','Apostilas','Scanner','Laboratórios','Ferramentas','Projeto'];
  const filtered=useMemo(()=>category==='Todos'?materials:materials.filter(m=>m.category===category),[category]);

  return <div className="page stack-lg materials-page">
    <header className="materials-intro" aria-labelledby="materials-title">
      <div><span className="eyebrow">ARTISYS / ACERVO DE ESTUDOS</span>
        <h1 id="materials-title">Biblioteca de apoio.</h1>
        <p>Apostilas, roteiros e arquivos para consultar durante as aulas e os laboratórios.</p></div>
      <div className="materials-collection-mark" aria-label={materials.length+' materiais disponíveis'}>
        <strong>{String(materials.length).padStart(2,'0')}</strong><span>ITENS NO ACERVO</span>
      </div>
    </header>
    <section className="materials-browser" aria-labelledby="materials-browser-title">
      <div className="materials-section-head">
        <div><span className="eyebrow">01 / EXPLORE O ACERVO</span><h2 id="materials-browser-title">Encontre o material certo.</h2></div>
        <a className="materials-drive-link" href={driveFolderUrl} target="_blank" rel="noopener noreferrer">Pasta original no Drive ↗</a>
      </div>
      <div className="materials-category-bar" role="group" aria-label="Filtrar materiais por categoria">
        {categories.map(c=><button type="button" key={c} className={category===c?'chip active':'chip'}
          aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}
          <span>{c==='Todos'?materials.length:materials.filter(m=>m.category===c).length}</span>
        </button>)}
      </div>
      <p className="materials-result-count" role="status">{filtered.length} {filtered.length===1?'material encontrado':'materiais encontrados'}{category!=='Todos'?' em '+category:''}</p>
      {filtered.length>0 ? <div className="materials-grid">
        {filtered.map((m,index)=><article className="material-card" data-category={m.category} key={m.id}>
          <span className="material-index" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>
          <div className="material-card-body">
            <div className="material-top">
              <span className={'file-kind kind-'+m.kind.toLowerCase()}>{m.kind}</span>
              <span>{m.category}</span>{m.lessons && <span>Aulas {m.lessons}</span>}
            </div>
            <h3>{m.title}</h3><p>{m.description}</p>
          </div>
          <div className="material-footer"><small>{m.sizeLabel||'Arquivo de apoio'}</small>
            <a className="material-open" href={'#material/'+m.id} aria-label={'Abrir material: '+m.title}>Abrir <span aria-hidden="true">↗</span></a>
          </div>
        </article>)}
      </div> : <div className="materials-empty">Nenhum material nesta categoria. Escolha outra acima.</div>}
    </section>
    <details className="materials-source">
      <summary>Sobre a origem dos materiais <span aria-hidden="true">+</span></summary>
      <p>O acervo reúne arquivos úteis que estavam organizados no Drive, incluindo apostilas, scanner, laboratórios, ferramentas e projeto final. As categorias refletem os arquivos realmente disponíveis.</p>
    </details>
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

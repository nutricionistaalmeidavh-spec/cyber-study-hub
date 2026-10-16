import {useEffect,useState,type FormEvent} from 'react';
import {platformApi} from './PlatformGate';

type Offer={priceCents:number|null;currency:'BRL';billingPeriod:'monthly';periodDays:30;updatedAt:string|null};
const formatBRL=(cents:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cents/100);

export function SubscriptionOfferAdmin(){
  const [price,setPrice]=useState('');
  const [saved,setSaved]=useState<Offer|null>(null);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  useEffect(()=>{
    let alive=true;
    platformApi<Offer>('/api/subscription/offer').then(result=>{
      if(!alive)return;
      setSaved(result);setPrice(result.priceCents===null?'':(result.priceCents/100).toFixed(2).replace('.',','));
    }).catch(e=>{if(alive)setError(String(e).replace(/^Error: /,''));})
      .finally(()=>{if(alive)setLoading(false);});
    return()=>{alive=false};
  },[]);
  const save=async(e:FormEvent)=>{
    e.preventDefault();setError('');setMessage('');
    const raw=price.trim();
    if(raw && !/^\d{1,6}(?:[,.]\d{1,2})?$/.test(raw)){
      setError('Informe reais e centavos (ex.: 49,90) ou deixe em branco.');
      return;
    }
    const value=raw?Math.round(Number(raw.replace(',','.'))*100):null;
    if(value!==null&&(value<100||value>10000000)){setError('O preço deve ficar entre R$ 1,00 e R$ 100.000,00.');return;}
    setBusy(true);
    try{
      const next=await platformApi<Offer>('/api/admin/subscription/offer','PUT',{priceCents:value});
      setSaved(next);setMessage(value===null?'Preço retirado da vitrine.':'Preço mensal salvo. A vitrine pública já poderá exibir '+formatBRL(value)+'.');
    }catch(e){setError(String(e).replace(/^Error: /,''));}
    finally{setBusy(false);}
  };
  return <section className="panel stack" aria-labelledby="subscription-price-admin">
    <div className="section-head"><div><span className="eyebrow">ASSINATURA · GESTÃO COMERCIAL</span><h2 id="subscription-price-admin">Preço da assinatura completa</h2></div></div>
    <p>A assinatura mensal oferece acesso a todos os cursos <strong>publicados</strong> durante a vigência. O acesso termina ao vencer ou ser revogado, sem apagar o progresso do aluno. Pré-lançamentos em lista de espera não liberam conteúdo.</p>
    <form className="platform-form" onSubmit={e=>void save(e)}>
      <label>Valor mensal (R$)
        <input type="text" inputMode="decimal" autoComplete="off" placeholder="Ex.: 49,90" maxLength={10}
          value={price} onChange={e=>setPrice(e.target.value)} disabled={loading||busy}/>
      </label>
      <p className="muted">{loading?'Carregando configuração…':saved?.priceCents===null?'Sem preço definido na vitrine.':'Valor atual: '+(saved?.priceCents!=null?formatBRL(saved.priceCents):'não definido')+' / mês'}</p>
      <div className="wrap">
        <button className="button primary" type="submit" disabled={busy||loading}>{busy?'Salvando…':'Salvar preço mensal'}</button>
        <button type="button" className="button ghost" disabled={busy||loading} onClick={()=>setPrice('')}>Limpar campo</button>
      </div>
    </form>
    <p className="muted">A edição do preço atualiza somente a vitrine. Não cobra ninguém, não altera assinaturas existentes e não configura nem sincroniza valores com o ArtiSys Pagamentos. Confira o valor no gateway antes de habilitar o checkout.</p>
    {error&&<p className="platform-error" role="alert">{error}</p>}
    {message&&<p role="status">{message}</p>}
  </section>;
}

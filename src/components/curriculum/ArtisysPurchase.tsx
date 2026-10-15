import { useEffect, useState } from 'react';
import './artisys-purchase.css';

type Offer = { id:string;productId:string;name:string;priceCents:number;currency:string;saleType:string;deliveryMode:string };
const flag=import.meta.env.VITE_ARTISYS_CHECKOUT_ENABLED==='true';
const paymentsBase=String(import.meta.env.VITE_ARTISYS_PAYMENTS_URL||'').trim().replace(/\/$/,'');
const baseUrl=(()=>{
 try{
  const url=new URL(paymentsBase);
  if(url.username||url.password||url.search||url.hash||url.pathname!=='/' ||
    (url.protocol!=='https:'&&!(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname))))return null;
  return url.origin;
 }catch{return null;}
})();
const brl=(cents:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cents/100);
const validOffer=(value:unknown):value is Offer=>{
 if(!value||typeof value!=='object')return false;
 const o=value as Record<string,unknown>;
 return typeof o.id==='string'&&/^[a-z0-9][a-z0-9_.-]{2,79}$/.test(o.id)&&
 typeof o.productId==='string'&&typeof o.name==='string'&&Number.isSafeInteger(o.priceCents)&&
 Number(o.priceCents)>0&&o.currency==='BRL'&&o.deliveryMode==='webhook'&&
 ['one_time','monthly','yearly'].includes(String(o.saleType));
};

export default function ArtisysPurchase({courseId,email}:{courseId:string;email?:string}) {
 const [offers,setOffers]=useState<Offer[]>([]);
 const [error,setError]=useState(false);
 useEffect(()=>{
  if(!flag||!baseUrl||!email)return;
  let active=true;
  const control=new AbortController();
  fetch(baseUrl+'/v1/catalog',{signal:control.signal,cache:'no-store'})
   .then(async response=>{if(!response.ok)throw Error('catalog unavailable');return response.json();})
   .then((payload:unknown)=>{
    if(!active)return;
    const values=(payload&&typeof payload==='object'&&'offers' in payload)?(payload as {offers:unknown}).offers:null;
    setOffers(Array.isArray(values)?values.filter(validOffer):[]);
   }).catch(()=>{if(active)setError(true);});
  return()=>{active=false;control.abort();};
 },[email]);
 if(!flag||!baseUrl||!email)return null;
 const course=offers.find(offer=>offer.productId==='hubestudos-course-'+courseId&&offer.saleType==='one_time');
 const monthly=offers.find(offer=>offer.productId==='hubestudos-subscription'&&offer.saleType==='monthly');
 const yearly=offers.find(offer=>offer.productId==='hubestudos-subscription'&&offer.saleType==='yearly');
 if(!course&&!monthly&&!yearly)return error?<p className="artisys-purchase-note" role="status">Ofertas temporariamente indisponíveis. Seu acesso atual permanece inalterado.</p>:null;
 const destination=(id:string)=>baseUrl+'/comprar?oferta='+encodeURIComponent(id);
 return <section className="artisys-purchase" aria-labelledby="artisys-purchase-title">
  <div><span className="eyebrow">PAGAMENTO ARTISYS</span><h2 id="artisys-purchase-title">Escolha seu acesso</h2>
   <p>Use no checkout o mesmo e-mail da sua conta ({email}). A liberação ocorre depois da confirmação financeira.</p></div>
  <div className="artisys-purchase-actions">
   {course&&<a className="button primary" href={destination(course.id)} target="_blank" rel="noopener noreferrer">Comprar este curso · {brl(course.priceCents)}</a>}
   {monthly&&<a className="button ghost" href={destination(monthly.id)} target="_blank" rel="noopener noreferrer">Assinar mensal · {brl(monthly.priceCents)}</a>}
   {yearly&&<a className="button ghost" href={destination(yearly.id)} target="_blank" rel="noopener noreferrer">Assinar anual · {brl(yearly.priceCents)}</a>}
  </div>
  <p className="artisys-purchase-note">Após o pagamento confirmado, recarregue o HubEstudos para atualizar o acesso. A cobrança e seus comprovantes ficam no ArtiSys Pagamentos.</p>
 </section>;
}

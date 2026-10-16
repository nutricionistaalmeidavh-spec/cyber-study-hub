import { useEffect, useState } from 'react';
import './artisys-purchase.css';
import {platformApi} from '../PlatformGate';

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
 const [purchaseError,setPurchaseError]=useState('');
 const [pending,setPending]=useState('');
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
 const buy=async(offer:Offer)=>{
  if(!baseUrl||pending)return;
  setPending(offer.id);setPurchaseError('');
  try{
   const {buyerBinding}=await platformApi<{buyerBinding:string}>('/api/billing/purchase-intent','POST',
     {productId:offer.productId,saleType:offer.saleType});
   window.location.assign(baseUrl+'/comprar?oferta='+encodeURIComponent(offer.id)+'&buyer='+encodeURIComponent(buyerBinding));
  }catch(e){setPurchaseError(String(e).replace(/^Error: /,''));setPending('');}
 };
 return <section className="artisys-purchase" aria-labelledby="artisys-purchase-title">
  <div><span className="eyebrow">PAGAMENTO ARTISYS</span><h2 id="artisys-purchase-title">Escolha seu acesso</h2>
   <p>Seu pedido será vinculado à conta autenticada ({email}). Não é necessário código por e-mail. O acesso é liberado somente após pagamento confirmado.</p></div>
  <div className="artisys-purchase-actions">
   {course&&<button type="button" disabled={Boolean(pending)} className="button primary" onClick={()=>void buy(course)}>{pending===course.id?'Preparando compra…':'Comprar esta trilha · '+brl(course.priceCents)}</button>}
   {monthly&&<button type="button" disabled={Boolean(pending)} className="button ghost" onClick={()=>void buy(monthly)}>{pending===monthly.id?'Preparando compra…':'Assinar mensal · '+brl(monthly.priceCents)}</button>}
   {yearly&&<button type="button" disabled={Boolean(pending)} className="button ghost" onClick={()=>void buy(yearly)}>{pending===yearly.id?'Preparando compra…':'Assinar anual · '+brl(yearly.priceCents)}</button>}
  </div>
  {purchaseError&&<p className="artisys-purchase-note" role="alert">{purchaseError}</p>}
  <p className="artisys-purchase-note">Após o pagamento confirmado, recarregue o HubEstudos para atualizar o acesso. A cobrança e seus comprovantes ficam no ArtiSys Pagamentos.</p>
 </section>;
}

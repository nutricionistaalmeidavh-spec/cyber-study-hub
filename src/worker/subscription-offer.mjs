// Preço de vitrine é independente dos direitos de acesso e do gateway de cobrança.
// Persistência local SQLite (Node ou Durable Objects); nenhuma API paga é necessária.
export const SUBSCRIPTION_OFFER_SCHEMA=[
  "CREATE TABLE IF NOT EXISTS subscription_offer (id INTEGER PRIMARY KEY CHECK(id=1),price_cents INTEGER CHECK(price_cents IS NULL OR (price_cents BETWEEN 100 AND 10000000)),updated_at TEXT NOT NULL)"
];
export const subscriptionOfferRoute=path=>path==='/api/subscription/offer'||path==='/api/admin/subscription/offer';
export async function handleSubscriptionOffer({path,method,readBody,requireAdmin,one,run,reply,fail}){
  if(path==='/api/subscription/offer'&&method==='GET'){
    const current=one('SELECT price_cents,updated_at FROM subscription_offer WHERE id=1');
    return reply(200,{priceCents:current?.price_cents??null,currency:'BRL',billingPeriod:'monthly',periodDays:30,updatedAt:current?.updated_at??null});
  }
  if(path==='/api/admin/subscription/offer'&&method==='PUT'){
    await requireAdmin();
    const body=await readBody(512);
    // null remove o valor publicado; nenhum preço arbitrário vindo da UI concede acesso.
    const price=body.priceCents;
    if(price!==null&&(!Number.isSafeInteger(price)||price<100||price>10000000))
      throw fail(400,'Informe um valor entre R$ 1,00 e R$ 100.000,00 ou deixe sem preço.');
    const updatedAt=new Date().toISOString();
    run('INSERT INTO subscription_offer(id,price_cents,updated_at) VALUES(1,?,?) ON CONFLICT(id) DO UPDATE SET price_cents=excluded.price_cents,updated_at=excluded.updated_at',price,updatedAt);
    return reply(200,{priceCents:price,currency:'BRL',billingPeriod:'monthly',periodDays:30,updatedAt});
  }
  throw fail(404,'Rota não encontrada.');
}

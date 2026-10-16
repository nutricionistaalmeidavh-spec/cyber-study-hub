import {useEffect,useState,type FormEvent} from 'react';
import {waitlistCatalogCourses} from '../curriculum/courseOfferings';
import './academy-waitlist.css';

type Status='idle'|'sending'|'success'|'error';
export default function AcademyWaitlist({selectedCourseId}:{selectedCourseId?:string}){
  const courseFromUrl=new URLSearchParams(window.location.search).get('curso');
  const initial=waitlistCatalogCourses.some(c=>c.id===courseFromUrl)?String(courseFromUrl):'academy';
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [courseId,setCourseId]=useState(selectedCourseId && waitlistCatalogCourses.some(c=>c.id===selectedCourseId)?selectedCourseId:initial);
  useEffect(()=>{
    if(selectedCourseId && (selectedCourseId==='academy'||waitlistCatalogCourses.some(c=>c.id===selectedCourseId)))
      setCourseId(selectedCourseId);
  },[selectedCourseId]);
  const [consent,setConsent]=useState(false);
  const [website,setWebsite]=useState('');
  const [status,setStatus]=useState<Status>('idle');
  const [message,setMessage]=useState('');

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(status==='sending'||!consent)return;
    setStatus('sending');setMessage('');
    try{
      const response=await fetch('/api/waitlist',{
        method:'POST',credentials:'same-origin',cache:'no-store',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name,email,courseId,consent,website})
      });
      const data=await response.json() as {error?:string;message?:string;ok?:boolean};
      if(!response.ok||!data.ok)throw new Error(data.error||'Não foi possível registrar sua inscrição.');
      setStatus('success');
      setMessage('Interesse registrado! Avisaremos sobre a abertura de vagas ou novidades da formação escolhida.');
    }catch(error){
      setStatus('error');
      setMessage(error instanceof Error?error.message:'Não foi possível concluir. Tente novamente.');
    }
  }

  return <section className="academy-waitlist-section" id="lista-de-espera" aria-labelledby="academy-waitlist-title">
    <div className="academy-container academy-waitlist-layout">
      <div className="academy-waitlist-copy">
        <span className="academy-section-index">04 / SEU PRÓXIMO PASSO</span>
        <div className="academy-waitlist-label"><span aria-hidden="true" /> INSCRIÇÕES DE INTERESSE ABERTAS</div>
        <h2 id="academy-waitlist-title">Seja um dos primeiros <em>a saber.</em></h2>
        <p>Os formatos de acesso estão em preparação. Entre gratuitamente na lista para receber novidades sobre a abertura das vagas do curso que mais combina com você.</p>
        <div className="academy-waitlist-highlights">
          <span><b>01</b> Escolha seu curso</span>
          <span><b>02</b> Registre seu interesse</span>
          <span><b>03</b> Aguarde as novidades</span>
        </div>
        <small>Entrar na lista não reserva uma vaga, não cria uma conta e não gera cobrança.</small>
      </div>
      <div className="academy-waitlist-form-card">
        {status==='success'?<div className="academy-waitlist-success" role="status">
          <span className="academy-waitlist-success-icon" aria-hidden="true">✓</span>
          <span className="academy-waitlist-form-kicker">INTERESSE RECEBIDO</span>
          <h3>Você está na lista.</h3>
          <p>{message}</p>
          <button className="academy-button academy-button-outline" type="button" onClick={()=>{
            setStatus('idle');setName('');setEmail('');setConsent(false);setCourseId('academy');setWebsite('');
          }}>Cadastrar outro interesse <span aria-hidden="true">→</span></button>
        </div>:<>
          <span className="academy-waitlist-form-kicker">LISTA DE ESPERA · ARTISYS ACADEMY</span>
          <h3>Receba o aviso de abertura.</h3>
          <p>Preencha seus dados em menos de um minuto.</p>
          <form onSubmit={submit} className="academy-waitlist-form">
            <label htmlFor="academy-waitlist-name">Seu nome</label>
            <input id="academy-waitlist-name" name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Como podemos te chamar?" value={name} onChange={event=>setName(event.target.value)} disabled={status==='sending'}/>
            <label htmlFor="academy-waitlist-email">Seu melhor e-mail</label>
            <input id="academy-waitlist-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="voce@exemplo.com" value={email} onChange={event=>setEmail(event.target.value)} disabled={status==='sending'}/>
            <label htmlFor="academy-waitlist-course">Curso de interesse</label>
            <select id="academy-waitlist-course" name="course" value={courseId} onChange={event=>setCourseId(event.target.value)} disabled={status==='sending'}>
              <option value="academy">Quero conhecer a Academy</option>
              {waitlistCatalogCourses.map(course=><option key={course.id} value={course.id}>{course.title}</option>)}
            </select>
            <div className="academy-waitlist-trap" aria-hidden="true">
              <label htmlFor="academy-waitlist-website">Site</label>
              <input id="academy-waitlist-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={event=>setWebsite(event.target.value)}/>
            </div>
            <label className="academy-waitlist-consent">
              <input type="checkbox" required checked={consent} onChange={event=>setConsent(event.target.checked)} disabled={status==='sending'}/>
              <span>Concordo em receber por e-mail informações sobre a abertura de vagas e novidades da ArtiSys Academy. Sei que posso solicitar a exclusão dos meus dados.</span>
            </label>
            {status==='error'&&<p className="academy-waitlist-error" role="alert">{message}</p>}
            <button type="submit" className="academy-button academy-button-primary academy-waitlist-submit" disabled={status==='sending'||!consent}>
              {status==='sending'?'Registrando interesse…':'Quero entrar na lista de espera'} <span aria-hidden="true">→</span>
            </button>
          </form>
          <small className="academy-waitlist-privacy">Seus dados serão usados apenas para contato sobre a Academy, sem venda de informações ou inscrição automática em um plano.</small>
        </>}
      </div>
    </div>
  </section>;
}

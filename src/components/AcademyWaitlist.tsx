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
      setMessage('Cadastro confirmado! Você está na lista para receber o aviso quando as inscrições da próxima turma abrirem.');
    }catch(error){
      setStatus('error');
      setMessage(error instanceof Error?error.message:'Não foi possível concluir. Tente novamente.');
    }
  }

  return <section className="academy-waitlist-section" id="lista-de-espera" aria-labelledby="academy-waitlist-title">
    <div className="academy-container academy-waitlist-layout">
      <div className="academy-waitlist-copy">
        <span className="academy-section-index">04 / SEU PRÓXIMO PASSO</span>
        <div className="academy-waitlist-label"><span aria-hidden="true" /> PRÓXIMA TURMA · LISTA DE ESPERA ABERTA</div>
        <h2 id="academy-waitlist-title">Última turma encerrada. <em>Entre na lista da próxima.</em></h2>
        <p>As inscrições da última turma foram encerradas. Deixe seu nome e e-mail para receber o aviso quando as próximas vagas abrirem.</p>
        <div className="academy-waitlist-highlights">
          <span><b>01</b> Escolha seu curso</span>
          <span><b>02</b> Deixe seu e-mail</span>
          <span><b>03</b> Receba o aviso</span>
        </div>
        <small>Entrar na lista é gratuito, não garante vaga e não gera cobrança.</small>
      </div>
      <div className="academy-waitlist-form-card">
        {status==='success'?<div className="academy-waitlist-success" role="status">
          <span className="academy-waitlist-success-icon" aria-hidden="true">✓</span>
          <span className="academy-waitlist-form-kicker">CADASTRO CONFIRMADO</span>
          <h3>Você está na lista.</h3>
          <p>{message}</p>
          <button className="academy-button academy-button-outline" type="button" onClick={()=>{
            setStatus('idle');setName('');setEmail('');setConsent(false);setCourseId('academy');setWebsite('');
          }}>Cadastrar outro interesse <span aria-hidden="true">→</span></button>
        </div>:<>
          <span className="academy-waitlist-form-kicker">LISTA DE ESPERA · ARTISYS ACADEMY</span>
          <h3>Garanta seu aviso da próxima turma.</h3>
          <p>É rápido, gratuito e sem compromisso.</p>
          <form onSubmit={submit} className="academy-waitlist-form">
            <label htmlFor="academy-waitlist-name">Seu nome</label>
            <input id="academy-waitlist-name" name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Como podemos te chamar?" value={name} onChange={event=>setName(event.target.value)} disabled={status==='sending'}/>
            <label htmlFor="academy-waitlist-email">Seu melhor e-mail</label>
            <input id="academy-waitlist-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="voce@exemplo.com" value={email} onChange={event=>setEmail(event.target.value)} disabled={status==='sending'}/>
            <label htmlFor="academy-waitlist-course">Qual formação você quer estudar?</label>
            <select id="academy-waitlist-course" name="course" value={courseId} onChange={event=>setCourseId(event.target.value)} disabled={status==='sending'}>
              <option value="academy">Quero saber da próxima turma</option>
              {waitlistCatalogCourses.map(course=><option key={course.id} value={course.id}>{course.title}</option>)}
            </select>
            <div className="academy-waitlist-trap" aria-hidden="true">
              <label htmlFor="academy-waitlist-website">Site</label>
              <input id="academy-waitlist-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={event=>setWebsite(event.target.value)}/>
            </div>
            <label className="academy-waitlist-consent">
              <input type="checkbox" required checked={consent} onChange={event=>setConsent(event.target.checked)} disabled={status==='sending'}/>
              <span>Quero receber por e-mail o aviso da próxima turma e novidades dos cursos ArtiSys Academy. Posso solicitar a exclusão dos meus dados.</span>
            </label>
            {status==='error'&&<p className="academy-waitlist-error" role="alert">{message}</p>}
            <button type="submit" className="academy-button academy-button-primary academy-waitlist-submit" disabled={status==='sending'||!consent}>
              {status==='sending'?'Registrando interesse…':'Quero ser avisado da próxima turma'} <span aria-hidden="true">→</span>
            </button>
          </form>
          <small className="academy-waitlist-privacy">Usaremos seus dados somente para avisos da Academy. Você não será matriculado nem cobrado ao entrar na lista.</small>
        </>}
      </div>
    </div>
  </section>;
}

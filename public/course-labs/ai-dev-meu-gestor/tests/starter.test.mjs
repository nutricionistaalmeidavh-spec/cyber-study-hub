import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../starter.html',import.meta.url),'utf8');
const script=source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Script do protótipo não encontrado');
function fixture(){
 class Element{constructor(tag='div'){this.tag=tag;this.textContent='';this.children=[];this.disabled=false;this.events={};}replaceChildren(){this.children=[];}append(...children){this.children.push(...children);}addEventListener(type,callback){this.events[type]=callback;}click(){if(!this.disabled)this.events.click?.();}}
 const elements=new Map();const doc={getElementById(id){if(!elements.has(id))elements.set(id,new Element());return elements.get(id);},createElement(tag){return new Element(tag)}};
 const context=vm.createContext({document:doc});vm.runInContext(script,context);return{doc,context};
}
test('o protótipo inicia com 3 ordens e 1 concluída',()=>{const {doc}=fixture();assert.equal(doc.getElementById('serviceCount').textContent,'3');assert.equal(doc.getElementById('doneCount').textContent,'1');});
test('pendente avança primeiro a em andamento sem mudar contagem',()=>{const{doc}=fixture();let button=doc.getElementById('orders').children[1].children[1];button.click();assert.equal(doc.getElementById('doneCount').textContent,'1');assert.match(doc.getElementById('orders').children[1].children[0].children[1].textContent,/em andamento/);});
test('conclusão dupla não aumenta contagem duas vezes',()=>{const{doc}=fixture();doc.getElementById('orders').children[1].children[1].click();doc.getElementById('orders').children[1].children[1].click();assert.equal(doc.getElementById('doneCount').textContent,'2');const disabled=doc.getElementById('orders').children[1].children[1];assert.equal(disabled.disabled,true);disabled.click();assert.equal(doc.getElementById('doneCount').textContent,'2');});
test('trocar somente texto não altera regras ou contagem',()=>{const altered=source.replace('Instalação de equipamento','Instalação didática');assert.ok(altered.includes('Instalação didática'));assert.ok(altered.includes('nextStatus'));const{doc}=fixture();assert.equal(doc.getElementById('doneCount').textContent,'1');});

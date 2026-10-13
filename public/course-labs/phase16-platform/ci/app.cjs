'use strict';
// Fixture sem HTTP/rede: identidade é entregue pelo chamador confiável do teste.
const notes = [{id:'a',owner:'alice',text:'nota A'}, {id:'b',owner:'bob',text:'nota B'}];
exports.readNote = (user,id,unsafe=false) => {
  if (!user) return {status:401};
  const note=notes.find(n=>n.id===id);
  if (!note) return {status:404};
  if (!unsafe && note.owner!==user) return {status:403};
  return {status:200,text:note.text};
};

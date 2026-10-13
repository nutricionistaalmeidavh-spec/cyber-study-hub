'use strict';
// Função de fronteira compartilhada pelo main e testes sem GUI.
exports.createReadHandler = (window, pageURL, identityFor) => (event,args) => {
  // Vincula objeto WebContents e frame principal, não apenas prefixo da URL.
  if (event.sender!==window.webContents || event.senderFrame!==window.webContents.mainFrame || event.senderFrame.url!==pageURL) {
    throw new Error('SENDER_DENIED');
  }
  if (!args || typeof args!=='object' || Array.isArray(args) || Object.keys(args).length!==1 || typeof args.id!=='string' || !/^[ab]$/.test(args.id)) {
    throw new Error('INVALID_ARGUMENT');
  }
  // Identidade vem do estado do main; nunca de args.owner enviado pelo renderer.
  const user=identityFor(event.sender.id);
  if (!user) throw new Error('UNAUTHENTICATED');
  const note={a:{owner:'alice',text:'nota A'},b:{owner:'bob',text:'nota B'}}[args.id];
  if (note.owner!==user) throw new Error('FORBIDDEN');
  return {text:note.text};
};

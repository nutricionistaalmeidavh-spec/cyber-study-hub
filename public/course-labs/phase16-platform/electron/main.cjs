'use strict';
const {app,BrowserWindow,ipcMain,protocol,net}=require('electron');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {createReadHandler}=require('./handler.cjs');
protocol.registerSchemesAsPrivileged([{scheme:'course',privileges:{standard:true,secure:true,supportFetchAPI:true}}]);
const pageURL='course://app/index.html';
let win;
app.whenReady().then(async()=>{
  // Lista finita impede usar o protocolo como leitor arbitrário do filesystem.
  const files={'/index.html':'index.html','/renderer.js':'renderer.js'};
  protocol.handle('course',request=>{
    const u=new URL(request.url);
    const file=Object.hasOwn(files,u.pathname)?files[u.pathname]:null;
    if(u.host!=='app'||u.search||!file) return new Response('not found',{status:404});
    return net.fetch(pathToFileURL(path.join(__dirname,file)).href);
  });
  win=new BrowserWindow({width:650,height:400,webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',e=>e.preventDefault());
  win.webContents.on('will-attach-webview',e=>e.preventDefault());
  win.webContents.session.setPermissionRequestHandler((_wc,_p,cb)=>cb(false));
  win.webContents.session.setPermissionCheckHandler(()=>false);
  // Login sintético explícito; app real usaria sessão verificada fora do renderer.
  const identities=new Map([[win.webContents.id,'alice']]);
  const wcId=win.webContents.id;
  ipcMain.handle('notes:read',createReadHandler(win,pageURL,id=>identities.get(id)));
  win.on('closed',()=>{identities.delete(wcId);ipcMain.removeHandler('notes:read');});
  await win.loadURL(pageURL);
});
app.on('window-all-closed',()=>app.quit());

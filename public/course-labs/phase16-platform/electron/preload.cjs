const {contextBridge,ipcRenderer}=require('electron');
// API de capacidade mínima: renderer não escolhe canal e não recebe event/IPC bruto.
contextBridge.exposeInMainWorld('notes',Object.freeze({read:id=>ipcRenderer.invoke('notes:read',{id})}));

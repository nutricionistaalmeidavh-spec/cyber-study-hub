const output=document.querySelector('#output');
async function read(id){try{output.textContent=JSON.stringify(await window.notes.read(id));}catch(e){output.textContent=e.message;}}
document.querySelector('#own').addEventListener('click',()=>read('a'));
document.querySelector('#other').addEventListener('click',()=>read('b'));

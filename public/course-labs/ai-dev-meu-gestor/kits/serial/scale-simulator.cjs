// Simulador original: usa o contrato de pesagem, sem serialport, sem hardware.
function normalizeWeight(text){
 const value=String(text).trim();
 const match=/^([0-9]+(?:[.,][0-9]{1,3})?)\\s*kg$/i.exec(value);
 if(!match)throw new TypeError('Formato de peso inválido');
 const kg=Number(match[1].replace(',','.'));
 if(!Number.isFinite(kg)||kg<0||kg>300)throw new RangeError('Fora da faixa didática');
 return{kg,unit:'kg',source:'simulated'};
}
if(require.main===module)console.log(JSON.stringify(normalizeWeight(process.argv[2]||'1,250 kg')));
module.exports={normalizeWeight};

// Execute APENAS após instalar @artisys/pdf e upstreams. Não envia dados pela rede.
import {writeFile} from 'node:fs/promises';
import {makeOrderPdfPayload} from './payload.mjs';
const output=process.argv[2];
if (!output || !output.endsWith('.pdf')) {console.error('Uso: node generate-pdf.mjs /caminho/saida.pdf');process.exit(2);}
const [{generatePdf,buildPdfmePlugins},schemas]=await Promise.all([import('@artisys/pdf'),import('@pdfme/schemas')]);
const {template,inputs}=makeOrderPdfPayload({id:'OS-001',cliente:'Cliente Fictício',servico:'Manutenção preventiva',status:'pendente'});
const bytes=await generatePdf({template,inputs,plugins:buildPdfmePlugins(schemas)});
await writeFile(output,bytes,{flag:'wx'}); // arquivo novo, não sobrescrever outro documento
console.log('PDF didático gravado: '+output+' ('+bytes.length+' bytes)');

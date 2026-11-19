const enc=new TextEncoder(),dec=new TextDecoder();
const b64=b=>btoa(Array.from(b,c=>String.fromCharCode(c)).join(''));
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
export async function derive(password,salt){const base=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:310000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
export async function seal(state,key,salt){const iv=crypto.getRandomValues(new Uint8Array(12));const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(state)));return{format:'demandas-vault',version:1,salt:b64(salt),iv:b64(iv),ciphertext:b64(new Uint8Array(ciphertext))}}
export async function unlock(vault,password){if(vault?.format!=='demandas-vault'||vault.version!==1||typeof vault.ciphertext!=='string')throw Error('Backup criptografado inválido.');const salt=bytes(vault.salt),key=await derive(password,salt);const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(vault.iv)},key,bytes(vault.ciphertext));return{state:JSON.parse(dec.decode(plain)),key,salt}}

import{dateISO,normalize}from'./core.js?v=1.7.0';
import{taskBody}from'./task-order.js?v=1.10.0';
export function checklistDate(card,group,fallback=dateISO()){
 const match=String(group?.name||'').match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2}|\d{4}))?(?=\s|$|\s*-)/);
 if(!match)return null;
 const year=match[3]?(match[3].length===2?'20'+match[3]:match[3]):String(card.weekStart||fallback).slice(0,4);
 const value=`${year}-${match[2].padStart(2,'0')}-${match[1].padStart(2,'0')}`,parsed=new Date(value+'T12:00:00');
 return Number.isFinite(parsed.getTime())&&dateISO(parsed)===value?value:null;
}
export function reportDay(state,card,groupId,itemId){const latest=state.timeEntries.filter(e=>e.taskId===itemId).at(-1);return checklistDate(card,card.checklists.find(g=>g.id===groupId),latest?.date)||latest?.date||dateISO()}
export function buildSeSuiteReport(state,factoryId,date){
 const valid=new Date(date+'T12:00:00');if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(valid.getTime())||dateISO(valid)!==date)throw Error('Informe uma data válida.');
 const byTask=new Map();for(const e of state.timeEntries)if(e.date===date&&e.minutes>0)byTask.set(e.taskId,true);
 const selected=[],seen=new Set();
 function add(item){if(!item.done||item.factoryId!==factoryId||seen.has(item.id))return;seen.add(item.id);selected.push(item)}
 for(const card of state.cards)for(const group of card.checklists){const groupDate=checklistDate(card,group,date);for(const item of group.items)if(groupDate===date||!groupDate&&byTask.has(item.id))add(item)}
 for(const item of state.backlog)if(byTask.has(item.id))add(item);
 const texts=[...new Map(selected.map(item=>{const body=taskBody(state,item.text).replace(/[\s;.]+$/,'').trim();return[normalize(body),body]})).values()].filter(Boolean);
 const bullets=texts.map(text=>'- '+text.charAt(0).toLocaleUpperCase('pt-BR')+text.slice(1)+';');
 const label=date.slice(8,10)+'/'+date.slice(5,7)+'/'+date.slice(2,4);
 return{text:label+'\n\n'+bullets.join('\n'),items:selected,count:bullets.length};
}

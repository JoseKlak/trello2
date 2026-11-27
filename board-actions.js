export function removeCard(state,cardId){const index=state.cards.findIndex(card=>card.id===cardId);if(index<0)throw Error('Cartão não encontrado.');return state.cards.splice(index,1)[0]}
export function removeChecklist(state,cardId,groupId){const card=state.cards.find(c=>c.id===cardId);if(!card)throw Error('Cartão não encontrado.');if(groupId==='backlog'){card.sharedBacklog=false;return{shared:true}}const index=card.checklists.findIndex(group=>group.id===groupId);if(index<0)throw Error('Checklist não encontrado.');return{shared:false,checklist:card.checklists.splice(index,1)[0]}}
export function moveCard(state,cardId,listId,beforeId=null){
 const card=state.cards.find(c=>c.id===cardId),list=state.lists.find(l=>l.id===listId&&!l.archivedAt);
 if(!card||!list)throw Error('Cartão ou lista não encontrado.');
 if(beforeId===cardId)return false;
 if(beforeId!==null&&!state.cards.some(c=>c.id===beforeId&&c.listId===listId))throw Error('Posição de destino inválida.');
 const original=state.cards.map(c=>c.id),oldList=card.listId,rest=state.cards.filter(c=>c!==card);
 let index=beforeId===null?rest.findLastIndex(c=>c.listId===listId)+1:rest.findIndex(c=>c.id===beforeId);
 if(beforeId===null&&index===0)index=rest.length;
 rest.splice(index,0,card);card.listId=listId;
 const changed=oldList!==listId||rest.some((c,i)=>c.id!==original[i]);
 if(changed)state.cards.splice(0,state.cards.length,...rest);
 return changed;
}

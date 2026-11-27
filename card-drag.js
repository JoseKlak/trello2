export function cardDropBefore(rows,clientY){return rows.find(row=>clientY<row.top+row.height/2)?.id||null}
export function bindCardDrag({root,onMove,onError}){
 let dragging=null;
 const clear=()=>root.querySelectorAll('.card-drop-before,.card-drop-end,.card-drop-list').forEach(el=>el.classList.remove('card-drop-before','card-drop-end','card-drop-list'));
 const finish=()=>{clear();root.querySelector('.card-dragging')?.classList.remove('card-dragging');delete root.dataset.cardDragging;dragging=null};
 function target(list,y){const rows=[...list.querySelectorAll('[data-card]')].filter(el=>el.dataset.card!==dragging);return cardDropBefore(rows.map(el=>{const r=el.closest('.card-shell').getBoundingClientRect();return{id:el.dataset.card,top:r.top,height:r.height}}),y)}
 root.querySelectorAll('[data-card]').forEach(button=>{
  button.ondragstart=e=>{dragging=button.dataset.card;root.dataset.cardDragging=dragging;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',dragging);button.closest('.card-shell').classList.add('card-dragging')};
  button.ondragend=finish;
  button.onkeydown=e=>{if(!e.altKey||!['ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const list=button.closest('[data-list]'),cards=[...list.querySelectorAll('[data-card]')],index=cards.indexOf(button);if(e.key==='ArrowUp'&&index===0||e.key==='ArrowDown'&&index===cards.length-1)return;const before=e.key==='ArrowUp'?cards[index-1].dataset.card:cards[index+2]?.dataset.card||null;onMove(button.dataset.card,list.dataset.list,before);root.querySelector(`[data-card="${button.dataset.card}"]`)?.focus({preventScroll:true})};
 });
 root.querySelectorAll('[data-list]').forEach(list=>{
  list.ondragover=e=>{if(!dragging)return;e.preventDefault();e.dataTransfer.dropEffect='move';clear();const before=target(list,e.clientY),cards=list.querySelector('.cards'),bounds=cards.getBoundingClientRect();if(e.clientY<bounds.top+35)cards.scrollTop-=12;else if(e.clientY>bounds.bottom-35)cards.scrollTop+=12;if(before)root.querySelector(`[data-card="${before}"]`).closest('.card-shell').classList.add('card-drop-before');else{const remaining=[...list.querySelectorAll('[data-card]')].filter(el=>el.dataset.card!==dragging);if(remaining.length)remaining.at(-1).closest('.card-shell').classList.add('card-drop-end');else cards.classList.add('card-drop-list')}};
  list.ondrop=e=>{if(!dragging)return;e.preventDefault();const id=dragging,before=target(list,e.clientY);finish();try{onMove(id,list.dataset.list,before)}catch(error){onError?.(error)}};
 });
 root.ondragleave=e=>{if(!root.contains(e.relatedTarget))clear()};
}

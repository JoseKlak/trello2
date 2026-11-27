import{cardDropBefore}from'./card-drag.js?v=1.10.0';
// Desktop follows the card drag flow. The handle also supports touch and keyboard.
export function bindTaskDrag({root,onMove,onError}){
 let drag=null,frame=0,ghost=null;
 const rows=group=>[...group.querySelectorAll('.task-list > [data-task-id]')].filter(row=>row.dataset.taskId!==drag?.itemId);
 const clear=()=>root.querySelectorAll('.task-drop-before,.task-drop-end,.task-drop-empty').forEach(el=>el.classList.remove('task-drop-before','task-drop-end','task-drop-empty'));
 function target(group,y){return cardDropBefore(rows(group).map(row=>{const r=row.getBoundingClientRect();return{id:row.dataset.taskId,top:r.top,height:r.height}}),y)}
 function indicate(group,before){clear();const items=rows(group);if(before)items.find(row=>row.dataset.taskId===before)?.classList.add('task-drop-before');else if(items.length)items.at(-1).classList.add('task-drop-end');else group.querySelector('.task-list')?.classList.add('task-drop-empty')}
 function cleanup(){cancelAnimationFrame(frame);clear();drag?.row.classList.remove('task-dragging');ghost?.remove();ghost=null;drag=null;delete root.dataset.taskDragging}
 function scroll(y){const rect=root.getBoundingClientRect();if(y<rect.top+55)root.scrollTop-=14;else if(y>rect.bottom-55)root.scrollTop+=14}
 function move(source,destination){try{onMove(source.groupId,destination.groupId,source.itemId,destination.beforeId)}catch(error){onError?.(error)}}
 function touchTarget(){if(!drag?.active)return;ghost.style.left=drag.x+12+'px';ghost.style.top=drag.y+12+'px';scroll(drag.y);const node=document.elementFromPoint(drag.x,drag.y),group=node?.closest('[data-task-group]');drag.target=null;clear();if(!group||!root.contains(group)||node.closest('.backlog-history'))return;const before=target(group,drag.y);indicate(group,before);drag.target={groupId:group.dataset.taskGroup,beforeId:before}}
 function tick(){if(!drag?.active||drag.kind!=='touch')return;touchTarget();frame=requestAnimationFrame(tick)}
 root.querySelectorAll('.task-list > [data-task-id]').forEach(row=>{
  const handle=row.querySelector('[data-task-handle]'),group=row.closest('[data-task-group]');let eligible=true;
  row.draggable=true;
  row.onpointerdown=e=>{eligible=!e.target.closest('input,textarea,select,button')||Boolean(e.target.closest('[data-task-handle],[data-inline-task]'))};
  row.ondragstart=e=>{if(!eligible||drag?.kind==='touch'){e.preventDefault();return}drag={kind:'native',itemId:row.dataset.taskId,groupId:group.dataset.taskGroup,row};root.dataset.taskDragging=drag.itemId;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',drag.itemId);e.dataTransfer.setDragImage(row,Math.min(30,row.offsetWidth/2),15);row.classList.add('task-dragging')};
  row.ondragend=cleanup;
  handle.onpointerdown=e=>{if(e.pointerType!=='touch'&&e.pointerType!=='pen')return;drag={kind:'touch',pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,groupId:group.dataset.taskGroup,itemId:row.dataset.taskId,row,active:false,target:null};handle.setPointerCapture(e.pointerId)};
  handle.onpointermove=e=>{if(!drag||drag.kind!=='touch'||e.pointerId!==drag.pointerId)return;drag.x=e.clientX;drag.y=e.clientY;if(!drag.active&&Math.hypot(drag.x-drag.startX,drag.y-drag.startY)>6){drag.active=true;root.dataset.taskDragging=drag.itemId;ghost=row.cloneNode(true);ghost.removeAttribute('data-task-id');ghost.className='task task-drag-ghost';ghost.style.width=row.getBoundingClientRect().width+'px';root.append(ghost);row.classList.add('task-dragging');frame=requestAnimationFrame(tick)}if(drag.active){e.preventDefault();touchTarget()}};
  handle.onpointerup=e=>{if(!drag||drag.kind!=='touch'||e.pointerId!==drag.pointerId)return;const source=drag,destination=drag.target;cleanup();if(handle.hasPointerCapture(e.pointerId))handle.releasePointerCapture(e.pointerId);if(source.active&&destination)move(source,destination)};
  handle.onpointercancel=()=>{if(drag?.kind==='touch')cleanup()};handle.onlostpointercapture=()=>{if(drag?.kind==='touch')cleanup()};
  handle.onkeydown=e=>{if(e.key==='Escape'){cleanup();return}if(!['ArrowUp','ArrowDown','PageUp','PageDown'].includes(e.key))return;e.preventDefault();const groups=[...root.querySelectorAll('[data-task-group]')],items=[...group.querySelectorAll('.task-list > [data-task-id]')],index=items.indexOf(row);let destination=group,before=null;if(e.key==='ArrowUp'){if(index===0)return;before=items[index-1].dataset.taskId}else if(e.key==='ArrowDown'){if(index===items.length-1)return;before=items[index+2]?.dataset.taskId||null}else{destination=groups[groups.indexOf(group)+(e.key==='PageUp'?-1:1)];if(!destination)return}move({groupId:group.dataset.taskGroup,itemId:row.dataset.taskId},{groupId:destination.dataset.taskGroup,beforeId:before});root.querySelector(`[data-task-handle="${row.dataset.taskId}"]`)?.focus({preventScroll:true})};
 });
 root.querySelectorAll('[data-task-group]').forEach(group=>{
  group.ondragover=e=>{if(drag?.kind!=='native'||e.target.closest('.backlog-history'))return;e.preventDefault();e.dataTransfer.dropEffect='move';scroll(e.clientY);indicate(group,target(group,e.clientY))};
  group.ondrop=e=>{if(drag?.kind!=='native'||e.target.closest('.backlog-history'))return;e.preventDefault();const source=drag,destination={groupId:group.dataset.taskGroup,beforeId:target(group,e.clientY)};cleanup();move(source,destination)};
 });
 root.ondragleave=e=>{if(!root.contains(e.relatedTarget))clear()};
}

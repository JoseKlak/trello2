import{taskBody}from'./task-order.js?v=1.10.0';
export function bindInlineTasks({root,state,onSave}){
 root.querySelectorAll('[data-inline-task]').forEach(button=>button.onclick=()=>{
  if(root.querySelector('.inline-task-form'))return;
  const row=button.closest('[data-task-id]'),task=[...state.backlog,...state.cards.flatMap(c=>c.checklists.flatMap(g=>g.items))].find(i=>i.id===button.dataset.inlineTask);if(!task)return;
  const form=document.createElement('form');form.className='inline-task-form';const input=document.createElement('textarea');input.value=taskBody(state,task.text);input.required=true;input.rows=2;input.setAttribute('aria-label','Título da atividade');const actions=document.createElement('div');actions.className='inline-task-actions';const save=document.createElement('button');save.type='submit';save.className='primary';save.textContent='Salvar';const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancelar';actions.append(save,cancel);form.append(input,actions);button.hidden=true;button.after(form);row.draggable=false;
  const close=()=>{form.remove();button.hidden=false;row.draggable=!row.classList.contains('task-in-history');button.focus({preventScroll:true})};cancel.onclick=close;
  input.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit()}};
  form.onsubmit=e=>{e.preventDefault();const text=taskBody(state,input.value);if(!text)return;task.text=text;onSave()};input.focus({preventScroll:true});input.select();
 });
}

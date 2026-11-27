export const backlogFinished=item=>Boolean(item.done&&item.sesuitePosted);
export function setTaskCheck(item,field,checked,now=new Date().toISOString()){
 if(!['done','sesuitePosted'].includes(field))throw Error('Controle de atividade inválido.');
 const wasFinished=backlogFinished(item),wasDone=Boolean(item.done),previousCompletedAt=item.completedAt||null;
 item[field]=Boolean(checked);
 if(field==='done'&&checked&&!wasDone)item.completedAt=now;
 if(field==='done'&&!checked)delete item.completedAt;
 const finished=backlogFinished(item);
 if(finished&&!wasFinished){item.closedAt=now;(item.completionHistory||=[]).push({completedAt:item.completedAt||null,closedAt:now})}
 if(wasFinished&&!finished){const history=item.completionHistory?.at(-1);if(history&&!history.reopenedAt)history.reopenedAt=now;else(item.completionHistory||=[]).push({completedAt:previousCompletedAt,closedAt:item.closedAt||null,reopenedAt:now});delete item.closedAt}
 return finished;
}
export function resumeTask(item,now=new Date().toISOString()){
 setTaskCheck(item,'done',false,now);setTaskCheck(item,'sesuitePosted',false,now);
}

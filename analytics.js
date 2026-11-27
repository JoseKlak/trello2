import{dateISO}from'./core.js?v=1.7.0';
import{backlogFinished}from'./task-status.js?v=1.11.0';
export const shiftDay=(day,amount)=>new Date(Date.parse(day+'T12:00:00Z')+amount*86400000).toISOString().slice(0,10);
export function validDay(day){return typeof day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(day)&&Number.isFinite(Date.parse(day+'T12:00:00Z'))&&new Date(day+'T12:00:00Z').toISOString().slice(0,10)===day}
const sum=rows=>rows.reduce((total,row)=>total+row.minutes,0);
const weekday=day=>(new Date(day+'T12:00:00Z').getUTCDay()+6)%7;
const bucket=(day,grouping)=>grouping==='month'?day.slice(0,7)+'-01':grouping==='week'?shiftDay(day,-weekday(day)):day;
export function buildAnalytics(state,{from='',to='',factoryId='',grouping='auto'}={}){
 const source=state.timeEntries.filter(e=>validDay(e.date)&&Number.isFinite(e.minutes)&&e.minutes>0&&(!factoryId||e.factoryId===factoryId));
 const dates=source.map(e=>e.date).sort(),today=dateISO(),start=from||dates[0]||today.slice(0,7)+'-01',end=to||dates.at(-1)||today;
 if(!validDay(start)||!validDay(end)||start>end)throw Error('Informe um período válido: a data inicial deve ser anterior ou igual à final.');
 const duration=Math.round((Date.parse(end+'T12:00:00Z')-Date.parse(start+'T12:00:00Z'))/86400000)+1;
 let actualGrouping=['day','week','month'].includes(grouping)?grouping:duration<=45?'day':duration<=210?'week':'month';
 if(actualGrouping==='day'&&duration>180)actualGrouping='week';if(actualGrouping==='week'&&duration>1260)actualGrouping='month';
 const tasks=new Map();for(const task of state.backlog)tasks.set(task.id,{task,cardId:null,groupId:'backlog'});
 for(const card of state.cards)for(const group of card.checklists)for(const task of group.items)if(!tasks.has(task.id))tasks.set(task.id,{task,cardId:card.id,groupId:group.id});
 const names=new Map(state.factories.map(f=>[f.id,f.name]));
 const entries=source.filter(e=>e.date>=start&&e.date<=end).map(e=>({...e,status:tasks.has(e.taskId)?tasks.get(e.taskId).task.sesuitePosted?'posted':'pending':'unknown'})).sort((a,b)=>b.date.localeCompare(a.date));
 const factories=new Map(),activities=new Map(),series=new Map(),weekdays=Array.from({length:7},(_,i)=>({index:i,minutes:0,days:new Set()}));
 for(let day=bucket(start,actualGrouping);validDay(day)&&day<=end;day=actualGrouping==='month'?(Number(day.slice(5,7))===12?(Number(day.slice(0,4))+1)+'-01-01':day.slice(0,5)+String(Number(day.slice(5,7))+1).padStart(2,'0')+'-01'):shiftDay(day,actualGrouping==='week'?7:1))series.set(day,{date:day,minutes:0,posted:0,pending:0,unknown:0});
 for(const entry of entries){
  const context=tasks.get(entry.taskId),id=entry.factoryId,name=names.get(id)||'Fábrica não cadastrada';
  if(!factories.has(id))factories.set(id,{id,name,minutes:0,posted:0,pending:0,unknown:0,entries:0,taskIds:new Set(),days:new Set()});
  const factory=factories.get(id);factory.minutes+=entry.minutes;factory[entry.status]+=entry.minutes;factory.entries++;factory.taskIds.add(entry.taskId||entry.id);factory.days.add(entry.date);
  const key=id+'\u0000'+(entry.taskId||entry.id);if(!activities.has(key))activities.set(key,{id:entry.taskId||entry.id,factoryId:id,factoryName:name,title:entry.taskText||context?.task.text||'Atividade sem título',minutes:0,status:entry.status,done:Boolean(context?.task.done),cardId:context?.cardId,groupId:context?.groupId,dates:new Set()});
  const activity=activities.get(key);activity.minutes+=entry.minutes;activity.dates.add(entry.date);
  const period=series.get(bucket(entry.date,actualGrouping));period.minutes+=entry.minutes;period[entry.status]+=entry.minutes;
  const day=weekdays[weekday(entry.date)];day.minutes+=entry.minutes;day.days.add(entry.date);
 }
 const rows=[...factories.values()].map(f=>({...f,activities:f.taskIds.size,activeDays:f.days.size,average:Math.round(f.minutes/f.taskIds.size)})).sort((a,b)=>b.minutes-a.minutes||a.name.localeCompare(b.name,'pt-BR'));
 const activityRows=[...activities.values()].sort((a,b)=>b.minutes-a.minutes||a.title.localeCompare(b.title,'pt-BR'));
 const previousTo=shiftDay(start,-1),previousFrom=shiftDay(start,-duration),previousMinutes=sum(source.filter(e=>e.date>=previousFrom&&e.date<=previousTo));
 const total=sum(entries),posted=sum(entries.filter(e=>e.status==='posted')),pending=sum(entries.filter(e=>e.status==='pending')),unknown=sum(entries.filter(e=>e.status==='unknown')),activeDays=new Set(entries.map(e=>e.date)).size;
 const statuses=[{id:'none',label:'Sem checks',count:0,minutes:0},{id:'done',label:'Realizada · falta SeSuite',count:0,minutes:0},{id:'posted',label:'SeSuite · falta conclusão',count:0,minutes:0},{id:'both',label:'Realizada e apontada',count:0,minutes:0},{id:'unknown',label:'Sem atividade atual',count:0,minutes:0}];
 const countedStatuses=new Set();for(const activity of activityRows){const index=activity.status==='unknown'?4:activity.done?(activity.status==='posted'?3:1):(activity.status==='posted'?2:0);if(!countedStatuses.has(activity.id)){statuses[index].count++;countedStatuses.add(activity.id)}statuses[index].minutes+=activity.minutes}
 const backlog=state.backlog.filter(t=>!factoryId||t.factoryId===factoryId),backlogFactories=new Map();for(const task of backlog){if(backlogFinished(task))continue;const id=task.factoryId;if(!backlogFactories.has(id))backlogFactories.set(id,{id,name:names.get(id)||'Sem fábrica',open:0,awaiting:0});const f=backlogFactories.get(id);f.open++;if(task.done&&!task.sesuitePosted)f.awaiting++}
 return{from:start,to:end,grouping:actualGrouping,entries,rows,activities:activityRows,series:[...series.values()],weekdays:weekdays.map(d=>({...d,activeDays:d.days.size})),total,posted,pending,unknown,activeDays,averageDay:activeDays?Math.round(total/activeDays):0,activityCount:new Set(entries.map(e=>e.taskId||e.id)).size,previousMinutes,previousFrom,previousTo,change:previousMinutes?(total-previousMinutes)/previousMinutes*100:null,statuses,pendingActivities:activityRows.filter(a=>a.status==='pending').sort((a,b)=>Number(b.done)-Number(a.done)||b.minutes-a.minutes),backlog:{total:backlog.length,finished:backlog.filter(backlogFinished).length,open:backlog.filter(t=>!backlogFinished(t)).length,awaiting:backlog.filter(t=>t.done&&!t.sesuitePosted).length,rows:[...backlogFactories.values()].sort((a,b)=>b.open-a.open||a.name.localeCompare(b.name,'pt-BR'))}};
}

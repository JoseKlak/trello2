export const SESSION_DAY=24*60*60*1000;
export class DaySessionStorage{
 constructor(storage,key='demandas-auth-session-v1',now=()=>Date.now()){this.storage=storage;this.key=key;this.deadlineKey=key+'-deadline';this.now=now;this.memory=new Map()}
 read(key){try{return this.storage?this.storage.getItem(key):this.memory.get(key)??null}catch{return this.memory.get(key)??null}}
 write(key,value){this.memory.set(key,value);try{this.storage?.setItem(key,value)}catch{}}
 drop(key){this.memory.delete(key);try{this.storage?.removeItem(key)}catch{}}
 begin(){this.write(this.deadlineKey,String(this.now()+SESSION_DAY))}
 expired(){const deadline=Number(this.read(this.deadlineKey));return!Number.isFinite(deadline)||deadline<=this.now()}
 getItem(key){if(this.expired()){this.drop(key);return null}return this.read(key)}
 setItem(key,value){if(!this.expired())this.write(key,value)}
 removeItem(key){this.drop(key);if(key===this.key)this.drop(this.deadlineKey)}
 clear(){this.removeItem(this.key)}
}

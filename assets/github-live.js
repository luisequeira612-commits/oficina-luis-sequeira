(function(){
"use strict";
const KEY="oficina-luis-sequeira-github-cache-v1",ROOT="https://api.github.com/repos/";
const IDLE_CYCLE=240000,GLOBAL_GAP=60000,ACTIVE_GAP=60000,MANUAL_GAP=15000,STALE=120000;
let rooms=[],cache={},due=new Map(),manualAt=new Map(),timer=0,busy=false,started=false,lastRequest=0,backoff=0,backoffCount=0,ratePause=0,rateRemaining=null,rateReset=0;
const list=document.getElementById("github-activity-list"),notice=document.getElementById("github-rate-notice");
const now=()=>Date.now(),validRepo=x=>typeof x==="string"&&/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(x);
function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||"{}");return x&&typeof x==="object"?x:{}}catch(_){return {}}}
function save(){try{cache.__meta={ratePause,backoff,backoffCount,rateRemaining,rateReset};localStorage.setItem(KEY,JSON.stringify(cache))}catch(_){}}
function mins(t){return Math.max(0,Math.floor((now()-(t||now()))/60000))}
function ago(t){const m=mins(new Date(t||0).getTime());return !t?"hora desconocida":m<1?"ahora":m<60?"hace "+m+" min":m<1440?"hace "+Math.floor(m/60)+" h":"hace "+Math.floor(m/1440)+" d"}
function at(t){return new Date(t).toLocaleTimeString("es-NI",{hour:"2-digit",minute:"2-digit"})}
function entry(room){return room.repository?cache[room.repository]:null}
function active(e){return (e?.runs||[]).find(x=>x.status==="in_progress"||x.status==="queued")||null}
function latest(e){return (e?.runs||[])[0]||null}
function state(e){const a=active(e),r=latest(e);if(a)return "working";if(!r||r.status!=="completed")return "rest";if(["failure","timed_out","action_required"].includes(r.conclusion))return "failure";if(r.conclusion==="success"&&(e.celebrateUntil||0)>now())return "success";return "rest"}
function freshness(e){if(e?.error)return "No se pudo obtener";if(!e?.checkedAt)return "Consultando…";return now()-e.checkedAt<=STALE?"En vivo":"Desactualizado (hace "+mins(e.checkedAt)+" min)"}
function paintRoom(room){
 const card=Array.from(document.querySelectorAll(".room[data-room-id]")).find(x=>x.dataset.roomId===room.id);if(!card)return;
 const e=entry(room),a=active(e),r=latest(e),s=state(e),status=card.querySelector("[data-repo-status]"),fresh=card.querySelector("[data-repo-freshness]"),bubble=card.querySelector("[data-repo-bubble]"),button=card.querySelector("[data-refresh-repo]");
 if(fresh)fresh.textContent=room.repository?freshness(e):"Sin repositorio";
 if(status){
  status.dataset.kind=s==="working"?"running":s==="success"?"success":s==="failure"?"failure":"";
  if(!room.repository)status.textContent="Vincula un repositorio público.";
  else if(e?.error)status.textContent=e.error;
  else if(!e?.checkedAt)status.textContent="Esperando la primera consulta.";
  else if(a)status.textContent="Trabajando · "+(a.name||a.display_title||"GitHub Actions")+" · "+ago(a.run_started_at||a.created_at);
  else if(s==="success")status.textContent="Éxito · "+(r.name||r.display_title||"GitHub Actions");
  else if(s==="failure")status.textContent="Falló · "+(r.name||r.display_title||"GitHub Actions");
  else status.textContent=r?"Sin ejecuciones activas · última: "+(r.name||r.display_title||"GitHub Actions"):"Sin ejecuciones recientes. Descansando.";
  if(e?.checkedAt)status.textContent+=" · Datos de hace "+mins(e.checkedAt)+" min";
 }
 if(bubble){bubble.hidden=!a;bubble.textContent=a?(a.name||a.display_title||"GitHub Actions"):""}
 if(button){const wait=Math.max(0,(manualAt.get(room.id)||0)-now());button.disabled=wait>0||busy||now()<ratePause||now()<backoff;button.textContent=wait?"Espera "+Math.ceil(wait/1000)+" s":"Actualizar"}
 card.querySelectorAll(".ag[data-agent-id]").forEach(worker=>{
  worker.classList.remove("st-w","st-t","st-a","st-r","is-success","is-failure","is-walking");
  const prev=worker.dataset.githubState||"rest";
  if(s==="working"){worker.classList.add("st-w");if(prev!=="working")worker.classList.add("is-walking")}
  else if(s==="success")worker.classList.add("st-r","is-success");
  else if(s==="failure")worker.classList.add("st-r","is-failure");
  else worker.classList.add("st-r");
  worker.dataset.githubState=s;
  const label=worker.querySelector('[data-status="true"]');
  if(label)label.textContent=s==="working"?"Trabajando":s==="success"?"Éxito":s==="failure"?"Falló":"Descansando";
 });
 const count=card.querySelector(".room-count");if(count)count.textContent=room.agents.length+" "+(room.agents.length===1?"personaje":"personajes");
}
function paintSummary(){
 const linked=rooms.filter(x=>validRepo(x.repository)),states=linked.map(x=>state(entry(x))),working=states.filter(x=>x==="working").length,success=states.filter(x=>x==="success").length,failure=states.filter(x=>x==="failure").length;
 const el=document.getElementById("summary-text");if(!el)return;
 if(!linked.length)el.textContent="Conecta repositorios de GitHub para ver actividad real.";else if(states.every(x=>x==="rest"))el.textContent="Todos descansan por ahora.";
 else{const parts=[];if(working)parts.push(working+" "+(working===1?"proyecto trabajando":"proyectos trabajando"));if(success)parts.push(success+" "+(success===1?"éxito reciente":"éxitos recientes"));if(failure)parts.push(failure+" "+(failure===1?"proyecto con fallo":"proyectos con fallos"));el.textContent=parts.join(" · ")+"."}
}
function paintActivity(){
 if(!list)return;const all=[];
 rooms.forEach(room=>(entry(room)?.runs||[]).forEach(run=>all.push({room,run})));
 all.sort((a,b)=>new Date(b.run.created_at||0)-new Date(a.run.created_at||0));list.replaceChildren();
 if(!all.length){const li=document.createElement("li");li.className="activity-empty";li.textContent="Todavía no hay ejecuciones guardadas.";list.append(li);return}
 all.slice(0,12).forEach(({room,run})=>{
  const li=document.createElement("li");li.className="activity-item";
  const name=document.createElement("strong");name.textContent=room.name;
  const workflow=document.createElement("span");workflow.textContent=run.name||run.display_title||"GitHub Actions";
  const status=document.createElement("span");status.className="activity-state";status.textContent=run.status==="queued"?"En cola":run.status==="in_progress"?"En curso":run.conclusion==="success"?"Éxito":run.conclusion==="failure"?"Falló":run.conclusion||"Completado";
  const time=document.createElement("time");time.dateTime=run.updated_at||run.created_at||"";time.textContent=ago(run.updated_at||run.created_at);
  li.append(name,workflow,status,time);
  if(typeof run.html_url==="string"&&run.html_url.startsWith("https://github.com/")){const link=document.createElement("a");link.href=run.html_url;link.target="_blank";link.rel="noopener noreferrer";link.textContent="Ver en GitHub";li.append(link)}
  list.append(li);
 });
}
function paintNotice(){
 if(!notice)return;const until=Math.max(ratePause,backoff);
 if(until>now()){notice.hidden=false;notice.textContent=ratePause>now()?"Límite de GitHub alcanzado, reintenta a las "+at(until):"GitHub rechazó la consulta; reintento automático a las "+at(until)+"."}
 else{notice.hidden=true;notice.textContent=""}
}
function paint(){rooms.forEach(paintRoom);paintSummary();paintActivity();paintNotice()}
function ids(){return rooms.filter(x=>validRepo(x.repository)).map(x=>x.repository)}
function idleGap(){return Math.max(GLOBAL_GAP,Math.floor(IDLE_CYCLE/Math.max(1,ids().length)))}
function plan(room,delay){due.set(room.repository,now()+delay)}
function schedule(delay){
 if(document.visibilityState==="hidden"||busy)return;
 if(timer)clearTimeout(timer);timer=setTimeout(()=>{timer=0;tick()},Math.max(0,delay));
}
function nextRoom(){
 const all=ids().map(id=>({id,at:due.has(id)?due.get(id):now()})).sort((a,b)=>a.at-b.at);
 return all[0]||null;
}
function rateHeaders(response){
 const remaining=response.headers.get("X-RateLimit-Remaining"),reset=response.headers.get("X-RateLimit-Reset");
 if(remaining!==null&&reset!==null&&Number.isFinite(Number(remaining))&&Number.isFinite(Number(reset))){
  rateRemaining=Number(remaining);rateReset=Number(reset);
  if(rateRemaining<10)ratePause=Math.max(ratePause,rateReset*1000);
  else if(ratePause<=now())ratePause=0;
 }
}
async function request(room){
 if(busy||document.visibilityState==="hidden")return;
 if(now()<ratePause||now()<backoff){paint();schedule(Math.max(1000,Math.min(ratePause||Infinity,backoff||Infinity)-now()));return}
 const wait=GLOBAL_GAP-(now()-lastRequest);if(wait>0){schedule(wait);return}
 const e=cache[room.repository]||{runs:[],etag:"",checkedAt:0},headers={Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"};
 if(e.etag)headers["If-None-Match"]=e.etag;
 busy=true;lastRequest=now();paint();
 try{
  const response=await fetch(ROOT+room.repository+"/actions/runs?per_page=5",{headers,cache:"no-store"});rateHeaders(response);
  if(response.status===304){e.checkedAt=now();delete e.error;cache[room.repository]=e;backoffCount=0;save()}
  else if(response.status===403||response.status===429){
   backoffCount=Math.min(6,backoffCount+1);
   const retry=Number(response.headers.get("Retry-After")||0)*1000,reset=Number(response.headers.get("X-RateLimit-Reset")||0)*1000;
   backoff=now()+Math.max(retry,reset>now()?reset-now():0,Math.min(900000,30000*Math.pow(2,backoffCount-1)));
   e.error="GitHub rechazó la consulta ("+response.status+"). Reintento a las "+at(backoff)+".";
   cache[room.repository]=e;save();
  }else if(response.status===404){e.error="Repositorio no encontrado, privado o Actions no disponible.";cache[room.repository]=e;save()}
  else if(!response.ok)throw new Error("GitHub respondió con el error "+response.status+".");
  else{
   const data=await response.json();if(!Array.isArray(data.workflow_runs))throw new Error("Respuesta de GitHub no válida.");
   const previousId=e.runs?.[0]?.id;e.runs=data.workflow_runs.slice(0,5);const newest=e.runs[0];
   if(newest&&newest.id!==previousId&&newest.status==="completed"&&newest.conclusion==="success")e.celebrateUntil=now()+7000;
   e.etag=response.headers.get("ETag")||e.etag||"";e.checkedAt=now();e.fetchedAt=now();delete e.error;
   cache[room.repository]=e;save();backoffCount=0;backoff=0;
  }
 }catch(error){e.error=error?.message||"No se pudo obtener información de GitHub.";cache[room.repository]=e;save()}
 finally{
  busy=false;const current=rooms.find(x=>x.id===room.id&&x.repository===room.repository);
  if(current)plan(room,active(cache[room.repository])?ACTIVE_GAP:idleGap());
  paint();
 }
}
async function tick(){
 if(document.visibilityState==="hidden"||busy)return;
 if(now()<ratePause||now()<backoff){paintNotice();schedule(Math.max(1000,Math.min(ratePause||Infinity,backoff||Infinity)-now()));return}
 const next=nextRoom();if(!next)return;
 const room=rooms.find(x=>x.repository===next.id);if(!room)return;
 const wait=Math.max(0,next.at-now(),GLOBAL_GAP-(now()-lastRequest));
 if(wait){schedule(wait);return}
 await request(room);const following=nextRoom();if(following)schedule(Math.max(1000,following.at-now(),GLOBAL_GAP-(now()-lastRequest)));
}
function sync(next){
 rooms=Array.isArray(next)?next:[];
 const keep=new Set(ids());
 rooms.forEach(room=>{if(!validRepo(room.repository))return;if(!cache[room.repository])cache[room.repository]={runs:[],etag:"",checkedAt:0};if(!due.has(room.repository))plan(room,idleGap())});
 Array.from(due.keys()).forEach(id=>{if(!keep.has(id))due.delete(id)});
 paint();
}
function refresh(roomId){
 const room=rooms.find(x=>x.id===roomId);if(!room||!validRepo(room.repository)||document.visibilityState==="hidden")return;
 const allowed=manualAt.get(roomId)||0;if(now()<allowed||now()<ratePause||now()<backoff)return;
 manualAt.set(roomId,now()+MANUAL_GAP);due.set(room.repository,now());setTimeout(paint,MANUAL_GAP+50);schedule(Math.max(0,GLOBAL_GAP-(now()-lastRequest)));
}
function visible(){
 if(document.visibilityState==="hidden"){if(timer)clearTimeout(timer);timer=0;return}
 const stale=rooms.find(x=>validRepo(x.repository)&&(!cache[x.repository]?.checkedAt||now()-cache[x.repository].checkedAt>STALE));
 if(stale)due.set(stale.repository,now());schedule(0);
}
function start(initial){
 if(started)return;started=true;cache=read();const meta=cache.__meta||{};ratePause=Number(meta.ratePause)||0;backoff=Number(meta.backoff)||0;backoffCount=Number(meta.backoffCount)||0;rateRemaining=Number.isFinite(meta.rateRemaining)?meta.rateRemaining:null;rateReset=Number(meta.rateReset)||0;sync(initial);
 const all=ids(),gap=idleGap();all.forEach((id,index)=>{if(!cache[id])cache[id]={runs:[],etag:"",checkedAt:0};due.set(id,now()+index*gap)});
 save();paint();document.addEventListener("visibilitychange",visible);window.addEventListener("online",()=>{if(document.visibilityState!=="hidden")schedule(0)});schedule(1200);
}
window.OfficeGitHubLive={start,sync,refresh,paintSummary};
})();
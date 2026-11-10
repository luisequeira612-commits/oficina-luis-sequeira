(function(){
"use strict";
const rooms=document.getElementById("rooms");
const overview=document.getElementById("office-3d-overview");
const overviewStatus=document.getElementById("office-3d-status");
const dialog=document.getElementById("room-dialog");
const scene=document.getElementById("room-scene");
const title=document.getElementById("room-dialog-title");
const caption=document.getElementById("room-dialog-caption");
const detail=document.getElementById("room-dialog-detail");
const close=document.getElementById("room-dialog-close");
const go=document.getElementById("room-dialog-go");
const projectSection=document.querySelector('main>section[aria-labelledby="projects-heading"]');
let selectedCard=null;
if(!rooms||!dialog||!scene)return;
function closeOverview(){if(overview&&typeof overview._office3dCleanup==="function")overview._office3dCleanup();if(overview){overview.classList.remove("is-active","office-employee-selected");overview.hidden=true}document.body.classList.remove("office-game-active")}
function workerState(agent){return agent.classList.contains("is-success")?"st-s":agent.classList.contains("is-failure")?"st-f":Array.from(agent.classList).find(name=>/^st-[wtar]$/.test(name))||"st-r"}
function workerDataFor(agent){const avatar=agent.querySelector(".human-worker");const state=workerState(agent);let history=[];try{history=JSON.parse(agent.dataset.taskHistory||"[]")}catch(_){history=[]}return {id:agent.dataset.agentId||"",name:agent.dataset.employeeName||agent.querySelector(".agent-role")?.textContent?.trim()||"Agente",role:agent.dataset.agentRole||"Puesto",state,gender:avatar?.dataset.gender||agent.dataset.employeeGender||"person",tone:avatar?.dataset.skinTone||agent.dataset.skinTone||"medium",hair:avatar?.dataset.hair||agent.dataset.hair||"short",shirt:avatar?.dataset.shirt||agent.dataset.shirt||"blue",task:agent.dataset.currentTask||"Sin tarea en curso",history}}
function openRoom(card,selectedEmployeeId=""){
 closeOverview();
 selectedCard=card;
 const name=card.querySelector(".room-title")?.textContent?.trim()||"Proyecto";
 const agents=Array.from(card.querySelectorAll(".ag"));
 const roles=agents.map(agent=>agent.querySelector(".agent-role")?.textContent?.trim()||"Puesto");
 const repoStatus=card.querySelector(".repo-status")?.textContent?.trim()||"Sin estado de repositorio disponible";
 title.textContent=name;
 const selectedAgent=agents.find(agent=>agent.dataset.agentId===selectedEmployeeId);caption.textContent=selectedAgent?"Seleccionaste a "+(selectedAgent.dataset.employeeName||"este empleado")+" · "+(selectedAgent.dataset.agentRole||"Puesto"):roles.length?roles.length+" puestos de trabajo en esta habitación":"Habitación lista para incorporar puestos de trabajo";
 detail.textContent=repoStatus;
 scene.replaceChildren();
 const floor=document.createElement("div");floor.className="room-floor";
 const wallBack=document.createElement("div");wallBack.className="room-wall room-wall-back";
 const wallSide=document.createElement("div");wallSide.className="room-wall room-wall-side";
 const window=document.createElement("div");window.className="room-window";wallBack.appendChild(window);
 const plant=document.createElement("div");plant.className="room-plant";plant.setAttribute("aria-hidden","true");wallSide.appendChild(plant);
 const furniture=document.createElement("div");furniture.className="room-furniture";
 if(roles.length){
  roles.forEach((role,index)=>{
   const station=document.createElement("div");station.className="room-station";
   const stateClass=Array.from(agents[index]?.classList||[]).find(className=>/^st-[wtar]$/.test(className));
   if(stateClass)station.classList.add(stateClass);
   const desk=document.createElement("div");desk.className="room-desk";
   const screen=document.createElement("div");screen.className="room-screen";
   const chair=document.createElement("div");chair.className="room-chair";
   const label=document.createElement("span");label.className="room-station-label";label.textContent=role;station.dataset.employeeId=agents[index]?.dataset.agentId||"";if(selectedEmployeeId&&station.dataset.employeeId===selectedEmployeeId)station.classList.add("is-selected-worker");
   const avatar=agents[index]?.querySelector(".human-worker");
   if(avatar){const person=avatar.cloneNode(true);person.classList.add("room-worker-avatar");station.appendChild(person)}
   station.append(chair,desk,screen,label);station.style.setProperty("--station-index",String(index));furniture.appendChild(station);
  });
 }else{
  const empty=document.createElement("p");empty.className="room-empty";empty.textContent="Aún no hay puestos ocupados. Puedes añadir personajes desde la tarjeta del proyecto.";furniture.appendChild(empty);
 }
 floor.append(wallBack,wallSide,furniture);scene.appendChild(floor);
 const threeD=document.getElementById("office-3d");
 const workerData=agents.map(agent=>({...workerDataFor(agent),selected:Boolean(selectedEmployeeId&&agent.dataset.agentId===selectedEmployeeId)}));
 const rendered3D=Boolean(threeD&&window.Office3D&&window.Office3D.open({container:threeD,roomName:name,workers:workerData}));
 scene.classList.toggle("room-scene-fallback-hidden",rendered3D);
 if(typeof dialog.showModal==="function")dialog.showModal();
 else {dialog.setAttribute("open","");close.focus()}
}
function ensureEmployeePanel(){let p=overview.querySelector(".office-employee-card");if(p)return p;p=document.createElement("section");p.className="office-employee-card";p.hidden=true;p.setAttribute("aria-live","polite");overview.appendChild(p);overview.addEventListener("click",e=>{if(!p.hidden&&!e.target.closest(".office-employee-card,.office-roster-person,.office-worker-tag")){p.hidden=true;overview.classList.remove("office-employee-selected")}});return p}
function workerStatusLabel(state){return state==="st-w"?"TRABAJANDO":state==="st-t"?"PENSANDO":state==="st-a"?"TE TOCA":state==="st-s"?"ÉXITO":state==="st-f"?"FALLO":"DESCANSANDO"}
function selectEmployee(w){const source=Array.from(rooms.querySelectorAll(".ag")).find(agent=>agent.dataset.agentId===w.id);if(source)w=workerDataFor(source);if(overview&&typeof overview._office3dFocusWorker==="function")overview._office3dFocusWorker(w.id);const p=ensureEmployeePanel();p.replaceChildren();const x=document.createElement("button");x.type="button";x.className="office-employee-close";x.textContent="×";x.setAttribute("aria-label","Cerrar ficha");x.addEventListener("click",()=>{p.hidden=true;overview.classList.remove("office-employee-selected")});const n=document.createElement("h3");n.textContent=w.name;const r=document.createElement("p");r.textContent=w.role+" · "+workerStatusLabel(w.state);const task=document.createElement("p");task.textContent="Tarea actual: "+(w.task||"Sin tarea registrada");const hist=document.createElement("div");hist.className="office-employee-history";const histTitle=document.createElement("strong");histTitle.textContent="Últimas tareas";hist.appendChild(histTitle);const items=Array.isArray(w.history)?w.history.slice(0,3):[];if(items.length){items.forEach(item=>{const row=document.createElement("p");row.textContent="· "+item;hist.appendChild(row)})}else{const row=document.createElement("p");row.textContent="Todavía no hay historial guardado.";hist.appendChild(row)}p.append(x,n,r,task,hist);p.hidden=false;overview.classList.add("office-employee-selected")}
function mountTycoonControls(data){let top=overview.querySelector(".office-tycoon-top");if(!top){top=document.createElement("div");top.className="office-tycoon-top";const hd=document.createElement("div");hd.className="office-tycoon-heading";const h=document.createElement("strong");h.textContent="Oficina de Luis Sequeira";const sub=document.createElement("span");sub.textContent=data.reduce((n,r)=>n+r.workers.length,0)+" empleados · minifiguras LEGO";hd.append(h,sub);const actions=document.createElement("div");actions.className="office-tycoon-actions";const projects=document.createElement("button");projects.type="button";projects.className="office-overlay-button";projects.textContent="Proyectos";projects.addEventListener("click",()=>sheet.hidden=false);const help=document.createElement("button");help.type="button";help.className="office-overlay-button office-help-button";help.textContent="?";help.setAttribute("aria-label","Ayuda");help.addEventListener("click",()=>{let tip=overview.querySelector(".office-help-tip");if(!tip){tip=document.createElement("p");tip.className="office-help-tip";tip.textContent="Arrastra para moverte · Pellizca para acercar · Usa ↶ ↷ para girar. Toca una persona para ver su ficha.";overview.appendChild(tip)}tip.hidden=false;clearTimeout(tip._timer);tip._timer=setTimeout(()=>tip.hidden=true,4200)});actions.append(projects,help);top.append(hd,actions);overview.appendChild(top)}
 const subtitle=top.querySelector(".office-tycoon-heading span");if(subtitle)subtitle.textContent=data.reduce((n,r)=>n+r.workers.length,0)+" empleados · minifiguras LEGO";
 let sheet=overview.querySelector(".office-project-sheet");if(!sheet){sheet=document.createElement("section");sheet.className="office-project-sheet";sheet.hidden=true;const head=document.createElement("div");head.className="office-sheet-head";const label=document.createElement("strong");label.textContent="Proyectos";const close=document.createElement("button");close.type="button";close.className="office-overlay-button";close.textContent="Cerrar";close.addEventListener("click",()=>sheet.hidden=true);head.append(label,close);const body=document.createElement("div");body.className="office-sheet-body";sheet.append(head,body);overview.appendChild(sheet);if(projectSection)body.appendChild(projectSection)}
 let legend=overview.querySelector(".office-state-legend");if(!legend){legend=document.createElement("details");legend.className="office-state-legend";const sum=document.createElement("summary");sum.textContent="Estados";const labels=document.createElement("span");labels.innerHTML='<i class="is-working"></i> Trabajando　<i class="is-resting"></i> Descansando　<i class="is-your-turn"></i> Te toca';legend.append(sum,labels);overview.appendChild(legend)}
}
function renderMap(){
 if(dialog.open)return;
 const cards=Array.from(rooms.querySelectorAll(".room[data-room-id]"));
 const roomData=cards.map(card=>({id:card.dataset.roomId,name:card.querySelector(".room-title")?.textContent?.trim()||"Proyecto",workers:Array.from(card.querySelectorAll(".ag"),agent=>({...workerDataFor(agent),roomId:card.dataset.roomId}))}));
 const totalWorkers=roomData.reduce((n,room)=>n+room.workers.length,0);const headerSubtitle=document.querySelector(".office-header-subtitle");if(headerSubtitle)headerSubtitle.textContent=totalWorkers+" empleados · minifiguras LEGO";
 const renderedOverview=Boolean(overview&&window.Office3D&&roomData.length&&window.Office3D.openOverview({container:overview,rooms:roomData,onSelectRoom:id=>{const card=cards.find(item=>item.dataset.roomId===id);if(card)openRoom(card)},onSelectWorker:worker=>selectEmployee(worker)}));
 if(renderedOverview){
  const roster=document.createElement("div");roster.className="office-employee-roster";roster.setAttribute("aria-label","Barra de equipo");
  const heading=document.createElement("div");heading.className="office-roster-heading";heading.textContent="EQUIPO · "+roomData.reduce((n,r)=>n+r.workers.length,0);
  const list=document.createElement("div");list.className="office-roster-list";
  roomData.forEach(room=>room.workers.forEach(worker=>{const card=document.createElement("button");card.type="button";card.className="office-roster-person";card.title=worker.name+" · "+worker.role;card.setAttribute("aria-label",worker.name+", "+worker.role);
   const avatar=document.createElement("span");avatar.className="office-roster-avatar";avatar.textContent=worker.name.slice(0,1).toUpperCase();avatar.style.setProperty("--shirt",({blue:"#2879C7",coral:"#D66B57",teal:"#168D83",mustard:"#C69A27",plum:"#875A9B"})[worker.shirt]||"#2879C7");
   const dot=document.createElement("i");dot.className="office-roster-dot "+(worker.state==="st-w"?"is-working":worker.state==="st-a"?"is-your-turn":"is-resting");avatar.appendChild(dot);card.append(avatar);card.addEventListener("click",()=>selectEmployee(worker));list.appendChild(card)}));
  const waiting=roomData.flatMap(r=>r.workers).filter(w=>w.state==="st-a");if(waiting.length){const turn=document.createElement("button");turn.type="button";turn.className="office-turn-count";turn.textContent="Te toca "+waiting.length;turn.addEventListener("click",()=>{const panel=ensureEmployeePanel();panel.replaceChildren();const close=document.createElement("button");close.type="button";close.className="office-employee-close";close.textContent="×";close.setAttribute("aria-label","Cerrar lista");close.addEventListener("click",()=>panel.hidden=true);const title=document.createElement("h3");title.textContent="Esperan tu decisión";panel.append(close,title);waiting.forEach(w=>{const item=document.createElement("button");item.type="button";item.className="office-turn-item";item.textContent=w.name+" · "+w.role;item.addEventListener("click",()=>selectEmployee(w));panel.appendChild(item)});panel.hidden=false});roster.appendChild(turn)}roster.append(heading,list);overview.appendChild(roster);mountTycoonControls(roomData);
 }
 if(overview){overview.hidden=!renderedOverview;if(renderedOverview)overview.classList.add("is-active")}
 document.body.classList.toggle("office-game-active",renderedOverview);
 if(overviewStatus){overviewStatus.hidden=renderedOverview;overviewStatus.textContent=renderedOverview?"":(window.Office3D?(window.Office3D.lastError||"No se pudo iniciar el motor 3D."):"No se cargó el archivo del motor 3D.");}
}
close.addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
dialog.addEventListener("close",()=>{const threeD=document.getElementById("office-3d");if(threeD&&typeof threeD._office3dCleanup==="function")threeD._office3dCleanup();if(threeD)threeD.classList.remove("is-active");scene.classList.remove("room-scene-fallback-hidden");renderMap()});
function sync3DWorkerStates(){const allStates=Array.from(rooms.querySelectorAll(".ag"),workerState);if(overview&&!overview.hidden&&typeof overview._office3dUpdateStates==="function")overview._office3dUpdateStates(allStates);const threeD=document.getElementById("office-3d");if(dialog.open&&selectedCard&&threeD&&typeof threeD._office3dUpdateStates==="function"){const states=Array.from(selectedCard.querySelectorAll(".ag"),workerState);threeD._office3dUpdateStates(states)}}
go.addEventListener("click",()=>{
 if(!selectedCard)return;
 dialog.close();
 const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 selectedCard.scrollIntoView({behavior:reduced?"auto":"smooth",block:"center"});
});
const observer=new MutationObserver(renderMap);
observer.observe(rooms,{childList:true});
const stateObserver=new MutationObserver(sync3DWorkerStates);
stateObserver.observe(rooms,{attributes:true,attributeFilter:["class"],subtree:true});
renderMap();
})();

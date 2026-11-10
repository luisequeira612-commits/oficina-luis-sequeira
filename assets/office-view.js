(function(){
"use strict";
const rooms=document.getElementById("rooms");
const map=document.getElementById("office-map");
const overview=document.getElementById("office-3d-overview");
const overviewStatus=document.getElementById("office-3d-status");
const dialog=document.getElementById("room-dialog");
const scene=document.getElementById("room-scene");
const title=document.getElementById("room-dialog-title");
const caption=document.getElementById("room-dialog-caption");
const detail=document.getElementById("room-dialog-detail");
const close=document.getElementById("room-dialog-close");
const go=document.getElementById("room-dialog-go");
let selectedCard=null;
if(!rooms||!map||!dialog||!scene)return;
function closeOverview(){if(overview&&typeof overview._office3dCleanup==="function")overview._office3dCleanup();if(overview){overview.classList.remove("is-active");overview.hidden=true}document.body.classList.remove("office-game-active");map.hidden=false}
function workerState(agent){return agent.classList.contains("is-success")?"st-s":agent.classList.contains("is-failure")?"st-f":Array.from(agent.classList).find(name=>/^st-[wtar]$/.test(name))||"st-r"}
function workerDataFor(agent){const avatar=agent.querySelector(".human-worker");const state=workerState(agent);return {id:agent.dataset.agentId||"",name:agent.dataset.employeeName||agent.querySelector(".agent-role")?.textContent?.trim()||"Agente",role:agent.dataset.agentRole||"Puesto",state,gender:avatar?.dataset.gender||agent.dataset.employeeGender||"person",tone:avatar?.dataset.skinTone||agent.dataset.skinTone||"medium",hair:avatar?.dataset.hair||agent.dataset.hair||"short",shirt:avatar?.dataset.shirt||agent.dataset.shirt||"blue"}}
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
 const workerData=agents.map(workerDataFor);
 const rendered3D=Boolean(threeD&&window.Office3D&&window.Office3D.open({container:threeD,roomName:name,workers:workerData}));
 scene.classList.toggle("room-scene-fallback-hidden",rendered3D);
 if(typeof dialog.showModal==="function")dialog.showModal();
 else {dialog.setAttribute("open","");close.focus()}
}
function renderMap(){
 if(dialog.open)return;
 const cards=Array.from(rooms.querySelectorAll(".room[data-room-id]"));
 const activeId=map.querySelector('.office-tile[aria-pressed="true"]')?.dataset.targetRoom||"";
 map.replaceChildren();
 cards.forEach(card=>{
  const titleText=card.querySelector(".room-title")?.textContent?.trim()||"Proyecto";
  const count=card.querySelector(".room-count")?.textContent?.trim()||"";
  const agents=card.querySelectorAll(".ag").length;
  const tile=document.createElement("button");
  tile.type="button";tile.className="office-tile";tile.dataset.targetRoom=card.dataset.roomId;
  tile.setAttribute("aria-label","Explorar habitación "+titleText);
  tile.setAttribute("aria-pressed",card.dataset.roomId===activeId?"true":"false");
  const name=document.createElement("span");name.className="office-tile-name";name.textContent=titleText;
  const meta=document.createElement("span");meta.className="office-tile-meta";meta.textContent=agents+" "+(agents===1?"puesto":"puestos")+" · "+count;
  const mark=document.createElement("span");mark.className="office-tile-mark";mark.textContent="Entrar";
  tile.append(name,meta,mark);
  tile.addEventListener("click",()=>{
   map.querySelectorAll(".office-tile").forEach(item=>item.setAttribute("aria-pressed",item===tile?"true":"false"));
   rooms.querySelectorAll(".room").forEach(item=>item.classList.toggle("room-is-target",item===card));
   openRoom(card);
  });
  map.appendChild(tile);
 });
 const roomData=cards.map(card=>({id:card.dataset.roomId,name:card.querySelector(".room-title")?.textContent?.trim()||"Proyecto",workers:Array.from(card.querySelectorAll(".ag"),agent=>({...workerDataFor(agent),roomId:card.dataset.roomId}))}));
 const renderedOverview=Boolean(overview&&window.Office3D&&roomData.length&&window.Office3D.openOverview({container:overview,rooms:roomData,onSelectRoom:(id,employeeId)=>{const card=cards.find(item=>item.dataset.roomId===id);if(card)openRoom(card,employeeId||"")}}));
 if(renderedOverview){
  const roster=document.createElement("div");roster.className="office-employee-roster";roster.setAttribute("aria-label","Plantilla de nueve empleados");
  const heading=document.createElement("div");heading.className="office-roster-heading";heading.textContent="EQUIPO · "+roomData.reduce((n,room)=>n+room.workers.length,0)+" EMPLEADOS";
  const list=document.createElement("div");list.className="office-roster-list";
  roomData.forEach((room,roomIndex)=>room.workers.forEach((worker,workerIndex)=>{
   const card=document.createElement("button");card.type="button";card.className="office-roster-person";card.title=worker.name+" · "+worker.role+" · "+room.name;
   const avatar=document.createElement("span");avatar.className="office-roster-avatar";avatar.textContent=worker.name.slice(0,1).toUpperCase();
   const name=document.createElement("span");name.className="office-roster-name";name.textContent=worker.name;
   const role=document.createElement("span");role.className="office-roster-role";role.textContent=worker.role;
   card.append(avatar,name,role);card.addEventListener("click",()=>{const target=cards.find(item=>item.dataset.roomId===room.id);if(target)openRoom(target)});
   list.appendChild(card);
  }));
  roster.append(heading,list);overview.appendChild(roster);
 }
 if(overview){overview.hidden=!renderedOverview;if(renderedOverview)overview.classList.add("is-active")}
 document.body.classList.toggle("office-game-active",renderedOverview);
 map.hidden=renderedOverview;
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

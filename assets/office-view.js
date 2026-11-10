(function(){
"use strict";
const rooms=document.getElementById("rooms");
const map=document.getElementById("office-map");
const dialog=document.getElementById("room-dialog");
const scene=document.getElementById("room-scene");
const title=document.getElementById("room-dialog-title");
const caption=document.getElementById("room-dialog-caption");
const detail=document.getElementById("room-dialog-detail");
const close=document.getElementById("room-dialog-close");
const go=document.getElementById("room-dialog-go");
let selectedCard=null;
if(!rooms||!map||!dialog||!scene)return;
function openRoom(card){
 selectedCard=card;
 const name=card.querySelector(".room-title")?.textContent?.trim()||"Proyecto";
 const agents=Array.from(card.querySelectorAll(".ag"));
 const roles=agents.map(agent=>agent.querySelector(".agent-role")?.textContent?.trim()||"Puesto");
 const repoStatus=card.querySelector(".repo-status")?.textContent?.trim()||"Sin estado de repositorio disponible";
 title.textContent=name;
 caption.textContent=roles.length?roles.length+" puestos de trabajo en esta habitación":"Habitación lista para incorporar puestos de trabajo";
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
   const desk=document.createElement("div");desk.className="room-desk";
   const screen=document.createElement("div");screen.className="room-screen";
   const chair=document.createElement("div");chair.className="room-chair";
   const label=document.createElement("span");label.className="room-station-label";label.textContent=role;
   const avatar=agents[index]?.querySelector(".human-worker");
   if(avatar){const person=avatar.cloneNode(true);person.classList.add("room-worker-avatar");station.appendChild(person)}
   station.append(chair,desk,screen,label);station.style.setProperty("--station-index",String(index));furniture.appendChild(station);
  });
 }else{
  const empty=document.createElement("p");empty.className="room-empty";empty.textContent="Aún no hay puestos ocupados. Puedes añadir personajes desde la tarjeta del proyecto.";furniture.appendChild(empty);
 }
 floor.append(wallBack,wallSide,furniture);scene.appendChild(floor);
 if(typeof dialog.showModal==="function")dialog.showModal();
 else {dialog.setAttribute("open","");close.focus()}
}
function renderMap(){
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
}
close.addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
go.addEventListener("click",()=>{
 if(!selectedCard)return;
 dialog.close();
 const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 selectedCard.scrollIntoView({behavior:reduced?"auto":"smooth",block:"center"});
});
const observer=new MutationObserver(renderMap);
observer.observe(rooms,{childList:true,subtree:true});
renderMap();
})();

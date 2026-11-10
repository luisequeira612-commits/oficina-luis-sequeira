(function(){
"use strict";
const rooms=document.getElementById("rooms");
const map=document.getElementById("office-map");
if(!rooms||!map)return;
function renderMap(){
 const cards=Array.from(rooms.querySelectorAll(".room[data-room-id]"));
 const activeId=map.querySelector('.office-tile[aria-pressed="true"]')?.dataset.targetRoom||"";
 map.replaceChildren();
 cards.forEach((card,index)=>{
  const title=card.querySelector(".room-title")?.textContent?.trim()||"Proyecto";
  const count=card.querySelector(".room-count")?.textContent?.trim()||"";
  const agents=card.querySelectorAll(".ag").length;
  const tile=document.createElement("button");
  tile.type="button";
  tile.className="office-tile";
  tile.dataset.targetRoom=card.dataset.roomId;
  tile.setAttribute("aria-label","Explorar "+title);
  tile.setAttribute("aria-pressed",card.dataset.roomId===activeId?"true":"false");
  const name=document.createElement("span");name.className="office-tile-name";name.textContent=title;
  const meta=document.createElement("span");meta.className="office-tile-meta";meta.textContent=agents+" "+(agents===1?"personaje":"personajes")+" · "+count;
  const mark=document.createElement("span");mark.className="office-tile-mark";mark.textContent="Explorar";
  tile.append(name,meta,mark);
  tile.addEventListener("click",()=>{
   map.querySelectorAll(".office-tile").forEach(item=>item.setAttribute("aria-pressed",item===tile?"true":"false"));
   rooms.querySelectorAll(".room").forEach(item=>item.classList.toggle("room-is-target",item===card));
   const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   card.scrollIntoView({behavior:reduced?"auto":"smooth",block:"center"});
  });
  map.appendChild(tile);
 });
}
const observer=new MutationObserver(renderMap);
observer.observe(rooms,{childList:true,subtree:true});
renderMap();
})();

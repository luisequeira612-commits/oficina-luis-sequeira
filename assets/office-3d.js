(function(){
"use strict";
const VERT=`#version 300 es
in vec3 aPosition; in vec3 aNormal; in vec3 aColor;
uniform mat4 uProjection; uniform mat4 uView;
out vec3 vColor; out vec3 vNormal;
void main(){vColor=aColor;vNormal=aNormal;gl_Position=uProjection*uView*vec4(aPosition,1.0);}`;
const FRAG=`#version 300 es
precision mediump float; in vec3 vColor; in vec3 vNormal; out vec4 outColor;
void main(){vec3 n=normalize(vNormal);vec3 light=normalize(vec3(-0.45,0.85,0.55));float diffuse=max(dot(n,light),0.0);float shade=0.48+diffuse*0.58;outColor=vec4(vColor*shade,1.0);}`;
const tone={light:[0.94,0.72,0.57],medium:[0.72,0.46,0.32],deep:[0.43,0.25,0.18]};
const hair=[0.12,0.085,0.07],hairColors=[[0.09,0.065,0.055],[0.19,0.12,0.08],[0.30,0.20,0.13]],shirts=[[0.18,0.34,0.52],[0.72,0.31,0.28],[0.20,0.43,0.39],[0.65,0.48,0.19],[0.39,0.29,0.43]],shirtByName={blue:shirts[0],coral:shirts[1],teal:shirts[2],mustard:shirts[3],plum:shirts[4]};
function mat4(){return new Float32Array(16)}
function perspective(out,fovy,aspect,near,far){const f=1/Math.tan(fovy/2),nf=1/(near-far);out.fill(0);out[0]=f/aspect;out[5]=f;out[10]=(far+near)*nf;out[11]=-1;out[14]=2*far*near*nf;return out}
function lookAt(out,eye,target,up){let zx=eye[0]-target[0],zy=eye[1]-target[1],zz=eye[2]-target[2];let l=Math.hypot(zx,zy,zz)||1;zx/=l;zy/=l;zz/=l;let xx=up[1]*zz-up[2]*zy,xy=up[2]*zx-up[0]*zz,xz=up[0]*zy-up[1]*zx;l=Math.hypot(xx,xy,xz)||1;xx/=l;xy/=l;xz/=l;let yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;out[0]=xx;out[1]=yx;out[2]=zx;out[3]=0;out[4]=xy;out[5]=yy;out[6]=zy;out[7]=0;out[8]=xz;out[9]=yz;out[10]=zz;out[11]=0;out[12]=-(xx*eye[0]+xy*eye[1]+xz*eye[2]);out[13]=-(yx*eye[0]+yy*eye[1]+yz*eye[2]);out[14]=-(zx*eye[0]+zy*eye[1]+zz*eye[2]);out[15]=1;return out}
function shader(gl,type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||"Shader error");return s}
function program(gl){const p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,VERT));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||"Program error");return p}
function buildScene(workers){
 const positions=[],normals=[],colors=[];
 const addTri=(a,b,c,color)=>{const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;for(const p of [a,b,c]){positions.push(...p);normals.push(nx,ny,nz);colors.push(...color)}};
 const quad=(a,b,c,d,color)=>{addTri(a,b,c,color);addTri(a,c,d,color)};
 const box=(x,y,z,w,h,d,color)=>{const x0=x-w/2,x1=x+w/2,y0=y-h/2,y1=y+h/2,z0=z-d/2,z1=z+d/2;quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],color);quad([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],color);quad([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],color);quad([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],color);quad([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],color);quad([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],color)};
 const sphere=(cx,cy,cz,rx,ry,rz,color,segments=9,rings=6)=>{for(let r=0;r<rings;r++){const p0=-Math.PI/2+Math.PI*r/rings,p1=-Math.PI/2+Math.PI*(r+1)/rings;for(let s=0;s<segments;s++){const t0=2*Math.PI*s/segments,t1=2*Math.PI*(s+1)/segments;const pt=(p,t)=>[cx+rx*Math.cos(p)*Math.cos(t),cy+ry*Math.sin(p),cz+rz*Math.cos(p)*Math.sin(t)];const a=pt(p0,t0),b=pt(p0,t1),c=pt(p1,t1),d=pt(p1,t0);quad(a,d,c,b,color)}}};
 const cyl=(x,y,z,r,h,color,seg=8)=>{for(let i=0;i<seg;i++){const a=i*2*Math.PI/seg,b=(i+1)*2*Math.PI/seg;const p1=[x+Math.cos(a)*r,y-h/2,z+Math.sin(a)*r],p2=[x+Math.cos(b)*r,y-h/2,z+Math.sin(b)*r],p3=[x+Math.cos(b)*r,y+h/2,z+Math.sin(b)*r],p4=[x+Math.cos(a)*r,y+h/2,z+Math.sin(a)*r];quad(p1,p4,p3,p2,color);addTri([x,y+h/2,z],p3,p4,color);addTri([x,y-h/2,z],p1,p2,color)}};
 const wood=[0.43,0.25,0.14],woodTop=[0.64,0.42,0.25],metal=[0.22,0.28,0.34],wall=[0.76,0.81,0.85],wallDark=[0.48,0.57,0.66],floor=[0.62,0.56,0.46],screen=[0.18,0.66,0.88],chair=[0.17,0.29,0.42],plant=[0.17,0.43,0.27];
 // Room shell: open front and right for a clear game-like cutaway.
 box(0,-0.18,0,12,.36,10,floor);box(0,2,-5,12,4,.22,wall);box(-6,2,0,.22,4,10,wallDark);
 // Wall trim, windows and architectural light bands.
 box(0,3.88,-4.82,12,.12,.12,[0.88,0.91,0.94]);box(-5.82,2,0,.12,4,10,[0.60,0.68,0.74]);
 box(-2.6,2.25,-4.84,2.6,1.8,.08,[0.22,0.49,0.64]);box(-2.6,2.25,-4.77,2.38,1.58,.06,[0.43,0.72,0.82]);
 box(-2.6,2.25,-4.70,.08,1.7,.08,[0.86,0.91,0.94]);box(-2.6,2.25,-4.69,2.5,.08,.08,[0.86,0.91,0.94]);
 // Floor planks and rugs.
 for(let i=-5;i<6;i++)box(i*.98,-.005,0,.018,.012,9.6,[0.72,0.65,0.55]);
 box(0,.025,1.7,9,.05,3.2,[0.31,0.38,0.43]);
 const count=Math.max(1,workers.length),cols=count>3?2:count,rows=Math.ceil(count/cols),workerRanges=[];
 workers.forEach((worker,index)=>{
  const col=index%cols,row=Math.floor(index/cols),x=(col-(cols-1)/2)*4.1,z=rows===1?-1.55:-2.8+row*2.4;
  // desk, legs, monitor, illuminated display, stand, keyboard, mouse and desktop tower.
  sphere(x,.012,z+.28,1.5,.008,.72,[0.24,0.25,0.25],12,3);
  box(x,.92,z,2.65,.18,1.15,woodTop);for(const dx of [-1.12,1.12])for(const dz of [-.42,.42])box(x+dx,.47,z+dz,.11,.82,.11,wood);
  box(x,.28,z+.52,.5,.08,.34,metal);
  box(x,.0,z+.52,.42,.45,.28,metal);
  box(x,1.65,z-.36,1.12,.78,.14,metal);box(x,1.65,z-.265,.98,.62,.025,screen);
  // Screen glow strips and small dashboard panels.
  box(x,1.65,z-.245,.82,.035,.012,[0.63,0.91,1]);box(x-.28,1.72,z-.24,.18,.025,.012,[0.12,0.95,0.82]);box(x+.18,1.52,z-.24,.35,.025,.012,[0.12,0.95,0.82]);
  box(x,1.23,z-.36,.14,.12,.14,metal);box(x,.99,z-.36,.68,.08,.35,metal);
  box(x,.97,z+.08,.72,.035,.26,[0.18,0.22,0.27]);for(let k=0;k<10;k++)box(x-.31+k*.069,.995,z+.08,.035,.012,.19,[0.66,0.72,0.76]);
  sphere(x+.62,.99,z+.12,.11,.06,.14,metal,8,5);
  // Chair, cushion, back, stem and five-foot base.
  box(x,.78,z+1.55,.9,.16,.78,chair);box(x,1.3,z+1.88,.86,1.05,.16,chair);cyl(x,.38,z+1.55,.09,.58,metal);
  for(let a=0;a<5;a++){const t=a*Math.PI*2/5;box(x+Math.cos(t)*.34,.12,z+1.55+Math.sin(t)*.34,.48,.08,.1,metal)}
  // Desk lamp and plant accessories.
  box(x-1.05,1.05,z-.38,.18,.16,.18,metal);box(x-1.05,1.38,z-.38,.08,.58,.08,metal);box(x-1.05,1.7,z-.38,.48,.16,.3,[0.82,0.68,0.38]);
  cyl(x+1.02,.34,z-.35,.24,.55,[0.45,0.25,0.15]);for(let leaf=0;leaf<5;leaf++)sphere(x+1.02+Math.cos(leaf*1.26)*.18,.78+(leaf%2)*.12,z-.35+Math.sin(leaf*1.26)*.18,.18,.36,.14,plant,7,5);
  // Seated low-poly worker: torso, head, hair, arms, legs and shoes.
  const skin=tone[worker.tone]||tone.medium,shirt=shirtByName[worker.shirt]||shirts[index%shirts.length],hairColor=hairColors[index%hairColors.length],hairStyle=worker.hair||"short",workerStart=positions.length;
  box(x,1.27,z+1.0,.62,.78,.36,shirt);sphere(x,1.98,z+.98,.34,.38,.32,skin,10,7);
  sphere(x,2.22,z+.96,.35,.17,.34,hairColor,9,5);
  if(hairStyle==="long"||hairStyle==="tied"){sphere(x-.29,1.86,z+.97,.11,.42,.13,hairColor,7,5);sphere(x+.29,1.86,z+.97,.11,.42,.13,hairColor,7,5)}
  if(hairStyle==="curly"){for(let curl=0;curl<7;curl++){const angle=curl*Math.PI*2/7;sphere(x+Math.cos(angle)*.25,2.28,z+.96+Math.sin(angle)*.24,.13,.13,.13,hairColor,6,4)}}
  if(hairStyle==="tied")sphere(x,2.32,z+.69,.13,.15,.13,hairColor,7,5);
  sphere(x-.11,2.03,z+1.265,.035,.045,.025,[0.10,0.09,0.09],6,4);sphere(x+.11,2.03,z+1.265,.035,.045,.025,[0.10,0.09,0.09],6,4);
  sphere(x,1.91,z+1.285,.035,.025,.025,[0.43,0.22,0.18],6,4);
  const armsStart=positions.length;
  sphere(x-.36,1.48,z+.78,.14,.34,.14,skin,8,5);sphere(x+.36,1.48,z+.78,.14,.34,.14,skin,8,5);
  const armsEnd=positions.length;
  box(x-.2,.74,z+.72,.18,.58,.18,shirt);box(x+.2,.74,z+.72,.18,.58,.18,shirt);
  box(x-.2,.43,z+.62,.22,.14,.3,metal);box(x+.2,.43,z+.62,.22,.14,.3,metal);
  // Subtle task-state accents; animations remain clearly labelled as simulated elsewhere.
  if(worker.state==="st-w"){box(x-.22,1.16,z+.47,.2,.18,.2,skin);box(x+.22,1.16,z+.47,.2,.18,.2,skin)}
  else if(worker.state==="st-t"){sphere(x+.44,2.35,z+.95,.13,.13,.13,[0.98,.78,.25],7,5)}
  else if(worker.state==="st-a"){sphere(x,2.52,z+.96,.11,.11,.11,[0.24,.78,.88],7,5)}
  workerRanges.push({start:workerStart,end:positions.length,armsStart,armsEnd,state:worker.state,index});
 });
 // Shared ceiling lights, wall art, bookcase and a plant at the room entrance.
 box(0,3.72,-.5,4.8,.08,.7,[0.88,0.79,0.55]);box(0,3.62,-.5,3.8,.08,.16,[1,.9,.65]);
 box(4.9,1.8,-4.82,1.2,2.8,.32,wood);for(let i=0;i<4;i++)box(4.9,1.0+i*.5,-4.6,1.0,.06,.42,[0.72,.76,.79]);
 for(let i=0;i<3;i++)box(4.9,1.25+i*.5,-4.36,.42,.35,.18,[.38,.54,.68]);
 const basePositions=new Float32Array(positions);
 const data=new Float32Array(positions.length+normals.length+colors.length);
 data.set(positions,0);data.set(normals,positions.length);data.set(colors,positions.length+normals.length);
 return {data,basePositions,workerRanges,count:positions.length/3,positionLength:positions.length,normalLength:normals.length};
}
function buildOfficeScene(rooms){
 const cols=rooms.length>1?2:1,rows=Math.ceil(rooms.length/cols),scenes=rooms.map(room=>buildScene(room.workers||[])),positions=[],normals=[],colors=[],workerRanges=[];
 let workerOffset=0;
 scenes.forEach((scene,index)=>{
  const col=index%cols,row=Math.floor(index/cols),xCenter=cols===1?0:(col===0?-6.2:6.2),zCenter=(row-(rows-1)/2)*10.4,flip=col===1,posStart=positions.length;
  for(let i=0;i<scene.positionLength;i+=3){const x=scene.basePositions[i],y=scene.basePositions[i+1],z=scene.basePositions[i+2];positions.push((flip?-x:x)+xCenter,y,(flip?-z:z)+zCenter)}
  for(let i=scene.positionLength;i<scene.positionLength+scene.normalLength;i+=3){normals.push(flip?-scene.data[i]:scene.data[i],scene.data[i+1],flip?-scene.data[i+2]:scene.data[i+2])}
  for(let i=scene.positionLength+scene.normalLength;i<scene.data.length;i++)colors.push(scene.data[i]);
  scene.workerRanges.forEach(worker=>workerRanges.push({...worker,start:worker.start+posStart,end:worker.end+posStart,armsStart:worker.armsStart+posStart,armsEnd:worker.armsEnd+posStart,index:worker.index+workerOffset}));
  workerOffset+=(rooms[index].workers||[]).length;
 });
 // Two facing rows of rooms open onto one continuous central hallway.
 if(cols>1){
  const addTri=(a,b,c,color)=>{const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;for(const p of [a,b,c]){positions.push(...p);normals.push(nx,ny,nz);colors.push(...color)}};
  const quad=(a,b,c,d,color)=>{addTri(a,b,c,color);addTri(a,c,d,color)};
  const box=(x,y,z,w,h,d,color)=>{const x0=x-w/2,x1=x+w/2,y0=y-h/2,y1=y+h/2,z0=z-d/2,z1=z+d/2;quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],color);quad([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],color);quad([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],color);quad([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],color);quad([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],color);quad([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],color)};
  box(0,.025,0,2.5,.12,rows*10.4,[0.40,0.46,0.51]);
  for(let row=0;row<rows;row++){const z=(row-(rows-1)/2)*10.4;box(-1.22,.12,z,.16,.18,1.8,[0.72,0.58,0.39]);box(1.22,.12,z,.16,.18,1.8,[0.72,0.58,0.39]);box(0,3.55,z,1.4,.08,.55,[0.88,0.79,0.55])}
 }
 const basePositions=new Float32Array(positions),data=new Float32Array(positions.length+normals.length+colors.length);
 data.set(positions,0);data.set(normals,positions.length);data.set(colors,positions.length+normals.length);
 return {data,basePositions,workerRanges,count:positions.length/3,positionLength:positions.length,normalLength:normals.length};
}
function open({container,roomName,workers=[],rooms=null,onSelectRoom=null}){
 if(typeof container._office3dCleanup==="function")container._office3dCleanup();
 container.replaceChildren();container.classList.remove("is-active");
 const canvas=document.createElement("canvas");canvas.setAttribute("aria-label","Escena 3D de "+roomName);
 const gl=canvas.getContext("webgl2",{alpha:false,antialias:false,powerPreference:"low-power"});
 if(!gl){const note=document.createElement("p");note.className="office-3d-error";note.textContent="Este navegador no ofrece WebGL 2 en este momento. Se muestra la vista alternativa.";container.appendChild(note);return false}
 try{
  const p=program(gl),scene=rooms&&rooms.length?buildOfficeScene(rooms):buildScene(workers),buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,scene.data,gl.DYNAMIC_DRAW);
  const stride=0,loc=(name)=>gl.getAttribLocation(p,name);gl.useProgram(p);
  const ap=loc("aPosition"),an=loc("aNormal"),ac=loc("aColor");
  gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,3,gl.FLOAT,false,stride,0);
  gl.enableVertexAttribArray(an);gl.vertexAttribPointer(an,3,gl.FLOAT,false,stride,scene.positionLength*4);
  gl.enableVertexAttribArray(ac);gl.vertexAttribPointer(ac,3,gl.FLOAT,false,stride,(scene.positionLength+scene.normalLength)*4);
  const up=gl.getUniformLocation(p,"uProjection"),uv=gl.getUniformLocation(p,"uView");
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.clearColor(.075,.12,.18,1);
  const roomNav=rooms&&rooms.length?document.createElement("div"):null;if(roomNav){roomNav.className="office-3d-room-nav";rooms.forEach(room=>{const button=document.createElement("button");button.type="button";button.textContent="Entrar · "+room.name;button.setAttribute("aria-label","Entrar en la habitación "+room.name);button.addEventListener("click",()=>{if(typeof onSelectRoom==="function")onSelectRoom(room.id)});roomNav.appendChild(button)})}
  const controls=document.createElement("div");controls.className="office-3d-controls";
  const hint=document.createElement("span");hint.className="office-3d-hint";hint.textContent="Arrastra para girar · Pellizca para acercar · Dos dedos para desplazar";
  const group=document.createElement("div");group.style.display="flex";group.style.gap="5px";
  const makeButton=(label,aria,fn)=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.setAttribute("aria-label",aria);b.addEventListener("click",fn);group.appendChild(b);return b};
  const overviewMode=Boolean(rooms&&rooms.length),overviewRows=overviewMode?Math.ceil(rooms.length/2):1,initialRadius=overviewMode?(rooms.length===1?13:Math.max(13,Math.max(24.8,overviewRows*10.4)*1.45)):13,minRadius=8,maxRadius=overviewMode?initialRadius*1.65:23;let theta=.72,phi=1.08,radius=initialRadius,target=[0,1.15,0];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  makeButton("−","Alejar cámara",()=>{radius=clamp(radius+1,minRadius,maxRadius)});
  makeButton("+","Acercar cámara",()=>{radius=clamp(radius-1,minRadius,maxRadius)});
  makeButton("↻","Restablecer cámara",()=>{theta=.72;phi=1.08;radius=initialRadius;target=[0,1.15,0]});
  controls.append(hint,group);container.append(canvas);if(roomNav)container.appendChild(roomNav);container.appendChild(controls);container.classList.add("is-active");
  const projection=mat4(),view=mat4();let raf=0,disposed=false,lastFrame=0;const reducedMotion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  container._office3dUpdateStates=states=>{scene.workerRanges.forEach((worker,index)=>{if(states[index])worker.state=states[index]})};
  function resize(){const rect=container.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.15),w=Math.max(1,Math.floor(rect.width*dpr)),h=Math.max(1,Math.floor(rect.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}}
  function render(timestamp=0){if(disposed)return;if(timestamp-lastFrame<32){raf=requestAnimationFrame(render);return}lastFrame=timestamp;resize();if(!reducedMotion){const seconds=timestamp*.001;scene.workerRanges.forEach(worker=>{let bob=0,arms=0;if(worker.state==="st-w"){bob=Math.sin(seconds*7+worker.index)*.025;arms=Math.sin(seconds*12+worker.index)*.055}else if(worker.state==="st-t"){bob=Math.sin(seconds*2+worker.index)*.014;arms=.035}else if(worker.state==="st-a"){bob=Math.sin(seconds*1.5+worker.index)*.01;arms=Math.sin(seconds*2.5+worker.index)*.025}else{bob=Math.sin(seconds*1.2+worker.index)*.018}for(let i=worker.start+1;i<worker.end;i+=3)scene.data[i]=scene.basePositions[i]+bob;for(let i=worker.armsStart+1;i<worker.armsEnd;i+=3)scene.data[i]=scene.basePositions[i]+bob+arms});gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,scene.data.subarray(0,scene.positionLength))}const eye=[target[0]+radius*Math.sin(phi)*Math.sin(theta),target[1]+radius*Math.cos(phi),target[2]+radius*Math.sin(phi)*Math.cos(theta)];perspective(projection,overviewMode?.86:.72,canvas.width/canvas.height,.1,100);lookAt(view,eye,target,[0,1,0]);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(up,false,projection);gl.uniformMatrix4fv(uv,false,view);gl.drawArrays(gl.TRIANGLES,0,scene.count);raf=requestAnimationFrame(render)}
  const pointers=new Map();let last=null,lastPinch=0;
  canvas.addEventListener("pointerdown",e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});last={x:e.clientX,y:e.clientY};if(pointers.size===2){const a=Array.from(pointers.values());lastPinch=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}});
  canvas.addEventListener("pointermove",e=>{if(!pointers.has(e.pointerId))return;const prev=pointers.get(e.pointerId),dx=e.clientX-prev.x,dy=e.clientY-prev.y;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size>=2){const a=Array.from(pointers.values()),dist=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(lastPinch)radius=clamp(radius-(dist-lastPinch)*.035,minRadius,maxRadius);lastPinch=dist;target[0]-=dx*.012;target[2]+=dy*.012}else if(last){theta-=dx*.009;phi=clamp(phi+dy*.008,.42,1.42)}last={x:e.clientX,y:e.clientY}});
  const release=e=>{pointers.delete(e.pointerId);last=pointers.size?Array.from(pointers.values())[0]:null;if(pointers.size<2)lastPinch=0};canvas.addEventListener("pointerup",release);canvas.addEventListener("pointercancel",release);
  canvas.addEventListener("wheel",e=>{e.preventDefault();radius=clamp(radius+Math.sign(e.deltaY)*.55,minRadius,maxRadius)},{passive:false});
  const observer=new ResizeObserver(resize);observer.observe(container);
  render();
  const cleanup=()=>{if(disposed)return;disposed=true;cancelAnimationFrame(raf);observer.disconnect();delete container._office3dUpdateStates;delete container._office3dCleanup;gl.deleteBuffer(buffer);gl.deleteProgram(p);gl.getExtension("WEBGL_lose_context")?.loseContext()};
  container._office3dCleanup=cleanup;
  return true;
 }catch(error){container.replaceChildren();const note=document.createElement("p");note.className="office-3d-error";note.textContent="No se pudo iniciar la escena 3D. Se conserva la vista alternativa.";container.appendChild(note);return false}
}
window.Office3D={open,openOverview:options=>open({...options,roomName:"Vista general de la oficina",workers:[]})};
})();
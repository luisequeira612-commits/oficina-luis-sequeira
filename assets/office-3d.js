(function(){
"use strict";
const VERT=`#version 300 es
in vec3 aPosition; in vec3 aNormal; in vec3 aColor;
uniform mat4 uProjection; uniform mat4 uView;
out vec3 vColor; out vec3 vNormal;
void main(){vColor=aColor;vNormal=aNormal;gl_Position=uProjection*uView*vec4(aPosition,1.0);}`;
const FRAG=`#version 300 es
precision mediump float; in vec3 vColor; in vec3 vNormal; out vec4 outColor;
void main(){vec3 n=normalize(vNormal);vec3 keyLight=normalize(vec3(-0.45,0.85,0.55));vec3 fillLight=normalize(vec3(0.72,0.42,-0.38));float keyDiffuse=max(dot(n,keyLight),0.0);float fillDiffuse=max(dot(n,fillLight),0.0);float hemisphere=0.5+0.5*n.y;float shade=0.50+keyDiffuse*0.36+fillDiffuse*0.18+hemisphere*0.08;outColor=vec4(vColor*shade,1.0);}`;
const tone={light:[0.94,0.72,0.57],medium:[0.72,0.46,0.32],deep:[0.43,0.25,0.18]};
const hair=[0.12,0.085,0.07],hairColors=[[0.09,0.065,0.055],[0.19,0.12,0.08],[0.30,0.20,0.13]],shirts=[[0.18,0.34,0.52],[0.72,0.31,0.28],[0.20,0.43,0.39],[0.65,0.48,0.19],[0.39,0.29,0.43]],shirtByName={blue:shirts[0],coral:shirts[1],teal:shirts[2],mustard:shirts[3],plum:shirts[4]};
function mat4(){return new Float32Array(16)}
function perspective(out,fovy,aspect,near,far){const f=1/Math.tan(fovy/2),nf=1/(near-far);out.fill(0);out[0]=f/aspect;out[5]=f;out[10]=(far+near)*nf;out[11]=-1;out[14]=2*far*near*nf;return out}
function lookAt(out,eye,target,up){let zx=eye[0]-target[0],zy=eye[1]-target[1],zz=eye[2]-target[2];let l=Math.hypot(zx,zy,zz)||1;zx/=l;zy/=l;zz/=l;let xx=up[1]*zz-up[2]*zy,xy=up[2]*zx-up[0]*zz,xz=up[0]*zy-up[1]*zx;l=Math.hypot(xx,xy,xz)||1;xx/=l;xy/=l;xz/=l;let yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;out[0]=xx;out[1]=yx;out[2]=zx;out[3]=0;out[4]=xy;out[5]=yy;out[6]=zy;out[7]=0;out[8]=xz;out[9]=yz;out[10]=zz;out[11]=0;out[12]=-(xx*eye[0]+xy*eye[1]+xz*eye[2]);out[13]=-(yx*eye[0]+yy*eye[1]+yz*eye[2]);out[14]=-(zx*eye[0]+zy*eye[1]+zz*eye[2]);out[15]=1;return out}
function shader(gl,type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||"Shader error");return s}
function program(gl){const p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,VERT));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||"Program error");return p}
function buildScene(workers,roomName=""){
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
 // Structural corner piers, plinths and capitals give the cutaway room real architectural scale.
 for(const cx of [-5.62,5.62]){
  const cz=-4.62;
  box(cx,1.98,cz,.38,3.92,.38,[0.48,0.56,0.63]);
  box(cx,3.94,cz,.58,.16,.58,[0.68,0.74,0.79]);
  box(cx,.16,cz,.54,.28,.54,[0.36,0.44,0.51]);
 }
 box(0,3.78,-4.68,11.5,.20,.34,[0.43,0.51,0.58]);
 box(-5.66,3.78,0,.34,.20,9.3,[0.43,0.51,0.58]);
 // Continuous skirting boards visually join the two solid walls to the floor.
 box(0,.17,-4.78,11.5,.28,.12,[0.42,0.50,0.57]);
 box(-5.78,.17,0,.12,.28,9.5,[0.42,0.50,0.57]);
 // Recessed wall panels and narrow battens add depth without covering project displays.
 for(const px of [-4.85,-4.35,3.15,3.65,4.15]){
  box(px,2.02,-4.77,.055,2.95,.055,[0.64,0.70,0.75]);
 }
 for(const pz of [-3.9,-3.25,-2.6,-1.95,-1.3]){
  box(-5.70,2.0,pz,.055,2.92,.055,[0.69,0.75,0.79]);
 }
 // A slim framed transition marks the workstation zone against the lounge floor.
 box(0,.075,.05,8.9,.035,.08,[0.78,0.70,0.56]);
 box(0,.075,3.35,8.9,.035,.08,[0.78,0.70,0.56]);
 box(-4.45,.075,1.70,.08,.035,3.3,[0.78,0.70,0.56]);
 box(4.45,.075,1.70,.08,.035,3.3,[0.78,0.70,0.56]);
 box(-2.6,2.25,-4.84,2.6,1.8,.08,[0.22,0.49,0.64]);box(-2.6,2.25,-4.77,2.38,1.58,.06,[0.43,0.72,0.82]);
 box(-2.6,2.25,-4.70,.08,1.7,.08,[0.86,0.91,0.94]);box(-2.6,2.25,-4.69,2.5,.08,.08,[0.86,0.91,0.94]);
 // Window sill, divided glass panes and a slim inner frame add architectural depth.
 box(-2.6,1.32,-4.62,2.68,.12,.30,[0.42,0.53,0.61]);
 box(-3.42,2.25,-4.64,.055,1.52,.06,[0.88,0.92,0.95]);box(-1.78,2.25,-4.64,.055,1.52,.06,[0.88,0.92,0.95]);
 box(-2.6,2.25,-4.63,.055,1.52,.06,[0.88,0.92,0.95]);box(-2.6,2.25,-4.62,2.42,.055,.06,[0.88,0.92,0.95]);
 box(-2.6,3.10,-4.61,2.42,.055,.06,[0.88,0.92,0.95]);box(-2.6,1.40,-4.61,2.42,.055,.06,[0.88,0.92,0.95]);
 // A project-specific wall installation makes each room recognizable without external textures.
 const projectKey=String(roomName||"").toLowerCase();
 const projectTheme=projectKey.includes("guardi")?"guardi":projectKey.includes("youtube")?"video":projectKey.includes("nova")?"launcher":projectKey.includes("babymonster")||projectKey.includes("chart")?"charts":"studio";
 const themeColors={guardi:[0.20,0.48,0.72],video:[0.82,0.22,0.25],launcher:[0.37,0.48,0.76],charts:[0.70,0.38,0.66],studio:[0.36,0.54,0.66]};
 const themeColor=themeColors[projectTheme];
 box(1.45,2.95,-4.76,2.72,1.52,.16,[0.17,0.23,0.30]);
 box(1.45,2.95,-4.65,2.54,1.34,.08,[0.83,0.87,0.90]);
 box(1.45,3.55,-4.59,2.48,.12,.035,themeColor);
 box(.28,2.95,-4.58,.12,1.18,.05,themeColor);
 if(projectTheme==="guardi"){
  // Shield-like emblem for the Guardi development room.
  box(1.42,2.98,-4.56,.66,.72,.07,[0.18,0.31,0.45]);
  addTri([1.42,3.30,-4.51],[1.10,2.98,-4.51],[1.42,2.57,-4.51],themeColor);
  addTri([1.42,3.30,-4.51],[1.42,2.57,-4.51],[1.74,2.98,-4.51],themeColor);
  box(1.42,2.98,-4.49,.10,.34,.04,[0.90,0.94,0.97]);
 }else if(projectTheme==="video"){
  // Play symbol and a small editing timeline.
  box(1.42,3.02,-4.55,.88,.66,.06,[0.76,0.18,0.22]);
  addTri([1.25,2.82,-4.50],[1.25,3.22,-4.50],[1.70,3.02,-4.50],[1,1,1]);
  for(let i=0;i<5;i++)box(2.02+i*.16,2.67,-4.53,.10,.09+(i%2)*.08,.035,i%2?themeColor:[0.35,0.68,0.75]);
 }else if(projectTheme==="launcher"){
  // Phone mock-up with orbit dots for the launcher/design room.
  box(1.42,2.98,-4.55,.55,.90,.07,[0.16,0.22,0.31]);
  box(1.42,3.00,-4.50,.43,.72,.025,[0.35,0.60,0.77]);
  sphere(1.42,2.67,-4.47,.045,.045,.025,[0.92,0.95,0.98],7,4);
  sphere(2.05,3.20,-4.52,.14,.14,.05,themeColor,8,5);
  sphere(2.30,2.78,-4.52,.09,.09,.04,[0.82,0.72,0.42],8,5);
 }else if(projectTheme==="charts"){
  // Chart bars and a music-note motif for the BABYMONSTER workspace.
  for(let i=0;i<5;i++)box(1.00+i*.22,2.78+(i%3)*.16,-4.55,.12,.36+(i%3)*.32,.05,i%2?themeColor:[0.37,0.60,0.76]);
  sphere(2.08,3.18,-4.52,.16,.13,.06,[0.20,0.24,0.31],8,5);
  box(2.20,3.48,-4.52,.07,.55,.05,[0.20,0.24,0.31]);
 }else{
  // A neutral modular display for user-created projects.
  for(let i=0;i<4;i++)box(1.00+i*.28,2.95,-4.55,.14,.52,.05,i%2?themeColor:[0.58,0.69,0.76]);
 }
 // A compact wall-mounted planning board adds a recognizable office detail to the left wall.
 box(-5.68,2.35,-1.05,.10,1.42,2.15,[0.25,0.34,0.42]);
 box(-5.61,2.35,-1.05,.045,1.28,2.01,[0.88,0.91,0.90]);
 box(-5.57,2.35,-1.05,.025,.055,1.84,[0.22,0.55,0.72]);
 for(let note=0;note<4;note++){
  const noteColor=note%2? [0.88,0.68,0.35]:[0.39,0.66,0.61];
  box(-5.56,2.52-(note%2)*.42,-1.68+note*.42,.025,.22,.30,noteColor);
  box(-5.54,2.52-(note%2)*.42,-1.68+note*.42,.018,.025,.20,[0.94,0.95,0.92]);
 }
 box(-5.55,1.62,-1.05,.18,.06,2.22,woodTop);
 // Floor planks and rugs.
 for(let i=-5;i<6;i++)box(i*.98,-.005,0,.018,.012,9.6,[0.72,0.65,0.55]);
 box(0,.025,1.7,9,.05,3.2,[0.31,0.38,0.43]);
 box(0,.056,1.7,8.8,.018,.10,themeColor);
 // A compact lounge corner gives the room a readable non-work zone.
 box(4.45,.58,1.92,2.55,.34,.82,[0.23,0.34,0.43]);
 box(4.45,.92,2.27,2.55,.72,.20,[0.18,0.28,0.37]);
 box(3.25,.72,1.92,.22,.58,.92,[0.28,0.40,0.48]);box(5.65,.72,1.92,.22,.58,.92,[0.28,0.40,0.48]);
 for(let seat=0;seat<3;seat++)box(3.65+seat*.80,.78,1.86,.72,.10,.68,[0.34,0.47,0.55]);
 box(4.45,.38,.88,1.72,.12,.82,woodTop);for(const dx of [-.68,.68])for(const dz of [-.28,.28])box(4.45+dx,.20,.88+dz,.08,.32,.08,wood);
 box(4.45,.46,.88,.52,.035,.34,[0.78,.84,.88]);
 cyl(5.55,.32,.58,.28,.52,[0.42,.25,.16]);for(let leaf=0;leaf<5;leaf++)sphere(5.55+Math.cos(leaf*1.26)*.18,.78+(leaf%2)*.10,.58+Math.sin(leaf*1.26)*.18,.16,.32,.13,plant,7,5);
 const count=Math.max(1,workers.length),cols=count>3?2:count,rows=Math.ceil(count/cols),workerRanges=[];
 workers.forEach((worker,index)=>{
  const col=index%cols,row=Math.floor(index/cols),x=(col-(cols-1)/2)*4.1,z=rows===1?-1.55:-2.8+row*2.4;
  // desk, legs, monitor, illuminated display, stand, keyboard, mouse and desktop tower.
  sphere(x,.012,z+.28,1.5,.008,.72,[0.24,0.25,0.25],12,3);
  box(x,.92,z,2.65,.18,1.15,woodTop);for(const dx of [-1.12,1.12])for(const dz of [-.42,.42])box(x+dx,.47,z+dz,.11,.82,.11,wood);
  // Two-drawer pedestal and recessed cable tray make the desk read as finished furniture.
  box(x+.78,.56,z-.12,.48,.62,.72,[0.43,0.49,0.54]);
  for(let drawer=0;drawer<2;drawer++){
   box(x+.78,.72-drawer*.27,z+.25,.40,.22,.035,[0.63,0.69,0.72]);
   box(x+.78,.72-drawer*.27,z+.275,.13,.025,.025,metal);
  }
  box(x,.79,z-.43,1.45,.08,.12,[0.24,0.30,0.35]);
  box(x,.73,z-.43,1.18,.035,.07,[0.48,0.55,0.60]);
  box(x,.28,z+.52,.5,.08,.34,metal);
  box(x,.0,z+.52,.42,.45,.28,metal);
  // Front-facing tower vents, status light and power control remain visible at desk scale.
  for(let vent=0;vent<4;vent++)box(x-.12+vent*.08,.12,z+.665,.025,.18,.018,[0.62,0.70,0.75]);
  sphere(x+.14,.30,z+.665,.035,.035,.018,[0.24,0.82,0.72],6,4);
  box(x+.12,.20,z+.665,.06,.035,.018,[0.76,0.82,0.86]);
  box(x,1.65,z-.36,1.12,.78,.14,metal);box(x,1.65,z-.265,.98,.62,.025,screen);
  // Screen glow strips and small dashboard panels.
  box(x,1.65,z-.245,.82,.035,.012,[0.63,0.91,1]);box(x-.28,1.72,z-.24,.18,.025,.012,[0.12,0.95,0.82]);box(x+.18,1.52,z-.24,.35,.025,.012,[0.12,0.95,0.82]);
  box(x,1.23,z-.36,.14,.12,.14,metal);box(x,.99,z-.36,.68,.08,.35,metal);
  box(x,.97,z+.08,.72,.035,.26,[0.18,0.22,0.27]);for(let k=0;k<10;k++)box(x-.31+k*.069,.995,z+.08,.035,.012,.19,[0.66,0.72,0.76]);
  sphere(x+.62,.99,z+.12,.11,.06,.14,metal,8,5);
  // Chair, cushion, back, stem and five-foot base.
  box(x,.78,z+1.55,.9,.16,.78,chair);box(x,1.3,z+1.88,.86,1.05,.16,chair);cyl(x,.38,z+1.55,.09,.58,metal);
  // Padded armrests and upright supports give the task chair a more complete silhouette.
  for(const side of [-1,1]){
   box(x+side*.48,1.02,z+1.48,.12,.42,.12,metal);
   box(x+side*.48,1.25,z+1.48,.18,.10,.54,[0.25,0.38,0.49]);
  }
  box(x,.92,z+1.88,.58,.045,.035,[0.39,0.49,0.57]);
  for(let a=0;a<5;a++){const t=a*Math.PI*2/5;box(x+Math.cos(t)*.34,.12,z+1.55+Math.sin(t)*.34,.48,.08,.1,metal)}
  // Desk lamp and plant accessories.
  box(x-1.05,1.05,z-.38,.18,.16,.18,metal);box(x-1.05,1.38,z-.38,.08,.58,.08,metal);box(x-1.05,1.7,z-.38,.48,.16,.3,[0.82,0.68,0.38]);
  cyl(x+.78,.34,z-.35,.24,.55,[0.45,0.25,0.15]);for(let leaf=0;leaf<5;leaf++)sphere(x+.78+Math.cos(leaf*1.26)*.18,.78+(leaf%2)*.12,z-.35+Math.sin(leaf*1.26)*.18,.18,.36,.14,plant,7,5);
  // Small themed desk objects repeat the room identity at workstation scale.
  if(projectTheme==="guardi"){
   box(x-.78,1.06,z+.12,.34,.08,.30,[0.18,0.31,0.45]);sphere(x-.78,1.16,z+.12,.09,.09,.08,themeColor,7,5);
  }else if(projectTheme==="video"){
   box(x-.78,1.06,z+.12,.36,.10,.30,[0.76,0.18,0.22]);for(let stripe=0;stripe<3;stripe++)box(x-.90+stripe*.12,1.12,z+.12,.06,.025,.31,[0.91,0.91,0.91]);
  }else if(projectTheme==="launcher"){
   box(x-.78,1.17,z+.12,.22,.34,.06,[0.16,0.22,0.31]);box(x-.78,1.18,z+.085,.16,.24,.018,[0.35,0.60,0.77]);sphere(x-.78,1.05,z+.075,.025,.025,.02,[0.92,0.95,0.98],6,4);
  }else if(projectTheme==="charts"){
   for(let bar=0;bar<4;bar++)box(x-.92+bar*.10,1.06+(bar%3)*.06,z+.12,.07,.12+(bar%3)*.12,.12,bar%2?themeColor:[0.37,0.60,0.76]);
  }else{
   box(x-.78,1.06,z+.12,.34,.08,.30,themeColor);box(x-.78,1.12,z+.12,.22,.025,.06,[0.91,0.94,0.97]);
  }
  // Original brick-built minifigure proportions: cylindrical head, top stud, block torso and separate legs.
  const skin=tone[worker.tone]||tone.medium,shirt=shirtByName[worker.shirt]||shirts[index%shirts.length],hairColor=hairColors[index%hairColors.length],hairStyle=worker.hair||"short",workerStart=positions.length;
  const minifigureGender=worker.gender==="woman"?"woman":"man";
  // Seated block legs and square shoes remain clearly separated below the desk.
  box(x-.20,.73,z+.76,.34,.62,.38,shirt);box(x+.20,.73,z+.76,.34,.62,.38,shirt);
  box(x-.20,.40,z+.91,.38,.18,.48,metal);box(x+.20,.40,z+.91,.38,.18,.48,metal);
  // Rectangular torso with broad shoulders, flat front and a small role badge.
  box(x,1.28,z+1.0,.82,.76,.48,shirt);
  box(x,1.61,z+1.245,.30,.12,.035,[0.88,0.91,0.92]);
  sphere(x+.25,1.43,z+1.255,.065,.065,.035,[0.88,0.72,0.40],7,5);
  const headStart=positions.length;
  // Cylindrical minifigure head with the characteristic top stud.
  cyl(x,2.02,z+.99,.355,.68,skin,12);
  cyl(x,2.40,z+.99,.125,.12,skin,12);
  // Hair pieces are compact block-compatible caps; long and tied styles keep variety.
  if(hairStyle==="short")box(x,2.34,z+.98,.70,.16,.67,hairColor);
  else if(hairStyle==="curly"){sphere(x,2.35,z+.98,.37,.18,.36,hairColor,9,5);for(let curl=0;curl<5;curl++){const a=curl*Math.PI*2/5;sphere(x+Math.cos(a)*.25,2.40,z+.98+Math.sin(a)*.24,.12,.12,.12,hairColor,6,4)}}
  else {box(x,2.34,z+.98,.72,.16,.68,hairColor);if(hairStyle==="long"){box(x-.30,2.02,z+.98,.13,.55,.48,hairColor);box(x+.30,2.02,z+.98,.13,.55,.48,hairColor)}else{sphere(x,2.48,z+.68,.13,.14,.13,hairColor,7,5)}}
  // Simple printed face: two eyes and a small smile, not realistic anatomy.
  sphere(x-.12,2.04,z+1.344,.045,.052,.025,[0.12,.10,.09],7,4);
  sphere(x+.12,2.04,z+1.344,.045,.052,.025,[0.12,.10,.09],7,4);
  box(x,1.91,z+1.345,.12,.018,.02,[0.40,.18,.15]);
  if(minifigureGender==="woman"&&index%3===0)box(x+.25,2.02,z+1.30,.07,.035,.025,[0.86,.70,.38]);
  const headEnd=positions.length;
  const armsStart=positions.length;
  // Short articulated block arms and rounded hands rest toward the keyboard.
  sphere(x-.48,1.52,z+.98,.16,.17,.16,shirt,8,5);sphere(x+.48,1.52,z+.98,.16,.17,.16,shirt,8,5);
  cyl(x-.49,1.34,z+.84,.115,.38,shirt,8);cyl(x+.49,1.34,z+.84,.115,.38,shirt,8);
  const handsStart=positions.length;
  sphere(x-.49,1.12,z+.58,.13,.13,.13,skin,8,5);sphere(x+.49,1.12,z+.58,.13,.13,.13,skin,8,5);
  const handsEnd=positions.length,armsEnd=positions.length;
  // Small printed state markers remain separate from real GitHub activity labels.
  if(worker.state==="st-w"){box(x-.22,1.16,z+.47,.2,.18,.2,skin);box(x+.22,1.16,z+.47,.2,.18,.2,skin)}
  else if(worker.state==="st-t"){sphere(x+.44,2.55,z+.95,.13,.13,.13,[.98,.78,.25],7,5)}
  else if(worker.state==="st-a"){sphere(x,2.62,z+.96,.11,.11,.11,[.24,.78,.88],7,5)}
  else if(worker.state==="st-s"){sphere(x-.34,2.62,z+.96,.08,.08,.08,[.98,.78,.22],7,5);sphere(x+.34,2.62,z+.96,.08,.08,.08,[.98,.78,.22],7,5)}
  else if(worker.state==="st-f"){box(x-.38,2.55,z+.96,.1,.3,.1,[.86,.16,.22]);sphere(x-.38,2.32,z+.96,.07,.07,.07,[.86,.16,.22],7,5)}
  workerRanges.push({start:workerStart,end:positions.length,headStart,headEnd,armsStart,armsEnd,handsStart,handsEnd,state:worker.state,index});
 });
 // Layered ceiling fixtures: recessed rails and three pendant lamps with bright diffusers.
 box(0,3.72,-.5,4.8,.08,.7,[0.34,0.41,0.47]);
 box(0,3.64,-.5,4.35,.08,.12,[0.82,0.87,0.91]);
 for(const lx of [-3.4,0,3.4]){
  box(lx,3.42,.95,.08,.42,.08,metal);cyl(lx,3.18,.95,.16,.10,[0.34,0.42,0.49]);
  sphere(lx,3.10,.95,.28,.10,.28,[1,.88,.57],9,5);
  box(lx,3.02,.95,.34,.035,.34,[1,.94,.74]);
 }
 // A warm wall wash and the original ceiling light remain subtle in the cutaway view.
 box(0,3.62,-.5,3.8,.08,.16,[1,.9,.65]);
 box(4.9,1.8,-4.82,1.2,2.8,.32,wood);for(let i=0;i<4;i++)box(4.9,1.0+i*.5,-4.6,1.0,.06,.42,[0.72,.76,.79]);
 for(let i=0;i<3;i++)box(4.9,1.25+i*.5,-4.36,.42,.35,.18,[.38,.54,.68]);
 const basePositions=new Float32Array(positions);
 const data=new Float32Array(positions.length+normals.length+colors.length);
 data.set(positions,0);data.set(normals,positions.length);data.set(colors,positions.length+normals.length);
 return {data,basePositions,workerRanges,count:positions.length/3,positionLength:positions.length,normalLength:normals.length};
}
function buildOfficeScene(rooms){
 const metal=[0.22,0.28,0.34];
 const cols=rooms.length>1?2:1,rows=Math.ceil(rooms.length/cols),scenes=rooms.map(room=>buildScene(room.workers||[],room.name||"")),positions=[],normals=[],colors=[],workerRanges=[];
 let workerOffset=0;
 scenes.forEach((scene,index)=>{
  const col=index%cols,row=Math.floor(index/cols),xCenter=cols===1?0:(col===0?-6.2:6.2),zCenter=(row-(rows-1)/2)*10.4,flip=col===1,posStart=positions.length;
  for(let i=0;i<scene.positionLength;i+=3){const x=scene.basePositions[i],y=scene.basePositions[i+1],z=scene.basePositions[i+2];positions.push((flip?-x:x)+xCenter,y,(flip?-z:z)+zCenter)}
  for(let i=scene.positionLength;i<scene.positionLength+scene.normalLength;i+=3){normals.push(flip?-scene.data[i]:scene.data[i],scene.data[i+1],flip?-scene.data[i+2]:scene.data[i+2])}
  for(let i=scene.positionLength+scene.normalLength;i<scene.data.length;i++)colors.push(scene.data[i]);
  scene.workerRanges.forEach(worker=>workerRanges.push({...worker,start:worker.start+posStart,end:worker.end+posStart,headStart:worker.headStart+posStart,headEnd:worker.headEnd+posStart,armsStart:worker.armsStart+posStart,armsEnd:worker.armsEnd+posStart,handsStart:worker.handsStart+posStart,handsEnd:worker.handsEnd+posStart,index:worker.index+workerOffset}));
  workerOffset+=(rooms[index].workers||[]).length;
 });
 // Give each project room a distinct entrance facing the shared corridor.
 const addTriDetail=(a,b,c,color)=>{const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;for(const p of [a,b,c]){positions.push(...p);normals.push(nx,ny,nz);colors.push(...color)}};
 const quadDetail=(a,b,c,d,color)=>{addTriDetail(a,b,c,color);addTriDetail(a,c,d,color)};
 const boxDetail=(x,y,z,w,h,d,color)=>{const x0=x-w/2,x1=x+w/2,y0=y-h/2,y1=y+h/2,z0=z-d/2,z1=z+d/2;quadDetail([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],color);quadDetail([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],color);quadDetail([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],color);quadDetail([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],color);quadDetail([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],color);quadDetail([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],color)};
 const roomAccentPalette=[[0.20,0.55,0.72],[0.76,0.47,0.20],[0.24,0.55,0.39],[0.48,0.36,0.68]];
 rooms.forEach((room,index)=>{
  const col=index%cols,row=Math.floor(index/cols),xCenter=cols===1?0:(col===0?-6.2:6.2),zCenter=(row-(rows-1)/2)*10.4,side=col===0?1:-1,portalX=xCenter+side*5.82,accent=roomAccentPalette[index%roomAccentPalette.length],trim=[0.20,0.27,0.34];
  // Two sturdy posts, a header, and a small project marker make every entrance readable.
  boxDetail(portalX,1.34,zCenter-1.08,.22,2.68,.22,trim);
  boxDetail(portalX,1.34,zCenter+1.08,.22,2.68,.22,trim);
  boxDetail(portalX,2.78,zCenter,.24,.24,2.48,accent);
  boxDetail(portalX,3.12,zCenter,.30,.42,1.42,[0.83,0.88,0.92]);
  boxDetail(portalX+side*.17,3.12,zCenter,.08,.26,1.12,accent);
  // A short accent runner leads from the hallway into the room.
  boxDetail(portalX-side*.54,.035,zCenter,1.05,.045,2.28,accent);
 });
 // Two facing rows of rooms open onto one continuous central hallway.
 if(cols>1){
  const addTri=(a,b,c,color)=>{const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;for(const p of [a,b,c]){positions.push(...p);normals.push(nx,ny,nz);colors.push(...color)}};
  const quad=(a,b,c,d,color)=>{addTri(a,b,c,color);addTri(a,c,d,color)};
  const box=(x,y,z,w,h,d,color)=>{const x0=x-w/2,x1=x+w/2,y0=y-h/2,y1=y+h/2,z0=z-d/2,z1=z+d/2;quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],color);quad([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],color);quad([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],color);quad([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],color);quad([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],color);quad([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],color)};
  box(0,.025,0,2.5,.12,rows*10.4,[0.40,0.46,0.51]);
  for(let row=0;row<rows;row++){const z=(row-(rows-1)/2)*10.4;box(-1.22,.12,z,.16,.18,1.8,[0.72,0.58,0.39]);box(1.22,.12,z,.16,.18,1.8,[0.72,0.58,0.39]);box(0,3.55,z,1.4,.08,.55,[0.88,0.79,0.55])}
  // A widened entrance atrium terminates the corridor with a staffed-looking reception counter.
  const foyerZ=(rows-1)*5.2+6.8;
  box(0,.015,foyerZ,8.4,.12,5.8,[0.52,0.58,0.62]);
  box(0,.09,foyerZ,7.9,.045,5.35,[0.69,0.65,0.57]);
  for(let tile=-3;tile<=3;tile++)box(tile*1.08,.118,foyerZ,.018,.012,5.1,[0.82,0.79,0.72]);
  box(0,.04,foyerZ-2.35,5.4,.08,.55,[0.20,0.34,0.43]);
  // Reception desk, stone counter, front panels and a visible terminal.
  box(0,.62,foyerZ-1.35,3.55,1.08,.92,[0.24,0.34,0.41]);
  box(0,1.20,foyerZ-1.35,3.82,.16,1.08,[0.72,0.76,0.77]);
  box(0,.62,foyerZ-.875,2.95,.62,.035,[0.31,0.48,0.55]);
  box(0,1.48,foyerZ-1.58,.92,.58,.12,metal);
  box(0,1.48,foyerZ-1.505,.78,.42,.025,[0.18,0.65,0.78]);
  box(0,1.48,foyerZ-1.48,.58,.025,.012,[0.72,0.94,0.98]);
  // Tall welcome wall and a suspended wayfinding sign.
  box(0,2.05,foyerZ-3.02,4.8,2.9,.18,[0.28,0.38,0.46]);
  box(0,2.05,foyerZ-2.91,4.48,2.58,.06,[0.78,0.83,0.85]);
  box(0,2.88,foyerZ-2.86,3.8,.16,.035,[0.20,0.48,0.62]);
  box(0,2.20,foyerZ-2.85,2.6,.08,.035,[0.42,0.51,0.57]);
  box(0,3.62,foyerZ-.1,4.4,.42,.16,[0.18,0.27,0.34]);
  box(0,3.62,foyerZ-.005,4.08,.24,.045,[0.24,0.55,0.68]);
  // Entrance portal and paired visitor seating create a clear public-facing threshold.
  for(const side of [-1,1]){
   box(side*3.35,1.62,foyerZ+2.10,.22,3.24,.22,[0.22,0.30,0.37]);
   box(side*3.35,3.24,foyerZ+2.10,.22,.22,4.8,[0.22,0.30,0.37]);
   box(side*2.25,.48,foyerZ+.55,1.45,.18,.62,[0.25,0.36,0.44]);
   box(side*2.25,.88,foyerZ+.78,1.45,.68,.18,[0.20,0.31,0.39]);
   box(side*2.25,.16,foyerZ+.55,.12,.30,.12,metal);
   box(side*3.55,.38,foyerZ-1.0,.48,.62,.48,[0.42,.26,.17]);
   for(let leaf=0;leaf<5;leaf++)box(side*3.55+Math.cos(leaf*1.26)*.20,.83+(leaf%2)*.12,foyerZ-1.0+Math.sin(leaf*1.26)*.20,.14,.58,.14,[0.17,0.43,0.27]);
  }
  // Ceiling canopy and warm downlights visually frame the entrance without external textures.
  box(0,3.88,foyerZ+.65,8.0,.16,5.2,[0.34,0.42,0.48]);
  for(const lightX of [-2.6,0,2.6]){box(lightX,3.77,foyerZ+.65,.68,.045,.68,[0.96,.91,.75]);box(lightX,3.70,foyerZ+.65,.30,.08,.30,[1,.88,.58])}
 }
 const basePositions=new Float32Array(positions),data=new Float32Array(positions.length+normals.length+colors.length);
 data.set(positions,0);data.set(normals,positions.length);data.set(colors,positions.length+normals.length);
 return {data,basePositions,workerRanges,count:positions.length/3,positionLength:positions.length,normalLength:normals.length};
}
function open({container,roomName,workers=[],rooms=null,onSelectRoom=null}){
 window.Office3D.lastError=null;
 if(typeof container._office3dCleanup==="function")container._office3dCleanup();
 container.replaceChildren();container.classList.remove("is-active");
 const canvas=document.createElement("canvas");canvas.setAttribute("aria-label","Escena 3D de "+roomName);
 let gl;
 try{gl=canvas.getContext("webgl2",{alpha:false,antialias:false,powerPreference:"low-power"})}
 catch(error){window.Office3D.lastError="No se pudo crear el contexto WebGL 2: "+(error&&error.message?error.message:String(error));return false}
 if(!gl){window.Office3D.lastError="El navegador no proporcionó un contexto WebGL 2.";const note=document.createElement("p");note.className="office-3d-error";note.textContent="Este navegador no ofrece WebGL 2 en este momento. Se muestra la vista alternativa.";container.appendChild(note);return false}
 try{
  const p=program(gl),scene=rooms&&rooms.length?buildOfficeScene(rooms):buildScene(workers,roomName),buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,scene.data,gl.DYNAMIC_DRAW);
  const stride=0,loc=(name)=>gl.getAttribLocation(p,name);gl.useProgram(p);
  const ap=loc("aPosition"),an=loc("aNormal"),ac=loc("aColor");
  gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,3,gl.FLOAT,false,stride,0);
  gl.enableVertexAttribArray(an);gl.vertexAttribPointer(an,3,gl.FLOAT,false,stride,scene.positionLength*4);
  gl.enableVertexAttribArray(ac);gl.vertexAttribPointer(ac,3,gl.FLOAT,false,stride,(scene.positionLength+scene.normalLength)*4);
  const up=gl.getUniformLocation(p,"uProjection"),uv=gl.getUniformLocation(p,"uView");
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.clearColor(.075,.12,.18,1);
  const roomNav=rooms&&rooms.length?document.createElement("div"):null;if(roomNav){roomNav.className="office-3d-room-nav";rooms.forEach(room=>{const button=document.createElement("button");button.type="button";button.textContent="Entrar · "+room.name;button.setAttribute("aria-label","Entrar en la habitación "+room.name);button.addEventListener("click",()=>{if(typeof onSelectRoom==="function")onSelectRoom(room.id)});roomNav.appendChild(button)})}
  const controls=document.createElement("div");controls.className="office-3d-controls";
  const hint=document.createElement("span");hint.className="office-3d-hint";hint.textContent="Arrastra para moverte · Pellizca para acercar · Usa ↶ ↷ para girar";
  const group=document.createElement("div");group.style.display="flex";group.style.gap="5px";
  const makeButton=(label,aria,fn)=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.setAttribute("aria-label",aria);b.addEventListener("click",fn);group.appendChild(b);return b};
  const overviewMode=Boolean(rooms&&rooms.length),overviewRows=overviewMode?Math.ceil(rooms.length/2):1,initialRadius=overviewMode?(rooms.length===1?13:Math.max(13,Math.max(24.8,overviewRows*10.4)*1.45)):13,minRadius=8,maxRadius=overviewMode?initialRadius*1.65:23;let theta=.72,phi=1.08,radius=initialRadius,target=[0,1.15,0];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  makeButton("−","Alejar cámara",()=>{radius=clamp(radius+1,minRadius,maxRadius)});
  makeButton("+","Acercar cámara",()=>{radius=clamp(radius-1,minRadius,maxRadius)});
  makeButton("↶","Girar a la izquierda",()=>{theta=clamp(theta-.14,-.35,1.78)});makeButton("↷","Girar a la derecha",()=>{theta=clamp(theta+.14,-.35,1.78)});makeButton("⌂","Centrar oficina",()=>{theta=.72;phi=1.08;radius=initialRadius;target=[0,1.15,0]});
  controls.append(hint,group);container.append(canvas);if(roomNav)container.appendChild(roomNav);container.appendChild(controls);container.classList.add("is-active");
  const projection=mat4(),view=mat4();let raf=0,disposed=false,lastFrame=0;const reducedMotion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  container._office3dUpdateStates=states=>{scene.workerRanges.forEach((worker,index)=>{if(states[index])worker.state=states[index]})};
  function resize(){const rect=container.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.15),w=Math.max(1,Math.floor(rect.width*dpr)),h=Math.max(1,Math.floor(rect.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}}
  function render(timestamp=0){if(disposed)return;if(timestamp-lastFrame<32){raf=requestAnimationFrame(render);return}lastFrame=timestamp;resize();if(!reducedMotion){const seconds=timestamp*.001;scene.workerRanges.forEach(worker=>{let bob=0,arms=0,head=0,hands=0;if(worker.state==="st-w"){bob=Math.sin(seconds*7+worker.index)*.025;arms=Math.sin(seconds*12+worker.index)*.055;head=Math.sin(seconds*3+worker.index)*.012;hands=Math.abs(Math.sin(seconds*16+worker.index))*.045}else if(worker.state==="st-t"){bob=Math.sin(seconds*2+worker.index)*.014;arms=.035;head=Math.sin(seconds*2.5+worker.index)*.025;hands=.006}else if(worker.state==="st-a"){bob=Math.sin(seconds*1.5+worker.index)*.01;arms=Math.sin(seconds*2.5+worker.index)*.025;head=Math.sin(seconds*1.4+worker.index)*.008}else if(worker.state==="st-s"){bob=Math.abs(Math.sin(seconds*5+worker.index))*.055;arms=Math.sin(seconds*9+worker.index)*.1;head=Math.sin(seconds*4+worker.index)*.018;hands=Math.abs(Math.sin(seconds*12+worker.index))*.035}else if(worker.state==="st-f"){bob=Math.sin(seconds*1.6+worker.index)*.008;arms=Math.sin(seconds*1.2+worker.index)*.012;head=Math.sin(seconds*1.5+worker.index)*.018}else{bob=Math.sin(seconds*1.2+worker.index)*.018;arms=Math.sin(seconds*1.1+worker.index)*.012;head=Math.sin(seconds*.9+worker.index)*.012}for(let i=worker.start+1;i<worker.end;i+=3)scene.data[i]=scene.basePositions[i]+bob;for(let i=worker.armsStart+1;i<worker.armsEnd;i+=3)scene.data[i]=scene.basePositions[i]+bob+arms;for(let i=worker.headStart+1;i<worker.headEnd;i+=3)scene.data[i]=scene.basePositions[i]+bob+head;for(let i=worker.handsStart+1;i<worker.handsEnd;i+=3)scene.data[i]=scene.basePositions[i]+bob+arms+hands});gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,scene.data.subarray(0,scene.positionLength))}const eye=[target[0]+radius*Math.sin(phi)*Math.sin(theta),target[1]+radius*Math.cos(phi),target[2]+radius*Math.sin(phi)*Math.cos(theta)];perspective(projection,overviewMode?.86:.72,canvas.width/canvas.height,.1,100);lookAt(view,eye,target,[0,1,0]);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(up,false,projection);gl.uniformMatrix4fv(uv,false,view);gl.drawArrays(gl.TRIANGLES,0,scene.count);raf=requestAnimationFrame(render)}
  const pointers=new Map();let lastPinch=0;
  canvas.addEventListener("pointerdown",e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});last={x:e.clientX,y:e.clientY};if(pointers.size===2){const a=Array.from(pointers.values());lastPinch=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}});
  canvas.addEventListener("pointermove",e=>{if(!pointers.has(e.pointerId))return;const prev=pointers.get(e.pointerId),dx=e.clientX-prev.x,dy=e.clientY-prev.y;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size>=2){const a=Array.from(pointers.values()),dist=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(lastPinch)radius=clamp(radius-(dist-lastPinch)*.035,minRadius,maxRadius);lastPinch=dist;target[0]=clamp(target[0]-dx*.012,-4.8,4.8);target[2]=clamp(target[2]+dy*.012,-7.5,7.5)}else{target[0]=clamp(target[0]-dx*.018,-4.8,4.8);target[2]=clamp(target[2]+dy*.018,-7.5,7.5)}});
  const release=e=>{pointers.delete(e.pointerId);if(pointers.size<2)lastPinch=0};canvas.addEventListener("pointerup",release);canvas.addEventListener("pointercancel",release);
  canvas.addEventListener("wheel",e=>{e.preventDefault();radius=clamp(radius+Math.sign(e.deltaY)*.55,minRadius,maxRadius)},{passive:false});
  const observer=new ResizeObserver(resize);observer.observe(container);
  render();
  const cleanup=()=>{if(disposed)return;disposed=true;cancelAnimationFrame(raf);observer.disconnect();delete container._office3dUpdateStates;delete container._office3dCleanup;gl.deleteBuffer(buffer);gl.deleteProgram(p);gl.getExtension("WEBGL_lose_context")?.loseContext()};
  container._office3dCleanup=cleanup;
  return true;
 }catch(error){window.Office3D.lastError=(error&&error.name?error.name+": ":"")+(error&&error.message?error.message:String(error));container.replaceChildren();const note=document.createElement("p");note.className="office-3d-error";note.textContent="No se pudo iniciar la escena 3D. Se conserva la vista alternativa.";container.appendChild(note);return false}
}
window.Office3D={open,openOverview:options=>open({...options,roomName:"Vista general de la oficina",workers:[]})};
})();
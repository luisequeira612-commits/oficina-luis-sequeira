(function(){
"use strict";
const VERT=`#version 300 es
in vec3 aPosition; in vec3 aNormal; in vec3 aColor;
uniform mat4 uProjection; uniform mat4 uView;
out vec3 vColor; out vec3 vNormal; out vec3 vViewPosition;
void main(){vec4 viewPosition=uView*vec4(aPosition,1.0);vColor=aColor;vNormal=mat3(uView)*aNormal;vViewPosition=-viewPosition.xyz;gl_Position=uProjection*viewPosition;}`;
const FRAG=`#version 300 es
precision mediump float; in vec3 vColor; in vec3 vNormal; in vec3 vViewPosition; out vec4 outColor;
void main(){vec3 n=normalize(vNormal);vec3 viewDir=normalize(vViewPosition);vec3 keyLight=normalize(vec3(-0.45,0.85,0.55));vec3 fillLight=normalize(vec3(0.72,0.42,-0.38));vec3 rimLight=normalize(vec3(-0.15,0.30,-0.92));float keyDiffuse=max(dot(n,keyLight),0.0);float fillDiffuse=max(dot(n,fillLight),0.0);float rimDiffuse=max(dot(n,rimLight),0.0);float hemisphere=0.5+0.5*n.y;float cavity=0.5+0.5*max(n.y,0.0);float specular=pow(max(dot(reflect(-keyLight,n),viewDir),0.0),48.0)*0.28;float shade=0.40+keyDiffuse*0.39+fillDiffuse*0.15+rimDiffuse*0.07+hemisphere*0.08+cavity*0.025+specular;outColor=vec4(min(vColor*shade+vec3(specular*.24),vec3(1.0)),1.0);}`;
const tone={light:[0.94,0.72,0.57],medium:[0.72,0.46,0.32],deep:[0.43,0.25,0.18]};
const hair=[0.12,0.085,0.07],hairColors=[[0.09,0.065,0.055],[0.19,0.12,0.08],[0.30,0.20,0.13]],shirts=[[0.04,0.30,0.86],[0.88,0.12,0.10],[0.02,0.58,0.42],[0.96,0.68,0.04],[0.46,0.16,0.68]],shirtByName={blue:shirts[0],coral:shirts[1],teal:shirts[2],mustard:shirts[3],plum:shirts[4]};
function mat4(){return new Float32Array(16)}
function perspective(out,fovy,aspect,near,far){const f=1/Math.tan(fovy/2),nf=1/(near-far);out.fill(0);out[0]=f/aspect;out[5]=f;out[10]=(far+near)*nf;out[11]=-1;out[14]=2*far*near*nf;return out}
function lookAt(out,eye,target,up){let zx=eye[0]-target[0],zy=eye[1]-target[1],zz=eye[2]-target[2];let l=Math.hypot(zx,zy,zz)||1;zx/=l;zy/=l;zz/=l;let xx=up[1]*zz-up[2]*zy,xy=up[2]*zx-up[0]*zz,xz=up[0]*zy-up[1]*zx;l=Math.hypot(xx,xy,xz)||1;xx/=l;xy/=l;xz/=l;let yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;out[0]=xx;out[1]=yx;out[2]=zx;out[3]=0;out[4]=xy;out[5]=yy;out[6]=zy;out[7]=0;out[8]=xz;out[9]=yz;out[10]=zz;out[11]=0;out[12]=-(xx*eye[0]+xy*eye[1]+xz*eye[2]);out[13]=-(yx*eye[0]+yy*eye[1]+yz*eye[2]);out[14]=-(zx*eye[0]+zy*eye[1]+zz*eye[2]);out[15]=1;return out}
function shader(gl,type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||"Shader error");return s}
function program(gl){const p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,VERT));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||"Program error");return p}
function buildScene(workers,roomName=""){
 const positions=[],normals=[],colors=[];
 const addTri=(a,b,c,color)=>{const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;for(const p of [a,b,c]){positions.push(...p);normals.push(nx,ny,nz);colors.push(...color)}};
 const quad=(a,b,c,d,color)=>{addTri(a,b,c,color);addTri(a,c,d,color)};
 // Generate each printed face on a tiny in-memory canvas, then bake visible pixels into the shared WebGL vertex buffer.
 const faceCanvas=document.createElement("canvas");faceCanvas.width=64;faceCanvas.height=48;
 const faceContext=faceCanvas.getContext("2d",{willReadFrequently:true});
 const printFaceCanvas=(x,z,index,skin)=>{
  if(!faceContext)return;
  const ctx=faceContext;ctx.clearRect(0,0,64,48);ctx.strokeStyle="#241914";ctx.fillStyle="#241914";ctx.lineWidth=3.2;ctx.lineCap="round";ctx.lineJoin="round";
  const eye=(cx,cy)=>{ctx.beginPath();ctx.arc(cx,cy,2.8,0,Math.PI*2);ctx.fill()};
  if(index%5===1){eye(19,16);ctx.beginPath();ctx.moveTo(42,16);ctx.lineTo(48,16);ctx.stroke()}else{eye(19,16);eye(45,16)}
  if(index%5===2){ctx.beginPath();ctx.moveTo(13,10);ctx.lineTo(22,8);ctx.moveTo(41,8);ctx.lineTo(50,10);ctx.stroke()}
  if(index===1||index===5){ctx.lineWidth=2.2;ctx.strokeRect(11,11,15,11);ctx.strokeRect(38,11,15,11);ctx.beginPath();ctx.moveTo(26,16);ctx.lineTo(38,16);ctx.stroke()}
  ctx.beginPath();
  if(index%5===3){ctx.moveTo(27,35);ctx.lineTo(37,35)}
  else if(index%5===4){ctx.arc(32,33,4,0,Math.PI*2)}
  else{ctx.moveTo(21,31);ctx.quadraticCurveTo(32,42,43,31)}
  ctx.stroke();
  const pixels=ctx.getImageData(0,0,64,48).data,zFace=z+.637;
  for(let sy=0;sy<48;sy+=2)for(let sx=0;sx<64;sx+=2){
   let alpha=0,red=0,green=0,blue=0;
   for(let oy=0;oy<2;oy++)for(let ox=0;ox<2;ox++){const p=((sy+oy)*64+sx+ox)*4;alpha+=pixels[p+3];red+=pixels[p];green+=pixels[p+1];blue+=pixels[p+2]}
   const a=alpha/(4*255);if(a<.035)continue;
   const ink=[red/Math.max(1,alpha),green/Math.max(1,alpha),blue/Math.max(1,alpha)],color=skin.map((tone,i)=>tone*(1-a)+ink[i]*a);
   const x0=x+(sx/64-.5)*.31,x1=x+((sx+2)/64-.5)*.31,yTop=2.14-sy/48*.25,yBottom=2.14-(sy+2)/48*.25;
   quad([x0,yTop,zFace],[x1,yTop,zFace],[x1,yBottom,zFace],[x0,yBottom,zFace],color);
  }
 };
 const box=(x,y,z,w,h,d,color)=>{const x0=x-w/2,x1=x+w/2,y0=y-h/2,y1=y+h/2,z0=z-d/2,z1=z+d/2;quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],color);quad([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],color);quad([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],color);quad([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],color);quad([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],color);quad([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],color)};
  const taperBox=(x,y,z,wt,wb,h,d,c)=>{const a=wt/2,b=wb/2,y0=y-h/2,y1=y+h/2,z0=z-d/2,z1=z+d/2;quad([x-b,y0,z1],[x+b,y0,z1],[x+a,y1,z1],[x-a,y1,z1],c);quad([x+b,y0,z0],[x-b,y0,z0],[x-a,y1,z0],[x+a,y1,z0],c);quad([x-b,y0,z0],[x-b,y0,z1],[x-a,y1,z1],[x-a,y1,z0],c);quad([x+b,y0,z1],[x+b,y0,z0],[x+a,y1,z0],[x+a,y1,z1],c);quad([x-a,y1,z1],[x+a,y1,z1],[x+a,y1,z0],[x-a,y1,z0],c);quad([x-b,y0,z0],[x+b,y0,z0],[x+b,y0,z1],[x-b,y0,z1],c)};
 const sphere=(cx,cy,cz,rx,ry,rz,color,segments=9,rings=6)=>{for(let r=0;r<rings;r++){const p0=-Math.PI/2+Math.PI*r/rings,p1=-Math.PI/2+Math.PI*(r+1)/rings;for(let s=0;s<segments;s++){const t0=2*Math.PI*s/segments,t1=2*Math.PI*(s+1)/segments;const pt=(p,t)=>[cx+rx*Math.cos(p)*Math.cos(t),cy+ry*Math.sin(p),cz+rz*Math.cos(p)*Math.sin(t)];const a=pt(p0,t0),b=pt(p0,t1),c=pt(p1,t1),d=pt(p1,t0);quad(a,d,c,b,color)}}};
 const cyl=(x,y,z,r,h,color,seg=8)=>{for(let i=0;i<seg;i++){const a=i*2*Math.PI/seg,b=(i+1)*2*Math.PI/seg;const p1=[x+Math.cos(a)*r,y-h/2,z+Math.sin(a)*r],p2=[x+Math.cos(b)*r,y-h/2,z+Math.sin(b)*r],p3=[x+Math.cos(b)*r,y+h/2,z+Math.sin(b)*r],p4=[x+Math.cos(a)*r,y+h/2,z+Math.sin(a)*r];quad(p1,p4,p3,p2,color);addTri([x,y+h/2,z],p3,p4,color);addTri([x,y-h/2,z],p1,p2,color)}};
 const roundedCylinder=(x,y,z,r,h,color,seg=24)=>{
  const profile=[[-.50,.84],[-.43,.96],[-.32,1],[.32,1],[.43,.96],[.50,.84]],rings=profile.map(([yy,rr])=>Array.from({length:seg},(_,i)=>{const a=i*2*Math.PI/seg;return [x+Math.cos(a)*r*rr,y+yy*h,z+Math.sin(a)*r*rr]}));
  for(let j=0;j<rings.length-1;j++)for(let i=0;i<seg;i++){const n=(i+1)%seg;quad(rings[j][i],rings[j][n],rings[j+1][n],rings[j+1][i],color)}
  for(let i=0;i<seg;i++){const n=(i+1)%seg;addTri([x,y-h*.5,z],rings[0][n],rings[0][i],color);addTri([x,y+h*.5,z],rings[rings.length-1][i],rings[rings.length-1][n],color)}
 };
 const segment=(a,b,r,color,seg=8)=>{
  const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],len=Math.hypot(dx,dy,dz)||1,n=[dx/len,dy/len,dz/len];
  const ref=Math.abs(n[1])<.88?[0,1,0]:[0,0,1],cross=(u,v)=>[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  let u=cross(n,ref),ul=Math.hypot(...u)||1;u=u.map(v=>v/ul);const v=cross(n,u);
  for(let i=0;i<seg;i++){const t0=i*2*Math.PI/seg,t1=(i+1)*2*Math.PI/seg,point=(p,t)=>[p[0]+r*(u[0]*Math.cos(t)+v[0]*Math.sin(t)),p[1]+r*(u[1]*Math.cos(t)+v[1]*Math.sin(t)),p[2]+r*(u[2]*Math.cos(t)+v[2]*Math.sin(t))],a0=point(a,t0),a1=point(a,t1),b0=point(b,t0),b1=point(b,t1);quad(a0,a1,b1,b0,color);addTri(a,b0,b1,color);addTri(b,a1,a0,color)}
 };
 // Layered opaque floor shadows add contact and visual grounding without a texture or shadow-map pass.
 const shadow=(cx,cz,rx,rz)=>{
  const bands=[{r:1.00,c:[0.51,0.47,0.40]},{r:.70,c:[0.47,0.43,0.37]},{r:.38,c:[0.43,0.40,0.35]}],segments=16,y=.009;
  let outer=1;
  for(const band of bands){
   for(let i=0;i<segments;i++){
    const a=i*Math.PI*2/segments,b=(i+1)*Math.PI*2/segments;
    const oa=[cx+Math.cos(a)*rx*outer,y,cz+Math.sin(a)*rz*outer],ob=[cx+Math.cos(b)*rx*outer,y,cz+Math.sin(b)*rz*outer];
    const ia=[cx+Math.cos(a)*rx*band.r,y,cz+Math.sin(a)*rz*band.r],ib=[cx+Math.cos(b)*rx*band.r,y,cz+Math.sin(b)*rz*band.r];
    quad(oa,ia,ib,ob,band.c);
   }
   outer=band.r;
  }
  for(let i=0;i<segments;i++){
   const a=i*Math.PI*2/segments,b=(i+1)*Math.PI*2/segments;
   addTri([cx,y,cz],[cx+Math.cos(b)*rx*.38,y,cz+Math.sin(b)*rz*.38],[cx+Math.cos(a)*rx*.38,y,cz+Math.sin(a)*rz*.38],[0.41,0.38,0.34]);
  }
 };
 const wood=[0.43,0.25,0.14],woodTop=[0.64,0.42,0.25],metal=[0.22,0.28,0.34],wall=[0.76,0.81,0.85],wallDark=[0.48,0.57,0.66],floor=[0.45,0.49,0.54],screen=[0.18,0.66,0.88],chair=[0.17,0.29,0.42],plant=[0.17,0.43,0.27];
 // Room shell: open front and right for a clear game-like cutaway.
 box(0,-0.18,0,12,.36,10,floor);box(0,2,-5,12,4,.22,wall);box(-6,2,0,.22,4,10,wallDark);
 // Visible low studs give the grey baseplate a brick-built identity; all geometry stays in the shared buffer.
 for(let sx=-5;sx<=5;sx+=1.25)for(let sz=-4;sz<=4;sz+=1.25)cyl(sx,.055,sz,.065,.10,[.57,.62,.68],8);
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
 // Ceiling fixtures create a visible overhead light source and a stronger playable-room silhouette.
 box(-3.0,3.68,-1.05,2.15,.10,.48,[0.28,0.33,0.39]);
 box(1.45,3.68,-1.05,2.15,.10,.48,[0.28,0.33,0.39]);
 box(-3.0,3.61,-1.05,1.35,.035,.18,[0.96,0.84,0.58]);
 box(1.45,3.61,-1.05,1.35,.035,.18,[0.96,0.84,0.58]);
 box(-3.0,3.57,-1.05,1.05,.025,.12,[0.86,0.74,0.48]);
 box(1.45,3.57,-1.05,1.05,.025,.12,[0.86,0.74,0.48]);
 // Light bands on the ceiling/floor axis reinforce depth without introducing textures.
 box(-3.0,.012,-1.05,1.55,.018,.42,[0.76,0.64,0.43]);
 box(1.45,.012,-1.05,1.55,.018,.42,[0.76,0.64,0.43]);
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
 // Keep the lounge in smaller project rooms; the nine-person office uses the full floor for workstations.
 if(workers.length<=6){
 shadow(4.45,1.70,1.62,.92);
 box(4.45,.58,1.92,2.55,.34,.82,[0.23,0.34,0.43]);
 box(4.45,.92,2.27,2.55,.72,.20,[0.18,0.28,0.37]);
 box(3.25,.72,1.92,.22,.58,.92,[0.28,0.40,0.48]);box(5.65,.72,1.92,.22,.58,.92,[0.28,0.40,0.48]);
 for(let seat=0;seat<3;seat++)box(3.65+seat*.80,.78,1.86,.72,.10,.68,[0.34,0.47,0.55]);
 box(4.45,.38,.88,1.72,.12,.82,woodTop);for(const dx of [-.68,.68])for(const dz of [-.28,.28])box(4.45+dx,.20,.88+dz,.08,.32,.08,wood);
 box(4.45,.46,.88,.52,.035,.34,[0.78,.84,.88]);
 cyl(5.55,.32,.58,.28,.52,[0.42,.25,.16]);for(let leaf=0;leaf<5;leaf++)sphere(5.55+Math.cos(leaf*1.26)*.18,.78+(leaf%2)*.10,.58+Math.sin(leaf*1.26)*.18,.16,.32,.13,plant,7,5);
 }
 const count=Math.max(1,workers.length),cols=count>=7?3:count>3?2:count,rows=Math.ceil(count/cols),workerRanges=[];
 if(count>=7){
  // Break points are mounted on the back wall and reached via the gaps between desk columns.
  for(const stationX of [-1.82,1.82,5.48]){
   box(stationX,1.08,1.45,.34,.92,.30,[.23,.32,.39]);
   box(stationX,1.13,1.265,.25,.48,.035,[.12,.22,.29]);
   box(stationX,1.28,1.245,.15,.055,.018,[.18,.83,.74]);
   box(stationX-.085,.87,1.245,.06,.12,.018,[.78,.85,.89]);
   box(stationX+.085,.87,1.245,.06,.12,.018,[.78,.85,.89]);
   box(stationX,1.58,1.45,.18,.055,.24,[.88,.70,.38]);
  }
 }
 workers.forEach((worker,index)=>{
  const col=index%cols,row=Math.floor(index/cols),x=(col-(cols-1)/2)*(count>=7?3.65:4.1),z=rows===1?-1.55:count>=7?-3.0+row*2.75:-2.8+row*2.4;
  // Subtle layered contact shadows ground the workstation and chair on the floor.
  const workstationStart=positions.length;shadow(x,z+.18,1.78,1.12);shadow(x,z+1.55,.78,.72);if(worker.selected)sphere(x,.045,z+.84,1.12,.035,.82,[1,.76,.24],14,3);
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
  // Animated code rows live inside the monitor surface; they scroll without textures or external assets.
  const monitorStart=positions.length;
  for(let codeRow=0;codeRow<7;codeRow++){
   const codeWidth=[.18,.31,.24,.38,.16,.28,.22][codeRow],codeY=1.86-codeRow*.075;
   box(x-.39+codeWidth/2,codeY,z-.24,codeWidth,.025,.012,codeRow%3===0?[0.12,0.95,0.82]:[0.63,0.91,1]);
  }
  const monitorEnd=positions.length;
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
  // Classic minifigure proportions with molded hair and printed facial details.
  const skin=tone[worker.tone]||tone.medium,shirt=shirtByName[worker.shirt]||shirts[index%shirts.length],hairColor=hairColors[index%hairColors.length],hairStyle=worker.hair||["short","long","curly","tied"][index%4],workerStart=positions.length,legsStart=positions.length;
  // Distinct hip block, short legs and forward-facing block feet create the classic seated minifigure silhouette.
  box(x,.88,z+.82,.66,.25,.40,[.16,.20,.25]);
  taperBox(x-.19,.66,z+.83,.34,.31,.40,.34,[.17,.22,.28]);taperBox(x+.19,.66,z+.83,.34,.31,.40,.34,[.17,.22,.28]);
  box(x-.19,.43,z+1.00,.32,.14,.43,[.13,.16,.19]);box(x+.19,.43,z+1.00,.32,.14,.43,[.13,.16,.19]);
  box(x-.19,.352,z+1.00,.325,.035,.435,[.075,.09,.12]);box(x+.19,.352,z+1.00,.325,.035,.435,[.075,.09,.12]);
  const legsEnd=positions.length;
  taperBox(x,1.29,z+1,.96,.66,.70,.46,shirt);box(x,1.56,z+.642,.035,.34,.025,[.96,.94,.84]);box(x,1.625,z+.70,.34,.075,.035,[.96,.94,.84]);box(x,1.22,z+.642,.58,.035,.025,[.96,.94,.84]);
  if(index%3===1){taperBox(x,1.30,z+.635,.42,.34,.48,.025,[.13,.20,.28]);box(x,1.51,z+.615,.09,.12,.018,[.88,.73,.35])}else if(index%3===2){for(let k=0;k<2;k++)sphere(x,1.48-k*.16,z+.625,.025,.025,.018,[.94,.88,.68],6,4)}else{box(x-.25,1.44,z+.645,.12,.14,.025,[.91,.91,.86]);box(x+.25,1.44,z+.645,.12,.14,.025,[.91,.91,.86])}
  const headStart=positions.length;cyl(x,1.68,z+.99,.17,.20,skin,16);roundedCylinder(x,2.02,z+.99,.365,.61,skin,24);
  let studY=2.49;if(hairStyle==="short"){sphere(x,2.29,z+.94,.36,.14,.31,hairColor,14,7);box(x,2.25,z+.72,.54,.12,.08,hairColor)}else if(hairStyle==="curly"){studY=2.58;sphere(x,2.32,z+.94,.37,.18,.32,hairColor,14,8);for(let k=0;k<7;k++){const q=k*Math.PI*2/7;sphere(x+Math.cos(q)*.27,2.36,z+.94+Math.sin(q)*.24,.105,.11,.105,hairColor,8,5)}}else if(hairStyle==="long"){sphere(x,2.31,z+.94,.37,.15,.32,hairColor,14,7);sphere(x-.30,2.03,z+.99,.12,.38,.18,hairColor,10,7);sphere(x+.30,2.03,z+.99,.12,.38,.18,hairColor,10,7)}else{studY=2.68;sphere(x,2.31,z+.94,.37,.15,.32,hairColor,14,7);sphere(x,2.47,z+.69,.15,.17,.15,hairColor,10,7)}cyl(x,studY,z+.99,.135,.12,skin,16);
  if(index===3||index===7){box(x,2.40,z+.98,.70,.09,.68,[.78,.18,.13]);box(x,2.42,z+1.01,.72,.035,.69,[.95,.72,.25])}
  if(index===2){sphere(x-.24,2.18,z+.98,.075,.075,.075,[.94,.72,.22],9,6);sphere(x+.24,2.18,z+.98,.075,.075,.075,[.94,.72,.22],9,6)}
  if(index===4){segment([x-.36,2.02,z+.99],[x-.40,2.28,z+.98],.035,[.22,.25,.29],8);sphere(x-.40,2.28,z+.98,.075,.075,.075,[.22,.25,.29],9,6)}
  if(index===6){sphere(x+.32,2.12,z+.98,.085,.12,.08,[.82,.28,.43],9,6);sphere(x+.32,2.12,z+1.06,.045,.055,.025,[.98,.76,.78],8,5)}
  // Canvas-generated facial print is baked onto the head as a lightweight color decal.
  printFaceCanvas(x,z,index,skin);
  const headEnd=positions.length,armsStart=positions.length;
  for(const side of [-1,1]){
   const shoulder=[x+side*.48,1.49,z+.99],elbow=[x+side*.58,1.30,z+.82],wrist=[x+side*.53,1.16,z+.66];
   sphere(shoulder[0],shoulder[1],shoulder[2],.16,.16,.16,shirt,12,7);
   segment(shoulder,elbow,.115,shirt,10);sphere(elbow[0],elbow[1],elbow[2],.105,.105,.105,shirt,10,6);
   segment(elbow,wrist,.105,shirt,10);
  }
  const handsStart=positions.length;
  for(const side of [-1,1]){
   const hx=x+side*.53,hy=1.12,hz=z+.62,arc=[];
   for(let k=0;k<=6;k++){const angle=(55+k*(250/6))*Math.PI/180;arc.push([hx+side*Math.cos(angle)*.095,hy+Math.sin(angle)*.095,hz+.045])}
   for(let k=0;k<arc.length-1;k++)segment(arc[k],arc[k+1],.038,skin,8);
   sphere(hx-side*.055,hy,hz+.045,.065,.075,.055,skin,10,6);
  }
  const handsEnd=positions.length,armsEnd=positions.length;
    // Small printed state markers remain separate from real GitHub activity labels.
  if(worker.state==="st-w"){box(x-.22,1.16,z+.47,.2,.18,.2,skin);box(x+.22,1.16,z+.47,.2,.18,.2,skin)}
  else if(worker.state==="st-a"){sphere(x+.44,2.55,z+.95,.13,.13,.13,[.98,.78,.25],7,5)}
  else if(worker.state==="st-t"){sphere(x,2.62,z+.96,.11,.11,.11,[.24,.78,.88],7,5)}
  else if(worker.state==="st-s"){sphere(x-.34,2.62,z+.96,.08,.08,.08,[.98,.78,.22],7,5);sphere(x+.34,2.62,z+.96,.08,.08,.08,[.98,.78,.22],7,5)}
  else if(worker.state==="st-f"){box(x-.38,2.55,z+.96,.1,.3,.1,[.86,.16,.22]);sphere(x-.38,2.32,z+.96,.07,.07,.07,[.86,.16,.22],7,5)}
  const bodyEnd=positions.length;
  // Mirror each complete workstation toward the open viewing side. Reverse triangle winding and normals to preserve WebGL culling and lighting.
  for(let i=workstationStart;i<positions.length;i+=9){for(let v=0;v<9;v+=3){positions[i+v+2]=-positions[i+v+2];normals[i+v+2]=-normals[i+v+2]}for(const array of [positions,normals,colors])for(let k=0;k<3;k++){const a=i+3+k,b=i+6+k,temp=array[a];array[a]=array[b];array[b]=temp}}
  const stationX=col===0?-1.82:col===1?1.82:5.48,leftLaneX=col===0?-5.48:col===1?-1.82:1.82,rightLaneX=col===0?-1.82:col===1?1.82:5.48,laneX=row%2===0?leftLaneX:rightLaneX;
  workerRanges.push({start:workerStart,end:positions.length,legsStart,legsEnd,bodyStart:legsEnd,bodyEnd,headStart,headEnd,armsStart,armsEnd,handsStart,handsEnd,monitorStart,monitorEnd,state:worker.state,index,employeeId:worker.id||"",name:worker.name||worker.role||"Agente",role:worker.role||"Puesto",roomId:worker.roomId||"",x,z:-z,laneX,stationX,restZ:2.0+row*.72});
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
 return {data,basePositions,baseNormals:new Float32Array(normals),workerRanges,count:positions.length/3,positionLength:positions.length,normalLength:normals.length};
}
function buildOfficeScene(rooms){
 const allWorkers=rooms.flatMap(room=>(room.workers||[]).map(worker=>({...worker,roomId:worker.roomId||room.id,projectName:room.name||"Proyecto"})));
 const scene=buildScene(allWorkers,"Oficina central");
 const positions=Array.from(scene.basePositions),normals=Array.from(scene.data.subarray(scene.positionLength,scene.positionLength+scene.normalLength)),colors=Array.from(scene.data.subarray(scene.positionLength+scene.normalLength));
 const workerRanges=scene.workerRanges;
 // Low partitions and project accent rails shape one connected open-plan office.
 const addTri=(a,b,c,color)=>{const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;for(const p of [a,b,c]){positions.push(...p);normals.push(nx,ny,nz);colors.push(...color)}};
 const quad=(a,b,c,d,color)=>{addTri(a,b,c,color);addTri(a,c,d,color)};
 const box=(x,y,z,w,h,d,color)=>{const x0=x-w/2,x1=x+w/2,y0=y-h/2,y1=y+h/2,z0=z-d/2,z1=z+d/2;quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],color);quad([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],color);quad([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],color);quad([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],color);quad([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],color);quad([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],color)};
 for(const z of [-1.62,1.13]){box(-1.82,.66,z,3.55,1.28,.12,[.64,.71,.75]);box(1.82,.66,z,3.55,1.28,.12,[.64,.71,.75]);}
 const accents=[[.20,.55,.72],[.76,.47,.20],[.24,.55,.39],[.48,.36,.68]];
 rooms.forEach((room,index)=>{const x=-4.9+(index%4)*3.25;box(x,3.34,-4.70,2.55,.12,.18,accents[index%accents.length]);});
 const data=new Float32Array(positions.length+normals.length+colors.length);
 data.set(positions,0);data.set(normals,positions.length);data.set(colors,positions.length+normals.length);
 return {data,basePositions:new Float32Array(positions),baseNormals:new Float32Array(normals),workerRanges,count:positions.length/3,positionLength:positions.length,normalLength:normals.length};
}
function open({container,roomName,workers=[],rooms=null,onSelectRoom=null,onSelectWorker=null}){
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
  const roomNav=rooms&&rooms.length?document.createElement("div"):null;if(roomNav){roomNav.className="office-3d-room-nav office-project-chip-strip";rooms.forEach(room=>{const button=document.createElement("button");button.type="button";button.className="office-project-chip";button.textContent=room.name;button.setAttribute("aria-label","Abrir proyecto "+room.name);button.addEventListener("click",()=>{if(typeof onSelectRoom==="function")onSelectRoom(room.id)});roomNav.appendChild(button)})}
  const controls=document.createElement("div");controls.className="office-3d-controls";const fpsMeter=document.createElement("span");fpsMeter.className="office-3d-fps";fpsMeter.textContent="FPS: —";fpsMeter.setAttribute("aria-label","Fotogramas por segundo medidos");fpsMeter.setAttribute("aria-live","off");
  const hint=document.createElement("span");hint.className="office-3d-hint";hint.textContent="Arrastra para moverte · Pellizca para acercar · Usa ↶ ↷ para girar";
  const group=document.createElement("div");group.style.display="flex";group.style.gap="5px";
  const makeButton=(label,aria,fn)=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.setAttribute("aria-label",aria);b.addEventListener("click",fn);group.appendChild(b);return b};
  const overviewMode=Boolean(rooms&&rooms.length),baseRadius=overviewMode?12.2:13,minRadius=5.5;let initialRadius=baseRadius,maxRadius=overviewMode?baseRadius*1.65:23,theta=.72,phi=1.08,radius=baseRadius,target=[0,1.65,0],cameraFitDone=false;
  const workerTags=overviewMode?document.createElement("div"):null;if(workerTags){workerTags.className="office-worker-tags";workerTags.setAttribute("aria-label","Empleados de la oficina");scene.workerRanges.forEach(worker=>{const tag=document.createElement("button");tag.type="button";tag.className="office-worker-tag";tag.setAttribute("aria-label","Seleccionar a "+worker.name+", "+worker.role);tag.title=worker.name+" · "+worker.role;const dot=document.createElement("span");dot.className="office-worker-tag-state";const name=document.createElement("span");name.className="office-worker-tag-name";name.textContent=worker.name;tag.append(dot,name);tag.addEventListener("click",()=>{if(typeof onSelectWorker==="function")onSelectWorker(worker);else if(typeof onSelectRoom==="function"&&worker.roomId)onSelectRoom(worker.roomId,worker.employeeId)});workerTags.appendChild(tag);worker.tag=tag;worker.tagDot=dot})}
  if(workerTags)mountWorkerStateBubbles(container,workerTags);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  makeButton("−","Alejar cámara",()=>{radius=clamp(radius+1,minRadius,maxRadius)});
  makeButton("+","Acercar cámara",()=>{radius=clamp(radius-1,minRadius,maxRadius)});
  makeButton("↶","Girar a la izquierda",()=>{theta=clamp(theta-.14,-.35,1.78)});makeButton("↷","Girar a la derecha",()=>{theta=clamp(theta+.14,-.35,1.78)});makeButton("⌂","Centrar oficina",()=>{theta=.72;phi=1.08;radius=initialRadius;target=[0,1.65,0]});
  controls.append(hint,group);container.append(canvas,fpsMeter);if(roomNav)container.appendChild(roomNav);if(workerTags)container.appendChild(workerTags);container.appendChild(controls);container.classList.add("is-active");
  const projection=mat4(),view=mat4();let raf=0,disposed=false,lastFrame=0,cameraAspect=0,fpsWindowStart=0,fpsFrames=0;const reducedMotion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,motionScale=reducedMotion?0.72:1;
  container._office3dUpdateStates=states=>{scene.workerRanges.forEach((worker,index)=>{if(states[index])worker.state=states[index]})};container._office3dFocusWorker=id=>{const worker=scene.workerRanges.find(item=>item.employeeId===id);if(worker){target=[worker.x,1.12,worker.z-1.05];radius=clamp(5.6,minRadius,maxRadius)}};
  function resize(){const rect=container.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.15),w=Math.max(1,Math.floor(rect.width*dpr)),h=Math.max(1,Math.floor(rect.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}if(w&&h){const aspect=w/h;if(!cameraFitDone||Math.abs(aspect-cameraAspect)>.025){const wasAtFit=!cameraFitDone||Math.abs(radius-initialRadius)<.05;initialRadius=overviewMode?12/(2*Math.tan(.86/2)*aspect*.88):baseRadius*Math.max(1,1.22/aspect);maxRadius=overviewMode?initialRadius*1.55:Math.max(23,initialRadius*1.65);if(wasAtFit||overviewMode)radius=initialRadius;cameraAspect=aspect;cameraFitDone=true}}}
  function mountWorkerStateBubbles(container,workerTags){workerTags.querySelectorAll(".office-worker-tag").forEach(tag=>{let bubble=tag.querySelector(".office-worker-typing-bubble");if(!bubble){bubble=document.createElement("span");bubble.className="office-worker-typing-bubble";bubble.textContent="...";tag.appendChild(bubble)}bubble.hidden=true})}
function render(timestamp=0){if(disposed)return;if(timestamp-lastFrame<32){raf=requestAnimationFrame(render);return}lastFrame=timestamp;resize();const seconds=timestamp*.001*motionScale;scene.workerRanges.forEach(worker=>{let bob=0,arms=0,head=0,hands=0,body=0,foot=0,headShift=0,armShift=0,walkX=0,walkZ=0,walkLift=0,monitorShift=0,route=null;if(worker.state==="st-w"){bob=Math.sin(seconds*7+worker.index)*.045;arms=Math.sin(seconds*12+worker.index)*.11;head=Math.sin(seconds*3+worker.index)*.02;hands=Math.abs(Math.sin(seconds*16+worker.index))*.08;body=Math.sin(seconds*6+worker.index)*.022;headShift=Math.sin(seconds*3+worker.index)*.02;armShift=Math.sin(seconds*12+worker.index)*.06}else if(worker.state==="st-t"){bob=Math.sin(seconds*2+worker.index)*.014;arms=.035;head=Math.sin(seconds*2.5+worker.index)*.025;hands=.006;body=Math.sin(seconds*2+worker.index)*.008;headShift=Math.sin(seconds*2.5+worker.index)*.018}else if(worker.state==="st-r"){bob=Math.sin(seconds*1.8+worker.index)*.008;arms=.018+Math.sin(seconds*1.6+worker.index)*.012;head=Math.sin(seconds*1.2+worker.index)*.008;hands=.01;body=Math.sin(seconds*1.4+worker.index)*.006}else if(worker.state==="st-a"){bob=Math.sin(seconds*2.2+worker.index)*.012;arms=.12+Math.abs(Math.sin(seconds*3+worker.index))*.06;head=Math.sin(seconds*2+worker.index)*.018;hands=.025;body=Math.sin(seconds*2+worker.index)*.006}else if(worker.state==="st-s"){bob=Math.abs(Math.sin(seconds*5+worker.index))*.055;arms=Math.sin(seconds*9+worker.index)*.1;head=Math.sin(seconds*4+worker.index)*.018;hands=Math.abs(Math.sin(seconds*12+worker.index))*.035;body=Math.sin(seconds*5+worker.index)*.018;headShift=Math.sin(seconds*4+worker.index)*.022}else if(worker.state==="st-f"){bob=Math.sin(seconds*1.6+worker.index)*.008;arms=Math.sin(seconds*1.2+worker.index)*.012;head=Math.sin(seconds*1.5+worker.index)*.018;body=-Math.abs(Math.sin(seconds*1.6+worker.index))*.012;headShift=-.018}else{bob=Math.sin(seconds*1.2+worker.index)*.018;arms=Math.sin(seconds*1.1+worker.index)*.012;head=Math.sin(seconds*.9+worker.index)*.012;body=Math.sin(seconds*1.2+worker.index)*.008}if(worker.state==="st-w"){monitorShift=((seconds*.34+worker.index*.13)%1)*.34}worker.renderX=worker.x+walkX;worker.renderZ=worker.z+walkZ;for(let i=worker.start;i<worker.end;i+=3){const axis=i%3;scene.data[i]=scene.basePositions[i]+(axis===0?walkX:axis===2?walkZ:bob)}for(let i=worker.legsStart;i<worker.legsEnd;i+=3){const axis=i%3,baseY=scene.basePositions[i-axis+1],baseX=scene.basePositions[i-axis];if(axis===1){const liftFactor=Math.max(0,Math.min(1,(baseY-.35)/.53));scene.data[i]=baseY+bob+foot+walkLift*liftFactor;}if(axis===2&&worker.state==="st-r"&&baseY<.72){const stridePhase=seconds*7.6+worker.index+(baseX<worker.x?0:Math.PI);scene.data[i]=scene.basePositions[i]+Math.sin(stridePhase)*.085}}for(let i=worker.bodyStart+1;i<worker.bodyEnd;i+=3)scene.data[i]=scene.basePositions[i]+bob+body+walkLift;for(let i=worker.armsStart;i<worker.armsEnd;i+=3){const axis=i%3,armScale=worker.state==="st-r"?.72:1;scene.data[i]=scene.basePositions[i]+(axis===0?walkX+(scene.basePositions[i]-worker.x)*armScale+armShift:axis===2?walkZ:0)}for(let i=worker.armsStart+1;i<worker.armsEnd;i+=3)scene.data[i]=scene.basePositions[i]+bob+arms+walkLift;for(let i=worker.headStart;i<worker.headEnd;i+=3){const axis=i%3;scene.data[i]=scene.basePositions[i]+(axis===0?walkX+headShift:axis===2?walkZ:0)}for(let i=worker.headStart+1;i<worker.headEnd;i+=3)scene.data[i]=scene.basePositions[i]+bob+head+walkLift;for(let i=worker.handsStart;i<worker.handsEnd;i+=3){const axis=i%3,handScale=worker.state==="st-r"?.72:1;scene.data[i]=scene.basePositions[i]+(axis===0?walkX+(scene.basePositions[i]-worker.x)*handScale+armShift*.8:axis===2?walkZ:0)}for(let i=worker.handsStart+1;i<worker.handsEnd;i+=3)scene.data[i]=scene.basePositions[i]+bob+arms+hands+walkLift;for(let i=worker.monitorStart;i<worker.monitorEnd;i+=3){const axis=i%3;scene.data[i]=scene.basePositions[i]+(axis===0?(((scene.basePositions[i]-worker.x+monitorShift+.39)%0.78)+worker.x-.39):0)}for(let i=worker.monitorStart+1;i<worker.monitorEnd;i+=3)scene.data[i]=scene.basePositions[i];gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,scene.data.subarray(0,scene.positionLength));const eye=[target[0]+radius*Math.sin(phi)*Math.sin(theta),target[1]+radius*Math.cos(phi),target[2]+radius*Math.sin(phi)*Math.cos(theta)];perspective(projection,overviewMode?.86:.72,canvas.width/canvas.height,.1,100);lookAt(view,eye,target,[0,1,0]);if(workerTags){const rect=container.getBoundingClientRect(),placed=[];scene.workerRanges.forEach(worker=>{const x=worker.renderX??worker.x,y=2.82,z=(worker.renderZ??worker.z)-.99,vx=view[0]*x+view[4]*y+view[8]*z+view[12],vy=view[1]*x+view[5]*y+view[9]*z+view[13],vz=view[2]*x+view[6]*y+view[10]*z+view[14],clipX=projection[0]*vx+projection[4]*vy+projection[8]*vz+projection[12],clipY=projection[1]*vx+projection[5]*vy+projection[9]*vz+projection[13],clipW=projection[3]*vx+projection[7]*vy+projection[11]*vz+projection[15];const visible=clipW>0&&Math.abs(clipX/clipW)<.96&&Math.abs(clipY/clipW)<.96;worker.tag.hidden=!visible;if(visible){const tw=worker.tag.offsetWidth||96,px=clamp((clipX/clipW+1)*.5*rect.width,tw/2+5,rect.width-tw/2-5);let py=clamp((1-clipY/clipW)*.5*rect.height,32,rect.height-120);const th=worker.tag.offsetHeight||18;let lift=0;while(placed.some(p=>Math.abs(p.x-px)<(p.w+tw)/2+3&&Math.abs(p.y-py)<(p.h+th)/2+3)&&lift<12){py-=3;lift+=3;}placed.push({x:px,y:py,w:tw,h:th});worker.tag.style.left=px+"px";worker.tag.style.top=py+"px"}worker.tag.classList.toggle("is-working",worker.state==="st-w");worker.tag.classList.toggle("is-success",worker.state==="st-s");worker.tag.classList.toggle("is-failure",worker.state==="st-f");worker.tag.classList.toggle("is-resting",worker.state==="st-t"||worker.state==="st-r");worker.tag.classList.toggle("is-your-turn",worker.state==="st-a");const bubble=worker.tag.querySelector(".office-worker-typing-bubble");if(bubble)bubble.hidden=worker.state!=="st-w"})}gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(up,false,projection);gl.uniformMatrix4fv(uv,false,view);gl.drawArrays(gl.TRIANGLES,0,scene.count);fpsFrames++;if(!fpsWindowStart)fpsWindowStart=timestamp;if(timestamp-fpsWindowStart>=1000){const measured=Math.round(fpsFrames*1000/Math.max(1,timestamp-fpsWindowStart));fpsMeter.textContent=measured+" FPS";fpsMeter.dataset.level=measured>=30?"good":measured>=24?"warn":"low";fpsFrames=0;fpsWindowStart=timestamp}raf=requestAnimationFrame(render)}
  const pointers=new Map();let lastPinch=0;
  canvas.addEventListener("pointerdown",e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const a=Array.from(pointers.values());lastPinch=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}});
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
import{_ as bt,c as Be,o as wt,a as Dt,r as _t,b as _,d as A,e as a,F as ne,f as ae,g as Le,w as ze,n as j,h as $,i as Z,t as J,j as Oe,k as Fe,l as At}from"./index-53cb5819.js";const M=/Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent);class Ct{constructor(e,s={}){this.canvas=e,this.ctx=e.getContext("2d"),this.options={direction:s.direction||"right",speed:s.speed||1,borderColor:s.borderColor||"rgba(255, 255, 255, 0.05)",squareSize:s.squareSize||40,hoverFillColor:s.hoverFillColor||"rgba(255, 255, 255, 0.6)",hoverShadowColor:s.hoverShadowColor||"rgba(255, 255, 255, 0.3)",transitionDuration:s.transitionDuration||200,trailDuration:s.trailDuration||1e3,specialBlockColor:s.specialBlockColor||"rgba(255, 100, 100, 0.8)",specialHoverColor:s.specialHoverColor||"rgba(100, 255, 100, 0.8)",snakeHeadColor:s.snakeHeadColor||"rgba(255, 255, 255, 0.9)",snakeTailColor:s.snakeTailColor||"rgba(100, 100, 255, 0.3)",snakeColorDecay:s.snakeColorDecay||.7,touchSensitivity:s.touchSensitivity||1,vibrationEnabled:s.vibrationEnabled||!1,...s},this.gridOffset={x:0,y:0},this.hoveredSquare=null,this.animationFrame=null,this.currentOpacity=0,this.targetOpacity=0,this.lastTimestamp=0,this.trailSquares=new Map,this.specialBlock=null,this.isSpecialBlockHovered=!1,this.snakeBody=[],this.shouldGrow=!1,this._boundHandlers={}}init(){this.resizeCanvas(),this.setupEventListeners(),M&&this.optimizeForMobile(),this.animate(),M?setTimeout(()=>this.createSpecialBlock(),500):this.createSpecialBlock(),this._boundHandlers.visibility=()=>this.handleVisibilityChange(),document.addEventListener("visibilitychange",this._boundHandlers.visibility)}optimizeForMobile(){const e=this.canvas.getContext("2d"),s=performance.now();for(let u=0;u<1e3;u++)e.fillRect(0,0,1,1);const m=performance.now()-s;m>10?(this.options.squareSize=Math.max(this.options.squareSize*1.5,60),this.options.speed*=.7,this.options.trailDuration*=.5):m>5&&(this.options.squareSize=Math.max(this.options.squareSize*1.2,50),this.options.speed*=.8)}resizeCanvas(){const e=window.devicePixelRatio||1,s=this.canvas.offsetWidth,m=this.canvas.offsetHeight;this.canvas.width=Math.floor(s*e),this.canvas.height=Math.floor(m*e),this.canvas.style.width=`${s}px`,this.canvas.style.height=`${m}px`,this.ctx.scale(e,e)}setupEventListeners(){this._boundHandlers.resize=()=>this.resizeCanvas(),this._boundHandlers.mousemove=e=>this.handleMouseMove(e),this._boundHandlers.mouseleave=()=>this.handleMouseLeave(),window.addEventListener("resize",this._boundHandlers.resize),this.canvas.addEventListener("mousemove",this._boundHandlers.mousemove),this.canvas.addEventListener("mouseleave",this._boundHandlers.mouseleave),M&&this.setupTouchEvents()}setupTouchEvents(){let e=null,s=!1,m=0,u=0;this._boundHandlers.touchstart=c=>{c.preventDefault();const p=Date.now();if(!(p-m<16)&&(m=p,c.touches.length===1)){const T=c.touches[0],E=this.canvas.getBoundingClientRect();e={x:T.clientX-E.left,y:T.clientY-E.top,time:p},s=!0,u++,this.handleTouchMove(e.x,e.y),this.hoveredSquare||(this.targetOpacity=.8*this.options.touchSensitivity),this.options.vibrationEnabled&&navigator.vibrate&&navigator.vibrate(10)}},this._boundHandlers.touchmove=c=>{if(c.preventDefault(),s&&c.touches.length===1){const p=c.touches[0],T=this.canvas.getBoundingClientRect();this.handleTouchMove(p.clientX-T.left,p.clientY-T.top)}},this._boundHandlers.touchend=c=>{c.preventDefault();const p=Date.now();if(e&&p-e.time<300){if(u++,u===2){this.resetSnake(),u=0,this.options.vibrationEnabled&&navigator.vibrate&&navigator.vibrate([50,50,50]);return}}else u=0;s=!1,e=null,this.handleTouchEnd()},this._boundHandlers.touchcancel=c=>{c.preventDefault(),s=!1,e=null},this.canvas.addEventListener("touchstart",this._boundHandlers.touchstart,{passive:!1}),this.canvas.addEventListener("touchmove",this._boundHandlers.touchmove,{passive:!1}),this.canvas.addEventListener("touchend",this._boundHandlers.touchend,{passive:!1}),this.canvas.addEventListener("touchcancel",this._boundHandlers.touchcancel,{passive:!1})}handleTouchMove(e,s){var T,E;const m=Math.floor(this.gridOffset.x/this.options.squareSize)*this.options.squareSize,u=Math.floor(this.gridOffset.y/this.options.squareSize)*this.options.squareSize,c=Math.floor((e+this.gridOffset.x-m)/this.options.squareSize),p=Math.floor((s+this.gridOffset.y-u)/this.options.squareSize);(((T=this.hoveredSquare)==null?void 0:T.x)!==c||((E=this.hoveredSquare)==null?void 0:E.y)!==p)&&(this.hoveredSquare&&(this.snakeBody.unshift({x:this.hoveredSquare.x,y:this.hoveredSquare.y}),!this.shouldGrow&&this.snakeBody.length>0&&this.snakeBody.pop(),this.shouldGrow=!1),this.hoveredSquare={x:c,y:p},this.targetOpacity=.8*this.options.touchSensitivity,this.specialBlock&&c===this.specialBlock.x&&p===this.specialBlock.y&&(this.shouldGrow=!0,this.createSpecialBlock(),this.options.vibrationEnabled&&navigator.vibrate&&navigator.vibrate(100)))}handleTouchEnd(){this.hoveredSquare&&(this.snakeBody.unshift({x:this.hoveredSquare.x,y:this.hoveredSquare.y}),!this.shouldGrow&&this.snakeBody.length>0&&this.snakeBody.pop(),this.shouldGrow=!1,this.targetOpacity=.4)}resetSnake(){this.snakeBody=[],this.hoveredSquare=null,this.targetOpacity=0,this.trailSquares.clear(),this.createSpecialBlock()}handleMouseMove(e){var R,b;const s=this.canvas.getBoundingClientRect(),m=e.clientX-s.left,u=e.clientY-s.top,c=Math.floor(this.gridOffset.x/this.options.squareSize)*this.options.squareSize,p=Math.floor(this.gridOffset.y/this.options.squareSize)*this.options.squareSize,T=Math.floor((m+this.gridOffset.x-c)/this.options.squareSize),E=Math.floor((u+this.gridOffset.y-p)/this.options.squareSize);(((R=this.hoveredSquare)==null?void 0:R.x)!==T||((b=this.hoveredSquare)==null?void 0:b.y)!==E)&&(this.hoveredSquare&&(this.snakeBody.unshift({x:this.hoveredSquare.x,y:this.hoveredSquare.y}),!this.shouldGrow&&this.snakeBody.length>0&&this.snakeBody.pop(),this.shouldGrow=!1),this.hoveredSquare={x:T,y:E},this.targetOpacity=.6,this.specialBlock&&T===this.specialBlock.x&&E===this.specialBlock.y&&(this.shouldGrow=!0,this.createSpecialBlock()))}handleMouseLeave(){if(this.hoveredSquare){const e=Math.floor(this.gridOffset.x/this.options.squareSize)*this.options.squareSize,s=Math.floor(this.gridOffset.y/this.options.squareSize)*this.options.squareSize,m=`${this.hoveredSquare.x},${this.hoveredSquare.y}`;this.trailSquares.set(m,{x:this.hoveredSquare.x*this.options.squareSize+e,y:this.hoveredSquare.y*this.options.squareSize+s,opacity:.6})}this.hoveredSquare=null,this.targetOpacity=0}createSpecialBlock(){const e=window.devicePixelRatio||1,s=Math.ceil(this.canvas.width/e/this.options.squareSize),m=Math.ceil(this.canvas.height/e/this.options.squareSize);let u,c;do u=1+Math.floor(Math.random()*(s-2)),c=1+Math.floor(Math.random()*(m-2));while(this.snakeBody.some(p=>p.x===u&&p.y===c));this.specialBlock={x:u,y:c,color:this.options.specialBlockColor}}drawGrid(){const e=window.devicePixelRatio||1;this.ctx.setTransform(1,0,0,1,0,0),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.setTransform(e,0,0,e,0,0);const s=Math.floor(this.gridOffset.x/this.options.squareSize)*this.options.squareSize,m=Math.floor(this.gridOffset.y/this.options.squareSize)*this.options.squareSize;this.ctx.lineWidth=M?1:.5,this.snakeBody.forEach((c,p)=>{const T=Math.round(c.x*this.options.squareSize+s-this.gridOffset.x%this.options.squareSize),E=Math.round(c.y*this.options.squareSize+m-this.gridOffset.y%this.options.squareSize);if(this.ctx.shadowColor=this.options.hoverShadowColor,this.ctx.shadowBlur=15,this.ctx.shadowOffsetX=0,this.ctx.shadowOffsetY=0,p===0)this.ctx.fillStyle=this.options.snakeHeadColor;else{const R=Math.pow(this.options.snakeColorDecay,p),b=this.options.snakeHeadColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([.\d]+))?\)/),C=this.options.snakeTailColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([.\d]+))?\)/);if(b&&C){const N=parseInt(b[1]),H=parseInt(b[2]),F=parseInt(b[3]),L=b[4]?parseFloat(b[4]):1,Y=parseInt(C[1]),l=parseInt(C[2]),U=parseInt(C[3]),x=C[4]?parseFloat(C[4]):1,z=Math.round(N+(Y-N)*(1-R)),q=Math.round(H+(l-H)*(1-R)),w=Math.round(F+(U-F)*(1-R)),v=L+(x-L)*(1-R);this.ctx.fillStyle=`rgba(${z}, ${q}, ${w}, ${v})`}else{const N=Math.max(.2,R);this.ctx.fillStyle=`rgba(255, 255, 255, ${N})`}}this.ctx.fillRect(T,E,this.options.squareSize,this.options.squareSize),this.ctx.shadowColor="transparent",this.ctx.shadowBlur=0});for(let c=s;c<this.canvas.width+this.options.squareSize;c+=this.options.squareSize)for(let p=m;p<this.canvas.height+this.options.squareSize;p+=this.options.squareSize){const T=Math.round(c-this.gridOffset.x%this.options.squareSize),E=Math.round(p-this.gridOffset.y%this.options.squareSize),R=Math.floor((c-s)/this.options.squareSize),b=Math.floor((p-m)/this.options.squareSize);if(this.specialBlock&&R===this.specialBlock.x&&b===this.specialBlock.y&&(this.ctx.shadowColor="rgba(255, 255, 255, 0.5)",this.ctx.shadowBlur=20,this.ctx.fillStyle=this.specialBlock.color,this.ctx.fillRect(T,E,this.options.squareSize,this.options.squareSize),this.ctx.shadowColor="transparent",this.ctx.shadowBlur=0),this.hoveredSquare&&R===this.hoveredSquare.x&&b===this.hoveredSquare.y){this.ctx.shadowColor=this.options.hoverShadowColor,this.ctx.shadowBlur=15,this.ctx.shadowOffsetX=0,this.ctx.shadowOffsetY=0;const C=this.options.hoverFillColor.replace("0.6",this.currentOpacity.toString());this.ctx.fillStyle=C,this.ctx.fillRect(T,E,this.options.squareSize,this.options.squareSize),this.ctx.shadowColor="transparent",this.ctx.shadowBlur=0}this.ctx.strokeStyle=this.options.borderColor,this.ctx.strokeRect(T,E,this.options.squareSize,this.options.squareSize)}const u=this.ctx.createRadialGradient(this.canvas.width/e/2,this.canvas.height/e/2,0,this.canvas.width/e/2,this.canvas.height/e/2,Math.sqrt(Math.pow(this.canvas.width/e,2)+Math.pow(this.canvas.height/e,2))/2);u.addColorStop(0,"rgba(6, 6, 6, 0)"),u.addColorStop(1,"#060606"),this.ctx.fillStyle=u,this.ctx.fillRect(0,0,this.canvas.width/e,this.canvas.height/e)}updateAnimation(e){this.lastTimestamp||(this.lastTimestamp=e);const s=e-this.lastTimestamp;if(this.lastTimestamp=e,this.currentOpacity!==this.targetOpacity){const u=Math.min(s/this.options.transitionDuration,1);this.currentOpacity+=(this.targetOpacity-this.currentOpacity)*u}for(const[u,c]of this.trailSquares)c.opacity-=s/this.options.trailDuration,c.opacity<=0&&this.trailSquares.delete(u);const m=Math.max(M?this.options.speed*.8:this.options.speed,0);switch(this.options.direction){case"right":this.gridOffset.x=(this.gridOffset.x-m+this.options.squareSize)%this.options.squareSize;break;case"left":this.gridOffset.x=(this.gridOffset.x+m+this.options.squareSize)%this.options.squareSize;break;case"up":this.gridOffset.y=(this.gridOffset.y+m+this.options.squareSize)%this.options.squareSize;break;case"down":this.gridOffset.y=(this.gridOffset.y-m+this.options.squareSize)%this.options.squareSize;break;case"diagonal":this.gridOffset.x=(this.gridOffset.x-m+this.options.squareSize)%this.options.squareSize,this.gridOffset.y=(this.gridOffset.y-m+this.options.squareSize)%this.options.squareSize;break}if(this.specialBlock){const u=window.devicePixelRatio||1,c=Math.floor(this.gridOffset.x/this.options.squareSize)*this.options.squareSize,p=Math.floor(this.gridOffset.y/this.options.squareSize)*this.options.squareSize,T=Math.round(this.specialBlock.x*this.options.squareSize+c-this.gridOffset.x%this.options.squareSize),E=Math.round(this.specialBlock.y*this.options.squareSize+p-this.gridOffset.y%this.options.squareSize);(T<-this.options.squareSize||T>this.canvas.width/u||E<-this.options.squareSize||E>this.canvas.height/u)&&this.createSpecialBlock()}this.drawGrid(),this.animationFrame=requestAnimationFrame(u=>this.updateAnimation(u))}animate(){this.animationFrame=requestAnimationFrame(e=>this.updateAnimation(e))}handleVisibilityChange(){document.hidden?this.animationFrame&&(cancelAnimationFrame(this.animationFrame),this.animationFrame=null):this.animationFrame||(this.lastTimestamp=0,this.animate())}destroy(){this.animationFrame&&(cancelAnimationFrame(this.animationFrame),this.animationFrame=null),window.removeEventListener("resize",this._boundHandlers.resize),this.canvas.removeEventListener("mousemove",this._boundHandlers.mousemove),this.canvas.removeEventListener("mouseleave",this._boundHandlers.mouseleave),M&&this._boundHandlers.touchstart&&(this.canvas.removeEventListener("touchstart",this._boundHandlers.touchstart),this.canvas.removeEventListener("touchmove",this._boundHandlers.touchmove),this.canvas.removeEventListener("touchend",this._boundHandlers.touchend),this.canvas.removeEventListener("touchcancel",this._boundHandlers.touchcancel)),document.removeEventListener("visibilitychange",this._boundHandlers.visibility)}}function Bt(){let d=null;function e(m){d=new Ct(m,{direction:"diagonal",speed:M?.03:.05,borderColor:M?"rgba(255, 255, 255, 0.2)":"rgba(255, 255, 255, 0.1)",squareSize:M?50:40,hoverFillColor:"rgba(255, 255, 255, 0.8)",hoverShadowColor:"rgba(255, 255, 255, 0.8)",transitionDuration:M?150:200,trailDuration:M?2e3:1500,specialBlockColor:"rgba(100, 255, 152, 0.8)",specialHoverColor:"rgba(29, 202, 29, 0.8)",snakeHeadColor:"rgba(255, 255, 255, 0.95)",snakeTailColor:"rgba(218, 231, 255, 0.25)",snakeColorDecay:.85,touchSensitivity:M?1.2:1,vibrationEnabled:M}),d.init()}function s(){d&&(d.destroy(),d=null)}return{init:e,destroy:s}}function Lt(){let d=null,e=null,s=null,m=null,u=!1,c,p,T,E,R,b,C,N,H,F,L,Y,l,U,x,z,q,w,v,ee,te,G,ie,K=[],Q,le,oe,P=[],xe=[],ge=Date.now(),re=0;const g={SIM_RESOLUTION:128,DYE_RESOLUTION:1024,CAPTURE_RESOLUTION:512,DENSITY_DISSIPATION:1,VELOCITY_DISSIPATION:.2,PRESSURE:.8,PRESSURE_ITERATIONS:20,CURL:30,SPLAT_RADIUS:.25,SPLAT_FORCE:6e3,SHADING:!0,COLORFUL:!0,COLOR_UPDATE_SPEED:10,PAUSED:!1,BACK_COLOR:{r:15,g:16,b:17},TRANSPARENT:!1,BLOOM:!0,BLOOM_ITERATIONS:8,BLOOM_RESOLUTION:256,BLOOM_INTENSITY:.8,BLOOM_THRESHOLD:.6,BLOOM_SOFT_KNEE:.7,SUNRAYS:!0,SUNRAYS_RESOLUTION:196,SUNRAYS_WEIGHT:1};function Se(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}function Me(){return/Mobi|Android/i.test(navigator.userAgent)}function I(t){const o=window.devicePixelRatio||1;return Math.floor(t*o)}function Ue(t){const o={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let i=t.getContext("webgl2",o);const r=!!i;r||(i=t.getContext("webgl",o)||t.getContext("experimental-webgl",o));let n,h;r?(i.getExtension("EXT_color_buffer_float"),h=i.getExtension("OES_texture_float_linear")):(n=i.getExtension("OES_texture_half_float"),h=i.getExtension("OES_texture_half_float_linear")),i.clearColor(0,0,0,1);const f=r?i.HALF_FLOAT:n?n.HALF_FLOAT_OES:null;let y,S,k;return r?(y=V(i,i.RGBA16F,i.RGBA,f),S=V(i,i.RG16F,i.RG,f),k=V(i,i.R16F,i.RED,f)):(y=V(i,i.RGBA,i.RGBA,f),S=V(i,i.RGBA,i.RGBA,f),k=V(i,i.RGBA,i.RGBA,f)),{gl:i,ext:{formatRGBA:y,formatRG:S,formatR:k,halfFloatTexType:f,supportLinearFiltering:h}}}function V(t,o,i,r){if(!qe(t,o,i,r))switch(o){case t.R16F:return V(t,t.RG16F,t.RG,r);case t.RG16F:return V(t,t.RGBA16F,t.RGBA,r);default:return null}return{internalFormat:o,format:i}}function qe(t,o,i,r){const n=t.createTexture();t.bindTexture(t.TEXTURE_2D,n),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,o,4,4,0,i,r,null);const h=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,h),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,n,0),t.checkFramebufferStatus(t.FRAMEBUFFER)===t.FRAMEBUFFER_COMPLETE}class Pe{constructor(o,i){this.vertexShader=o,this.fragmentShaderSource=i,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(o){let i=0;for(let n=0;n<o.length;n++)i+=Ne(o[n]);let r=this.programs[i];if(r==null){const n=B(e.FRAGMENT_SHADER,this.fragmentShaderSource,o);r=ye(this.vertexShader,n),this.programs[i]=r}r!==this.activeProgram&&(this.uniforms=Te(r),this.activeProgram=r)}bind(){e.useProgram(this.activeProgram)}}class O{constructor(o,i){this.uniforms={},this.program=ye(o,i),this.uniforms=Te(this.program)}bind(){e.useProgram(this.program)}}function ye(t,o){const i=e.createProgram();if(e.attachShader(i,t),e.attachShader(i,o),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS))throw e.getProgramInfoLog(i);return i}function Te(t){const o=[],i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;r++){const n=e.getActiveUniform(t,r).name;o[n]=e.getUniformLocation(t,n)}return o}function B(t,o,i){o=ke(o,i);const r=e.createShader(t);if(e.shaderSource(r,o),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw e.getShaderInfoLog(r);return r}function ke(t,o){if(o==null)return t;let i="";return o.forEach(r=>{i+="#define "+r+`
`}),i+t}function Ne(t){if(t.length===0)return 0;let o=0;for(let i=0;i<t.length;i++)o=(o<<5)-o+t.charCodeAt(i),o|=0;return o}function Ie(){const t=B(e.VERTEX_SHADER,`
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `),o=B(e.VERTEX_SHADER,`
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        float offset = 1.33333333;
        vL = vUv - texelSize * offset;
        vR = vUv + texelSize * offset;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `),i=B(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      uniform sampler2D uTexture;
      void main () {
        vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
        sum += texture2D(uTexture, vL) * 0.35294117;
        sum += texture2D(uTexture, vR) * 0.35294117;
        gl_FragColor = sum;
      }
    `),r=B(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        gl_FragColor = texture2D(uTexture, vUv);
      }
    `),n=B(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `),h=B(e.FRAGMENT_SHADER,`
      precision mediump float;
      uniform vec4 color;
      void main () {
        gl_FragColor = color;
      }
    `),f=`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uBloom;
      uniform sampler2D uSunrays;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;
      vec3 linearToGamma (vec3 color) {
        color = max(color, vec3(0));
        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
      #ifdef SHADING
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;
        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);
        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);
        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        c *= diffuse;
      #endif
      #ifdef BLOOM
        vec3 bloom = texture2D(uBloom, vUv).rgb;
      #endif
      #ifdef SUNRAYS
        float sunrays = texture2D(uSunrays, vUv).r;
        c *= sunrays;
      #ifdef BLOOM
        bloom *= sunrays;
      #endif
      #endif
      #ifdef BLOOM
        float noise = texture2D(uDithering, vUv * ditherScale).r;
        noise = noise * 2.0 - 1.0;
        bloom += noise / 255.0;
        bloom = linearToGamma(bloom);
        c += bloom;
      #endif
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }
    `,y=B(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec3 curve;
      uniform float threshold;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float br = max(c.r, max(c.g, c.b));
        float rq = clamp(br - curve.x, 0.0, curve.y);
        rq = curve.z * rq * rq;
        c *= max(rq, br - threshold) / max(br, 0.0001);
        gl_FragColor = vec4(c, 0.0);
      }
    `),S=B(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum;
      }
    `),k=B(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform float intensity;
      void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum * intensity;
      }
    `),W=B(e.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        vec4 c = texture2D(uTexture, vUv);
        float br = max(c.r, max(c.g, c.b));
        c.a = 1.0 - min(max(br * 20.0, 0.0), 0.8);
        gl_FragColor = c;
      }
    `),pt=B(e.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float weight;
      #define ITERATIONS 16
      void main () {
        float Density = 0.3;
        float Decay = 0.95;
        float Exposure = 0.7;
        vec2 coord = vUv;
        vec2 dir = vUv - 0.5;
        dir *= 1.0 / float(ITERATIONS) * Density;
        float illuminationDecay = 1.0;
        float color = texture2D(uTexture, vUv).a;
        for (int i = 0; i < ITERATIONS; i++) {
          coord -= dir;
          float col = texture2D(uTexture, coord).a;
          color += col * illuminationDecay * weight;
          illuminationDecay *= Decay;
        }
        gl_FragColor = vec4(color * Exposure, 0.0, 0.0, 1.0);
      }
    `),xt=B(e.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `),gt=B(e.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
      #ifdef MANUAL_FILTERING
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
      #else
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
      #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }`,s.supportLinearFiltering?null:["MANUAL_FILTERING"]),St=B(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `),yt=B(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `),Tt=B(e.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `),Et=B(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `),Rt=B(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);c=new O(o,i),p=new O(t,r),T=new O(t,n),E=new O(t,h),R=new O(t,y),b=new O(t,S),C=new O(t,k),N=new O(t,W),H=new O(t,pt),F=new O(t,xt),L=new O(t,gt),Y=new O(t,St),l=new O(t,yt),U=new O(t,Tt),x=new O(t,Et),z=new O(t,Rt),q=new Pe(t,f)}function Xe(){e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),e.STATIC_DRAW),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0)}function D(t){e.bindFramebuffer(e.FRAMEBUFFER,t),e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0)}function X(t,o,i,r,n,h){e.activeTexture(e.TEXTURE0);const f=e.createTexture();e.bindTexture(e.TEXTURE_2D,f),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,h),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,h),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i,t,o,0,r,n,null);const y=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,y),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,f,0),e.viewport(0,0,t,o),e.clear(e.COLOR_BUFFER_BIT);const S=1/t,k=1/o;return{texture:f,fbo:y,width:t,height:o,texelSizeX:S,texelSizeY:k,attach(W){return e.activeTexture(e.TEXTURE0+W),e.bindTexture(e.TEXTURE_2D,f),W}}}function ce(t,o,i,r,n,h){let f=X(t,o,i,r,n,h),y=X(t,o,i,r,n,h);return{width:t,height:o,texelSizeX:f.texelSizeX,texelSizeY:f.texelSizeY,get read(){return f},set read(S){f=S},get write(){return y},set write(S){y=S},swap(){const S=f;f=y,y=S}}}function He(t,o,i,r,n,h,f){const y=X(o,i,r,n,h,f);return p.bind(),e.uniform1i(p.uniforms.uTexture,t.attach(0)),D(y.fbo),y}function Ee(t,o,i,r,n,h,f){return t.width===o&&t.height===i||(t.read=He(t.read,o,i,r,n,h,f),t.write=X(o,i,r,n,h,f),t.width=o,t.height=i,t.texelSizeX=1/o,t.texelSizeY=1/i),t}function se(t){let o=e.drawingBufferWidth/e.drawingBufferHeight;o<1&&(o=1/o);const i=Math.round(t),r=Math.round(t*o);return e.drawingBufferWidth>e.drawingBufferHeight?{width:r,height:i}:{width:i,height:r}}function Re(){const t=se(g.SIM_RESOLUTION),o=se(g.DYE_RESOLUTION),i=s.halfFloatTexType,r=s.formatRGBA,n=s.formatRG,h=s.formatR,f=s.supportLinearFiltering?e.LINEAR:e.NEAREST;w==null?w=ce(o.width,o.height,r.internalFormat,r.format,i,f):w=Ee(w,o.width,o.height,r.internalFormat,r.format,i,f),v==null?v=ce(t.width,t.height,n.internalFormat,n.format,i,f):v=Ee(v,t.width,t.height,n.internalFormat,n.format,i,f),ee=X(t.width,t.height,h.internalFormat,h.format,i,e.NEAREST),te=X(t.width,t.height,h.internalFormat,h.format,i,e.NEAREST),G=ce(t.width,t.height,h.internalFormat,h.format,i,e.NEAREST),Ye(),Ge()}function Ye(){const t=se(g.BLOOM_RESOLUTION),o=s.halfFloatTexType,i=s.formatRGBA,r=s.supportLinearFiltering?e.LINEAR:e.NEAREST;ie=X(t.width,t.height,i.internalFormat,i.format,o,r),K.length=0;for(let n=0;n<g.BLOOM_ITERATIONS;n++){const h=t.width>>n+1,f=t.height>>n+1;if(h<2||f<2)break;const y=X(h,f,i.internalFormat,i.format,o,r);K.push(y)}}function Ge(){const t=se(g.SUNRAYS_RESOLUTION),o=s.halfFloatTexType,i=s.formatR,r=s.supportLinearFiltering?e.LINEAR:e.NEAREST;Q=X(t.width,t.height,i.internalFormat,i.format,o,r),le=X(t.width,t.height,i.internalFormat,i.format,o,r)}function Ve(){const t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT),e.texImage2D(e.TEXTURE_2D,0,e.RGB,1,1,0,e.RGB,e.UNSIGNED_BYTE,new Uint8Array([255,255,255])),{texture:t,width:1,height:1,attach(o){return e.activeTexture(e.TEXTURE0+o),e.bindTexture(e.TEXTURE_2D,t),o}}}function We(){const t=[];g.SHADING&&t.push("SHADING"),g.BLOOM&&t.push("BLOOM"),g.SUNRAYS&&t.push("SUNRAYS"),q.setKeywords(t)}function $e(){const t=Date.now();let o=(t-ge)/1e3;return o=Math.min(o,.016666),ge=t,o}function Ke(){const t=I(d.clientWidth),o=I(d.clientHeight);return d.width!==t||d.height!==o?(d.width=t,d.height=o,!0):!1}function je(t){re+=t*g.COLOR_UPDATE_SPEED,re>=1&&(re=ht(re,0,1),P.forEach(o=>{o.color=ue()}))}function Je(){xe.length>0&&be(xe.pop()),P.forEach(t=>{t.moved&&(t.moved=!1,st(t))})}function Qe(t){e.disable(e.BLEND),e.viewport(0,0,v.width,v.height),l.bind(),e.uniform2f(l.uniforms.texelSize,v.texelSizeX,v.texelSizeY),e.uniform1i(l.uniforms.uVelocity,v.read.attach(0)),D(te.fbo),U.bind(),e.uniform2f(U.uniforms.texelSize,v.texelSizeX,v.texelSizeY),e.uniform1i(U.uniforms.uVelocity,v.read.attach(0)),e.uniform1i(U.uniforms.uCurl,te.attach(1)),e.uniform1f(U.uniforms.curl,g.CURL),e.uniform1f(U.uniforms.dt,t),D(v.write.fbo),v.swap(),Y.bind(),e.uniform2f(Y.uniforms.texelSize,v.texelSizeX,v.texelSizeY),e.uniform1i(Y.uniforms.uVelocity,v.read.attach(0)),D(ee.fbo),T.bind(),e.uniform1i(T.uniforms.uTexture,G.read.attach(0)),e.uniform1f(T.uniforms.value,g.PRESSURE),D(G.write.fbo),G.swap(),x.bind(),e.uniform2f(x.uniforms.texelSize,v.texelSizeX,v.texelSizeY),e.uniform1i(x.uniforms.uDivergence,ee.attach(0));for(let i=0;i<g.PRESSURE_ITERATIONS;i++)e.uniform1i(x.uniforms.uPressure,G.read.attach(1)),D(G.write.fbo),G.swap();z.bind(),e.uniform2f(z.uniforms.texelSize,v.texelSizeX,v.texelSizeY),e.uniform1i(z.uniforms.uPressure,G.read.attach(0)),e.uniform1i(z.uniforms.uVelocity,v.read.attach(1)),D(v.write.fbo),v.swap(),L.bind(),e.uniform2f(L.uniforms.texelSize,v.texelSizeX,v.texelSizeY),s.supportLinearFiltering||e.uniform2f(L.uniforms.dyeTexelSize,v.texelSizeX,v.texelSizeY);const o=v.read.attach(0);e.uniform1i(L.uniforms.uVelocity,o),e.uniform1i(L.uniforms.uSource,o),e.uniform1f(L.uniforms.dt,t),e.uniform1f(L.uniforms.dissipation,g.VELOCITY_DISSIPATION),D(v.write.fbo),v.swap(),e.viewport(0,0,w.width,w.height),s.supportLinearFiltering||e.uniform2f(L.uniforms.dyeTexelSize,w.texelSizeX,w.texelSizeY),e.uniform1i(L.uniforms.uVelocity,v.read.attach(0)),e.uniform1i(L.uniforms.uSource,w.read.attach(1)),e.uniform1f(L.uniforms.dissipation,g.DENSITY_DISSIPATION),D(w.write.fbo),w.swap()}function Ze(t){g.BLOOM&&it(w.read,ie),g.SUNRAYS&&(ot(w.read,w.write,Q),rt(Q,le,1)),t==null||!g.TRANSPARENT?(e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.enable(e.BLEND)):e.disable(e.BLEND);const o=t==null?e.drawingBufferWidth:t.width,i=t==null?e.drawingBufferHeight:t.height;e.viewport(0,0,o,i);const r=t==null?null:t.fbo;et(r,ut(g.BACK_COLOR)),tt(r,o,i)}function et(t,o){E.bind(),e.uniform4f(E.uniforms.color,o.r,o.g,o.b,1),D(t)}function tt(t,o,i){if(q.bind(),g.SHADING&&e.uniform2f(q.uniforms.texelSize,1/o,1/i),e.uniform1i(q.uniforms.uTexture,w.read.attach(0)),g.BLOOM){e.uniform1i(q.uniforms.uBloom,ie.attach(1)),e.uniform1i(q.uniforms.uDithering,oe.attach(2));const r=ft(oe,o,i);e.uniform2f(q.uniforms.ditherScale,r.x,r.y)}g.SUNRAYS&&e.uniform1i(q.uniforms.uSunrays,Q.attach(3)),D(t)}function it(t,o){if(K.length<2)return;let i=o;e.disable(e.BLEND),R.bind();const r=g.BLOOM_THRESHOLD*g.BLOOM_SOFT_KNEE+1e-4,n=g.BLOOM_THRESHOLD-r,h=r*2,f=.25/r;e.uniform3f(R.uniforms.curve,n,h,f),e.uniform1f(R.uniforms.threshold,g.BLOOM_THRESHOLD),e.uniform1i(R.uniforms.uTexture,t.attach(0)),e.viewport(0,0,i.width,i.height),D(i.fbo),b.bind();for(let y=0;y<K.length;y++){const S=K[y];e.uniform2f(b.uniforms.texelSize,i.texelSizeX,i.texelSizeY),e.uniform1i(b.uniforms.uTexture,i.attach(0)),e.viewport(0,0,S.width,S.height),D(S.fbo),i=S}e.blendFunc(e.ONE,e.ONE),e.enable(e.BLEND);for(let y=K.length-2;y>=0;y--){const S=K[y];e.uniform2f(b.uniforms.texelSize,i.texelSizeX,i.texelSizeY),e.uniform1i(b.uniforms.uTexture,i.attach(0)),e.viewport(0,0,S.width,S.height),D(S.fbo),i=S}e.disable(e.BLEND),C.bind(),e.uniform2f(C.uniforms.texelSize,i.texelSizeX,i.texelSizeY),e.uniform1i(C.uniforms.uTexture,i.attach(0)),e.uniform1f(C.uniforms.intensity,g.BLOOM_INTENSITY),e.viewport(0,0,o.width,o.height),D(o.fbo)}function ot(t,o,i){e.disable(e.BLEND),N.bind(),e.uniform1i(N.uniforms.uTexture,t.attach(0)),e.viewport(0,0,o.width,o.height),D(o.fbo),H.bind(),e.uniform1f(H.uniforms.weight,g.SUNRAYS_WEIGHT),e.uniform1i(H.uniforms.uTexture,o.attach(0)),e.viewport(0,0,i.width,i.height),D(i.fbo)}function rt(t,o,i){c.bind();for(let r=0;r<i;r++)e.uniform2f(c.uniforms.texelSize,t.texelSizeX,0),e.uniform1i(c.uniforms.uTexture,t.attach(0)),D(o.fbo),e.uniform2f(c.uniforms.texelSize,0,t.texelSizeY),e.uniform1i(c.uniforms.uTexture,o.attach(0)),D(t.fbo)}function st(t){const o=t.deltaX*g.SPLAT_FORCE,i=t.deltaY*g.SPLAT_FORCE;we(t.texcoordX,t.texcoordY,o,i,t.color)}function be(t){for(let o=0;o<t;o++){const i=ue();i.r*=10,i.g*=10,i.b*=10;const r=Math.random(),n=Math.random(),h=1e3*(Math.random()-.5),f=1e3*(Math.random()-.5);we(r,n,h,f,i)}}function we(t,o,i,r,n){e.viewport(0,0,v.width,v.height),F.bind(),e.uniform1i(F.uniforms.uTarget,v.read.attach(0)),e.uniform1f(F.uniforms.aspectRatio,d.width/d.height),e.uniform2f(F.uniforms.point,t,o),e.uniform3f(F.uniforms.color,i,r,0),e.uniform1f(F.uniforms.radius,nt(g.SPLAT_RADIUS/100)),D(v.write.fbo),v.swap(),e.viewport(0,0,w.width,w.height),e.uniform1i(F.uniforms.uTarget,w.read.attach(0)),e.uniform3f(F.uniforms.color,n.r,n.g,n.b),D(w.write.fbo),w.swap()}function nt(t){const o=d.width/d.height;return o>1&&(t*=o),t}function De(t,o,i,r){t.id=o,t.down=!0,t.moved=!1,t.texcoordX=i/d.width,t.texcoordY=1-r/d.height,t.prevTexcoordX=t.texcoordX,t.prevTexcoordY=t.texcoordY,t.deltaX=0,t.deltaY=0,t.color=ue()}function _e(t,o,i){t.prevTexcoordX=t.texcoordX,t.prevTexcoordY=t.texcoordY,t.texcoordX=o/d.width,t.texcoordY=1-i/d.height,t.deltaX=at(t.texcoordX-t.prevTexcoordX),t.deltaY=lt(t.texcoordY-t.prevTexcoordY),t.moved=Math.abs(t.deltaX)>0||Math.abs(t.deltaY)>0}function Ae(t){t.down=!1}function at(t){const o=d.width/d.height;return o<1&&(t*=o),t}function lt(t){const o=d.width/d.height;return o>1&&(t/=o),t}function ue(){const t=ct(Math.random(),1,1);return t.r*=.15,t.g*=.15,t.b*=.15,t}function ct(t,o,i){let r,n,h;const f=Math.floor(t*6),y=t*6-f,S=i*(1-o),k=i*(1-y*o),W=i*(1-(1-y)*o);switch(f%6){case 0:r=i,n=W,h=S;break;case 1:r=k,n=i,h=S;break;case 2:r=S,n=i,h=W;break;case 3:r=S,n=k,h=i;break;case 4:r=W,n=S,h=i;break;case 5:r=i,n=S,h=k;break}return{r,g:n,b:h}}function ut(t){return{r:t.r/255,g:t.g/255,b:t.b/255}}function ht(t,o,i){const r=i-o;return r===0?o:(t-o)%r+o}function ft(t,o,i){return{x:o/t.width,y:i/t.height}}let he,fe,de,ve,me,pe;function dt(){P.push(new Se),he=t=>{if(u)return;const o=I(t.offsetX),i=I(t.offsetY),r=P.find(n=>n.id===-1);r!=null&&De(r,-1,o,i)},fe=t=>{if(u)return;const o=P[0];if(!o.down)return;const i=I(t.offsetX),r=I(t.offsetY);_e(o,i,r)},de=()=>{u||Ae(P[0])},ve=t=>{if(u)return;t.preventDefault();const o=t.targetTouches;for(;o.length>=P.length;)P.push(new Se);for(let i=0;i<o.length;i++){const r=I(o[i].pageX),n=I(o[i].pageY);De(P[i+1],o[i].identifier,r,n)}},me=t=>{if(u)return;t.preventDefault();const o=t.targetTouches;for(let i=0;i<o.length;i++){const r=P[i+1];if(!r.down)continue;const n=I(o[i].pageX),h=I(o[i].pageY);_e(r,n,h)}},pe=t=>{if(u)return;const o=t.changedTouches;for(let i=0;i<o.length;i++){const r=P.find(n=>n.id===o[i].identifier);r!=null&&Ae(r)}},d.addEventListener("mousedown",he),d.addEventListener("mousemove",fe),window.addEventListener("mouseup",de),d.addEventListener("touchstart",ve,{passive:!1}),d.addEventListener("touchmove",me,{passive:!1}),d.addEventListener("touchend",pe)}function Ce(){if(u)return;const t=$e();Ke()&&Re(),je(t),Je(),Qe(t),Ze(null),m=requestAnimationFrame(Ce)}function vt(t){d=t;const o=Ue(d);if(e=o.gl,s=o.ext,!e){console.warn("WebGL not supported");return}Me()&&(g.DYE_RESOLUTION=512),s.supportLinearFiltering||(g.DYE_RESOLUTION=512,g.SHADING=!1,g.BLOOM=!1,g.SUNRAYS=!1),Xe(),Ie(),oe=Ve(),We(),Re(),be(parseInt(Math.random()*20)+5),dt(),Ce()}function mt(){if(u=!0,m&&(cancelAnimationFrame(m),m=null),d&&(d.removeEventListener("mousedown",he),d.removeEventListener("mousemove",fe),window.removeEventListener("mouseup",de),d.removeEventListener("touchstart",ve),d.removeEventListener("touchmove",me),d.removeEventListener("touchend",pe)),e){const t=e.getExtension("WEBGL_lose_context");t&&t.loseContext()}d=null,e=null,s=null,w=null,v=null,ee=null,te=null,G=null,ie=null,Q=null,le=null,oe=null}return{init:vt,destroy:mt}}const zt={class:"home-page"},Ot={class:"hero"},Ft={class:"hero-content"},Mt={class:"hero-actions"},Ut={class:"skills-grid"},qt={key:0,viewBox:"0 0 24 24",width:"28",height:"28",fill:"none"},Pt={key:1,viewBox:"0 0 24 24",width:"28",height:"28"},kt={key:2,viewBox:"0 0 24 24",width:"28",height:"28"},Nt={key:3,viewBox:"0 0 24 24",width:"28",height:"28",fill:"none"},It={key:4,viewBox:"0 0 24 24",width:"28",height:"28",fill:"none"},Xt={key:5,viewBox:"0 0 24 24",width:"28",height:"28",fill:"none"},Ht={key:6,viewBox:"0 0 24 24",width:"28",height:"28",fill:"none"},Yt={key:7,viewBox:"0 0 24 24",width:"28",height:"28",fill:"none"},Gt={key:8,viewBox:"0 0 24 24",width:"28",height:"28",fill:"none"},Vt={key:9,viewBox:"0 0 24 24",width:"28",height:"28",fill:"none"},Wt={key:10,viewBox:"0 0 24 24",width:"28",height:"28",fill:"none"},$t={key:11,viewBox:"0 0 24 24",width:"28",height:"28",fill:"none"},Kt={key:12,viewBox:"0 0 24 24",width:"28",height:"28",fill:"none"},jt={key:13,viewBox:"0 0 24 24",width:"28",height:"28",fill:"none"},Jt={class:"skill-name"},Qt={class:"skill-desc"},Zt={class:"contact-inner"},ei={class:"contact-links"},ti=["href"],ii={class:"contact-icon"},oi={class:"contact-label"},ri="欢迎，这是个记录折腾过程的地方",si={__name:"HomePage",setup(d){const e=$(null),s=$(null),m=$(!1),u=$(!1),c=$(null),p=$(null),T=$(null),E=$(null);let R=null,b=null,C=null;const N=Be(()=>[...ri]),H=Be(()=>[..."ZhuYiming"]),F=[{name:"Spring Boot",desc:"企业级 Java 后端框架",color:"#6DB33F",type:"spring"},{name:"Vue 3",desc:"现代前端渐进式框架",color:"#42B883",type:"vue"},{name:"Kotlin",desc:"Android 与服务端开发",color:"#7F52FF",type:"kotlin"},{name:"Python",desc:"数据处理与 AI 脚本",color:"#3776AB",type:"python"},{name:"MySQL",desc:"关系型数据库设计",color:"#4479A1",type:"mysql"},{name:"Redis",desc:"高性能缓存与消息队列",color:"#DC382D",type:"redis"},{name:"Cloudflare",desc:"边缘计算与 CDN",color:"#F38020",type:"cloudflare"},{name:"Playwright",desc:"浏览器自动化与爬虫",color:"#2EAD33",type:"playwright"},{name:"ArkTS",desc:"HarmonyOS 应用开发",color:"#CE392D",type:"arkts"},{name:"微信小程序",desc:"轻量级移动端应用",color:"#07C160",type:"wechat"},{name:"C / C++",desc:"系统编程与高性能计算",color:"#00599C",type:"cpp"},{name:"Linux",desc:"了解常用 Linux 命令",color:"#FCC624",type:"linux"},{name:"Docker",desc:"了解 Docker 工作原理及部署",color:"#2496ED",type:"docker"},{name:"Git",desc:"熟悉 Git 版本管理",color:"#F05032",type:"git"}],L=[{icon:"@",label:"Email",href:"mailto:myzovo@qq.com"},{icon:"G",label:"GitHub",href:"https://github.com/myzovo"}];return wt(()=>{c.value&&(b=Bt(),b.init(c.value)),p.value&&(C=Lt(),C.init(p.value)),R=new IntersectionObserver(Y=>{Y.forEach(l=>{l.isIntersecting&&(l.target===e.value&&(m.value=!0),l.target===s.value&&(u.value=!0),R.unobserve(l.target))})},{threshold:.15}),e.value&&R.observe(e.value),s.value&&R.observe(s.value)}),Dt(()=>{R&&R.disconnect(),b&&b.destroy(),C&&C.destroy()}),(Y,l)=>{const U=_t("router-link");return _(),A("div",zt,[a("section",Ot,[a("canvas",{ref_key:"gridCanvas",ref:c,class:"fluid-canvas"},null,512),l[3]||(l[3]=a("div",{class:"hero-vignette"},null,-1)),a("div",Ft,[l[2]||(l[2]=a("p",{class:"hero-eyebrow"},"全栈开发者 / AI 应用开发",-1)),a("h1",{class:"hero-name",ref_key:"heroNameRef",ref:T},[(_(!0),A(ne,null,ae(H.value,(x,z)=>(_(),A("span",{key:z,class:"name-char",style:Z({animationDelay:`${z*.08}s`})},J(x),5))),128))],512),a("p",{class:"hero-bio",ref_key:"heroBioRef",ref:E},[(_(!0),A(ne,null,ae(N.value,(x,z)=>(_(),A("span",{key:z,class:"bio-char",style:Z({animationDelay:`${z*.04}s`})},J(x),5))),128))],512),a("div",Mt,[Le(U,{class:"btn-primary shimmer-btn",to:"/portfolio"},{default:ze(()=>[...l[0]||(l[0]=[Oe("查看作品",-1)])]),_:1}),Le(U,{class:"btn-secondary",to:"/blog"},{default:ze(()=>[...l[1]||(l[1]=[Oe("阅读博客",-1)])]),_:1})])]),l[4]||(l[4]=a("div",{class:"scroll-indicator"},[a("div",{class:"arrow arrow-1"}),a("div",{class:"arrow arrow-2"})],-1))]),a("section",{class:"about",ref_key:"aboutRef",ref:e},[a("h2",{class:j(["section-title",{visible:m.value}])},"技术栈",2),a("p",{class:j(["section-subtitle",{visible:m.value}])},"持续学习，持续进化",2),a("div",Ut,[(_(),A(ne,null,ae(F,(x,z)=>a("div",{key:x.name,class:j(["skill-card",{visible:m.value}]),style:Z({transitionDelay:`${z*80}ms`})},[a("div",{class:"skill-icon",style:Z({"--brand-color":x.color})},[x.type==="spring"?(_(),A("svg",qt,[...l[5]||(l[5]=[a("path",{d:"M21.854 8.646a5.96 5.96 0 0 0-4.293-5.262 5.97 5.97 0 0 0-6.478 1.389c-.283.283-.53.6-.743.941-.213-.34-.46-.658-.743-.941a5.97 5.97 0 0 0-6.478-1.39A5.96 5.96 0 0 0 .073 8.7C.96 13.977 5.23 18.22 12 22c6.77-3.78 11.04-8.023 11.927-13.3a5.93 5.93 0 0 0-.073-.054z",fill:"currentColor"},null,-1)])])):x.type==="vue"?(_(),A("svg",Pt,[...l[6]||(l[6]=[a("path",{d:"M2 3h3.5L12 14.5 18.5 3H22L12 21 2 3z",fill:"currentColor"},null,-1),a("path",{d:"M7.5 3L12 11 16.5 3H14L12 6.5 10 3H7.5z",fill:"rgba(0,0,0,0.3)"},null,-1)])])):x.type==="kotlin"?(_(),A("svg",kt,[...l[7]||(l[7]=[a("path",{d:"M2 2h20L12 12l10 10H2V2z",fill:"currentColor"},null,-1),a("path",{d:"M5.5 5.5l6.5 6.5-6.5 6.5V5.5z",fill:"rgba(255,255,255,0.5)"},null,-1)])])):x.type==="python"?(_(),A("svg",Nt,[...l[8]||(l[8]=[a("path",{d:"M12 2C9.24 2 7.47 3.17 7.47 5.24V7h4.86v.56H5.38C3.14 7.56 1.4 9.53 1.4 12.28c0 2.74 1.53 4.62 3.98 4.62h1.62V14.8c0-2.16 1.87-4.04 4.04-4.04h4.86c1.76 0 3.16-1.42 3.16-3.16V5.24C19.06 3.17 17.28 2 12 2zm-2.62 1.83a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9z",fill:"#3776AB"},null,-1),a("path",{d:"M12 22c2.76 0 4.53-1.17 4.53-3.24V16.2H11.67v-.56h6.89c2.24 0 3.98-1.97 3.98-4.72 0-2.74-1.53-4.62-3.98-4.62h-1.62v2.11c0 2.16-1.87 4.04-4.04 4.04H8.54c-1.76 0-3.16 1.42-3.16 3.16v2.53C5.38 20.83 7.16 22 12 22zm2.62-1.83a.95.95 0 1 1 0-1.9.95.95 0 0 1 0 1.9z",fill:"#FFD43B"},null,-1)])])):x.type==="mysql"?(_(),A("svg",It,[...l[9]||(l[9]=[a("ellipse",{cx:"12",cy:"6",rx:"9",ry:"3.5",fill:"currentColor"},null,-1),a("path",{d:"M3 6v5c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5V6",stroke:"currentColor","stroke-width":"1.5",fill:"none"},null,-1),a("path",{d:"M3 11v5c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5v-5",stroke:"currentColor","stroke-width":"1.5",fill:"none"},null,-1)])])):x.type==="redis"?(_(),A("svg",Xt,[...l[10]||(l[10]=[a("path",{d:"M12 2L3 7v10l9 5 9-5V7l-9-5z",fill:"none",stroke:"currentColor","stroke-width":"1.5"},null,-1),a("path",{d:"M12 2v20M3 7l9 5 9-5M3 17l9-5 9 5",stroke:"currentColor","stroke-width":"1.2",opacity:"0.5"},null,-1),a("circle",{cx:"12",cy:"12",r:"2.5",fill:"currentColor"},null,-1)])])):x.type==="cloudflare"?(_(),A("svg",Ht,[...l[11]||(l[11]=[a("path",{d:"M16.5 18h-9a1.5 1.5 0 0 1 0-3h.24a5.5 5.5 0 0 1 10.52 0h.24a1.5 1.5 0 0 1 0 3z",fill:"currentColor",opacity:"0.25"},null,-1),a("path",{d:"M18.5 14.5a4 4 0 0 0-3.87-3.02A5.5 5.5 0 0 0 5 13.5H3.5a2.5 2.5 0 0 0-.47 4.97A2 2 0 0 0 5 18h11.5a2 2 0 0 0 2-2v-.5z",fill:"currentColor"},null,-1)])])):x.type==="playwright"?(_(),A("svg",Yt,[...l[12]||(l[12]=[a("circle",{cx:"12",cy:"12",r:"10",fill:"currentColor",opacity:"0.15"},null,-1),a("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"1.5",fill:"none"},null,-1),a("text",{x:"12",y:"16","text-anchor":"middle",fill:"currentColor","font-size":"12","font-weight":"700","font-family":"sans-serif"},"P",-1)])])):x.type==="arkts"?(_(),A("svg",Gt,[...l[13]||(l[13]=[a("circle",{cx:"12",cy:"12",r:"10",fill:"currentColor",opacity:"0.15"},null,-1),a("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"1.5",fill:"none"},null,-1),a("text",{x:"12",y:"16","text-anchor":"middle",fill:"currentColor","font-size":"11","font-weight":"700","font-family":"sans-serif"},"A",-1)])])):x.type==="cpp"?(_(),A("svg",Vt,[...l[14]||(l[14]=[a("circle",{cx:"12",cy:"12",r:"10",fill:"currentColor",opacity:"0.15"},null,-1),a("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"1.5",fill:"none"},null,-1),a("text",{x:"12",y:"16.5","text-anchor":"middle",fill:"currentColor","font-size":"9.5","font-weight":"700","font-family":"sans-serif"},"C++",-1)])])):x.type==="linux"?(_(),A("svg",Wt,[...l[15]||(l[15]=[a("circle",{cx:"12",cy:"12",r:"10",fill:"currentColor",opacity:"0.15"},null,-1),a("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"1.5",fill:"none"},null,-1),a("text",{x:"12",y:"16","text-anchor":"middle",fill:"currentColor","font-size":"8","font-weight":"700","font-family":"monospace"},">_",-1)])])):x.type==="docker"?(_(),A("svg",$t,[...l[16]||(l[16]=[Fe('<rect x="2" y="9" width="4" height="3" rx="0.5" fill="currentColor" data-v-c5a60294></rect><rect x="7" y="9" width="4" height="3" rx="0.5" fill="currentColor" data-v-c5a60294></rect><rect x="12" y="9" width="4" height="3" rx="0.5" fill="currentColor" data-v-c5a60294></rect><rect x="7" y="5" width="4" height="3" rx="0.5" fill="currentColor" data-v-c5a60294></rect><rect x="12" y="5" width="4" height="3" rx="0.5" fill="currentColor" data-v-c5a60294></rect><path d="M1 14c0 0 2 5 11 5s12-5 12-5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" data-v-c5a60294></path>',6)])])):x.type==="git"?(_(),A("svg",Kt,[...l[17]||(l[17]=[Fe('<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" data-v-c5a60294></circle><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none" data-v-c5a60294></circle><circle cx="12" cy="8" r="2" fill="currentColor" data-v-c5a60294></circle><circle cx="12" cy="16" r="2" fill="currentColor" data-v-c5a60294></circle><line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" stroke-width="1.5" data-v-c5a60294></line>',5)])])):x.type==="wechat"?(_(),A("svg",jt,[...l[18]||(l[18]=[a("path",{d:"M9.5 4C5.91 4 3 6.46 3 9.5c0 1.7.86 3.22 2.2 4.24L4.5 16l2.5-1.2c.8.3 1.68.46 2.58.46.17 0 .33 0 .5-.02A5.48 5.48 0 0 1 10 13.5C10 10.46 12.46 8 15.5 8c.45 0 .88.05 1.3.14C15.9 5.64 13 4 9.5 4z",fill:"currentColor"},null,-1),a("path",{d:"M21 13.5c0-2.76-2.69-5-6-5s-6 2.24-6 5 2.69 5 6 5c.67 0 1.31-.1 1.9-.28L20 19.5l-.65-2.08C20.44 16.49 21 15.06 21 13.5z",fill:"currentColor",opacity:"0.6"},null,-1)])])):At("",!0)],4),a("h3",Jt,J(x.name),1),a("p",Qt,J(x.desc),1)],6)),64))])],512),a("section",{class:"contact",ref_key:"contactRef",ref:s},[a("canvas",{ref_key:"contactCanvas",ref:p,class:"contact-canvas"},null,512),a("div",Zt,[a("h2",{class:j(["section-title",{visible:u.value}])},"联系方式",2),a("p",{class:j(["section-subtitle",{visible:u.value}])},"期待与你交流",2),a("div",ei,[(_(),A(ne,null,ae(L,(x,z)=>a("a",{key:x.label,href:x.href,target:"_blank",rel:"noreferrer",class:j(["contact-item",{visible:u.value}]),style:Z({transitionDelay:`${z*100}ms`})},[a("span",ii,J(x.icon),1),a("span",oi,J(x.label),1)],14,ti)),64))])])],512)])}}},ai=bt(si,[["__scopeId","data-v-c5a60294"]]);export{ai as default};

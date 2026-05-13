import{_ as St,c as Ue,o as Dt,a as _t,r as bt,b as z,d as G,e as d,F as oe,f as ne,g as we,w as Fe,n as W,h as Y,i as ae,t as H,j as Oe}from"./index-f835806e.js";function yt(){let l=null,t=null,h=null,F=null,S=!1,y,K,V,A,L,N,M,q,k,D,m,C,p,E,$,j,O,T,s,Q,Z,B,ee,X=[],J,ue,te,_=[],Te=[],xe=Date.now(),re=0;const c={SIM_RESOLUTION:128,DYE_RESOLUTION:1024,CAPTURE_RESOLUTION:512,DENSITY_DISSIPATION:1,VELOCITY_DISSIPATION:.2,PRESSURE:.8,PRESSURE_ITERATIONS:20,CURL:30,SPLAT_RADIUS:.25,SPLAT_FORCE:6e3,SHADING:!0,COLORFUL:!0,COLOR_UPDATE_SPEED:10,PAUSED:!1,BACK_COLOR:{r:15,g:16,b:17},TRANSPARENT:!1,BLOOM:!0,BLOOM_ITERATIONS:8,BLOOM_RESOLUTION:256,BLOOM_INTENSITY:.8,BLOOM_THRESHOLD:.6,BLOOM_SOFT_KNEE:.7,SUNRAYS:!0,SUNRAYS_RESOLUTION:196,SUNRAYS_WEIGHT:1};function ge(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}function Be(){return/Mobi|Android/i.test(navigator.userAgent)}function U(e){const i=window.devicePixelRatio||1;return Math.floor(e*i)}function Ne(e){const i={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let r=e.getContext("webgl2",i);const o=!!r;o||(r=e.getContext("webgl",i)||e.getContext("experimental-webgl",i));let n,a;o?(r.getExtension("EXT_color_buffer_float"),a=r.getExtension("OES_texture_float_linear")):(n=r.getExtension("OES_texture_half_float"),a=r.getExtension("OES_texture_half_float_linear")),r.clearColor(0,0,0,1);const u=o?r.HALF_FLOAT:n?n.HALF_FLOAT_OES:null;let v,f,b;return o?(v=P(r,r.RGBA16F,r.RGBA,u),f=P(r,r.RG16F,r.RG,u),b=P(r,r.R16F,r.RED,u)):(v=P(r,r.RGBA,r.RGBA,u),f=P(r,r.RGBA,r.RGBA,u),b=P(r,r.RGBA,r.RGBA,u)),{gl:r,ext:{formatRGBA:v,formatRG:f,formatR:b,halfFloatTexType:u,supportLinearFiltering:a}}}function P(e,i,r,o){if(!Pe(e,i,r,o))switch(i){case e.R16F:return P(e,e.RG16F,e.RG,o);case e.RG16F:return P(e,e.RGBA16F,e.RGBA,o);default:return null}return{internalFormat:i,format:r}}function Pe(e,i,r,o){const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i,4,4,0,r,o,null);const a=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE}class Ie{constructor(i,r){this.vertexShader=i,this.fragmentShaderSource=r,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(i){let r=0;for(let n=0;n<i.length;n++)r+=Ce(i[n]);let o=this.programs[r];if(o==null){const n=g(t.FRAGMENT_SHADER,this.fragmentShaderSource,i);o=pe(this.vertexShader,n),this.programs[r]=o}o!==this.activeProgram&&(this.uniforms=Ee(o),this.activeProgram=o)}bind(){t.useProgram(this.activeProgram)}}class R{constructor(i,r){this.uniforms={},this.program=pe(i,r),this.uniforms=Ee(this.program)}bind(){t.useProgram(this.program)}}function pe(e,i){const r=t.createProgram();if(t.attachShader(r,e),t.attachShader(r,i),t.linkProgram(r),!t.getProgramParameter(r,t.LINK_STATUS))throw t.getProgramInfoLog(r);return r}function Ee(e){const i=[],r=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<r;o++){const n=t.getActiveUniform(e,o).name;i[n]=t.getUniformLocation(e,n)}return i}function g(e,i,r){i=Me(i,r);const o=t.createShader(e);if(t.shaderSource(o,i),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS))throw t.getShaderInfoLog(o);return o}function Me(e,i){if(i==null)return e;let r="";return i.forEach(o=>{r+="#define "+o+`
`}),r+e}function Ce(e){if(e.length===0)return 0;let i=0;for(let r=0;r<e.length;r++)i=(i<<5)-i+e.charCodeAt(r),i|=0;return i}function Xe(){const e=g(t.VERTEX_SHADER,`
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
    `),i=g(t.VERTEX_SHADER,`
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
    `),r=g(t.FRAGMENT_SHADER,`
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
    `),o=g(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        gl_FragColor = texture2D(uTexture, vUv);
      }
    `),n=g(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `),a=g(t.FRAGMENT_SHADER,`
      precision mediump float;
      uniform vec4 color;
      void main () {
        gl_FragColor = color;
      }
    `),u=`
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
    `,v=g(t.FRAGMENT_SHADER,`
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
    `),f=g(t.FRAGMENT_SHADER,`
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
    `),b=g(t.FRAGMENT_SHADER,`
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
    `),I=g(t.FRAGMENT_SHADER,`
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
    `),dt=g(t.FRAGMENT_SHADER,`
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
    `),ht=g(t.FRAGMENT_SHADER,`
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
    `),Tt=g(t.FRAGMENT_SHADER,`
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
      }`,h.supportLinearFiltering?null:["MANUAL_FILTERING"]),xt=g(t.FRAGMENT_SHADER,`
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
    `),gt=g(t.FRAGMENT_SHADER,`
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
    `),pt=g(t.FRAGMENT_SHADER,`
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
    `),Et=g(t.FRAGMENT_SHADER,`
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
    `),Rt=g(t.FRAGMENT_SHADER,`
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
    `);y=new R(i,r),K=new R(e,o),V=new R(e,n),A=new R(e,a),L=new R(e,v),N=new R(e,f),M=new R(e,b),q=new R(e,I),k=new R(e,dt),D=new R(e,ht),m=new R(e,Tt),C=new R(e,xt),p=new R(e,gt),E=new R(e,pt),$=new R(e,Et),j=new R(e,Rt),O=new Ie(e,u)}function ze(){t.bindBuffer(t.ARRAY_BUFFER,t.createBuffer()),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),t.STATIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,t.createBuffer()),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),t.STATIC_DRAW),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.enableVertexAttribArray(0)}function x(e){t.bindFramebuffer(t.FRAMEBUFFER,e),t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0)}function w(e,i,r,o,n,a){t.activeTexture(t.TEXTURE0);const u=t.createTexture();t.bindTexture(t.TEXTURE_2D,u),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,r,e,i,0,o,n,null);const v=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,v),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,u,0),t.viewport(0,0,e,i),t.clear(t.COLOR_BUFFER_BIT);const f=1/e,b=1/i;return{texture:u,fbo:v,width:e,height:i,texelSizeX:f,texelSizeY:b,attach(I){return t.activeTexture(t.TEXTURE0+I),t.bindTexture(t.TEXTURE_2D,u),I}}}function se(e,i,r,o,n,a){let u=w(e,i,r,o,n,a),v=w(e,i,r,o,n,a);return{width:e,height:i,texelSizeX:u.texelSizeX,texelSizeY:u.texelSizeY,get read(){return u},set read(f){u=f},get write(){return v},set write(f){v=f},swap(){const f=u;u=v,v=f}}}function Ge(e,i,r,o,n,a,u){const v=w(i,r,o,n,a,u);return K.bind(),t.uniform1i(K.uniforms.uTexture,e.attach(0)),x(v.fbo),v}function Re(e,i,r,o,n,a,u){return e.width===i&&e.height===r||(e.read=Ge(e.read,i,r,o,n,a,u),e.write=w(i,r,o,n,a,u),e.width=i,e.height=r,e.texelSizeX=1/i,e.texelSizeY=1/r),e}function ie(e){let i=t.drawingBufferWidth/t.drawingBufferHeight;i<1&&(i=1/i);const r=Math.round(e),o=Math.round(e*i);return t.drawingBufferWidth>t.drawingBufferHeight?{width:o,height:r}:{width:r,height:o}}function Se(){const e=ie(c.SIM_RESOLUTION),i=ie(c.DYE_RESOLUTION),r=h.halfFloatTexType,o=h.formatRGBA,n=h.formatRG,a=h.formatR,u=h.supportLinearFiltering?t.LINEAR:t.NEAREST;T==null?T=se(i.width,i.height,o.internalFormat,o.format,r,u):T=Re(T,i.width,i.height,o.internalFormat,o.format,r,u),s==null?s=se(e.width,e.height,n.internalFormat,n.format,r,u):s=Re(s,e.width,e.height,n.internalFormat,n.format,r,u),Q=w(e.width,e.height,a.internalFormat,a.format,r,t.NEAREST),Z=w(e.width,e.height,a.internalFormat,a.format,r,t.NEAREST),B=se(e.width,e.height,a.internalFormat,a.format,r,t.NEAREST),Ye(),He()}function Ye(){const e=ie(c.BLOOM_RESOLUTION),i=h.halfFloatTexType,r=h.formatRGBA,o=h.supportLinearFiltering?t.LINEAR:t.NEAREST;ee=w(e.width,e.height,r.internalFormat,r.format,i,o),X.length=0;for(let n=0;n<c.BLOOM_ITERATIONS;n++){const a=e.width>>n+1,u=e.height>>n+1;if(a<2||u<2)break;const v=w(a,u,r.internalFormat,r.format,i,o);X.push(v)}}function He(){const e=ie(c.SUNRAYS_RESOLUTION),i=h.halfFloatTexType,r=h.formatR,o=h.supportLinearFiltering?t.LINEAR:t.NEAREST;J=w(e.width,e.height,r.internalFormat,r.format,i,o),ue=w(e.width,e.height,r.internalFormat,r.format,i,o)}function Ve(){const e=t.createTexture();return t.bindTexture(t.TEXTURE_2D,e),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT),t.texImage2D(t.TEXTURE_2D,0,t.RGB,1,1,0,t.RGB,t.UNSIGNED_BYTE,new Uint8Array([255,255,255])),{texture:e,width:1,height:1,attach(i){return t.activeTexture(t.TEXTURE0+i),t.bindTexture(t.TEXTURE_2D,e),i}}}function ke(){const e=[];c.SHADING&&e.push("SHADING"),c.BLOOM&&e.push("BLOOM"),c.SUNRAYS&&e.push("SUNRAYS"),O.setKeywords(e)}function We(){const e=Date.now();let i=(e-xe)/1e3;return i=Math.min(i,.016666),xe=e,i}function Ke(){const e=U(l.clientWidth),i=U(l.clientHeight);return l.width!==e||l.height!==i?(l.width=e,l.height=i,!0):!1}function qe(e){re+=e*c.COLOR_UPDATE_SPEED,re>=1&&(re=ct(re,0,1),_.forEach(i=>{i.color=ce()}))}function $e(){Te.length>0&&De(Te.pop()),_.forEach(e=>{e.moved&&(e.moved=!1,it(e))})}function je(e){t.disable(t.BLEND),t.viewport(0,0,s.width,s.height),p.bind(),t.uniform2f(p.uniforms.texelSize,s.texelSizeX,s.texelSizeY),t.uniform1i(p.uniforms.uVelocity,s.read.attach(0)),x(Z.fbo),E.bind(),t.uniform2f(E.uniforms.texelSize,s.texelSizeX,s.texelSizeY),t.uniform1i(E.uniforms.uVelocity,s.read.attach(0)),t.uniform1i(E.uniforms.uCurl,Z.attach(1)),t.uniform1f(E.uniforms.curl,c.CURL),t.uniform1f(E.uniforms.dt,e),x(s.write.fbo),s.swap(),C.bind(),t.uniform2f(C.uniforms.texelSize,s.texelSizeX,s.texelSizeY),t.uniform1i(C.uniforms.uVelocity,s.read.attach(0)),x(Q.fbo),V.bind(),t.uniform1i(V.uniforms.uTexture,B.read.attach(0)),t.uniform1f(V.uniforms.value,c.PRESSURE),x(B.write.fbo),B.swap(),$.bind(),t.uniform2f($.uniforms.texelSize,s.texelSizeX,s.texelSizeY),t.uniform1i($.uniforms.uDivergence,Q.attach(0));for(let r=0;r<c.PRESSURE_ITERATIONS;r++)t.uniform1i($.uniforms.uPressure,B.read.attach(1)),x(B.write.fbo),B.swap();j.bind(),t.uniform2f(j.uniforms.texelSize,s.texelSizeX,s.texelSizeY),t.uniform1i(j.uniforms.uPressure,B.read.attach(0)),t.uniform1i(j.uniforms.uVelocity,s.read.attach(1)),x(s.write.fbo),s.swap(),m.bind(),t.uniform2f(m.uniforms.texelSize,s.texelSizeX,s.texelSizeY),h.supportLinearFiltering||t.uniform2f(m.uniforms.dyeTexelSize,s.texelSizeX,s.texelSizeY);const i=s.read.attach(0);t.uniform1i(m.uniforms.uVelocity,i),t.uniform1i(m.uniforms.uSource,i),t.uniform1f(m.uniforms.dt,e),t.uniform1f(m.uniforms.dissipation,c.VELOCITY_DISSIPATION),x(s.write.fbo),s.swap(),t.viewport(0,0,T.width,T.height),h.supportLinearFiltering||t.uniform2f(m.uniforms.dyeTexelSize,T.texelSizeX,T.texelSizeY),t.uniform1i(m.uniforms.uVelocity,s.read.attach(0)),t.uniform1i(m.uniforms.uSource,T.read.attach(1)),t.uniform1f(m.uniforms.dissipation,c.DENSITY_DISSIPATION),x(T.write.fbo),T.swap()}function Je(e){c.BLOOM&&et(T.read,ee),c.SUNRAYS&&(tt(T.read,T.write,J),rt(J,ue,1)),e==null||!c.TRANSPARENT?(t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND)):t.disable(t.BLEND);const i=e==null?t.drawingBufferWidth:e.width,r=e==null?t.drawingBufferHeight:e.height;t.viewport(0,0,i,r);const o=e==null?null:e.fbo;Qe(o,st(c.BACK_COLOR)),Ze(o,i,r)}function Qe(e,i){A.bind(),t.uniform4f(A.uniforms.color,i.r,i.g,i.b,1),x(e)}function Ze(e,i,r){if(O.bind(),c.SHADING&&t.uniform2f(O.uniforms.texelSize,1/i,1/r),t.uniform1i(O.uniforms.uTexture,T.read.attach(0)),c.BLOOM){t.uniform1i(O.uniforms.uBloom,ee.attach(1)),t.uniform1i(O.uniforms.uDithering,te.attach(2));const o=lt(te,i,r);t.uniform2f(O.uniforms.ditherScale,o.x,o.y)}c.SUNRAYS&&t.uniform1i(O.uniforms.uSunrays,J.attach(3)),x(e)}function et(e,i){if(X.length<2)return;let r=i;t.disable(t.BLEND),L.bind();const o=c.BLOOM_THRESHOLD*c.BLOOM_SOFT_KNEE+1e-4,n=c.BLOOM_THRESHOLD-o,a=o*2,u=.25/o;t.uniform3f(L.uniforms.curve,n,a,u),t.uniform1f(L.uniforms.threshold,c.BLOOM_THRESHOLD),t.uniform1i(L.uniforms.uTexture,e.attach(0)),t.viewport(0,0,r.width,r.height),x(r.fbo),N.bind();for(let v=0;v<X.length;v++){const f=X[v];t.uniform2f(N.uniforms.texelSize,r.texelSizeX,r.texelSizeY),t.uniform1i(N.uniforms.uTexture,r.attach(0)),t.viewport(0,0,f.width,f.height),x(f.fbo),r=f}t.blendFunc(t.ONE,t.ONE),t.enable(t.BLEND);for(let v=X.length-2;v>=0;v--){const f=X[v];t.uniform2f(N.uniforms.texelSize,r.texelSizeX,r.texelSizeY),t.uniform1i(N.uniforms.uTexture,r.attach(0)),t.viewport(0,0,f.width,f.height),x(f.fbo),r=f}t.disable(t.BLEND),M.bind(),t.uniform2f(M.uniforms.texelSize,r.texelSizeX,r.texelSizeY),t.uniform1i(M.uniforms.uTexture,r.attach(0)),t.uniform1f(M.uniforms.intensity,c.BLOOM_INTENSITY),t.viewport(0,0,i.width,i.height),x(i.fbo)}function tt(e,i,r){t.disable(t.BLEND),q.bind(),t.uniform1i(q.uniforms.uTexture,e.attach(0)),t.viewport(0,0,i.width,i.height),x(i.fbo),k.bind(),t.uniform1f(k.uniforms.weight,c.SUNRAYS_WEIGHT),t.uniform1i(k.uniforms.uTexture,i.attach(0)),t.viewport(0,0,r.width,r.height),x(r.fbo)}function rt(e,i,r){y.bind();for(let o=0;o<r;o++)t.uniform2f(y.uniforms.texelSize,e.texelSizeX,0),t.uniform1i(y.uniforms.uTexture,e.attach(0)),x(i.fbo),t.uniform2f(y.uniforms.texelSize,0,e.texelSizeY),t.uniform1i(y.uniforms.uTexture,i.attach(0)),x(e.fbo)}function it(e){const i=e.deltaX*c.SPLAT_FORCE,r=e.deltaY*c.SPLAT_FORCE;_e(e.texcoordX,e.texcoordY,i,r,e.color)}function De(e){for(let i=0;i<e;i++){const r=ce();r.r*=10,r.g*=10,r.b*=10;const o=Math.random(),n=Math.random(),a=1e3*(Math.random()-.5),u=1e3*(Math.random()-.5);_e(o,n,a,u,r)}}function _e(e,i,r,o,n){t.viewport(0,0,s.width,s.height),D.bind(),t.uniform1i(D.uniforms.uTarget,s.read.attach(0)),t.uniform1f(D.uniforms.aspectRatio,l.width/l.height),t.uniform2f(D.uniforms.point,e,i),t.uniform3f(D.uniforms.color,r,o,0),t.uniform1f(D.uniforms.radius,ot(c.SPLAT_RADIUS/100)),x(s.write.fbo),s.swap(),t.viewport(0,0,T.width,T.height),t.uniform1i(D.uniforms.uTarget,T.read.attach(0)),t.uniform3f(D.uniforms.color,n.r,n.g,n.b),x(T.write.fbo),T.swap()}function ot(e){const i=l.width/l.height;return i>1&&(e*=i),e}function be(e,i,r,o){e.id=i,e.down=!0,e.moved=!1,e.texcoordX=r/l.width,e.texcoordY=1-o/l.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=ce()}function ye(e,i,r){e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=i/l.width,e.texcoordY=1-r/l.height,e.deltaX=nt(e.texcoordX-e.prevTexcoordX),e.deltaY=at(e.texcoordY-e.prevTexcoordY),e.moved=Math.abs(e.deltaX)>0||Math.abs(e.deltaY)>0}function Ae(e){e.down=!1}function nt(e){const i=l.width/l.height;return i<1&&(e*=i),e}function at(e){const i=l.width/l.height;return i>1&&(e/=i),e}function ce(){const e=ut(Math.random(),1,1);return e.r*=.15,e.g*=.15,e.b*=.15,e}function ut(e,i,r){let o,n,a;const u=Math.floor(e*6),v=e*6-u,f=r*(1-i),b=r*(1-v*i),I=r*(1-(1-v)*i);switch(u%6){case 0:o=r,n=I,a=f;break;case 1:o=b,n=r,a=f;break;case 2:o=f,n=r,a=I;break;case 3:o=f,n=b,a=r;break;case 4:o=I,n=f,a=r;break;case 5:o=r,n=f,a=b;break}return{r:o,g:n,b:a}}function st(e){return{r:e.r/255,g:e.g/255,b:e.b/255}}function ct(e,i,r){const o=r-i;return o===0?i:(e-i)%o+i}function lt(e,i,r){return{x:i/e.width,y:r/e.height}}let le,fe,ve,me,de,he;function ft(){_.push(new ge),le=e=>{if(S)return;const i=U(e.offsetX),r=U(e.offsetY),o=_.find(n=>n.id===-1);o!=null&&be(o,-1,i,r)},fe=e=>{if(S)return;const i=_[0];if(!i.down)return;const r=U(e.offsetX),o=U(e.offsetY);ye(i,r,o)},ve=()=>{S||Ae(_[0])},me=e=>{if(S)return;e.preventDefault();const i=e.targetTouches;for(;i.length>=_.length;)_.push(new ge);for(let r=0;r<i.length;r++){const o=U(i[r].pageX),n=U(i[r].pageY);be(_[r+1],i[r].identifier,o,n)}},de=e=>{if(S)return;e.preventDefault();const i=e.targetTouches;for(let r=0;r<i.length;r++){const o=_[r+1];if(!o.down)continue;const n=U(i[r].pageX),a=U(i[r].pageY);ye(o,n,a)}},he=e=>{if(S)return;const i=e.changedTouches;for(let r=0;r<i.length;r++){const o=_.find(n=>n.id===i[r].identifier);o!=null&&Ae(o)}},l.addEventListener("mousedown",le),l.addEventListener("mousemove",fe),window.addEventListener("mouseup",ve),l.addEventListener("touchstart",me,{passive:!1}),l.addEventListener("touchmove",de,{passive:!1}),l.addEventListener("touchend",he)}function Le(){if(S)return;const e=We();Ke()&&Se(),qe(e),$e(),je(e),Je(null),F=requestAnimationFrame(Le)}function vt(e){l=e;const i=Ne(l);if(t=i.gl,h=i.ext,!t){console.warn("WebGL not supported");return}Be()&&(c.DYE_RESOLUTION=512),h.supportLinearFiltering||(c.DYE_RESOLUTION=512,c.SHADING=!1,c.BLOOM=!1,c.SUNRAYS=!1),ze(),Xe(),te=Ve(),ke(),Se(),De(parseInt(Math.random()*20)+5),ft(),Le()}function mt(){if(S=!0,F&&(cancelAnimationFrame(F),F=null),l&&(l.removeEventListener("mousedown",le),l.removeEventListener("mousemove",fe),window.removeEventListener("mouseup",ve),l.removeEventListener("touchstart",me),l.removeEventListener("touchmove",de),l.removeEventListener("touchend",he)),t){const e=t.getExtension("WEBGL_lose_context");e&&e.loseContext()}l=null,t=null,h=null,T=null,s=null,Q=null,Z=null,B=null,ee=null,J=null,ue=null,te=null}return{init:vt,destroy:mt}}const At={class:"home-page"},Lt={class:"hero"},Ut={class:"hero-content"},wt={class:"hero-actions"},Ft={class:"skills-grid"},Ot={class:"skill-icon"},Bt={class:"skill-name"},Nt={class:"skill-desc"},Pt={class:"contact-links"},It=["href"],Mt={class:"contact-icon"},Ct={class:"contact-label"},Xt="热爱技术，专注于构建高质量的全栈应用。探索 AI、RAG、云原生等前沿技术，用代码创造价值。",zt={__name:"HomePage",setup(l){const t=Y(null),h=Y(null),F=Y(!1),S=Y(!1),y=Y(null),K=Y(null),V=Y(null);let A=null,L=null;const N=Ue(()=>[...Xt]),M=Ue(()=>[..."FeiTwnd"]),q=[{icon:"S",name:"Spring Boot",desc:"企业级 Java 后端框架"},{icon:"V",name:"Vue 3",desc:"现代前端渐进式框架"},{icon:"K",name:"Kotlin",desc:"Android 与服务端开发"},{icon:"P",name:"Python",desc:"数据处理与 AI 脚本"},{icon:"M",name:"MySQL",desc:"关系型数据库设计"},{icon:"R",name:"Redis",desc:"高性能缓存与消息队列"},{icon:"C",name:"Cloudflare",desc:"边缘计算与 CDN"},{icon:"W",name:"Playwright",desc:"浏览器自动化与爬虫"}],k=[{icon:"@",label:"Email",href:"mailto:myzovo@qq.com"},{icon:"G",label:"GitHub",href:"https://github.com/myzovo"}];return Dt(()=>{y.value&&(L=yt(),L.init(y.value)),A=new IntersectionObserver(D=>{D.forEach(m=>{m.isIntersecting&&(m.target===t.value&&(F.value=!0),m.target===h.value&&(S.value=!0),A.unobserve(m.target))})},{threshold:.15}),t.value&&A.observe(t.value),h.value&&A.observe(h.value)}),_t(()=>{A&&A.disconnect(),L&&L.destroy()}),(D,m)=>{const C=bt("router-link");return z(),G("div",At,[d("section",Lt,[d("canvas",{ref_key:"fluidCanvas",ref:y,class:"fluid-canvas"},null,512),m[3]||(m[3]=d("div",{class:"hero-vignette"},null,-1)),d("div",Ut,[m[2]||(m[2]=d("p",{class:"hero-eyebrow"},"全栈开发者 / AI 爱好者",-1)),d("h1",{class:"hero-name",ref_key:"heroNameRef",ref:K},[(z(!0),G(oe,null,ne(M.value,(p,E)=>(z(),G("span",{key:E,class:"name-char",style:ae({animationDelay:`${E*.08}s`})},H(p),5))),128))],512),d("p",{class:"hero-bio",ref_key:"heroBioRef",ref:V},[(z(!0),G(oe,null,ne(N.value,(p,E)=>(z(),G("span",{key:E,class:"bio-char",style:ae({animationDelay:`${E*.04}s`})},H(p),5))),128))],512),d("div",wt,[we(C,{class:"btn-primary shimmer-btn",to:"/portfolio"},{default:Fe(()=>[...m[0]||(m[0]=[Oe("查看作品",-1)])]),_:1}),we(C,{class:"btn-secondary",to:"/blog"},{default:Fe(()=>[...m[1]||(m[1]=[Oe("阅读博客",-1)])]),_:1})])]),m[4]||(m[4]=d("div",{class:"scroll-indicator"},[d("div",{class:"arrow arrow-1"}),d("div",{class:"arrow arrow-2"})],-1))]),d("section",{class:"about",ref_key:"aboutRef",ref:t},[d("h2",{class:W(["section-title",{visible:F.value}])},"技术栈",2),d("p",{class:W(["section-subtitle",{visible:F.value}])},"持续学习，持续进化",2),d("div",Ft,[(z(),G(oe,null,ne(q,(p,E)=>d("div",{key:p.name,class:W(["skill-card",{visible:F.value}]),style:ae({transitionDelay:`${E*80}ms`})},[d("div",Ot,H(p.icon),1),d("h3",Bt,H(p.name),1),d("p",Nt,H(p.desc),1)],6)),64))])],512),d("section",{class:"contact",ref_key:"contactRef",ref:h},[d("h2",{class:W(["section-title",{visible:S.value}])},"联系方式",2),d("p",{class:W(["section-subtitle",{visible:S.value}])},"期待与你交流",2),d("div",Pt,[(z(),G(oe,null,ne(k,(p,E)=>d("a",{key:p.label,href:p.href,target:"_blank",rel:"noreferrer",class:W(["contact-item",{visible:S.value}]),style:ae({transitionDelay:`${E*100}ms`})},[d("span",Mt,H(p.icon),1),d("span",Ct,H(p.label),1)],14,It)),64))])],512)])}}},Yt=St(zt,[["__scopeId","data-v-078d1de9"]]);export{Yt as default};

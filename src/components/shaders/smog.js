const G=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const u of i.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&o(u)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerpolicy&&(i.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?i.credentials="include":r.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}};G();function v(){}function R(e){return e()}function L(){return Object.create(null)}function S(e){e.forEach(R)}function I(e){return typeof e=="function"}function W(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function B(e){return Object.keys(e).length===0}function $(e,t,n){e.insertBefore(t,n||null)}function F(e){e.parentNode.removeChild(e)}function D(e){return document.createElement(e)}function x(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function M(e){return Array.from(e.childNodes)}function j(e){const t={};for(const n of e)t[n.name]=n.value;return t}let b;function y(e){b=e}function H(){if(!b)throw new Error("Function called outside component initialization");return b}function U(e){H().$$.on_mount.push(e)}function V(e){H().$$.on_destroy.push(e)}const _=[],C=[],A=[],T=[],z=Promise.resolve();let k=!1;function Y(){k||(k=!0,z.then(h))}function P(e){A.push(e)}const p=new Set;let E=0;function h(){const e=b;do{for(;E<_.length;){const t=_[E];E++,y(t),q(t.$$)}for(y(null),_.length=0,E=0;C.length;)C.pop()();for(let t=0;t<A.length;t+=1){const n=A[t];p.has(n)||(p.add(n),n())}A.length=0}while(_.length);for(;T.length;)T.pop()();k=!1,p.clear(),y(e)}function q(e){if(e.fragment!==null){e.update(),S(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(P)}}const K=new Set;function X(e,t){e&&e.i&&(K.delete(e),e.i(t))}function J(e,t,n,o){const{fragment:r,on_mount:i,on_destroy:u,after_update:f}=e.$$;r&&r.m(t,n),o||P(()=>{const c=i.map(R).filter(I);u?u.push(...c):S(c),e.$$.on_mount=[]}),f.forEach(P)}function Q(e,t){const n=e.$$;n.fragment!==null&&(S(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function Z(e,t){e.$$.dirty[0]===-1&&(_.push(e),Y(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function tt(e,t,n,o,r,i,u,f=[-1]){const c=b;y(e);const s=e.$$={fragment:null,ctx:null,props:i,update:v,not_equal:r,bound:L(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(c?c.$$.context:[])),callbacks:L(),dirty:f,skip_bound:!1,root:t.target||c.$$.root};u&&u(s.root);let g=!1;if(s.ctx=n?n(e,t.props||{},(l,d,...m)=>{const w=m.length?m[0]:d;return s.ctx&&r(s.ctx[l],s.ctx[l]=w)&&(!s.skip_bound&&s.bound[l]&&s.bound[l](w),g&&Z(e,l)),d}):[],s.update(),g=!0,S(s.before_update),s.fragment=o?o(s.ctx):!1,t.target){if(t.hydrate){const l=M(t.target);s.fragment&&s.fragment.l(l),l.forEach(F)}else s.fragment&&s.fragment.c();t.intro&&X(e.$$.fragment),J(e,t.target,t.anchor,t.customElement),h()}y(c)}let N;typeof HTMLElement=="function"&&(N=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const{on_mount:e}=this.$$;this.$$.on_disconnect=e.map(R).filter(I);for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(e,t,n){this[e]=n}disconnectedCallback(){S(this.$$.on_disconnect)}$destroy(){Q(this,1),this.$destroy=v}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const o=n.indexOf(t);o!==-1&&n.splice(o,1)}}$set(e){this.$$set&&!B(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}});function et(e,t,n,o,r){const i=e.getContext("webgl"),u=i.createShader(i.VERTEX_SHADER);i.shaderSource(u,t),i.compileShader(u);const f=i.createShader(i.FRAGMENT_SHADER);i.shaderSource(f,n),i.compileShader(f);const c=i.createProgram();i.attachShader(c,u),i.attachShader(c,f),i.linkProgram(c),i.useProgram(c);const s=i.getAttribLocation(c,"a_PointSize");i.vertexAttrib1f(s,30);const g=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,g);const l=new Float32Array([-1,-1,-1,1,1,1,1,-1,-1,-1]);i.bufferData(i.ARRAY_BUFFER,l,i.STATIC_DRAW);const d=i.getAttribLocation(c,"a_Position");return i.vertexAttribPointer(d,2,i.FLOAT,!1,0,0),i.enableVertexAttribArray(d),i.drawArrays(i.TRIANGLE_STRIP,o,r),{gl:i,glProgram:c}}function nt(e){const{glSrv:t,indicesCount:n,indicesStart:o}=e;!t||!t.gl||t.gl.drawArrays(t.gl.TRIANGLE_STRIP,o,n)}function it(e){const{glSrv:t,indicesCount:n,indicesStart:o}=e;!t||!t.gl||t.gl.drawArrays(t.gl.TRIANGLE_STRIP,o,n)}function O(e,t,n,o){const{glSrv:r,indicesCount:i,indicesStart:u}=e;if(!r||!r.gl)return;const f=r.gl.getUniformLocation(r.glProgram,t);o(r.gl,f,n),r.gl.drawArrays(r.gl.TRIANGLE_STRIP,u,i)}function rt(e,t,n){O(e,t,n,(o,r,i)=>{o.uniform1f(r,i)})}function ot(e,t,n){O(e,t,n,(o,r,i)=>{o.uniform2fv(r,i)})}function st(e){const{glSrv:t}=e;!t||!t.gl||t.gl.deleteProgram(t.glProgram)}function ct(e){let t;return{c(){t=D("canvas"),this.c=v,x(t,"width",e[1]),x(t,"height",e[2])},m(n,o){$(n,t,o),e[8](t)},p(n,[o]){o&2&&x(t,"width",n[1]),o&4&&x(t,"height",n[2])},i:v,o:v,d(n){n&&F(t),e[8](null)}}}function ut(e,t,n){const o=`attribute vec4 a_Position;
void main(){
    gl_Position=a_Position;
}`,r=`
#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives:enable

uniform float u_time;
uniform vec2 u_resolution;

float snow(vec2 uv,float scale)
{
  float _t=u_time*.05;
  uv.x+=_t/scale;
  uv*=scale;
  vec2 s=floor(uv),f=fract(uv),p;
  float k=40.,d;
  p=.5+.35*sin(8.*fract(sin((s+p+scale)*mat2(2,4,7,6))*6.))-f;
  d=length(p);
  k=min(d,k);
  k=smoothstep(0.,k,sin(f.x+f.y)*.009);
  return k;
}

void main(void)
{
  vec2 uv=(gl_FragCoord.xy*.2-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
  float dd=1.-length(uv);
  uv.x+=sin(u_time*.00003); // speed
  uv.y+=sin(uv.x*1.4)*.2;
  float c=snow(uv,90.)*.3;
  c+=snow(uv,25.)*.5;
  c+=snow(uv,15.)*.8;
  c+=snow(uv,10.);
  c+=snow(uv,10.);
  c+=snow(uv,6.);
  c+=snow(uv,5.);
  vec3 finalColor=(vec3(.2,.2,.2))*c*3.5;
  gl_FragColor=vec4(finalColor,c*0.9);
}`;let{width:i="320px"}=t,{height:u="240px"}=t,{indicesCount:f=5}=t,{indicesStart:c=0}=t,{time:s=0}=t,{resolutionWH:g=[320,240]}=t,{canvasEl:l}=t,d={glSrv:null,indicesStart:c,indicesCount:f},m;U(()=>{n(7,d.glSrv=et(l,o,r,c,f),d),m=setInterval(()=>{n(3,s+=.03)},16)}),V(()=>{clearInterval(m),st(d)});function w(a){C[a?"unshift":"push"](()=>{l=a,n(0,l)})}return e.$$set=a=>{"width"in a&&n(1,i=a.width),"height"in a&&n(2,u=a.height),"indicesCount"in a&&n(4,f=a.indicesCount),"indicesStart"in a&&n(5,c=a.indicesStart),"time"in a&&n(3,s=a.time),"resolutionWH"in a&&n(6,g=a.resolutionWH),"canvasEl"in a&&n(0,l=a.canvasEl)},e.$$.update=()=>{e.$$.dirty&144&&f&&nt(d),e.$$.dirty&160&&c&&it(d),e.$$.dirty&136&&s&&rt(d,"u_time",s),e.$$.dirty&192&&g&&ot(d,"u_resolution",g)},[l,i,u,s,f,c,g,d,w]}class at extends N{constructor(t){super(),tt(this,{target:this.shadowRoot,props:j(this.attributes),customElement:!0},ut,ct,W,{width:1,height:2,indicesCount:4,indicesStart:5,time:3,resolutionWH:6,canvasEl:0},null),t&&(t.target&&$(t.target,this,t.anchor),t.props&&(this.$set(t.props),h()))}static get observedAttributes(){return["width","height","indicesCount","indicesStart","time","resolutionWH","canvasEl"]}get width(){return this.$$.ctx[1]}set width(t){this.$$set({width:t}),h()}get height(){return this.$$.ctx[2]}set height(t){this.$$set({height:t}),h()}get indicesCount(){return this.$$.ctx[4]}set indicesCount(t){this.$$set({indicesCount:t}),h()}get indicesStart(){return this.$$.ctx[5]}set indicesStart(t){this.$$set({indicesStart:t}),h()}get time(){return this.$$.ctx[3]}set time(t){this.$$set({time:t}),h()}get resolutionWH(){return this.$$.ctx[6]}set resolutionWH(t){this.$$set({resolutionWH:t}),h()}get canvasEl(){return this.$$.ctx[0]}set canvasEl(t){this.$$set({canvasEl:t}),h()}}customElements.define("my-smog",at);

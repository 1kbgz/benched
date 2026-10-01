var oi=globalThis,ai=oi.ShadowRoot&&(oi.ShadyCSS===void 0||oi.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ps=Symbol(),Ar=new WeakMap,ze=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==ps)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(ai&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=Ar.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Ar.set(e,t))}return t}toString(){return this.cssText}},$r=s=>new ze(typeof s=="string"?s:s+"",void 0,ps),N=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((i,n,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+s[r+1],s[0]);return new ze(e,s,ps)},Rr=(s,t)=>{if(ai)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),n=oi.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=e.cssText,s.appendChild(i)}},gs=ai?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return $r(e)})(s):s;var{is:Rl,defineProperty:Nl,getOwnPropertyDescriptor:Ol,getOwnPropertyNames:Fl,getOwnPropertySymbols:Il,getPrototypeOf:Bl}=Object,li=globalThis,Nr=li.trustedTypes,Vl=Nr?Nr.emptyScript:"",ql=li.reactiveElementPolyfillSupport,Te=(s,t)=>s,Pe={toAttribute(s,t){switch(t){case Boolean:s=s?Vl:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},hi=(s,t)=>!Rl(s,t),Or={attribute:!0,type:String,converter:Pe,reflect:!1,useDefault:!1,hasChanged:hi};Symbol.metadata??=Symbol("metadata"),li.litPropertyMetadata??=new WeakMap;var Ct=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Or){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),n=this.getPropertyDescriptor(t,i,e);n!==void 0&&Nl(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){let{get:n,set:r}=Ol(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:n,set(o){let a=n?.call(this);r?.call(this,o),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Or}static _$Ei(){if(this.hasOwnProperty(Te("elementProperties")))return;let t=Bl(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Te("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Te("properties"))){let e=this.properties,i=[...Fl(e),...Il(e)];for(let n of i)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,n]of e)this.elementProperties.set(i,n)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let n=this._$Eu(e,i);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let n of i)e.unshift(gs(n))}else t!==void 0&&e.push(gs(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Rr(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:Pe).toAttribute(e,i.type);this._$Em=t,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(t,e){let i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let r=i.getPropertyOptions(n),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Pe;this._$Em=n;let a=o.fromAttribute(e,r.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(t,e,i,n=!1,r){if(t!==void 0){let o=this.constructor;if(n===!1&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??hi)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[n,r]of i){let{wrapped:o}=r,a=this[n];o!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,r,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};Ct.elementStyles=[],Ct.shadowRootOptions={mode:"open"},Ct[Te("elementProperties")]=new Map,Ct[Te("finalized")]=new Map,ql?.({ReactiveElement:Ct}),(li.reactiveElementVersions??=[]).push("2.1.2");var bs=globalThis,Fr=s=>s,ci=bs.trustedTypes,Ir=ci?ci.createPolicy("lit-html",{createHTML:s=>s}):void 0,ws="$lit$",St=`lit$${Math.random().toFixed(9).slice(2)}$`,ys="?"+St,Dl=`<${ys}>`,Wt=document,$e=()=>Wt.createComment(""),Re=s=>s===null||typeof s!="object"&&typeof s!="function",xs=Array.isArray,Ur=s=>xs(s)||typeof s?.[Symbol.iterator]=="function",vs=`[ 	
\f\r]`,Ae=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Br=/-->/g,Vr=/>/g,qt=RegExp(`>|${vs}(?:([^\\s"'>=/]+)(${vs}*=${vs}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),qr=/'/g,Dr=/"/g,Hr=/^(?:script|style|textarea|title)$/i,Cs=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),$=Cs(1),jr=Cs(2),Kr=Cs(3),lt=Symbol.for("lit-noChange"),O=Symbol.for("lit-nothing"),Wr=new WeakMap,Dt=Wt.createTreeWalker(Wt,129);function Yr(s,t){if(!xs(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ir!==void 0?Ir.createHTML(t):t}var Qr=(s,t)=>{let e=s.length-1,i=[],n,r=t===2?"<svg>":t===3?"<math>":"",o=Ae;for(let a=0;a<e;a++){let l=s[a],h,c,u=-1,d=0;for(;d<l.length&&(o.lastIndex=d,c=o.exec(l),c!==null);)d=o.lastIndex,o===Ae?c[1]==="!--"?o=Br:c[1]!==void 0?o=Vr:c[2]!==void 0?(Hr.test(c[2])&&(n=RegExp("</"+c[2],"g")),o=qt):c[3]!==void 0&&(o=qt):o===qt?c[0]===">"?(o=n??Ae,u=-1):c[1]===void 0?u=-2:(u=o.lastIndex-c[2].length,h=c[1],o=c[3]===void 0?qt:c[3]==='"'?Dr:qr):o===Dr||o===qr?o=qt:o===Br||o===Vr?o=Ae:(o=qt,n=void 0);let m=o===qt&&s[a+1].startsWith("/>")?" ":"";r+=o===Ae?l+Dl:u>=0?(i.push(h),l.slice(0,u)+ws+l.slice(u)+St+m):l+St+(u===-2?a:m)}return[Yr(s,r+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},Ne=class s{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let r=0,o=0,a=t.length-1,l=this.parts,[h,c]=Qr(t,e);if(this.el=s.createElement(h,i),Dt.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=Dt.nextNode())!==null&&l.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(let u of n.getAttributeNames())if(u.endsWith(ws)){let d=c[o++],m=n.getAttribute(u).split(St),f=/([.?@])?(.*)/.exec(d);l.push({type:1,index:r,name:f[2],strings:m,ctor:f[1]==="."?di:f[1]==="?"?mi:f[1]==="@"?fi:Ht}),n.removeAttribute(u)}else u.startsWith(St)&&(l.push({type:6,index:r}),n.removeAttribute(u));if(Hr.test(n.tagName)){let u=n.textContent.split(St),d=u.length-1;if(d>0){n.textContent=ci?ci.emptyScript:"";for(let m=0;m<d;m++)n.append(u[m],$e()),Dt.nextNode(),l.push({type:2,index:++r});n.append(u[d],$e())}}}else if(n.nodeType===8)if(n.data===ys)l.push({type:2,index:r});else{let u=-1;for(;(u=n.data.indexOf(St,u+1))!==-1;)l.push({type:7,index:r}),u+=St.length-1}r++}}static createElement(t,e){let i=Wt.createElement("template");return i.innerHTML=t,i}};function Ut(s,t,e=s,i){if(t===lt)return t;let n=i!==void 0?e._$Co?.[i]:e._$Cl,r=Re(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(s),n._$AT(s,e,i)),i!==void 0?(e._$Co??=[])[i]=n:e._$Cl=n),n!==void 0&&(t=Ut(s,n._$AS(s,t.values),n,i)),t}var ui=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??Wt).importNode(e,!0);Dt.currentNode=n;let r=Dt.nextNode(),o=0,a=0,l=i[0];for(;l!==void 0;){if(o===l.index){let h;l.type===2?h=new oe(r,r.nextSibling,this,t):l.type===1?h=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(h=new pi(r,this,t)),this._$AV.push(h),l=i[++a]}o!==l?.index&&(r=Dt.nextNode(),o++)}return Dt.currentNode=Wt,n}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},oe=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=O,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Ut(this,t,e),Re(t)?t===O||t==null||t===""?(this._$AH!==O&&this._$AR(),this._$AH=O):t!==this._$AH&&t!==lt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ur(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==O&&Re(this._$AH)?this._$AA.nextSibling.data=t:this.T(Wt.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Ne.createElement(Yr(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{let r=new ui(n,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=Wr.get(t.strings);return e===void 0&&Wr.set(t.strings,e=new Ne(t)),e}k(t){xs(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,n=0;for(let r of t)n===e.length?e.push(i=new s(this.O($e()),this.O($e()),this,this.options)):i=e[n],i._$AI(r),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=Fr(t).nextSibling;Fr(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ht=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,r){this.type=1,this._$AH=O,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=O}_$AI(t,e=this,i,n){let r=this.strings,o=!1;if(r===void 0)t=Ut(this,t,e,0),o=!Re(t)||t!==this._$AH&&t!==lt,o&&(this._$AH=t);else{let a=t,l,h;for(t=r[0],l=0;l<r.length-1;l++)h=Ut(this,a[i+l],e,l),h===lt&&(h=this._$AH[l]),o||=!Re(h)||h!==this._$AH[l],h===O?t=O:t!==O&&(t+=(h??"")+r[l+1]),this._$AH[l]=h}o&&!n&&this.j(t)}j(t){t===O?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},di=class extends Ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===O?void 0:t}},mi=class extends Ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==O)}},fi=class extends Ht{constructor(t,e,i,n,r){super(t,e,i,n,r),this.type=5}_$AI(t,e=this){if((t=Ut(this,t,e,0)??O)===lt)return;let i=this._$AH,n=t===O&&i!==O||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==O&&(i===O||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},pi=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Ut(this,t)}},Gr={M:ws,P:St,A:ys,C:1,L:Qr,R:ui,D:Ur,V:Ut,I:oe,H:Ht,N:mi,U:fi,B:di,F:pi},Wl=bs.litHtmlPolyfillSupport;Wl?.(Ne,oe),(bs.litHtmlVersions??=[]).push("3.3.3");var Xr=(s,t,e)=>{let i=e?.renderBefore??t,n=i._$litPart$;if(n===void 0){let r=e?.renderBefore??null;i._$litPart$=n=new oe(t.insertBefore($e(),r),r,void 0,e??{})}return n._$AI(s),n};var Ss=globalThis,Pt=class extends Ct{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Xr(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return lt}};Pt._$litElement$=!0,Pt.finalized=!0,Ss.litElementHydrateSupport?.({LitElement:Pt});var Ul=Ss.litElementPolyfillSupport;Ul?.({LitElement:Pt});(Ss.litElementVersions??=[]).push("4.2.2");var Jr=N`
  :host {
    display: flex;
    position: relative;
    align-items: stretch;
    border-radius: var(--wa-panel-border-radius);
    background-color: var(--wa-color-fill-quiet, var(--wa-color-brand-fill-quiet));
    border-color: var(--wa-color-border-quiet, var(--wa-color-brand-border-quiet));
    border-style: var(--wa-panel-border-style);
    border-width: var(--wa-panel-border-width);
    color: var(--wa-color-text-normal);
    padding: 1em;
  }

  /* Appearance modifiers */
  :host([appearance~='plain']) {
    background-color: transparent;
    border-color: transparent;
  }

  :host([appearance~='outlined']) {
    background-color: transparent;
    border-color: var(--wa-color-border-loud, var(--wa-color-brand-border-loud));
  }

  :host([appearance~='filled']) {
    background-color: var(--wa-color-fill-quiet, var(--wa-color-brand-fill-quiet));
    border-color: transparent;
  }

  :host([appearance~='filled-outlined']) {
    border-color: var(--wa-color-border-quiet, var(--wa-color-brand-border-quiet));
  }

  :host([appearance~='accent']) {
    color: var(--wa-color-on-loud, var(--wa-color-brand-on-loud));
    background-color: var(--wa-color-fill-loud, var(--wa-color-brand-fill-loud));
    border-color: transparent;

    [part~='icon'] {
      color: currentColor;
    }
  }

  [part~='icon'] {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    color: var(--wa-color-on-quiet);
    font-size: 1.25em;
  }

  ::slotted([slot='icon']) {
    margin-inline-end: var(--wa-form-control-padding-inline);
  }

  [part~='message'] {
    flex: 1 1 auto;
    display: block;
    overflow: hidden;
  }
`;var Zr={small:"s",medium:"m",large:"l"},to=new Set;function At(s,t){t in Zr&&!to.has(`${s}:${t}`)&&(to.add(`${s}:${t}`),console.warn(`[${s}] size="${t}" is deprecated. Use size="${Zr[t]}" instead. The long-form value will be removed in the next major version.`))}var pt=N`
  :host([size='xs']) {
    font-size: var(--wa-font-size-xs);
  }

  :host([size='s']),
  :host([size='small']) {
    font-size: var(--wa-font-size-s);
  }

  :host([size='m']),
  :host([size='medium']) {
    font-size: var(--wa-font-size-m);
  }

  :host([size='l']),
  :host([size='large']) {
    font-size: var(--wa-font-size-l);
  }

  :host([size='xl']) {
    font-size: var(--wa-font-size-xl);
  }
`;var ae=N`
  :where(:root),
  .wa-neutral,
  :host([variant='neutral']) {
    --wa-color-fill-loud: var(--wa-color-neutral-fill-loud);
    --wa-color-fill-normal: var(--wa-color-neutral-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-neutral-fill-quiet);
    --wa-color-border-loud: var(--wa-color-neutral-border-loud);
    --wa-color-border-normal: var(--wa-color-neutral-border-normal);
    --wa-color-border-quiet: var(--wa-color-neutral-border-quiet);
    --wa-color-on-loud: var(--wa-color-neutral-on-loud);
    --wa-color-on-normal: var(--wa-color-neutral-on-normal);
    --wa-color-on-quiet: var(--wa-color-neutral-on-quiet);
  }

  .wa-brand,
  :host([variant='brand']) {
    --wa-color-fill-loud: var(--wa-color-brand-fill-loud);
    --wa-color-fill-normal: var(--wa-color-brand-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-brand-fill-quiet);
    --wa-color-border-loud: var(--wa-color-brand-border-loud);
    --wa-color-border-normal: var(--wa-color-brand-border-normal);
    --wa-color-border-quiet: var(--wa-color-brand-border-quiet);
    --wa-color-on-loud: var(--wa-color-brand-on-loud);
    --wa-color-on-normal: var(--wa-color-brand-on-normal);
    --wa-color-on-quiet: var(--wa-color-brand-on-quiet);
  }

  .wa-success,
  :host([variant='success']) {
    --wa-color-fill-loud: var(--wa-color-success-fill-loud);
    --wa-color-fill-normal: var(--wa-color-success-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-success-fill-quiet);
    --wa-color-border-loud: var(--wa-color-success-border-loud);
    --wa-color-border-normal: var(--wa-color-success-border-normal);
    --wa-color-border-quiet: var(--wa-color-success-border-quiet);
    --wa-color-on-loud: var(--wa-color-success-on-loud);
    --wa-color-on-normal: var(--wa-color-success-on-normal);
    --wa-color-on-quiet: var(--wa-color-success-on-quiet);
  }

  .wa-warning,
  :host([variant='warning']) {
    --wa-color-fill-loud: var(--wa-color-warning-fill-loud);
    --wa-color-fill-normal: var(--wa-color-warning-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-warning-fill-quiet);
    --wa-color-border-loud: var(--wa-color-warning-border-loud);
    --wa-color-border-normal: var(--wa-color-warning-border-normal);
    --wa-color-border-quiet: var(--wa-color-warning-border-quiet);
    --wa-color-on-loud: var(--wa-color-warning-on-loud);
    --wa-color-on-normal: var(--wa-color-warning-on-normal);
    --wa-color-on-quiet: var(--wa-color-warning-on-quiet);
  }

  .wa-danger,
  :host([variant='danger']) {
    --wa-color-fill-loud: var(--wa-color-danger-fill-loud);
    --wa-color-fill-normal: var(--wa-color-danger-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-danger-fill-quiet);
    --wa-color-border-loud: var(--wa-color-danger-border-loud);
    --wa-color-border-normal: var(--wa-color-danger-border-normal);
    --wa-color-border-quiet: var(--wa-color-danger-border-quiet);
    --wa-color-on-loud: var(--wa-color-danger-on-loud);
    --wa-color-on-normal: var(--wa-color-danger-on-normal);
    --wa-color-on-quiet: var(--wa-color-danger-on-quiet);
  }
`;function K(s,t){let e={waitUntilFirstUpdate:!1,...t};return(i,n)=>{let{update:r}=i,o=Array.isArray(s)?s:[s];i.update=function(a){o.forEach(l=>{let h=l;if(a.has(h)){let c=a.get(h),u=this[h];c!==u&&(!e.waitUntilFirstUpdate||this.hasUpdated)&&this[n](c,u)}}),r.call(this,a)}}}var Hl=Object.defineProperty,jl=Object.getOwnPropertyDescriptor,eo=s=>{throw TypeError(s)},g=(s,t,e,i)=>{for(var n=i>1?void 0:i?jl(t,e):t,r=s.length-1,o;r>=0;r--)(o=s[r])&&(n=(i?o(t,e,n):o(n))||n);return i&&n&&Hl(t,e,n),n},io=(s,t,e)=>t.has(s)||eo("Cannot "+e),so=(s,t,e)=>(io(s,t,"read from private field"),e?e.call(s):t.get(s)),no=(s,t,e)=>t.has(s)?eo("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(s):t.set(s,e),ro=(s,t,e,i)=>(io(s,t,"write to private field"),i?i.call(s,e):t.set(s,e),e);var U=s=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(s,t)}):customElements.define(s,t)};var Kl={attribute:!0,type:String,converter:Pe,reflect:!1,hasChanged:hi},Yl=(s=Kl,t,e)=>{let{kind:i,metadata:n}=e,r=globalThis.litPropertyMetadata.get(n);if(r===void 0&&globalThis.litPropertyMetadata.set(n,r=new Map),i==="setter"&&((s=Object.create(s)).wrapped=!0),r.set(e.name,s),i==="accessor"){let{name:o}=e;return{set(a){let l=t.get.call(this);t.set.call(this,a),this.requestUpdate(o,l,s,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,s,a),a}}}if(i==="setter"){let{name:o}=e;return function(a){let l=this[o];t.call(this,a),this.requestUpdate(o,l,s,!0,a)}}throw Error("Unsupported decorator location: "+i)};function w(s){return(t,e)=>typeof e=="object"?Yl(s,t,e):((i,n,r)=>{let o=n.hasOwnProperty(r);return n.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(n,r):void 0})(s,t,e)}function ht(s){return w({...s,state:!0,attribute:!1})}var jt=(s,t,e)=>(e.configurable=!0,e.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(s,t,e),e);function J(s,t){return(e,i,n)=>{let r=o=>o.renderRoot?.querySelector(s)??null;if(t){let{get:o,set:a}=typeof i=="object"?e:n??(()=>{let l=Symbol();return{get(){return this[l]},set(h){this[l]=h}}})();return jt(e,i,{get(){let l=o.call(this);return l===void 0&&(l=r(this),(l!==null||this.hasUpdated)&&a.call(this,l)),l}})}return jt(e,i,{get(){return r(this)}})}}var Ql=N`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden],
  :host([hidden]) {
    display: none !important;
  }
`,Gl=/;\s+$/;function Xl(s){return s.replace(/[A-Z]/g,t=>`-${t.toLowerCase()}`)}function oo(s){let{property:t,value:e,element:i}=s;if(e){let n=i.getAttribute("style")||"";n&&(n.match(Gl)||(n+=";"),n+=" ");let r=`${t}: ${e}`;return n.includes(r)?void 0:`${n}${r};`}return null}var gi,D=class extends Pt{constructor(){super(),no(this,gi,!1),this.initialReflectedProperties=new Map,this.didSSR=!!this.shadowRoot,this.customStates={set:(t,e)=>{if(this.internals?.states)try{e?this.internals.states.add(t):this.internals.states.delete(t)}catch(i){if(String(i).includes("must start with '--'"))console.error("Your browser implements an outdated version of CustomStateSet. Consider using a polyfill");else throw i}},has:t=>{if(!this.internals?.states)return!1;try{return this.internals.states.has(t)}catch{return!1}}};try{this.internals=this.attachInternals()}catch{console.error("Element internals are not supported in your browser. Consider using a polyfill")}this.customStates.set("wa-defined",!0);let s=this.constructor;for(let[t,e]of s.elementProperties)e.default==="inherit"&&e.initial!==void 0&&typeof t=="string"&&this.customStates.set(`initial-${t}-${e.initial}`,!0)}static get styles(){let s=Array.isArray(this.css)?this.css:this.css?[this.css]:[];return[Ql,...s]}connectedCallback(){super.connectedCallback(),this.didSSR||this.shadowRoot?.prepend(document.createComment(` Web Awesome: https://webawesome.com/docs/components/${this.localName.replace("wa-","")} `)),this.didSSR&&this.updateComplete.then(()=>{this.shadowRoot?.prepend(document.createComment(` Web Awesome: https://webawesome.com/docs/components/${this.localName.replace("wa-","")} `))})}attributeChangedCallback(s,t,e){so(this,gi)||(this.constructor.elementProperties.forEach((i,n)=>{i.reflect&&this[n]!=null&&this.initialReflectedProperties.set(n,this[n])}),ro(this,gi,!0)),super.attributeChangedCallback(s,t,e)}willUpdate(s){super.willUpdate(s),this.initialReflectedProperties.forEach((t,e)=>{s.has(e)&&this[e]==null&&(this[e]=t)})}firstUpdated(s){super.firstUpdated(s),this.didSSR&&this.shadowRoot?.querySelectorAll("slot").forEach(t=>{t.dispatchEvent(new Event("slotchange",{bubbles:!0,composed:!1,cancelable:!1}))})}update(s){try{super.update(s)}catch(t){if(this.didSSR&&!this.hasUpdated){let e=new Event("lit-hydration-error",{bubbles:!0,composed:!0,cancelable:!1});e.error=t,this.dispatchEvent(e)}throw t}}setStyle(s,t){if(!this.style){let e=oo({property:Xl(s),value:t,element:this});e&&this.setAttribute("style",e);return}this.style[s]=t}setStyleProperty(s,t){if(!this.style){let e=oo({property:s,value:t,element:this});e&&this.setAttribute("style",e);return}this.style.setProperty(s,t)}relayNativeEvent(s,t){s.stopImmediatePropagation(),this.dispatchEvent(new s.constructor(s.type,{...s,...t}))}};gi=new WeakMap;g([w()],D.prototype,"dir",2);g([w()],D.prototype,"lang",2);g([w({type:Boolean,reflect:!0,attribute:"did-ssr"})],D.prototype,"didSSR",2);var Rt=class extends D{constructor(){super(...arguments),this.variant="brand",this.size="m"}handleSizeChange(){At(this.localName,this.size)}render(){return $`
      <div part="icon">
        <slot name="icon"></slot>
      </div>

      <div part="message">
        <slot></slot>
      </div>
    `}};Rt.css=[Jr,ae,pt];g([w({reflect:!0})],Rt.prototype,"variant",2);g([w({reflect:!0})],Rt.prototype,"appearance",2);g([w({reflect:!0})],Rt.prototype,"size",2);g([K("size")],Rt.prototype,"handleSizeChange",1);Rt=g([U("wa-callout")],Rt);var ao=()=>({checkValidity(s){let t=s.input,e={message:"",isValid:!0,invalidKeys:[]};if(!t)return e;let i=!0;if("checkValidity"in t&&(i=t.checkValidity()),i)return e;if(e.isValid=!1,"validationMessage"in t&&(e.message=t.validationMessage),!("validity"in t))return e.invalidKeys.push("customError"),e;for(let n in t.validity){if(n==="valid")continue;let r=n;t.validity[r]&&e.invalidKeys.push(r)}return e}});var vi=class extends Event{constructor(){super("wa-invalid",{bubbles:!0,cancelable:!1,composed:!0})}};var Jl=()=>({observedAttributes:["custom-error"],checkValidity(s){let t={message:"",isValid:!0,invalidKeys:[]};return s.customError&&(t.message=s.customError,t.isValid=!1,t.invalidKeys=["customError"]),t}}),rt=class extends D{constructor(){super(),this.name=null,this.disabled=!1,this.required=!1,this.assumeInteractionOn=["input"],this.validators=[],this.valueHasChanged=!1,this.hasInteracted=!1,this.customError=null,this.emittedEvents=[],this.emitInvalid=s=>{s.target===this&&(this.hasInteracted=!0,this.dispatchEvent(new vi))},this.handleInteraction=s=>{let t=this.emittedEvents;t.includes(s.type)||t.push(s.type),t.length===this.assumeInteractionOn?.length&&(this.hasInteracted=!0)},"addEventListener"in this&&this.addEventListener("invalid",this.emitInvalid)}static get validators(){return[Jl()]}static get observedAttributes(){let s=new Set(super.observedAttributes||[]);for(let t of this.validators)if(t.observedAttributes)for(let e of t.observedAttributes)s.add(e);return[...s]}connectedCallback(){super.connectedCallback(),this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>{this.updateValidity()}):this.updateValidity(),this.assumeInteractionOn.forEach(s=>{this.addEventListener?.(s,this.handleInteraction)})}firstUpdated(...s){super.firstUpdated(...s),this.updateValidity()}willUpdate(s){if(!!1&&s.has("customError")&&(this.customError||(this.customError=null),this.setCustomValidity(this.customError||"")),s.has("value")||s.has("disabled")||s.has("defaultValue")){let t=this.value;this.updateFormValue(t)}s.has("disabled")&&(this.customStates.set("disabled",this.disabled),(this.hasAttribute("disabled")||!!1&&!this.matches(":disabled"))&&this.toggleAttribute("disabled",this.disabled)),super.willUpdate(s),this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>this.updateValidity()):this.updateValidity()}updateFormValue(s){if(Array.isArray(s)){if(this.name){let t=new FormData;for(let e of s)t.append(this.name,e);this.setValue(t,t)}}else this.setValue(s,s)}get labels(){return this.internals.labels}getForm(){return this.internals.form}set form(s){s?this.setAttribute("form",s):this.removeAttribute("form")}get form(){return this.internals.form}get validity(){return this.internals.validity}get willValidate(){return this.internals.willValidate}get validationMessage(){return this.internals.validationMessage}checkValidity(){return this.updateValidity(),this.internals.checkValidity()}reportValidity(){return this.updateValidity(),this.hasInteracted=!0,this.internals.reportValidity()}get validationTarget(){return this.input||void 0}setValidity(...s){let t=s[0],e=s[1],i=s[2];i||(i=this.validationTarget),this.internals.setValidity(t,e,i||void 0),this.requestUpdate("validity"),this.setCustomStates()}setCustomStates(){let s=!!this.required,t=this.internals.validity.valid,e=this.hasInteracted;this.customStates.set("required",s),this.customStates.set("optional",!s),this.customStates.set("invalid",!t),this.customStates.set("valid",t),this.customStates.set("user-invalid",!t&&e),this.customStates.set("user-valid",t&&e)}setCustomValidity(s){if(!s){this.customError=null,this.setValidity({});return}this.customError=s,this.setValidity({customError:!0},s,this.validationTarget)}formResetCallback(){this.resetValidity(),this.hasInteracted=!1,this.valueHasChanged=!1,this.emittedEvents=[],this.updateValidity()}formDisabledCallback(s){this.disabled=s,this.updateValidity()}formStateRestoreCallback(s,t){this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>{this.value=s,t==="restore"&&this.resetValidity(),this.updateValidity()}):(this.value=s,t==="restore"&&this.resetValidity(),this.updateValidity())}setValue(...s){let[t,e]=s;this.internals.setFormValue(t,e)}get allValidators(){let s=this.constructor.validators||[],t=this.validators||[];return[...s,...t]}resetValidity(){this.setCustomValidity(""),this.setValidity({})}updateValidity(){if(this.disabled||this.hasAttribute("disabled")||!this.willValidate){this.resetValidity();return}let s=this.allValidators;if(!s?.length)return;let t={customError:!!this.customError},e=this.validationTarget||this.input||void 0,i="";for(let n of s){let{isValid:r,message:o,invalidKeys:a}=n.checkValidity(this);r||(i||(i=o),a?.length>=0&&a.forEach(l=>t[l]=!0))}i||(i=this.validationMessage),this.setValidity(t,i,e)}};rt.formAssociated=!0;g([w({reflect:!0})],rt.prototype,"name",2);g([w({type:Boolean})],rt.prototype,"disabled",2);g([w({state:!0,attribute:!1})],rt.prototype,"valueHasChanged",2);g([w({state:!0,attribute:!1})],rt.prototype,"hasInteracted",2);g([w({attribute:"custom-error",reflect:!0})],rt.prototype,"customError",2);g([w({attribute:!1,state:!0,type:Object})],rt.prototype,"validity",1);var le=class{constructor(s,...t){this.slotNames=[],this.handleSlotChange=e=>{let i=e.target;(this.slotNames.includes("[default]")&&!i.name||i.name&&this.slotNames.includes(i.name))&&this.host.requestUpdate()},(this.host=s).addController(this),this.slotNames=t}hasDefaultSlot(){return this.host.childNodes?[...this.host.childNodes].some(s=>{if(s.nodeType===Node.TEXT_NODE&&s.textContent.trim()!=="")return!0;if(s.nodeType===Node.ELEMENT_NODE){let t=s;if(t.tagName.toLowerCase()==="wa-visually-hidden")return!1;if(!t.hasAttribute("slot"))return!0}return!1}):!1}hasNamedSlot(s){return this.host.querySelector?.(`:scope > [slot="${s}"]`)!==null}test(s,t){return t&&this.host.didSSR&&!this.host.hasUpdated?!!this.host[t]:s==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(s)}hostConnected(){let s=this.host.shadowRoot;s&&"addEventListener"in s&&s.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){let s=this.host.shadowRoot;s&&"removeEventListener"in s&&s.removeEventListener("slotchange",this.handleSlotChange)}};var lo=N`
  @layer wa-component {
    :host {
      display: inline-block;

      /* Workaround because Chrome doesn't like :host(:has()) below
       * https://issues.chromium.org/issues/40062355
       * Firefox doesn't like this nested rule, so both are needed */
      &:has(wa-badge) {
        position: relative;
      }
    }

    /* Apply relative positioning only when needed to position wa-badge
     * This avoids creating a new stacking context for every button */
    :host(:has(wa-badge)) {
      position: relative;
    }
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    transition-property: background, border, box-shadow, color, opacity, transform;
    transition-duration: var(--wa-transition-fast);
    transition-timing-function: var(--wa-transition-easing);
    transform-origin: center;
    cursor: pointer;
    padding: 0 var(--wa-form-control-padding-inline);
    font-family: inherit;
    font-size: inherit;
    font-weight: var(--wa-font-weight-action);
    height: var(--wa-form-control-height);
    width: 100%;

    background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));

    border-color: transparent;
    color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
    border-start-start-radius: var(--_button-start-start-radius, var(--wa-form-control-border-radius));
    border-start-end-radius: var(--_button-start-end-radius, var(--wa-form-control-border-radius));
    border-end-start-radius: var(--_button-end-start-radius, var(--wa-form-control-border-radius));
    border-end-end-radius: var(--_button-end-end-radius, var(--wa-form-control-border-radius));
    border-style: var(--wa-form-control-border-style);
    border-width: var(--wa-form-control-border-width);
  }

  /* Hover and active transforms */
  .button:not(.disabled):not(.loading) {
    @media (hover: hover) {
      &:hover {
        transform: var(--wa-button-transform-hover);
      }
    }
    &:active {
      transform: var(--wa-button-transform-active);
    }

    @media (prefers-reduced-motion: reduce) {
      &:hover,
      &:active {
        transform: none;
      }
    }
  }

  /* Appearance modifiers */
  :host([appearance='plain']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
        background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='outlined']) {
    /* Indentation overrides for grouping outlined */
    margin-inline-start: var(--_button-horizontal-indent-outlined);
    margin-block-start: var(--_button-vertical-indent-outlined);

    .button {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: var(--wa-color-border-loud, var(--wa-color-neutral-border-loud));
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
        background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='filled']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='filled-outlined']) {
    /* Indentation overrides for grouping outlined */
    margin-inline-start: var(--_button-horizontal-indent-outlined);
    margin-block-start: var(--_button-vertical-indent-outlined);

    .button {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));
      border-color: var(--wa-color-border-normal, var(--wa-color-neutral-border-normal));
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='accent']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
      background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud)),
        var(--wa-color-mix-active)
      );
    }
  }

  /* Focus states */
  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Disabled state */
  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;

    /* When disabled, prevent mouse events from bubbling up from children */
    .button {
      pointer-events: none;
    }
  }

  /* Keep it last so Safari doesn't stop parsing this block */
  .button::-moz-focus-inner {
    border: 0;
  }

  /* Icon buttons */
  .button.is-icon-button {
    outline-offset: 2px;
    width: var(--wa-form-control-height);
    aspect-ratio: 1;
  }

  /* Icon buttons with a caret need to grow to fit both the icon and the caret */
  .button.is-icon-button.caret {
    width: auto;
    aspect-ratio: auto;
    min-width: var(--wa-form-control-height);
  }

  /* Pill modifier */
  :host([pill]) .button {
    border-start-start-radius: var(--_button-start-start-radius, var(--wa-border-radius-pill));
    border-start-end-radius: var(--_button-start-end-radius, var(--wa-border-radius-pill));
    border-end-start-radius: var(--_button-end-start-radius, var(--wa-border-radius-pill));
    border-end-end-radius: var(--_button-end-end-radius, var(--wa-border-radius-pill));
  }

  /*
   * Label
   */

  .start,
  .end {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .label {
    display: inline-block;
  }

  .is-icon-button .label {
    display: flex;
    justify-content: center;
  }

  .label::slotted(wa-icon) {
    align-self: center;
  }

  /*
   * Caret modifier
   */

  wa-icon[part='caret'] {
    display: flex;
    align-self: center;
    align-items: center;

    &::part(svg) {
      width: 0.875em;
      height: 0.875em;
    }

    .button:has(&) .end {
      display: none;
    }
  }

  /*
   * Loading modifier
   */

  .loading {
    position: relative;
    cursor: wait;

    .start,
    .label,
    .end,
    .caret {
      /* Hidden with opacity, not visibility, so the label stays in the accessibility tree */
      opacity: 0;

      /* Unlike visibility: hidden, opacity leaves the content clickable */
      pointer-events: none;
    }

    wa-spinner {
      --indicator-color: currentColor;
      --track-color: color-mix(in oklab, currentColor, transparent 90%);

      position: absolute;
      font-size: 1em;
      height: 1em;
      width: 1em;
      top: calc(50% - 0.5em);
      left: calc(50% - 0.5em);
    }
  }

  /*
   * Badges
   */

  .button ::slotted(wa-badge) {
    border-color: var(--wa-color-surface-default);
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  :host(:dir(rtl)) ::slotted(wa-badge) {
    translate: -50% -50%;
  }

  /*
  * Button spacing
  */

  slot[name='start']::slotted(*) {
    margin-inline-end: 0.75em;
  }

  slot[name='end']::slotted(*),
  .button:not(.visually-hidden-label) [part='caret'] {
    margin-inline-start: 0.75em;
  }
`;var Ms=new Set,he=new Map,Mt,_s="ltr",Ls="en",ho=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(ho){let s=new MutationObserver(co);_s=document.documentElement.dir||"ltr",Ls=document.documentElement.lang||navigator.language,s.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function Oe(...s){s.map(t=>{let e=t.$code.toLowerCase();he.has(e)?he.set(e,Object.assign(Object.assign({},he.get(e)),t)):he.set(e,t),Mt||(Mt=t)}),co()}function co(){ho&&(_s=document.documentElement.dir||"ltr",Ls=document.documentElement.lang||navigator.language),[...Ms.keys()].map(s=>{typeof s.requestUpdate=="function"&&s.requestUpdate()})}var bi=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){Ms.add(this.host)}hostDisconnected(){Ms.delete(this.host)}dir(){return`${this.host.dir||_s}`.toLowerCase()}lang(){let t=`${this.host.lang||Ls}`.toLowerCase().replace(/_/g,"-");try{return new Intl.Locale(t),t}catch{return Mt?Mt.$code.toLowerCase():"en"}}getTranslationData(t){var e,i;let n;try{n=new Intl.Locale(t.replace(/_/g,"-"))}catch{return{locale:void 0,language:"",region:"",primary:void 0,secondary:void 0}}let r=n.language.toLowerCase(),o=(i=(e=n.region)===null||e===void 0?void 0:e.toLowerCase())!==null&&i!==void 0?i:"",a=he.get(`${r}-${o}`),l=he.get(r);return{locale:n,language:r,region:o,primary:a,secondary:l}}exists(t,e){var i;let{primary:n,secondary:r}=this.getTranslationData((i=e.lang)!==null&&i!==void 0?i:this.lang());return e=Object.assign({includeFallback:!1},e),!!(n&&n[t]||r&&r[t]||e.includeFallback&&Mt&&Mt[t])}term(t,...e){let{primary:i,secondary:n}=this.getTranslationData(this.lang()),r;if(i&&i[t])r=i[t];else if(n&&n[t])r=n[t];else if(Mt&&Mt[t])r=Mt[t];else return console.error(`No translation found for: ${String(t)}`),String(t);return typeof r=="function"?r(...e):r}date(t,e){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),e).format(t)}number(t,e){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),e).format(t)}relativeTime(t,e,i){return new Intl.RelativeTimeFormat(this.lang(),i).format(t,e)}};var uo={$code:"en",$name:"English",$dir:"ltr",am:"AM",autosizeColumn:"Autosize column",captions:"Captions",carousel:"Carousel",chooseDate:"Choose date",chooseDecade:"Choose decade",chooseMonth:"Choose month",chooseTime:"Choose time",chooseYear:"Choose year",clearEntry:"Clear entry",clearFilter:"Clear filter",clearSort:"Clear sort",close:"Close",closeCalendar:"Close calendar",closeTimeInput:"Close time picker",collapseRow:"Collapse row",columnMenu:"Column options",columnMovedToPosition:(s,t,e)=>`${s} moved to position ${t} of ${e}`,columns:"Columns",compactPageXOfY:(s,t)=>`${s} of ${t}`,copied:"Copied",copy:"Copy",createOption:s=>`Create "${s}"`,currentlyPlaying:"currently playing",currentValue:"Current value",date:"Date",datePickerKeyboardHelp:"Use arrow keys to change values; press Alt+Down Arrow to open the calendar.",day:"Day",dayPeriod:"AM/PM",decrement:"Decrement",deselectAllRows:"Deselect all rows",dropFileHere:"Drop file here or click to browse",dropFilesHere:"Drop files here or click to browse",empty:"Empty",endDate:"End date",enterFullscreen:"Enter fullscreen",error:"Error",exitFullscreen:"Exit fullscreen",expandRow:"Expand row",filterByColumn:s=>`Filter by ${s}`,filterFrom:"From",filterMax:"Max",filterMin:"Min",filterTo:"To",firstPage:"First page",goToSlide:(s,t)=>`Go to slide ${s} of ${t}`,hideColumn:"Hide column",hidePassword:"Hide password",hour:"Hour",incompleteDate:"Enter a valid date.",increment:"Increment",jumpBackwardX:s=>`Jump back ${s} pages`,jumpForwardX:s=>`Jump forward ${s} pages`,lastPage:"Last page",loading:"Loading",minute:"Minute",month:"Month",moreOptions:"More Options",mute:"Mute",nextDecade:"Next decade",nextMonth:"Next month",nextPage:"Next page",nextSlide:"Next slide",nextVideo:"Next Video",nextYear:"Next year",noData:"No data",noResults:"No matching results",now:"Now",numCharacters:s=>s===1?"1 character":`${s} characters`,numCharactersRemaining:s=>s===1?"1 character remaining":`${s} characters remaining`,numOptionsSelected:s=>s===0?"No options selected":s===1?"1 option selected":`${s} options selected`,numRowsCopied:s=>s===1?"1 row copied":`${s} rows copied`,numRowsSelected:s=>s===1?"1 row selected":`${s} rows selected`,pageXOfY:(s,t)=>`Page ${s} of ${t}`,pagination:"Pagination",pause:"Pause",pauseAnimation:"Pause animation",pictureInPicture:"Picture in picture",pinLeft:"Pin left",pinRight:"Pin right",play:"Play",playAnimation:"Play animation",playbackSpeed:"Playback speed",playlist:"Playlist",pm:"PM",previousDecade:"Previous decade",previousMonth:"Previous month",previousPage:"Previous page",previousSlide:"Previous slide",previousVideo:"Previous video",previousYear:"Previous year",progress:"Progress",rangeTooLong:s=>s===1?"Select a range no longer than 1 day":`Select a range no longer than ${s} days`,rangeTooShort:s=>s===1?"Select a range at least 1 day long":`Select a range at least ${s} days long`,readonly:"Read-only",remove:"Remove",resetColumns:"Reset columns",resize:"Resize",resizeColumn:"Resize column",rowsPerPage:"Rows per page",scrollableRegion:"Scrollable region",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",search:"Search",second:"Second",seek:"Seek",seekProgress:(s,t)=>`${s} of ${t}`,selectAColorFromTheScreen:"Select a color from the screen",selectAllRows:"Select all rows",selected:"Selected",selectedDateLabel:s=>`Selected: ${s}`,selectedRangeLabel:s=>`Selected range: ${s}`,selectGroup:"Select group",selectionCleared:"Selection cleared",selectRow:"Select row",showingNofMRows:(s,t)=>`Showing ${s} of ${t} rows`,showingXtoYofZ:(s,t,e)=>`${s}\u2013${t} of ${e}`,showPassword:"Show password",slideNum:s=>`Slide ${s}`,sortAscending:"Sort ascending",sortColumn:"Sort column",sortDescending:"Sort descending",startDate:"Start date",time:"Time",timeInputKeyboardHelp:"Use arrow keys to change values; press Alt+Down Arrow to open the time picker.",today:"Today",toggleColorFormat:"Toggle color format",unmute:"Unmute",unpin:"Unpin",unpinColumn:"Unpin column",videoPlayer:"Video player",volume:"Volume",year:"Year",zoomIn:"Zoom in",zoomOut:"Zoom out"};Oe(uo);var mo=uo;var ot=class extends bi{lang(){return this.host.didSSR&&!this.host.hasUpdated?this.host.lang||"en":super.lang()}};Oe(mo);var wi={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},yi=s=>(...t)=>({_$litDirective$:s,values:t}),ce=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var et=yi(class extends ce{constructor(s){if(super(s),s.type!==wi.ATTRIBUTE||s.name!=="class"||s.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(s){return" "+Object.keys(s).filter(t=>s[t]).join(" ")+" "}update(s,[t]){if(this.st===void 0){this.st=new Set,s.strings!==void 0&&(this.nt=new Set(s.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(let i in t)t[i]&&!this.nt?.has(i)&&this.st.add(i);return this.render(t)}let e=s.element.classList;for(let i of this.st)i in t||(e.remove(i),this.st.delete(i));for(let i in t){let n=!!t[i];n===this.st.has(i)||this.nt?.has(i)||(n?(e.add(i),this.st.add(i)):(e.remove(i),this.st.delete(i)))}return lt}});var ct=s=>s??O;var po=Symbol.for(""),Zl=s=>{if(s?.r===po)return s?._$litStatic$};var Es=(s,...t)=>({_$litStatic$:t.reduce((e,i,n)=>e+(r=>{if(r._$litStatic$!==void 0)return r._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${r}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(i)+s[n+1],s[0]),r:po}),fo=new Map,ks=s=>(t,...e)=>{let i=e.length,n,r,o=[],a=[],l,h=0,c=!1;for(;h<i;){for(l=t[h];h<i&&(r=e[h],(n=Zl(r))!==void 0);)l+=n+t[++h],c=!0;h!==i&&a.push(r),o.push(l),h++}if(h===i&&o.push(t[i]),c){let u=o.join("$$lit$$");(t=fo.get(u))===void 0&&(o.raw=o,fo.set(u,t=o)),e=a}return s(t,...e)},xi=ks($),sm=ks(jr),nm=ks(Kr);var T=class extends rt{constructor(){super(...arguments),this.assumeInteractionOn=["click"],this.hasSlotController=new le(this,"[default]","start","end"),this.localize=new ot(this),this.invalid=!1,this.isIconButton=!1,this.title="",this.variant="neutral",this.appearance="accent",this.size="m",this.withCaret=!1,this.withStart=!1,this.withEnd=!1,this.disabled=!1,this.loading=!1,this.pill=!1,this.type="button"}static get validators(){return[...super.validators,ao()]}handleSizeChange(){At(this.localName,this.size)}constructLightDOMButton(){let s=document.createElement("button");for(let t of this.attributes)t.name!=="style"&&s.setAttribute(t.name,t.value);return s.type=this.type,s.style.position="absolute !important",s.style.width="0 !important",s.style.height="0 !important",s.style.clipPath="inset(50%) !important",s.style.overflow="hidden !important",s.style.whiteSpace="nowrap !important",this.name&&(s.name=this.name),s.value=this.value||"",s}handleClick(s){if(this.disabled||this.loading){s.preventDefault(),s.stopImmediatePropagation();return}if(this.type!=="submit"&&this.type!=="reset"||!this.getForm())return;let e=this.constructLightDOMButton();this.parentElement?.append(e),e.click(),e.remove()}handleInvalid(){this.dispatchEvent(new vi)}handleLabelSlotChange(){let s=this.labelSlot.assignedNodes({flatten:!0}),t=!1,e=!1,i=!1,n=!1;[...s].forEach(r=>{if(r.nodeType===Node.ELEMENT_NODE){let o=r;o.localName==="wa-icon"?(e=!0,t||(t=o.label!==void 0)):n=!0}else r.nodeType===Node.TEXT_NODE&&(r.textContent?.trim()||"").length>0&&(i=!0)}),this.isIconButton=e&&!i&&!n,this.customStates.set("icon-button",this.isIconButton),this.isIconButton&&!t&&console.warn('Icon buttons must have a label for screen readers. Add <wa-icon label="..."> to remove this warning.',this)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.customStates.set("disabled",this.disabled),this.updateValidity()}handleHrefChange(){this.customStates.set("link",this.isLink())}handleLoadingChange(){this.customStates.set("loading",this.loading)}setValue(...s){}click(){this.button.click()}focus(s){this.button.focus(s)}blur(){this.button.blur()}render(){let s=this.isLink(),t=s?Es`a`:Es`button`;return xi`
      <${t}
        part="base button"
        class=${et({button:!0,caret:this.withCaret,disabled:this.disabled,loading:this.loading,rtl:this.localize.dir()==="rtl","has-label":this.hasSlotController.test("[default]"),"has-start":this.hasSlotController.test("start","withStart"),"has-end":this.hasSlotController.test("end","withEnd"),"is-icon-button":this.isIconButton})}
        ?disabled=${ct(s?void 0:this.disabled)}
        type=${ct(s?void 0:this.type)}
        title=${this.title}
        name=${ct(s?void 0:this.name)}
        value=${ct(s?void 0:this.value)}
        href=${ct(s?this.href:void 0)}
        target=${ct(s?this.target:void 0)}
        download=${ct(s?this.download:void 0)}
        rel=${ct(s&&this.rel?this.rel:void 0)}
        role=${ct(s?void 0:"button")}
        aria-disabled=${ct(s&&this.disabled?"true":void 0)}
        aria-busy=${this.loading?"true":"false"}
        tabindex=${this.disabled?"-1":"0"}
        @invalid=${this.isButton()?this.handleInvalid:null}
        @click=${this.handleClick}
      >
        <slot name="start" part="start" class="start"></slot>
        <slot part="label" class="label" @slotchange=${this.handleLabelSlotChange}></slot>
        <slot name="end" part="end" class="end"></slot>
        ${this.withCaret?xi`
                <wa-icon part="caret" class="caret" library="system" name="chevron-down" variant="solid"></wa-icon>
              `:""}
        ${this.loading?xi`<wa-spinner part="spinner"></wa-spinner>`:""}
      </${t}>
    `}};T.shadowRootOptions={...rt.shadowRootOptions,delegatesFocus:!0};T.css=[lo,ae,pt];g([J(".button")],T.prototype,"button",2);g([J("slot:not([name])")],T.prototype,"labelSlot",2);g([ht()],T.prototype,"invalid",2);g([ht()],T.prototype,"isIconButton",2);g([w()],T.prototype,"title",2);g([w({reflect:!0})],T.prototype,"variant",2);g([w({reflect:!0})],T.prototype,"appearance",2);g([w({reflect:!0})],T.prototype,"size",2);g([K("size")],T.prototype,"handleSizeChange",1);g([w({attribute:"with-caret",type:Boolean,reflect:!0})],T.prototype,"withCaret",2);g([w({attribute:"with-start",type:Boolean})],T.prototype,"withStart",2);g([w({attribute:"with-end",type:Boolean})],T.prototype,"withEnd",2);g([w({type:Boolean})],T.prototype,"disabled",2);g([w({type:Boolean,reflect:!0})],T.prototype,"loading",2);g([w({type:Boolean,reflect:!0})],T.prototype,"pill",2);g([w()],T.prototype,"type",2);g([w({reflect:!0})],T.prototype,"name",2);g([w({reflect:!0})],T.prototype,"value",2);g([w({reflect:!0})],T.prototype,"href",2);g([w()],T.prototype,"target",2);g([w()],T.prototype,"rel",2);g([w()],T.prototype,"download",2);g([w({attribute:"formaction"})],T.prototype,"formAction",2);g([w({attribute:"formenctype"})],T.prototype,"formEnctype",2);g([w({attribute:"formmethod"})],T.prototype,"formMethod",2);g([w({attribute:"formnovalidate",type:Boolean})],T.prototype,"formNoValidate",2);g([w({attribute:"formtarget"})],T.prototype,"formTarget",2);g([K("disabled",{waitUntilFirstUpdate:!0})],T.prototype,"handleDisabledChange",1);g([K("href")],T.prototype,"handleHrefChange",1);g([K("loading",{waitUntilFirstUpdate:!0})],T.prototype,"handleLoadingChange",1);T=g([U("wa-button")],T);T.disableWarning?.("change-in-update");var go=N`
  :host {
    --track-width: 2px;
    --track-color: var(--wa-color-neutral-fill-normal);
    --indicator-color: var(--wa-color-brand-fill-loud);
    --speed: 2s;
    --size: 1em;

    /*
      Resizing a spinner element using anything but font-size will break the animation because the animation uses em
      units. Therefore, if a spinner is used in a flex container without \`flex: none\` applied, the spinner can
      grow/shrink and break the animation. The use of \`flex: none\` on the host element prevents this by always having
      the spinner sized according to its actual dimensions.
    */
    flex: none;
    display: inline-flex;
    width: var(--size);
    height: var(--size);
  }

  svg {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    animation: spin var(--speed) linear infinite;
  }

  .track,
  .indicator {
    --radius: calc(var(--size) / 2 - var(--track-width) / 2);
    --circumference: calc(var(--radius) * 2 * 3.141592654);

    cx: calc(var(--size) / 2);
    cy: calc(var(--size) / 2);
    r: var(--radius);
    fill: none;
    stroke-width: var(--track-width);
  }

  .track {
    stroke: var(--track-color);
  }

  .indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: calc(0.597 * var(--circumference)), calc(0.796 * var(--circumference));
    stroke-dashoffset: calc(-0.04 * var(--circumference));
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: calc(0.008 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: calc(0.716 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: calc(-0.278 * var(--circumference));
    }
    100% {
      stroke-dasharray: calc(0.716 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: calc(-0.987 * var(--circumference));
    }
  }
`;var zs=class extends D{constructor(){super(...arguments),this.localize=new ot(this)}render(){return $`
      <svg
        part="base spinner"
        role="progressbar"
        aria-label=${this.localize.term("loading")}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="track" />
        <circle class="indicator" />
      </svg>
    `}};zs.css=go;zs=g([U("wa-spinner")],zs);var vo=class extends Event{constructor(){super("wa-error",{bubbles:!0,cancelable:!1,composed:!0})}};var bo=class extends Event{constructor(){super("wa-load",{bubbles:!0,cancelable:!1,composed:!0})}};var wo=N`
  :host {
    --primary-color: currentColor;
    --primary-opacity: 1;
    --secondary-color: currentColor;
    --secondary-opacity: 0.4;
    --rotate-angle: 0deg;

    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: -0.125em;
  }

  /* #region Canvas — the box the icon is centered within (mirrors Font Awesome's icon canvas). Orthogonal to font-size. */

  /* Fixed width (default): 1.25em × 1em (20 × 16px) */
  :host(:not([canvas])),
  :host([canvas='fixed']) {
    width: 1.25em;
    height: 1em;
    min-width: 1.25em; /* <-- this is what Safari respects for intrinsic */
    min-height: 1em;
  }

  /* Auto: hug the icon's width. \`auto-width\` is the deprecated alias for canvas="auto". */
  :host([canvas='auto']),
  :host([auto-width]:not([canvas])) {
    width: auto;
    height: 1em;
  }

  /* Square: 1.25em × 1.25em (20 × 20px) */
  :host([canvas='square']) {
    width: 1.25em;
    height: 1.25em;
    min-width: 1.25em;
    min-height: 1.25em;
  }

  /* Roomy: 1.5em × 1.5em (24 × 24px) */
  :host([canvas='roomy']) {
    width: 1.5em;
    height: 1.5em;
    min-width: 1.5em;
    min-height: 1.5em;
  }

  /* #endregion */

  svg {
    /* NOTE: Avoid setting fill here. A stylesheet rule beats SVG presentation attributes, breaking stroke-based
       libraries like Lucide (fill="none" stroke="currentColor") and attribute-based mutators (issue #1733). The default
       library applies fill="currentColor" in its mutator instead. */
    height: 1em;
    overflow: visible;
    width: auto;

    /* Duotone colors with path-specific opacity fallback */
    path[data-duotone-primary] {
      color: var(--primary-color);
      opacity: var(--path-opacity, var(--primary-opacity));
    }

    path[data-duotone-secondary] {
      color: var(--secondary-color);
      opacity: var(--path-opacity, var(--secondary-opacity));
    }
  }

  /* Rotation */
  :host([rotate]) {
    transform: rotate(var(--rotate-angle, 0deg));
  }

  /* Flipping */
  :host([flip='x']) {
    transform: scaleX(-1);
  }
  :host([flip='y']) {
    transform: scaleY(-1);
  }
  :host([flip='both']) {
    transform: scale(-1, -1);
  }

  /* Rotation and Flipping combined */
  :host([rotate][flip='x']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleX(-1);
  }
  :host([rotate][flip='y']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleY(-1);
  }
  :host([rotate][flip='both']) {
    transform: rotate(var(--rotate-angle, 0deg)) scale(-1, -1);
  }

  /* #region Animations — ported from Font Awesome 7.3 (--fa-* props mapped to wa-icon's --* names) */

  :host([animation='beat']) {
    animation-name: beat;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='bounce']) {
    animation-name: bounce;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
  }

  :host([animation='fade']) {
    animation-name: fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='beat-fade']) {
    animation-name: beat-fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='flip']) {
    animation-name: flip;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1.5s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='flip-360']) {
    animation-name: flip-360;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='shake']) {
    animation-name: shake;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.75s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='spin']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-pulse']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, steps(8));
  }

  /* spin-reverse is FA's reverse modifier expressed as a standalone value; reverse any spin via --animation-direction: reverse */
  :host([animation='spin-reverse']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, reverse);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap']) {
    animation-name: spin-snap;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 3s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap-4']) {
    animation-name: spin-snap-4;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 2.4s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap-8']) {
    animation-name: spin-snap-8;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 4s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='buzz']) {
    animation-name: buzz;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.6s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='wag']) {
    animation-name: wag;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.9s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
    transform-origin: bottom center;
  }

  :host([animation='float']) {
    animation-name: float;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 3s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
    will-change: transform;
  }

  :host([animation='swing']) {
    animation-name: swing;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1.2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
    transform-origin: top center;
  }

  :host([animation='jello']) {
    animation-name: jello;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.9s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
  }

  @media (prefers-reduced-motion: reduce) {
    :host([animation='beat']),
    :host([animation='bounce']),
    :host([animation='fade']),
    :host([animation='beat-fade']),
    :host([animation='flip']),
    :host([animation='flip-360']),
    :host([animation='shake']),
    :host([animation='spin']),
    :host([animation='spin-pulse']),
    :host([animation='spin-reverse']),
    :host([animation='spin-snap']),
    :host([animation='spin-snap-4']),
    :host([animation='spin-snap-8']),
    :host([animation='buzz']),
    :host([animation='wag']),
    :host([animation='float']),
    :host([animation='swing']),
    :host([animation='jello']) {
      animation: none !important;
      transition: none !important;
    }
  }

  /* #endregion */

  /* #region Keyframes — ported verbatim from Font Awesome 7.3 */

  @keyframes beat {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(calc(1.25 * var(--beat-scale, 1.25)));
    }
    45% {
      transform: scale(calc(1.22 * var(--beat-scale, 1.22)));
    }
    65% {
      transform: scale(calc(1.25 * var(--beat-scale, 1.25)));
    }
    90% {
      transform: scale(1);
    }
  }

  @keyframes bounce {
    0% {
      transform: scale(1, 1) translateY(0);
      /* No fallback by design (ported from FA 7.3): the first segment uses the user's --animation-timing or the CSS
         initial ease, while the explicit cubic-beziers on later stops drive the bounce physics. */
      animation-timing-function: var(--animation-timing);
    }
    14% {
      transform: scale(var(--bounce-start-scale-x, 1.06), var(--bounce-start-scale-y, 0.94))
        translateY(var(--bounce-anticipation, 3px));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    32% {
      transform: scale(var(--bounce-jump-scale-x, 0.94), var(--bounce-jump-scale-y, 1.12))
        translateY(calc(-1 * var(--bounce-height, 0.5em)));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    52% {
      transform: scale(1, 1) translateY(calc(-1 * var(--bounce-height, 0.5em) * 1.1));
      animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
    }
    70% {
      transform: scale(var(--bounce-land-scale-x, 1.06), var(--bounce-land-scale-y, 0.92)) translateY(0);
      animation-timing-function: cubic-bezier(0.33, 0.33, 0.66, 1);
    }
    85% {
      transform: scale(0.98, 1.04) translateY(calc(-2px * var(--bounce-rebound, 1)));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: scale(1, 1) translateY(0);
    }
  }

  @keyframes fade {
    0% {
      opacity: 1;
      transform: scale(1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    40% {
      opacity: var(--fade-opacity, 0.4);
      transform: scale(0.98);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes beat-fade {
    0% {
      opacity: var(--beat-fade-opacity, 0.4);
      transform: scale(1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    25% {
      opacity: calc(var(--beat-fade-opacity, 0.4) + 0.4);
      transform: scale(var(--beat-fade-scale, 1.28));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    45% {
      opacity: 1;
      transform: scale(var(--beat-fade-scale, 1.25));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    65% {
      opacity: calc(var(--beat-fade-opacity, 0.4) + 0.4);
      transform: scale(var(--beat-fade-scale, 1.28));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    100% {
      opacity: var(--beat-fade-opacity, 0.4);
      transform: scale(1);
    }
  }

  @keyframes flip {
    0% {
      transform: perspective(2em) scale(1) rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    8% {
      transform: perspective(2em) scale(var(--flip-anticipation-scale, 0.95))
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    35% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.6));
      animation-timing-function: linear;
    }
    65% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.5));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    92% {
      transform: perspective(2em) scale(1)
        rotate3d(
          var(--flip-x, 0),
          var(--flip-y, 1),
          var(--flip-z, 0),
          calc(var(--flip-angle, -360deg) * var(--flip-overshoot, 1.04))
        );
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), var(--flip-angle, -360deg));
    }
  }

  @keyframes flip-360 {
    0% {
      transform: perspective(2em) scale(1) rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    8% {
      transform: perspective(2em) scale(var(--flip-anticipation-scale, 0.95))
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    50% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.6));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    80% {
      transform: perspective(2em) scale(1)
        rotate3d(
          var(--flip-x, 0),
          var(--flip-y, 1),
          var(--flip-z, 0),
          calc(var(--flip-angle, -360deg) * var(--flip-overshoot, 1.04))
        );
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), var(--flip-angle, -360deg));
    }
  }

  @keyframes shake {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    8% {
      transform: rotate(35deg) translateX(1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    20% {
      transform: rotate(-22deg) translateX(-1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    35% {
      transform: rotate(15deg) translateX(1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    50% {
      transform: rotate(-9deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    65% {
      transform: rotate(5deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    78% {
      transform: rotate(-3deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    90% {
      transform: rotate(1deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    12% {
      transform: rotate(60deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    16.67% {
      transform: rotate(60deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    28.67% {
      transform: rotate(120deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    33.33% {
      transform: rotate(120deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    45.33% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    62% {
      transform: rotate(240deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    66.67% {
      transform: rotate(240deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    78.67% {
      transform: rotate(300deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    83.33% {
      transform: rotate(300deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    95.33% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap-4 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    15% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    25% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    40% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    65% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    75% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    90% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap-8 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    9% {
      transform: rotate(45deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    12.5% {
      transform: rotate(45deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    21.5% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    25% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    34% {
      transform: rotate(135deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    37.5% {
      transform: rotate(135deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    46.5% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    59% {
      transform: rotate(225deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    62.5% {
      transform: rotate(225deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    71.5% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    75% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    84% {
      transform: rotate(315deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    87.5% {
      transform: rotate(315deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    96.5% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes buzz {
    0% {
      transform: translateX(0) rotate(0deg);
      animation-timing-function: cubic-bezier(0.1, 0, 0.9, 1);
    }
    5% {
      transform: translateX(var(--buzz-distance, 4px)) rotate(0.5deg);
    }
    10% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px))) rotate(-0.5deg);
    }
    15% {
      transform: translateX(var(--buzz-distance, 4px)) rotate(0.3deg);
    }
    20% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px))) rotate(-0.3deg);
    }
    25% {
      transform: translateX(calc(var(--buzz-distance, 4px) * 0.7)) rotate(0.2deg);
    }
    30% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px) * 0.7)) rotate(-0.2deg);
    }
    35% {
      transform: translateX(calc(var(--buzz-distance, 4px) * 0.4)) rotate(0.1deg);
    }
    40% {
      transform: translateX(0) rotate(0deg);
    }
    100% {
      transform: translateX(0) rotate(0deg);
    }
  }

  @keyframes wag {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    12% {
      transform: rotate(var(--wag-angle, 12deg));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    24% {
      transform: rotate(2deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    36% {
      transform: rotate(calc(var(--wag-angle, 12deg) * 0.85));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    48% {
      transform: rotate(1deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    58% {
      transform: rotate(calc(var(--wag-angle, 12deg) * 0.6));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    68% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    15% {
      transform: translateY(calc(-0.4 * var(--float-height, 6px))) translateX(var(--float-drift, 1px))
        rotate(var(--float-tilt, 1deg)) scale(1, 1);
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    35% {
      transform: translateY(calc(-1 * var(--float-height, 6px))) translateX(0) rotate(0deg)
        scale(var(--float-stretch-x, 0.98), var(--float-stretch-y, 1.03));
      animation-timing-function: cubic-bezier(0.5, 0, 0.5, 0);
    }
    50% {
      transform: translateY(calc(-0.92 * var(--float-height, 6px))) translateX(calc(-0.5 * var(--float-drift, 1px)))
        rotate(calc(-0.5 * var(--float-tilt, 1deg))) scale(0.995, 1.01);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    70% {
      transform: translateY(calc(-0.3 * var(--float-height, 6px))) translateX(calc(-1 * var(--float-drift, 1px)))
        rotate(calc(-1 * var(--float-tilt, 1deg))) scale(1, 1);
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    90% {
      transform: translateY(calc(0.05 * var(--float-height, 6px))) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: translateY(0) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
    }
  }

  @keyframes swing {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    8% {
      transform: rotate(var(--swing-angle, 22deg));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    18% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.85));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    28% {
      transform: rotate(calc(var(--swing-angle, 22deg) * 0.65));
      animation-timing-function: cubic-bezier(0.35, 0, 0.65, 1);
    }
    38% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.45));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    48% {
      transform: rotate(calc(var(--swing-angle, 22deg) * 0.25));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    56% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.1));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    64% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes jello {
    0% {
      transform: scale(1, 1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    12% {
      transform: scale(var(--jello-scale-x, 1.15), calc(2 - var(--jello-scale-x, 1.15)));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    24% {
      transform: scale(calc(2 - var(--jello-scale-y, 1.12)), var(--jello-scale-y, 1.12));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    36% {
      transform: scale(
        calc(1 + (var(--jello-scale-x, 1.15) - 1) * 0.5),
        calc(2 - (1 + (var(--jello-scale-x, 1.15) - 1) * 0.5))
      );
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    48% {
      transform: scale(
        calc(2 - (1 + (var(--jello-scale-y, 1.12) - 1) * 0.3)),
        calc(1 + (var(--jello-scale-y, 1.12) - 1) * 0.3)
      );
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    58% {
      transform: scale(1.02, 0.98);
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    68% {
      transform: scale(1, 1);
    }
    100% {
      transform: scale(1, 1);
    }
  }

  /* #endregion */
`;var th="",Ts="";function yo(){return th.replace(/\/$/,"")}function eh(s){Ts=s}function xo(){if(!Ts){let s=document.querySelector("[data-fa-kit-code]");s&&eh(s.getAttribute("data-fa-kit-code")||"")}return Ts}var Co="7.3.0";function ih(s,t,e){let i="solid";return t==="chisel"&&(i="chisel-regular"),t==="etch"&&(i="etch-solid"),t==="graphite"&&(i="graphite-thin"),t==="jelly"&&(i="jelly-regular",e==="duo-regular"&&(i="jelly-duo-regular"),e==="fill-regular"&&(i="jelly-fill-regular")),t==="jelly-duo"&&(i="jelly-duo-regular"),t==="jelly-fill"&&(i="jelly-fill-regular"),t==="notdog"&&(e==="solid"&&(i="notdog-solid"),e==="duo-solid"&&(i="notdog-duo-solid")),t==="notdog-duo"&&(i="notdog-duo-solid"),t==="slab"&&((e==="solid"||e==="regular")&&(i="slab-regular"),e==="press-regular"&&(i="slab-press-regular")),t==="slab-press"&&(i="slab-press-regular"),t==="slab-duo"&&(i="slab-duo-regular"),t==="slab-press-duo"&&(i="slab-press-duo-regular"),t==="thumbprint"&&(i="thumbprint-light"),t==="utility"&&(i="utility-semibold"),t==="utility-duo"&&(i="utility-duo-semibold"),t==="utility-fill"&&(i="utility-fill-semibold"),t==="whiteboard"&&(i="whiteboard-semibold"),t==="mosaic"&&(i="mosaic-solid"),t==="pixel"&&(i="pixel-regular"),t==="vellum"&&(i="vellum-solid"),t==="classic"&&(e==="thin"&&(i="thin"),e==="light"&&(i="light"),e==="regular"&&(i="regular"),e==="solid"&&(i="solid")),t==="duotone"&&(e==="thin"&&(i="duotone-thin"),e==="light"&&(i="duotone-light"),e==="regular"&&(i="duotone-regular"),e==="solid"&&(i="duotone")),t==="sharp"&&(e==="thin"&&(i="sharp-thin"),e==="light"&&(i="sharp-light"),e==="regular"&&(i="sharp-regular"),e==="solid"&&(i="sharp-solid")),t==="sharp-duotone"&&(e==="thin"&&(i="sharp-duotone-thin"),e==="light"&&(i="sharp-duotone-light"),e==="regular"&&(i="sharp-duotone-regular"),e==="solid"&&(i="sharp-duotone-solid")),t==="brands"&&(i="brands"),i}function sh(s,t,e){let i=ih(s,t,e),n=yo();if(n)return`${n}/${i}/${s}.svg`;let r=xo();return r.length>0?`https://ka-p.fontawesome.com/releases/v${Co}/svgs/${i}/${s}.svg?token=${encodeURIComponent(r)}`:`https://ka-f.fontawesome.com/releases/v${Co}/svgs/${i}/${s}.svg`}var nh={name:"default",resolver:(s,t="classic",e="solid")=>sh(s,t,e),mutator:(s,t)=>{if(s.hasAttribute("fill")||s.setAttribute("fill","currentColor"),t?.family&&!s.hasAttribute("data-duotone-initialized")){let{family:e,variant:i}=t;if(e==="duotone"||e==="sharp-duotone"||e==="notdog-duo"||e==="notdog"&&i==="duo-solid"||e==="jelly-duo"||e==="jelly"&&i==="duo-regular"||e==="utility-duo"||e==="slab-duo"||e==="slab-press-duo"||e==="thumbprint"){let n=[...s.querySelectorAll("path")],r=n.find(a=>!a.hasAttribute("opacity")),o=n.find(a=>a.hasAttribute("opacity"));if(!r||!o)return;if(r.setAttribute("data-duotone-primary",""),o.setAttribute("data-duotone-secondary",""),t.swapOpacity&&r&&o){let a=o.getAttribute("opacity")||"0.4";r.style.setProperty("--path-opacity",a),o.style.setProperty("--path-opacity","1")}s.setAttribute("data-duotone-initialized","")}}}},So=nh;function rh(s){return`data:image/svg+xml,${encodeURIComponent(s)}`}var Ps={solid:{backward:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M236.3 107.1C247.9 96 265 92.9 279.7 99.2C294.4 105.5 304 120 304 136L304 272.3L476.3 107.2C487.9 96 505 92.9 519.7 99.2C534.4 105.5 544 120 544 136L544 504C544 520 534.4 534.5 519.7 540.8C505 547.1 487.9 544 476.3 532.9L304 367.7L304 504C304 520 294.4 534.5 279.7 540.8C265 547.1 247.9 544 236.3 532.9L44.3 348.9C36.5 341.3 32 330.9 32 320C32 309.1 36.5 298.7 44.3 291.1L236.3 107.1z"/></svg>',"backward-step":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M491 100.8C478.1 93.8 462.3 94.5 450 102.6L192 272.1L192 128C192 110.3 177.7 96 160 96C142.3 96 128 110.3 128 128L128 512C128 529.7 142.3 544 160 544C177.7 544 192 529.7 192 512L192 367.9L450 537.5C462.3 545.6 478 546.3 491 539.3C504 532.3 512 518.8 512 504.1L512 136.1C512 121.4 503.9 107.9 491 100.9z"/></svg>',"angles-left":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M77.3 256 214.7 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256zm192 0L406.7 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L269.3 256z"/></svg>',"angles-right":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M434.7 256 297.3 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L434.7 256zm-192 0L105.3 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256z"/></svg>',check:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"/></svg>',"chevron-down":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>',"chevron-left":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>',"chevron-right":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>',circle:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"/></svg>',"closed-captioning":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M64 192C64 156.7 92.7 128 128 128L512 128C547.3 128 576 156.7 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192zM216 272L248 272C252.4 272 256 275.6 256 280C256 293.3 266.7 304 280 304C293.3 304 304 293.3 304 280C304 249.1 278.9 224 248 224L216 224C185.1 224 160 249.1 160 280L160 360C160 390.9 185.1 416 216 416L248 416C278.9 416 304 390.9 304 360C304 346.7 293.3 336 280 336C266.7 336 256 346.7 256 360C256 364.4 252.4 368 248 368L216 368C211.6 368 208 364.4 208 360L208 280C208 275.6 211.6 272 216 272zM384 280C384 275.6 387.6 272 392 272L424 272C428.4 272 432 275.6 432 280C432 293.3 442.7 304 456 304C469.3 304 480 293.3 480 280C480 249.1 454.9 224 424 224L392 224C361.1 224 336 249.1 336 280L336 360C336 390.9 361.1 416 392 416L424 416C454.9 416 480 390.9 480 360C480 346.7 469.3 336 456 336C442.7 336 432 346.7 432 360C432 364.4 428.4 368 424 368L392 368C387.6 368 384 364.4 384 360L384 280z"/></svg>',"closed-captioning-slash":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M39 39.1C48.4 29.7 63.6 29.7 72.9 39.1L161.8 128L512 128C547.3 128 576 156.7 576 192L576 448C576 473.5 561.1 495.4 539.6 505.8L601 567.1C610.4 576.5 610.4 591.7 601 601C591.6 610.3 576.4 610.4 567.1 601L39 73.1C29.7 63.7 29.7 48.5 39 39.1zM384 350.1L384 279.9C384 275.5 387.6 271.9 392 271.9L424 271.9C428.4 271.9 432 275.5 432 279.9C432 293.2 442.7 303.9 456 303.9C469.3 303.9 480 293.2 480 279.9C480 249 454.9 223.9 424 223.9L392 223.9C361.1 223.9 336 249 336 279.9L336 302.1L384 350.1zM445.5 411.6C465.7 403.2 480 383.2 480 359.9C480 346.6 469.3 335.9 456 335.9C442.7 335.9 432 346.6 432 359.9C432 364.3 428.4 367.9 424 367.9L401.8 367.9L445.5 411.6zM162.3 264.1C160.8 269.1 160 274.5 160 280L160 360C160 390.9 185.1 416 216 416L248 416C266.1 416 282.1 407.5 292.4 394.2L410.2 512L128 512C92.7 512 64 483.3 64 448L64 192C64 184.2 65.4 176.7 68 169.8L162.3 264.1zM256.1 357.9C256 358.6 256 359.3 256 360C256 364.4 252.4 368 248 368L216 368C211.6 368 208 364.4 208 360L208 309.8L256.1 357.9z"/></svg>',compress:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M160 64c0-17.7-14.3-32-32-32S96 46.3 96 64l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z"/></svg>',ellipsis:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M96 320C96 289.1 121.1 264 152 264C182.9 264 208 289.1 208 320C208 350.9 182.9 376 152 376C121.1 376 96 350.9 96 320zM264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320zM488 264C518.9 264 544 289.1 544 320C544 350.9 518.9 376 488 376C457.1 376 432 350.9 432 320C432 289.1 457.1 264 488 264z"/></svg>',"ellipsis-vertical":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"/></svg>',expand:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 96C110.3 96 96 110.3 96 128L96 224C96 241.7 110.3 256 128 256C145.7 256 160 241.7 160 224L160 160L224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L128 96zM160 416C160 398.3 145.7 384 128 384C110.3 384 96 398.3 96 416L96 512C96 529.7 110.3 544 128 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480L160 416zM416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160L480 224C480 241.7 494.3 256 512 256C529.7 256 544 241.7 544 224L544 128C544 110.3 529.7 96 512 96L416 96zM544 416C544 398.3 529.7 384 512 384C494.3 384 480 398.3 480 416L480 480L416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L512 544C529.7 544 544 529.7 544 512L544 416z"/></svg>',eyedropper:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M341.6 29.2l-101.6 101.6-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4 101.6-101.6c39-39 39-102.2 0-141.1s-102.2-39-141.1 0zM55.4 323.3c-15 15-23.4 35.4-23.4 56.6l0 42.4-26.6 39.9c-8.5 12.7-6.8 29.6 4 40.4s27.7 12.5 40.4 4l39.9-26.6 42.4 0c21.2 0 41.6-8.4 56.6-23.4l109.4-109.4-45.3-45.3-109.4 109.4c-3 3-7.1 4.7-11.3 4.7l-36.1 0 0-36.1c0-4.2 1.7-8.3 4.7-11.3l109.4-109.4-45.3-45.3-109.4 109.4z"/></svg>',forward:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M403.7 107.1C392.1 96 375 92.9 360.3 99.2C345.6 105.5 336 120 336 136L336 272.3L163.7 107.2C152.1 96 135 92.9 120.3 99.2C105.6 105.5 96 120 96 136L96 504C96 520 105.6 534.5 120.3 540.8C135 547.1 152.1 544 163.7 532.9L336 367.7L336 504C336 520 345.6 534.5 360.3 540.8C375 547.1 392.1 544 403.7 532.9L595.7 348.9C603.6 341.4 608 330.9 608 320C608 309.1 603.5 298.7 595.7 291.1L403.7 107.1z"/></svg>',file:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z"/></svg>',"file-audio":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM389.8 307.7C380.7 301.4 368.3 303.6 362 312.7C355.7 321.8 357.9 334.2 367 340.5C390.9 357.2 406.4 384.8 406.4 416C406.4 447.2 390.8 474.9 367 491.5C357.9 497.8 355.7 510.3 362 519.3C368.3 528.3 380.8 530.6 389.8 524.3C423.9 500.5 446.4 460.8 446.4 416C446.4 371.2 424 331.5 389.8 307.7zM208 376C199.2 376 192 383.2 192 392L192 440C192 448.8 199.2 456 208 456L232 456L259.2 490C262.2 493.8 266.8 496 271.7 496L272 496C280.8 496 288 488.8 288 480L288 352C288 343.2 280.8 336 272 336L271.7 336C266.8 336 262.2 338.2 259.2 342L232 376L208 376zM336 448.2C336 458.9 346.5 466.4 354.9 459.8C367.8 449.5 376 433.7 376 416C376 398.3 367.8 382.5 354.9 372.2C346.5 365.5 336 373.1 336 383.8L336 448.3z"/></svg>',"file-code":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM282.2 359.6C290.8 349.5 289.7 334.4 279.6 325.8C269.5 317.2 254.4 318.3 245.8 328.4L197.8 384.4C190.1 393.4 190.1 406.6 197.8 415.6L245.8 471.6C254.4 481.7 269.6 482.8 279.6 474.2C289.6 465.6 290.8 450.4 282.2 440.4L247.6 400L282.2 359.6zM394.2 328.4C385.6 318.3 370.4 317.2 360.4 325.8C350.4 334.4 349.2 349.6 357.8 359.6L392.4 400L357.8 440.4C349.2 450.5 350.3 465.6 360.4 474.2C370.5 482.8 385.6 481.7 394.2 471.6L442.2 415.6C449.9 406.6 449.9 393.4 442.2 384.4L394.2 328.4z"/></svg>',"file-excel":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM292 330.7C284.6 319.7 269.7 316.7 258.7 324C247.7 331.3 244.7 346.3 252 357.3L291.2 416L252 474.7C244.6 485.7 247.6 500.6 258.7 508C269.8 515.4 284.6 512.4 292 501.3L320 459.3L348 501.3C355.4 512.3 370.3 515.3 381.3 508C392.3 500.7 395.3 485.7 388 474.7L348.8 416L388 357.3C395.4 346.3 392.4 331.4 381.3 324C370.2 316.6 355.4 319.6 348 330.7L320 372.7L292 330.7z"/></svg>',"file-image":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM256 320C256 302.3 241.7 288 224 288C206.3 288 192 302.3 192 320C192 337.7 206.3 352 224 352C241.7 352 256 337.7 256 320zM220.6 512L419.4 512C435.2 512 448 499.2 448 483.4C448 476.1 445.2 469 440.1 463.7L343.3 361.9C337.3 355.6 328.9 352 320.1 352L319.8 352C311 352 302.7 355.6 296.6 361.9L199.9 463.7C194.8 469 192 476.1 192 483.4C192 499.2 204.8 512 220.6 512z"/></svg>',"file-pdf":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L208 576L208 464C208 428.7 236.7 400 272 400L448 400L448 234.5C448 217.5 441.3 201.2 429.3 189.2L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM272 444C261 444 252 453 252 464L252 592C252 603 261 612 272 612C283 612 292 603 292 592L292 564L304 564C337.1 564 364 537.1 364 504C364 470.9 337.1 444 304 444L272 444zM304 524L292 524L292 484L304 484C315 484 324 493 324 504C324 515 315 524 304 524zM400 444C389 444 380 453 380 464L380 592C380 603 389 612 400 612L432 612C460.7 612 484 588.7 484 560L484 496C484 467.3 460.7 444 432 444L400 444zM420 572L420 484L432 484C438.6 484 444 489.4 444 496L444 560C444 566.6 438.6 572 432 572L420 572zM508 464L508 592C508 603 517 612 528 612C539 612 548 603 548 592L548 548L576 548C587 548 596 539 596 528C596 517 587 508 576 508L548 508L548 484L576 484C587 484 596 475 596 464C596 453 587 444 576 444L528 444C517 444 508 453 508 464z"/></svg>',"file-powerpoint":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM280 320C266.7 320 256 330.7 256 344L256 488C256 501.3 266.7 512 280 512C293.3 512 304 501.3 304 488L304 464L328 464C367.8 464 400 431.8 400 392C400 352.2 367.8 320 328 320L280 320zM328 416L304 416L304 368L328 368C341.3 368 352 378.7 352 392C352 405.3 341.3 416 328 416z"/></svg>',"file-video":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM208 368L208 464C208 481.7 222.3 496 240 496L336 496C353.7 496 368 481.7 368 464L368 440L403 475C406.2 478.2 410.5 480 415 480C424.4 480 432 472.4 432 463L432 368.9C432 359.5 424.4 351.9 415 351.9C410.5 351.9 406.2 353.7 403 356.9L368 391.9L368 367.9C368 350.2 353.7 335.9 336 335.9L240 335.9C222.3 335.9 208 350.2 208 367.9z"/></svg>',"file-word":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM263.4 338.8C260.5 325.9 247.7 317.7 234.8 320.6C221.9 323.5 213.7 336.3 216.6 349.2L248.6 493.2C250.9 503.7 260 511.4 270.8 512C281.6 512.6 291.4 505.9 294.8 495.6L320 419.9L345.2 495.6C348.6 505.8 358.4 512.5 369.2 512C380 511.5 389.1 503.8 391.4 493.2L423.4 349.2C426.3 336.3 418.1 323.4 405.2 320.6C392.3 317.8 379.4 325.9 376.6 338.8L363.4 398.2L342.8 336.4C339.5 326.6 330.4 320 320 320C309.6 320 300.5 326.6 297.2 336.4L276.6 398.2L263.4 338.8z"/></svg>',"file-zipper":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM192 136C192 149.3 202.7 160 216 160L264 160C277.3 160 288 149.3 288 136C288 122.7 277.3 112 264 112L216 112C202.7 112 192 122.7 192 136zM192 232C192 245.3 202.7 256 216 256L264 256C277.3 256 288 245.3 288 232C288 218.7 277.3 208 264 208L216 208C202.7 208 192 218.7 192 232zM256 304L224 304C206.3 304 192 318.3 192 336L192 384C192 410.5 213.5 432 240 432C266.5 432 288 410.5 288 384L288 336C288 318.3 273.7 304 256 304zM240 368C248.8 368 256 375.2 256 384C256 392.8 248.8 400 240 400C231.2 400 224 392.8 224 384C224 375.2 231.2 368 240 368z"/></svg>',"forward-step":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M21 36.8c12.9-7 28.7-6.3 41 1.8L320 208.1 320 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 384c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-144.1-258 169.6c-12.3 8.1-28 8.8-41 1.8S0 454.7 0 440L0 72C0 57.3 8.1 43.8 21 36.8z"/></svg>',gauge:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm320 96c0-26.9-16.5-49.9-40-59.3L280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 172.7c-23.5 9.5-40 32.5-40 59.3 0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',gear:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z"/></svg>',"grip-vertical":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M128 40c0-22.1-17.9-40-40-40L40 0C17.9 0 0 17.9 0 40L0 88c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zm0 192c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM0 424l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 40c0-22.1-17.9-40-40-40L232 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM192 232l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 424c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48z"/></svg>',indeterminate:'<svg part="indeterminate-icon" class="icon" viewBox="0 0 16 16"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round"><g stroke="currentColor" stroke-width="2"><g transform="translate(2.285714 6.857143)"><path d="M10.2857143,1.14285714 L1.14285714,1.14285714"/></g></g></g></svg>',minus:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"/></svg>',pause:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M48 32C21.5 32 0 53.5 0 80L0 432c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48L48 32zm224 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0z"/></svg>',"picture-in-picture":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M448 32c35.3 0 64 28.7 64 64l0 112-64 0 0-112-384 0 0 320 144 0 0 64-144 0-6.5-.3c-30.1-3.1-54.1-27-57.1-57.1L0 416 0 96C0 62.9 25.2 35.6 57.5 32.3L64 32 448 32zm16 224c26.5 0 48 21.5 48 48l0 128c0 26.5-21.5 48-48 48l-160 0c-26.5 0-48-21.5-48-48l0-128c0-26.5 21.5-48 48-48l160 0z"/></svg>',play:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"/></svg>',"play-circle":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>',star:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"/></svg>',upload:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M352 173.3L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 173.3L246.6 214.7C234.1 227.2 213.8 227.2 201.3 214.7C188.8 202.2 188.8 181.9 201.3 169.4L297.3 73.4C309.8 60.9 330.1 60.9 342.6 73.4L438.6 169.4C451.1 181.9 451.1 202.2 438.6 214.7C426.1 227.2 405.8 227.2 393.3 214.7L352 173.3zM320 464C364.2 464 400 428.2 400 384L480 384C515.3 384 544 412.7 544 448L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 448C96 412.7 124.7 384 160 384L240 384C240 428.2 275.8 464 320 464zM464 488C477.3 488 488 477.3 488 464C488 450.7 477.3 440 464 440C450.7 440 440 450.7 440 464C440 477.3 450.7 488 464 488z"/></svg>',user:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"/></svg>',volume:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM441.1 107c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C443.3 170.7 464 210.9 464 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C361.1 227.6 368 241 368 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C402.1 312.9 416 286.1 416 256s-13.9-56.9-35.5-74.5z"/></svg>',"volume-low":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM380.6 181.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C361.1 227.6 368 241 368 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C402.1 312.9 416 286.1 416 256s-13.9-56.9-35.5-74.5z"/></svg>',"volume-xmark":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM367 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>',xmark:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>'},regular:{calendar:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176zM144 288L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 288L144 288z"/></svg>',"circle-question":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256-80c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>',"circle-xmark":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM167 167c-9.4 9.4-9.4 24.6 0 33.9l55 55-55 55c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l55-55 55 55c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-55-55 55-55c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-55 55-55-55c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>',clock:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z"/></svg>',copy:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l133.5 0c4.2 0 8.3 1.7 11.3 4.7l58.5 58.5c3 3 4.7 7.1 4.7 11.3L400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-197.5c0-17-6.7-33.3-18.7-45.3L370.7 18.7C358.7 6.7 342.5 0 325.5 0L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-48 0 0 16c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l16 0 0-48-16 0z"/></svg>',eye:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M288 80C222.8 80 169.2 109.6 128.1 147.7 89.6 183.5 63 226 49.4 256 63 286 89.6 328.5 128.1 364.3 169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256 513 226 486.4 183.5 447.9 147.7 406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1 3.3 7.9 3.3 16.7 0 24.6-14.9 35.7-46.2 87.7-93 131.1-47.1 43.7-111.8 80.6-192.6 80.6S142.5 443.2 95.4 399.4c-46.8-43.5-78.1-95.4-93-131.1-3.3-7.9-3.3-16.7 0-24.6 14.9-35.7 46.2-87.7 93-131.1zM288 336c44.2 0 80-35.8 80-80 0-29.6-16.1-55.5-40-69.3-1.4 59.7-49.6 107.9-109.3 109.3 13.8 23.9 39.7 40 69.3 40zm-79.6-88.4c2.5 .3 5 .4 7.6 .4 35.3 0 64-28.7 64-64 0-2.6-.2-5.1-.4-7.6-37.4 3.9-67.2 33.7-71.1 71.1zm45.6-115c10.8-3 22.2-4.5 33.9-4.5 8.8 0 17.5 .9 25.8 2.6 .3 .1 .5 .1 .8 .2 57.9 12.2 101.4 63.7 101.4 125.2 0 70.7-57.3 128-128 128-61.6 0-113-43.5-125.2-101.4-1.8-8.6-2.8-17.5-2.8-26.6 0-11 1.4-21.8 4-32 .2-.7 .3-1.3 .5-1.9 11.9-43.4 46.1-77.6 89.5-89.5z"/></svg>',"eye-slash":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.4-96.4c2.7-2.4 5.4-4.8 8-7.2 46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6-56.8 0-105.6 18.2-146 44.2L41-24.9zM176.9 111.1c32.1-18.9 69.2-31.1 111.1-31.1 65.2 0 118.8 29.6 159.9 67.7 38.5 35.7 65.1 78.3 78.6 108.3-13.6 30-40.2 72.5-78.6 108.3-3.1 2.8-6.2 5.6-9.4 8.4L393.8 328c14-20.5 22.2-45.3 22.2-72 0-70.7-57.3-128-128-128-26.7 0-51.5 8.2-72 22.2l-39.1-39.1zm182 182l-108-108c11.1-5.8 23.7-9.1 37.1-9.1 44.2 0 80 35.8 80 80 0 13.4-3.3 26-9.1 37.1zM103.4 173.2l-34-34c-32.6 36.8-55 75.8-66.9 104.5-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6 37.3 0 71.2-7.9 101.5-20.6L352.2 422c-20 6.4-41.4 10-64.2 10-65.2 0-118.8-29.6-159.9-67.7-38.5-35.7-65.1-78.3-78.6-108.3 10.4-23.1 28.6-53.6 54-82.8z"/></svg>',star:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M288.1-32c9 0 17.3 5.1 21.4 13.1L383 125.3 542.9 150.7c8.9 1.4 16.3 7.7 19.1 16.3s.5 18-5.8 24.4L441.7 305.9 467 465.8c1.4 8.9-2.3 17.9-9.6 23.2s-17 6.1-25 2L288.1 417.6 143.8 491c-8 4.1-17.7 3.3-25-2s-11-14.2-9.6-23.2L134.4 305.9 20 191.4c-6.4-6.4-8.6-15.8-5.8-24.4s10.1-14.9 19.1-16.3l159.9-25.4 73.6-144.2c4.1-8 12.4-13.1 21.4-13.1zm0 76.8L230.3 158c-3.5 6.8-10 11.6-17.6 12.8l-125.5 20 89.8 89.9c5.4 5.4 7.9 13.1 6.7 20.7l-19.8 125.5 113.3-57.6c6.8-3.5 14.9-3.5 21.8 0l113.3 57.6-19.8-125.5c-1.2-7.6 1.3-15.3 6.7-20.7l89.8-89.9-125.5-20c-7.6-1.2-14.1-6-17.6-12.8L288.1 44.8z"/></svg>'}},oh={name:"system",resolver:(s,t="classic",e="solid")=>{let n=Ps[e][s]??Ps.regular[s]??Ps.regular["circle-question"];return n?rh(n):""},mutator:s=>{s.hasAttribute("fill")||s.setAttribute("fill","currentColor")}},Mo=oh;var ah="classic",lh=[So,Mo],_o=new Set;function Lo(s){_o.add(s)}function Eo(s){_o.delete(s)}function Ci(s){return lh.find(t=>t.name===s)}function ko(){return ah}var{I:Qm}=Gr;var zo=(s,t)=>t===void 0?s?._$litType$!==void 0:s?._$litType$===t;var Fe=Symbol(),Si=Symbol(),As,$s=new Map,H=class extends D{constructor(){super(...arguments),this.svg=null,this.autoWidth=!1,this.swapOpacity=!1,this.label="",this.library="default",this.rotate=0,this.resolveIcon=async(s,t)=>{let e;if(t?.spriteSheet){this.hasUpdated||await this.updateComplete,this.svg=$`<svg part="svg">
        <use part="use" href="${s}"></use>
      </svg>`,await this.updateComplete;let i=this.shadowRoot.querySelector("[part='svg']");return typeof t.mutator=="function"&&t.mutator(i,this),this.svg}try{if(e=await fetch(s,{mode:"cors"}),!e.ok)return e.status===410?Fe:Si}catch{return Si}try{let i=document.createElement("div");i.innerHTML=await e.text();let n=i.firstElementChild;if(n?.tagName?.toLowerCase()!=="svg")return Fe;As||(As=new DOMParser);let o=As.parseFromString(n.outerHTML,"text/html").body.querySelector("svg");return o?(o.part.add("svg"),document.adoptNode(o)):Fe}catch{return Fe}}}connectedCallback(){super.connectedCallback(),Lo(this)}firstUpdated(s){super.firstUpdated(s),this.hasAttribute("rotate")&&this.style.setProperty("--rotate-angle",`${this.rotate}deg`),this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Eo(this)}async getIconSource(){let s=Ci(this.library),t=this.family||ko();if(this.name&&s){let e=this.canvas==="auto"||this.autoWidth,i;try{i=await s.resolver(this.name,t,this.variant,e)}catch{i=void 0}return{url:i,fromLibrary:!0}}return{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){let{url:s,fromLibrary:t}=await this.getIconSource(),e=t?Ci(this.library):void 0;if(!s){this.svg=null;return}let i=$s.get(s);i||(i=this.resolveIcon(s,e),$s.set(s,i));let n=await i;n===Si&&$s.delete(s);let r=await this.getIconSource();if(s===r.url){if(zo(n)){this.svg=n;return}switch(n){case Si:case Fe:this.svg=null,this.dispatchEvent(new vo);break;default:this.svg=n.cloneNode(!0),e?.mutator?.(this.svg,this),this.dispatchEvent(new bo)}}}willUpdate(s){return this.style||this.setStyleProperty("--rotate-angle",`${this.rotate}deg`),super.willUpdate(s)}updated(s){super.updated(s);let t=Ci(this.library);this.hasAttribute("rotate")&&this.style.setProperty("--rotate-angle",`${this.rotate}deg`);let e=this.shadowRoot?.querySelector("svg");e&&t?.mutator?.(e,this)}render(){return this.hasUpdated?this.svg:$`<svg part="svg" width="16" height="16" viewBox="0 0 16 16"></svg>`}};H.css=wo;g([ht()],H.prototype,"svg",2);g([w({reflect:!0})],H.prototype,"name",2);g([w({reflect:!0})],H.prototype,"family",2);g([w({reflect:!0})],H.prototype,"variant",2);g([w({reflect:!0})],H.prototype,"canvas",2);g([w({attribute:"auto-width",type:Boolean,reflect:!0})],H.prototype,"autoWidth",2);g([w({attribute:"swap-opacity",type:Boolean,reflect:!0})],H.prototype,"swapOpacity",2);g([w()],H.prototype,"src",2);g([w()],H.prototype,"label",2);g([w({reflect:!0})],H.prototype,"library",2);g([w({type:Number,reflect:!0})],H.prototype,"rotate",2);g([w({type:String,reflect:!0})],H.prototype,"flip",2);g([w({type:String,reflect:!0})],H.prototype,"animation",2);g([K("label")],H.prototype,"handleLabelChange",1);g([K(["family","name","library","variant","src","autoWidth","canvas","swapOpacity"],{waitUntilFirstUpdate:!0})],H.prototype,"setIcon",1);H=g([U("wa-icon")],H);var To=N`
  :host {
    --spacing: var(--wa-space-l);

    /* Internal calculated properties */
    --inner-border-radius: calc(var(--wa-panel-border-radius) - var(--wa-panel-border-width));

    display: flex;
    flex-direction: column;
    background-color: var(--wa-color-surface-default);
    border-color: var(--wa-color-surface-border);
    border-radius: var(--wa-panel-border-radius);
    border-style: var(--wa-panel-border-style);
    box-shadow: var(--wa-shadow-s);
    border-width: var(--wa-panel-border-width);
    color: var(--wa-color-text-normal);
  }

  /* Appearance modifiers */
  :host([appearance='plain']) {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }

  :host([appearance='outlined']) {
    background-color: var(--wa-color-surface-default);
    border-color: var(--wa-color-surface-border);
  }

  :host([appearance='filled']) {
    background-color: var(--wa-color-neutral-fill-quiet);
    border-color: transparent;
  }

  :host([appearance='filled-outlined']) {
    background-color: var(--wa-color-neutral-fill-quiet);
    border-color: var(--wa-color-surface-border);
  }

  :host([appearance='accent']) {
    color: var(--wa-color-neutral-on-loud);
    background-color: var(--wa-color-neutral-fill-loud);
    border-color: transparent;
  }

  /* Take care of top and bottom radii */
  .media,
  :host(:not([with-media])) .header,
  :host(:not([with-media], [with-header])) .body {
    border-start-start-radius: var(--inner-border-radius);
    border-start-end-radius: var(--inner-border-radius);
  }

  :host(:not([with-footer])) .body,
  .footer {
    border-end-start-radius: var(--inner-border-radius);
    border-end-end-radius: var(--inner-border-radius);
  }

  .media {
    display: flex;
    overflow: hidden;

    &::slotted(*) {
      display: block;
      width: 100%;
      border-radius: 0 !important;
    }
  }

  /* Round all corners for plain appearance */
  :host([appearance='plain']) .media {
    border-radius: var(--inner-border-radius);

    &::slotted(*) {
      border-radius: inherit !important;
    }
  }

  .header {
    display: block;
    border-block-end-style: inherit;
    border-block-end-color: var(--wa-color-surface-border);
    border-block-end-width: var(--wa-panel-border-width);
    padding: calc(var(--spacing) / 2) var(--spacing);
  }

  .body {
    display: block;
    padding: var(--spacing);
  }

  .footer {
    display: block;
    border-block-start-style: inherit;
    border-block-start-color: var(--wa-color-surface-border);
    border-block-start-width: var(--wa-panel-border-width);
    padding: var(--spacing);
  }

  /* Push slots to sides when the action slots renders */
  .has-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  :host(:not([with-header])) .header,
  :host(:not([with-footer])) .footer,
  :host(:not([with-media])) .media {
    display: none;
  }

  /* Orientation Styles */
  :host([orientation='horizontal']) {
    flex-direction: row;

    .media {
      border-start-start-radius: var(--inner-border-radius);
      border-end-start-radius: var(--inner-border-radius);
      border-start-end-radius: 0;

      &::slotted(*) {
        block-size: 100%;
        inline-size: 100%;
        object-fit: cover;
      }
    }
  }

  :host([orientation='horizontal']) .body slot::slotted(*) {
    display: block;
    height: 100%;
    margin: 0;
  }

  :host([orientation='horizontal']) slot[name='actions']::slotted(*) {
    display: flex;
    align-items: center;
    padding: var(--spacing);
  }
`;var at=class extends D{constructor(){super(...arguments),this.hasSlotController=new le(this,"footer","header","media","header-actions","footer-actions","actions"),this.appearance="outlined",this.withHeader=!1,this.withMedia=!1,this.withFooter=!1,this.withHeaderActions=!1,this.withFooterActions=!1,this.orientation="vertical"}willUpdate(s){this.withHeader=this.hasSlotController.test("header","withHeader"),this.withMedia=this.hasSlotController.test("media","withMedia"),this.withFooter=this.hasSlotController.test("footer","withFooter"),super.willUpdate(s)}render(){if(this.orientation==="horizontal")return $`
        <slot name="media" part="media" class="media"></slot>
        <div part="body" class="body"><slot></slot></div>
        <slot name="actions" part="actions" class="actions"></slot>
      `;let s=this.hasSlotController.test("header-actions","withHeaderActions"),t=this.hasSlotController.test("footer-actions","withFooterActions");return $`
      <slot name="media" part="media" class="media"></slot>

      <div
        part="header"
        class=${et({header:!0,"has-actions":s})}
      >
        <slot name="header"></slot>
        <slot name="header-actions"></slot>
      </div>

      <div part="body" class="body"><slot></slot></div>

      <div
        part="footer"
        class=${et({footer:!0,"has-actions":t})}
      >
        <slot name="footer"></slot>
        <slot name="footer-actions"></slot>
      </div>
    `}};at.css=[pt,To];g([w({reflect:!0})],at.prototype,"appearance",2);g([w({attribute:"with-header",type:Boolean,reflect:!0})],at.prototype,"withHeader",2);g([w({attribute:"with-media",type:Boolean,reflect:!0})],at.prototype,"withMedia",2);g([w({attribute:"with-footer",type:Boolean,reflect:!0})],at.prototype,"withFooter",2);g([w({attribute:"with-header-actions",type:Boolean,reflect:!0})],at.prototype,"withHeaderActions",2);g([w({attribute:"with-footer-actions",type:Boolean,reflect:!0})],at.prototype,"withFooterActions",2);g([w({reflect:!0})],at.prototype,"orientation",2);at=g([U("wa-card")],at);at.disableWarning?.("change-in-update");var Po=N`
  :host {
    --current-text-color: var(--wa-color-brand-on-loud);

    display: block;
    color: var(--wa-color-text-normal);
    -webkit-user-select: none;
    user-select: none;

    position: relative;
    display: flex;
    align-items: center;
    font: inherit;
    padding: 0.5em 1em 0.5em 0.25em;
    border-radius: var(--wa-border-radius-s);
    line-height: var(--wa-line-height-condensed);
    transition: var(--wa-transition-fast) background-color var(--wa-transition-easing);
    cursor: pointer;
  }

  :host(:focus) {
    outline: none;
  }

  @media (hover: hover) {
    :host(:not(:state(disabled), :state(current)):is(:state(hover), :hover)) {
      background-color: var(--wa-color-neutral-fill-normal);
      color: var(--wa-color-neutral-on-normal);
    }
  }

  :host(:state(current)),
  :host(:state(disabled):state(current)) {
    background-color: var(--wa-form-control-activated-color);
    color: var(--current-text-color);
    opacity: 1;
  }

  :host(:state(disabled)) {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .label {
    flex: 1 1 auto;
    display: inline-block;
  }

  .check {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--wa-font-size-smaller);
    visibility: hidden;
    width: 2em;
  }

  :host(:state(selected)) .check {
    visibility: visible;
  }

  .start,
  .end {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .start::slotted(*) {
    margin-inline-end: 0.5em;
  }

  .end::slotted(*) {
    margin-inline-start: 0.5em;
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }
`;function Ie(s,t=0){if(!s||!globalThis.Node)return"";if(typeof s[Symbol.iterator]=="function")return(Array.isArray(s)?s:[...s]).map(n=>Ie(n,--t)).join("");let e=s;if(e.nodeType===Node.TEXT_NODE)return e.textContent??"";if(e.nodeType===Node.ELEMENT_NODE){let i=e;if(i.hasAttribute("slot")||i.matches("style, script"))return"";if(i instanceof HTMLSlotElement){let n=i.assignedNodes({flatten:!0});if(n.length>0)return Ie(n,--t)}return t>-1?Ie(i,--t):i.textContent??""}return e.hasChildNodes()?Ie(e.childNodes,--t):""}var ut=class extends D{constructor(){super(...arguments),this.localize=new ot(this),this.cachedDefaultLabel="",this.isInitialized=!1,this.isDefaultLabelDirty=!0,this.current=!1,this.value="",this.disabled=!1,this.selected=!1,this.defaultSelected=!1,this._label="",this.handleHover=s=>{s.type==="mouseenter"?this.customStates.set("hover",!0):s.type==="mouseleave"&&this.customStates.set("hover",!1)}}set label(s){let t=this._label;this._label=s||"",this._label!==t&&this.requestUpdate("label",t)}get label(){return this._label?this._label:this.defaultLabel}get defaultLabel(){return(this.isDefaultLabelDirty||!this.cachedDefaultLabel)&&this.updateDefaultLabel(),this.cachedDefaultLabel}connectedCallback(){super.connectedCallback(),this.setAttribute("role","option"),this.setAttribute("aria-selected","false"),this.addEventListener("mouseenter",this.handleHover),this.addEventListener("mouseleave",this.handleHover)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mouseenter",this.handleHover),this.removeEventListener("mouseleave",this.handleHover)}handleDefaultSlotChange(){this.isDefaultLabelDirty=!0,this.isInitialized?(customElements.whenDefined("wa-select").then(()=>{let s=this.closest("wa-select");s&&s.handleDefaultSlotChange?.()}),customElements.whenDefined("wa-combobox").then(()=>{let s=this.closest("wa-combobox");s&&s.handleDefaultSlotChange?.()})):this.isInitialized=!0}willUpdate(s){s.has("defaultSelected")&&(this.didSSR&&this.hasUpdated||!this.didSSR)&&this.syncDefaultSelected(),super.willUpdate(s)}syncDefaultSelected(){if("closest"in this&&!this.closest("wa-combobox, wa-select")?.hasInteracted&&this.defaultSelected){let s=this.selected;this.selected=this.defaultSelected,this.requestUpdate("selected",s)}}updated(s){s.has("disabled")&&(this.setAttribute("aria-disabled",this.disabled?"true":"false"),this.customStates.set("disabled",this.disabled)),s.has("selected")&&(this.setAttribute("aria-selected",this.selected?"true":"false"),this.customStates.set("selected",this.selected)),s.has("value")&&(typeof this.value!="string"&&(this.value=String(this.value)),this.handleDefaultSlotChange()),s.has("current")&&this.customStates.set("current",this.current),super.updated(s)}async firstUpdated(s){if(super.firstUpdated(s),this.didSSR&&!this.hasUpdated?(await this.updateComplete,this.syncDefaultSelected()):this.syncDefaultSelected(),this.selected&&!this.defaultSelected){let t=this.closest("wa-select, wa-combobox");t&&!t.hasInteracted&&(await customElements.whenDefined(t?.localName),await t.updateComplete,t.selectionChanged?.())}}updateDefaultLabel(){let s=this.cachedDefaultLabel;this.cachedDefaultLabel=Ie(this).trim(),this.isDefaultLabelDirty=!1;let t=this.cachedDefaultLabel!==s;return!this._label&&t&&this.requestUpdate("label",s),t}render(){let s=this.selected;return this.didSSR&&!this.hasUpdated?(this.updateComplete.then(()=>{this.requestUpdate()}),O):$`
      ${s?$`<wa-icon
            part="checked-icon"
            class="check"
            name="check"
            library="system"
            variant="solid"
            aria-hidden="true"
          ></wa-icon>`:$`<span part="checked-icon" class="check" aria-hidden="true"></span>`}
      <slot part="start" name="start" class="start"></slot>
      <slot part="label" class="label" @slotchange=${this.handleDefaultSlotChange}></slot>
      <slot part="end" name="end" class="end"></slot>
    `}};ut.css=Po;g([J(".label")],ut.prototype,"defaultSlot",2);g([ht()],ut.prototype,"current",2);g([w({reflect:!0})],ut.prototype,"value",2);g([w({type:Boolean})],ut.prototype,"disabled",2);g([w({type:Boolean,attribute:!1})],ut.prototype,"selected",2);g([w({type:Boolean,attribute:"selected"})],ut.prototype,"defaultSelected",2);g([w()],ut.prototype,"label",1);ut=g([U("wa-option")],ut);var Ao=N`
  :host {
    --tag-max-size: 10ch;
    --show-duration: var(--wa-transition-fast);
    --hide-duration: var(--wa-transition-fast);
  }

  /* Add ellipses to multi select options */
  :host wa-tag::part(content) {
    display: initial;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: var(--tag-max-size);
  }

  :host .disabled [part~='combobox'] {
    opacity: 0.5;
    cursor: not-allowed;
    outline: none;
  }

  :host .enabled:is(.open, :focus-within) [part~='combobox'] {
    outline-color: var(--wa-color-focus);
  }

  /** The popup */
  .select {
    flex: 1 1 auto;
    display: inline-flex;
    width: 100%;
    position: relative;
    vertical-align: middle;

    /* Pass through from select to the popup */
    --show-duration: inherit;
    --hide-duration: inherit;

    &::part(popup) {
      z-index: 900;
    }

    &[data-current-placement^='top']::part(popup) {
      transform-origin: bottom;
    }

    &[data-current-placement^='bottom']::part(popup) {
      transform-origin: top;
    }
  }

  /* Combobox */
  .combobox {
    flex: 1;
    display: flex;
    width: 100%;
    min-width: 0;
    align-items: center;
    justify-content: start;

    min-height: var(--wa-form-control-height);

    background-color: var(--wa-form-control-background-color);
    border-color: var(--wa-form-control-border-color);
    border-radius: var(--wa-form-control-border-radius);
    border-style: var(--wa-form-control-border-style);
    border-width: var(--wa-form-control-border-width);
    color: var(--wa-form-control-value-color);
    cursor: pointer;
    font-family: inherit;
    font-weight: var(--wa-form-control-value-font-weight);
    line-height: var(--wa-form-control-value-line-height);
    overflow: hidden;
    padding: 0 var(--wa-form-control-padding-inline);
    position: relative;
    vertical-align: middle;
    transition:
      background-color var(--wa-transition-normal),
      border-color var(--wa-transition-normal),
      outline-color var(--wa-transition-fast);
    transition-timing-function: var(--wa-transition-easing);
    outline: var(--wa-focus-ring-style) var(--wa-focus-ring-width) transparent;
    outline-offset: var(--wa-focus-ring-offset);

    /* Pills */
    :host([pill]) & {
      border-radius: var(--wa-border-radius-pill);
    }
  }

  /* Appearance modifiers */
  :host([appearance='outlined']) .combobox {
    background-color: var(--wa-form-control-background-color);
    border-color: var(--wa-form-control-border-color);
  }

  :host([appearance='filled']) .combobox {
    background-color: var(--wa-color-neutral-fill-quiet);
    border-color: var(--wa-color-neutral-fill-quiet);
  }

  :host([appearance='filled-outlined']) .combobox {
    background-color: var(--wa-color-neutral-fill-quiet);
    border-color: var(--wa-form-control-border-color);
  }

  .display-input {
    position: relative;
    width: 100%;
    font: inherit;
    border: none;
    background: none;
    line-height: var(--wa-form-control-value-line-height);
    color: var(--wa-form-control-value-color);
    cursor: inherit;
    overflow: hidden;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: var(--wa-form-control-placeholder-color);
    }
  }

  /* Manage spacing when tags are present */
  :host([multiple]) {
    --_padding-with-tags: calc(var(--wa-form-control-height) * 0.1 - var(--wa-form-control-border-width));

    & .combobox:has(.tags wa-tag) {
      padding-block: var(--_padding-with-tags);
      padding-inline-start: var(--_padding-with-tags);
    }
  }

  /* Visually hide the display input when multiple is enabled */
  :host([multiple]) .combobox:has(.tags wa-tag) .display-input {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .value-input {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    padding: 0;
    margin: 0;
  }

  .tags {
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25em;

    &::slotted(wa-tag) {
      cursor: pointer !important;
    }

    .disabled &,
    .disabled &::slotted(wa-tag) {
      cursor: not-allowed !important;
    }
  }

  /* Start and End */

  .start,
  .end {
    flex: 0;
    display: inline-flex;
    align-items: center;
    color: var(--wa-color-neutral-on-quiet);
  }

  .end::slotted(*) {
    margin-inline-start: var(--wa-form-control-padding-inline);
  }

  .start::slotted(*) {
    margin-inline-end: var(--wa-form-control-padding-inline);
  }

  :host([multiple]) .combobox:has(.tags wa-tag) .start::slotted(*) {
    margin-inline-start: calc(var(--wa-form-control-padding-inline) - var(--_padding-with-tags));
  }

  /* Clear button */
  [part~='clear-button'] {
    flex: 0 0 auto;
    display: inline-flex;
    align-self: stretch;
    align-items: center;
    justify-content: center;
    inline-size: 1.5em;
    font-size: inherit;
    color: var(--wa-color-neutral-on-quiet);
    border: none;
    background: none;
    padding: 0;
    transition: color var(--wa-transition-normal);
    cursor: pointer;
    /* The box is wider than the glyph, so overhang half that growth on each side. Keeps the glyph
       on the same trailing axis as the segmented-field pickers' clear buttons. */
    margin-inline-start: calc(var(--wa-form-control-padding-inline) - 0.125em);
    margin-inline-end: -0.125em;

    &:focus {
      outline: none;
    }

    @media (hover: hover) {
      &:hover {
        color: color-mix(in oklab, currentColor, var(--wa-color-mix-hover));
      }
    }

    &:active {
      color: color-mix(in oklab, currentColor, var(--wa-color-mix-active));
    }
  }

  /* Expand icon */
  .expand-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    color: var(--wa-color-neutral-on-quiet);
    transition: rotate var(--wa-transition-slow) var(--wa-transition-easing);
    rotate: 0deg;
    margin-inline-start: var(--wa-form-control-padding-inline);

    .open & {
      rotate: -180deg;
    }
  }

  /* Listbox */
  .listbox {
    display: block;
    position: relative;
    font: inherit;
    box-shadow: var(--wa-shadow-m);
    background: var(--wa-color-surface-raised);
    border-color: var(--wa-color-surface-border);
    border-radius: var(--wa-border-radius-m);
    border-style: var(--wa-border-style);
    border-width: var(--wa-border-width-s);
    padding: 0.25em;
    overflow: auto;
    overscroll-behavior: none;

    /* Make sure it adheres to the popup's auto size */
    max-width: var(--auto-size-available-width);
    max-height: var(--auto-size-available-height);

    &::slotted(wa-divider) {
      --spacing: 0.5em;
    }
  }

  /* Space options with half the listbox's padding */
  .listbox slot:not([name]) {
    display: flex;
    flex-direction: column;
    gap: 0.125em;
  }

  slot:not([name])::slotted(small) {
    display: block;
    font-size: var(--wa-font-size-smaller);
    font-weight: var(--wa-font-weight-semibold);
    color: var(--wa-color-text-quiet);
    padding-block: 0.5em;
    padding-inline: 2.25em;
  }
`;function hh(s,t){return{top:Math.round(s.getBoundingClientRect().top-t.getBoundingClientRect().top),left:Math.round(s.getBoundingClientRect().left-t.getBoundingClientRect().left)}}function Rs(s,t,e="vertical",i="smooth"){let n=hh(s,t),r=n.top+t.scrollTop,o=n.left+t.scrollLeft,a=t.scrollLeft,l=t.scrollLeft+t.offsetWidth,h=t.scrollTop,c=t.scrollTop+t.offsetHeight;(e==="horizontal"||e==="both")&&(o<a?t.scrollTo({left:o,behavior:i}):o+s.clientWidth>l&&t.scrollTo({left:o-t.offsetWidth+s.clientWidth,behavior:i})),(e==="vertical"||e==="both")&&(r<h?t.scrollTo({top:r,behavior:i}):r+s.clientHeight>c&&t.scrollTo({top:r-t.offsetHeight+s.clientHeight,behavior:i}))}var $o=class extends Event{constructor(){super("wa-show",{bubbles:!0,cancelable:!0,composed:!0})}};var Ro=class extends Event{constructor(s){super("wa-hide",{bubbles:!0,cancelable:!0,composed:!0}),this.detail=s}};var No=class extends Event{constructor(){super("wa-after-show",{bubbles:!0,cancelable:!1,composed:!0})}};var Oo=class extends Event{constructor(){super("wa-after-hide",{bubbles:!0,cancelable:!1,composed:!0})}};var Fo=class extends Event{constructor(){super("wa-clear",{bubbles:!0,cancelable:!1,composed:!0})}};var Kt=[];function Io(s){Ns(s),Kt.push(s)}function Ns(s){for(let t=Kt.length-1;t>=0;t--)if(Kt[t]===s){Kt.splice(t,1);break}}function Bo(s){return Kt.length>0&&Kt[Kt.length-1]===s}var Vo=(s={})=>{let{validationElement:t,validationProperty:e}=s;t||typeof document<"u"&&"createElement"in document&&(t=Object.assign(document.createElement("input"),{required:!0})),e||(e="value");let i={observedAttributes:["required"],message:t?.validationMessage,checkValidity(n){let r={message:"",isValid:!0,invalidKeys:[]};return(n.required??n.hasAttribute("required"))&&!n[e]&&(r.message=typeof i.message=="function"?i.message(n):i.message||"",r.isValid=!1,r.invalidKeys.push("valueMissing")),r}};return i};var qo=N`
  :host {
    display: flex;
    flex-direction: column;
  }

  /* Treat wrapped labels, inputs, and hints as direct children of the host element */
  [part~='form-control'] {
    display: contents;
  }

  /* Label */
  :is([part~='form-control-label'], [part~='label']):has(*:not(:empty)),
  :is([part~='form-control-label'], [part~='label']).has-label {
    display: inline-flex;
    color: var(--wa-form-control-label-color);
    font-weight: var(--wa-form-control-label-font-weight);
    line-height: var(--wa-form-control-label-line-height);
    margin-block-end: 0.5em;
  }

  :host([required]) :is([part~='form-control-label'], [part~='label'])::after {
    content: var(--wa-form-control-required-content);
    margin-inline-start: var(--wa-form-control-required-content-offset);
    color: var(--wa-form-control-required-content-color);
  }

  /* Help text */
  [part~='hint'] {
    display: block;
    color: var(--wa-form-control-hint-color);
    font-weight: var(--wa-form-control-hint-font-weight);
    line-height: var(--wa-form-control-hint-line-height);
    margin-block-start: 0.5em;
    font-size: var(--wa-font-size-smaller);

    &:not(.has-slotted, .has-hint, .has-count) {
      display: none;
    }
  }
`;function Os(s,t){return new Promise(e=>{function i(n){n.target===s&&(s.removeEventListener(t,i),e())}s.addEventListener(t,i)})}function Fs(s,t){return new Promise(e=>{let i=new AbortController,{signal:n}=i;if(s.classList.contains(t))return;s.classList.add(t);let r=!1,o=()=>{r||(r=!0,s.classList.remove(t),e(),i.abort())};s.addEventListener("animationend",o,{once:!0,signal:n}),s.addEventListener("animationcancel",o,{once:!0,signal:n}),requestAnimationFrame(()=>{!r&&s.getAnimations().length===0&&o()})})}var Be=class extends ce{constructor(t){if(super(t),this.it=O,t.type!==wi.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===O||t==null)return this._t=void 0,this.it=t;if(t===lt)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;let e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};Be.directiveName="unsafeHTML",Be.resultType=1;var Do=yi(Be);var P=class extends rt{constructor(){super(...arguments),this.assumeInteractionOn=["blur","input"],this.cachedOptions=null,this.hasSlotController=new le(this,"hint","label"),this.localize=new ot(this),this.selectionOrder=new Map,this.typeToSelectString="",this.slotChangePending=!1,this.displayLabel="",this.selectedOptions=[],this.name="",this._defaultValue=null,this.size="m",this.placeholder="",this.multiple=!1,this.maxOptionsVisible=3,this.disabled=!1,this.withClear=!1,this.open=!1,this.appearance="outlined",this.pill=!1,this.label="",this.placement="bottom",this.hint="",this.withLabel=!1,this.withHint=!1,this.required=!1,this.getTag=s=>$`
        <wa-tag
          part="tag"
          exportparts="
            base:tag__base,
            content:tag__content,
            remove-button:tag__remove-button,
            remove-button__base:tag__remove-button__base
          "
          ?pill=${this.pill}
          size=${this.size}
          with-remove
          data-value=${s.value}
          @wa-remove=${t=>this.handleTagRemove(t,s)}
        >
          ${s.label}
        </wa-tag>
      `,this.handleDocumentFocusIn=s=>{let t=s.composedPath();this&&!t.includes(this)&&this.hide()},this.handleDocumentKeyDown=s=>{let t=s.target,e=t.closest('[part~="clear-button"]')!==null,i=t.closest("wa-button")!==null;if(!(e||i)){if(s.key==="Escape"&&this.open&&Bo(this)&&(s.preventDefault(),s.stopPropagation(),this.hide(),this.displayInput.focus({preventScroll:!0})),s.key==="Enter"||s.key===" "&&this.typeToSelectString===""){if(s.preventDefault(),s.stopImmediatePropagation(),!this.open){this.show();return}this.currentOption&&!this.currentOption.disabled&&(this.valueHasChanged=!0,this.hasInteracted=!0,this.multiple?this.toggleOptionSelection(this.currentOption):this.setSelectedOptions(this.currentOption),this.updateComplete.then(()=>{this.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.multiple||(this.hide(),this.displayInput.focus({preventScroll:!0})));return}if(["ArrowUp","ArrowDown","Home","End"].includes(s.key)){let n=this.getAllOptions(),r=n.indexOf(this.currentOption),o=Math.max(0,r);if(s.preventDefault(),!this.open&&(this.show(),this.currentOption))return;s.key==="ArrowDown"?(o=r+1,o>n.length-1&&(o=0)):s.key==="ArrowUp"?(o=r-1,o<0&&(o=n.length-1)):s.key==="Home"?o=0:s.key==="End"&&(o=n.length-1),this.setCurrentOption(n[o])}if(s.key?.length===1||s.key==="Backspace"){let n=this.getAllOptions();if(s.metaKey||s.ctrlKey||s.altKey)return;if(!this.open){if(s.key==="Backspace")return;this.show()}s.stopPropagation(),s.preventDefault(),clearTimeout(this.typeToSelectTimeout),this.typeToSelectTimeout=window.setTimeout(()=>this.typeToSelectString="",1e3),s.key==="Backspace"?this.typeToSelectString=this.typeToSelectString.slice(0,-1):this.typeToSelectString+=s.key.toLowerCase();for(let r of n)if(r.label.toLowerCase().startsWith(this.typeToSelectString)){this.setCurrentOption(r);break}}}},this.handleDocumentMouseDown=s=>{let t=s.composedPath();this&&!t.includes(this)&&this.hide()}}static get validators(){let s=[Vo({validationElement:Object.assign(document.createElement("select"),{required:!0})})];return[...super.validators,...s]}get validationTarget(){return this.valueInput}set defaultValue(s){this._defaultValue=this.convertDefaultValue(s)}get defaultValue(){return this.convertDefaultValue(this._defaultValue)}rawValuesEqual(s,t){return s==null&&t==null?!0:s==null||t==null||s.length!==t.length?!1:s.every((e,i)=>e===t[i])}convertDefaultValue(s){return!(this.multiple||this.hasAttribute("multiple"))&&Array.isArray(s)&&(s=s[0]),s}set value(s){let t=this.value;s instanceof FormData&&(s=s.getAll(this.name)),s!=null&&!Array.isArray(s)&&(s=[s]);let e=this._value;this._value=s??null,this.rawValuesEqual(e,this._value)||(this.valueHasChanged=!0,this.requestUpdate("value",t))}get value(){let s=this._value??this.defaultValue??null;s!=null&&(s=Array.isArray(s)?s:[s]),this.optionValues=new Set(this.getAllOptions().filter(e=>!e.disabled).map(e=>e.value));let t=s;return s!=null&&(t=s.filter(e=>this.optionValues.has(e)),t=this.multiple?t:t[0],t=t??null),t}handleSizeChange(){At(this.localName,this.size)}connectedCallback(){super.connectedCallback(),this.processSlotChange(),this.open=!1}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.cachedOptions=null}updateDefaultValue(){let t=this.getAllOptions().filter(e=>e.hasAttribute("selected")||e.defaultSelected);if(t.length>0){let e=t.map(i=>i.value);this._defaultValue=this.multiple?e:e[0]}this.hasAttribute("value")&&(this._defaultValue=this.getAttribute("value")||null)}addOpenListeners(){document.addEventListener("focusin",this.handleDocumentFocusIn),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown),Io(this),this.getRootNode()!==document&&this.getRootNode().addEventListener("focusin",this.handleDocumentFocusIn)}removeOpenListeners(){document.removeEventListener("focusin",this.handleDocumentFocusIn),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),Ns(this),this.getRootNode()!==document&&this.getRootNode().removeEventListener("focusin",this.handleDocumentFocusIn)}handleFocus(){this.displayInput.setSelectionRange(0,0)}handleLabelClick(){this.displayInput.focus()}handleComboboxClick(s){s.preventDefault()}handleComboboxMouseDown(s){let e=s.composedPath().some(i=>i instanceof Element&&i.tagName.toLowerCase()==="wa-button");this.disabled||e||(s.preventDefault(),this.displayInput.focus({preventScroll:!0}),this.open=!this.open)}handleComboboxKeyDown(s){s.stopPropagation(),this.handleDocumentKeyDown(s)}handleClearClick(s){s.stopPropagation(),this.hasInteracted=!0,this.valueHasChanged=!0,this.value!==null&&(this.displayLabel="",this.selectionOrder.clear(),this.setSelectedOptions([]),this.displayInput.focus({preventScroll:!0}),this.updateComplete.then(()=>{this.dispatchEvent(new Fo),this.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}))}handleClearMouseDown(s){s.stopPropagation(),s.preventDefault()}handleOptionClick(s){let e=s.target.closest("wa-option");e&&!e.disabled&&(this.hasInteracted=!0,this.valueHasChanged=!0,this.multiple?this.toggleOptionSelection(e):this.setSelectedOptions(e),this.updateComplete.then(()=>this.displayInput.focus({preventScroll:!0})),this.requestUpdate("value"),this.updateComplete.then(()=>{this.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.multiple||(this.hide(),this.displayInput.focus({preventScroll:!0})))}handleDefaultSlotChange(){this.slotChangePending||(this.slotChangePending=!0,queueMicrotask(()=>{this.slotChangePending=!1,this.processSlotChange()}))}processSlotChange(){if(customElements.get("wa-option")||customElements.whenDefined("wa-option").then(()=>this.handleDefaultSlotChange()),this.didSSR&&!this.hasUpdated){this.updateComplete.then(()=>{this.handleDefaultSlotChange()});return}this.cachedOptions=null;let s=this.getAllOptions();this.updateDefaultValue();let t=this.value;if(t==null||!this.valueHasChanged&&!this.hasInteracted){this.selectionChanged();return}Array.isArray(t)||(t=[t]);let e=s.filter(i=>t.includes(i.value));this.setSelectedOptions(e)}handleTagRemove(s,t){if(s.stopPropagation(),this.disabled)return;this.hasInteracted=!0,this.valueHasChanged=!0;let e=t;if(!e){let i=s.target.closest("wa-tag[data-value]");if(i){let n=i.dataset.value;e=this.selectedOptions.find(r=>r.value===n)}}e&&(this.toggleOptionSelection(e,!1),this.updateComplete.then(()=>{this.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}))}getAllOptions(){return this.cachedOptions?this.cachedOptions:this?.querySelectorAll?(this.cachedOptions=[...this.querySelectorAll("wa-option")],this.cachedOptions):[]}getFirstOption(){return this.querySelector("wa-option")}setCurrentOption(s){this.getAllOptions().forEach(e=>{e.current=!1,e.tabIndex=-1}),s&&(this.currentOption=s,s.current=!0,s.tabIndex=0,s.focus({preventScroll:!0}),this.open&&!this.listbox.hidden&&Rs(s,this.listbox,"vertical","auto"))}setSelectedOptions(s){let t=this.getAllOptions(),e=Array.isArray(s)?s:[s];t.forEach(i=>{e.includes(i)||(i.selected=!1)}),e.length&&e.forEach(i=>i.selected=!0),this.selectionChanged()}toggleOptionSelection(s,t){t===!0||t===!1?s.selected=t:s.selected=!s.selected,this.selectionChanged()}selectionChanged(){let t=this.getAllOptions().filter(o=>{if(!this.hasInteracted&&!this.valueHasChanged){let a=this.defaultValue,l=Array.isArray(a)?a:[a];return o.hasAttribute("selected")||o.defaultSelected||o.selected||l?.includes(o.value)}return o.selected}),e=new Set(t.map(o=>o.value));for(let o of this.selectionOrder.keys())e.has(o)||this.selectionOrder.delete(o);let n=(this.selectionOrder.size>0?Math.max(...this.selectionOrder.values()):-1)+1;for(let o of t)this.selectionOrder.has(o.value)||this.selectionOrder.set(o.value,n++);this.selectedOptions=t.sort((o,a)=>{let l=this.selectionOrder.get(o.value)??0,h=this.selectionOrder.get(a.value)??0;return l-h});let r=new Set(this.selectedOptions.map(o=>o.value));if(r.size>0||this._value){let o=this._value;if(this._value==null){let a=this.defaultValue??[];this._value=Array.isArray(a)?a:[a]}this._value=this._value?.filter(a=>!this.optionValues?.has(a))??null,this._value?.unshift(...r),this.requestUpdate("value",o)}if(this.multiple)this.placeholder&&!this.value?.length?this.displayLabel="":this.displayLabel=this.localize.term("numOptionsSelected",this.selectedOptions.length);else{let o=this.selectedOptions[0];this.displayLabel=o?.label??""}this.updateComplete.then(()=>{this.updateValidity()})}get tags(){return this.selectedOptions.map((s,t)=>{if(t<this.maxOptionsVisible||this.maxOptionsVisible<=0){let e=this.getTag(s,t);return e?typeof e=="string"?Do(e):e:null}else if(t===this.maxOptionsVisible)return $`
          <wa-tag
            part="tag"
            exportparts="
              base:tag__base,
              content:tag__content,
              remove-button:tag__remove-button,
              remove-button__base:tag__remove-button__base
            "
            >+${this.selectedOptions.length-t}</wa-tag
          >
        `;return null})}updated(s){super.updated(s),(s.has("value")||s.has("displayLabel"))&&this.customStates.set("blank",!this.value&&!this.displayLabel)}handleDisabledChange(){this.disabled&&this.open&&(this.open=!1)}handleValueChange(){let s=this.getAllOptions(),t=Array.isArray(this.value)?this.value:[this.value],e=s.filter(i=>t.includes(i.value));this.setSelectedOptions(e),this.updateValidity()}async handleOpenChange(){if(this.open&&!this.disabled){this.setCurrentOption(this.selectedOptions[0]||this.getFirstOption());let s=new $o;if(this.dispatchEvent(s),s.defaultPrevented){this.open=!1;return}this.addOpenListeners(),this.listbox.hidden=!1,this.popup.active=!0,requestAnimationFrame(()=>{this.setCurrentOption(this.currentOption)}),await Fs(this.popup.popup,"show"),this.currentOption&&Rs(this.currentOption,this.listbox,"vertical","auto"),this.dispatchEvent(new No)}else{let s=new Ro;if(this.dispatchEvent(s),s.defaultPrevented){this.open=!1;return}this.removeOpenListeners(),await Fs(this.popup.popup,"hide"),this.listbox.hidden=!0,this.popup.active=!1,this.dispatchEvent(new Oo)}}async show(){if(this.open||this.disabled){this.open=!1;return}return this.open=!0,Os(this,"wa-after-show")}async hide(){if(!this.open||this.disabled){this.open=!1;return}return this.open=!1,Os(this,"wa-after-hide")}focus(s){this.displayInput.focus(s)}blur(){this.displayInput.blur()}formResetCallback(){this.selectionOrder.clear(),this.value=this.defaultValue,super.formResetCallback(),this.handleValueChange(),this.updateComplete.then(()=>{this.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))})}render(){let s=this.hasSlotController.test("label","withLabel"),t=this.hasSlotController.test("hint","withHint"),e=this.label?!0:!!s,i=this.hint?!0:!!t,n=(this.hasUpdated||!1)&&this.withClear&&!this.disabled&&(this.displayLabel||this.value&&this.value.length>0);return $`
      <div
        part="form-control"
        class=${et({"form-control":!0,"form-control-has-label":e})}
      >
        <label
          id="label"
          part="form-control-label label"
          class=${et({label:!0,"has-label":e})}
          aria-hidden=${e?"false":"true"}
          @click=${this.handleLabelClick}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <wa-popup
            class=${et({select:!0,open:this.open,disabled:this.disabled,enabled:!this.disabled,multiple:this.multiple})}
            placement=${this.placement}
            flip
            shift
            sync="width"
            auto-size="vertical"
            auto-size-padding="10"
          >
            <div
              part="combobox"
              class="combobox"
              slot="anchor"
              @keydown=${this.handleComboboxKeyDown}
              @mousedown=${this.handleComboboxMouseDown}
              @click=${this.handleComboboxClick}
            >
              <slot part="start" name="start" class="start"></slot>

              <input
                part="display-input"
                class="display-input"
                type="text"
                placeholder=${this.placeholder}
                .disabled=${this.disabled}
                .value=${this.displayLabel}
                ?required=${this.required}
                autocomplete="off"
                spellcheck="false"
                autocapitalize="off"
                readonly
                aria-invalid=${!this.validity.valid}
                aria-controls="listbox"
                aria-expanded=${this.open?"true":"false"}
                aria-haspopup="listbox"
                aria-labelledby="label"
                aria-disabled=${this.disabled?"true":"false"}
                aria-describedby="hint"
                role="combobox"
                tabindex="0"
                @focus=${this.handleFocus}
              />

              <!-- Tags need to wait for first hydration before populating otherwise it will create a hydration mismatch. -->
              ${this.multiple&&this.hasUpdated?$`<div part="tags" class="tags" @wa-remove=${this.handleTagRemove}>${this.tags}</div>`:""}

              <input
                class="value-input"
                type="text"
                ?disabled=${this.disabled}
                ?required=${this.required}
                .value=${Array.isArray(this.value)?this.value.join(", "):this.value}
                tabindex="-1"
                aria-hidden="true"
                @focus=${()=>this.focus()}
              />

              ${n?$`
                    <button
                      part="clear-button"
                      type="button"
                      aria-label=${this.localize.term("clearEntry")}
                      @mousedown=${this.handleClearMouseDown}
                      @click=${this.handleClearClick}
                      tabindex="-1"
                    >
                      <slot name="clear-icon">
                        <wa-icon name="circle-xmark" library="system" variant="regular"></wa-icon>
                      </slot>
                    </button>
                  `:""}

              <slot name="end" part="end" class="end"></slot>

              <slot name="expand-icon" part="expand-icon" class="expand-icon">
                <wa-icon library="system" name="chevron-down" variant="solid"></wa-icon>
              </slot>
            </div>

            <div
              id="listbox"
              role="listbox"
              aria-expanded=${this.open?"true":"false"}
              aria-multiselectable=${this.multiple?"true":"false"}
              aria-labelledby="label"
              part="listbox"
              class="listbox"
              tabindex="-1"
              @mouseup=${this.handleOptionClick}
            >
              <slot @slotchange=${this.handleDefaultSlotChange}></slot>
            </div>
          </wa-popup>
        </div>

        <slot
          id="hint"
          name="hint"
          part="hint"
          class=${et({"has-slotted":i})}
          aria-hidden=${i?"false":"true"}
          >${this.hint}</slot
        >
      </div>
    `}};P.css=[Ao,qo,pt];g([J(".select")],P.prototype,"popup",2);g([J(".combobox")],P.prototype,"combobox",2);g([J(".display-input")],P.prototype,"displayInput",2);g([J(".value-input")],P.prototype,"valueInput",2);g([J(".listbox")],P.prototype,"listbox",2);g([ht()],P.prototype,"displayLabel",2);g([ht()],P.prototype,"currentOption",2);g([ht()],P.prototype,"selectedOptions",2);g([w({reflect:!0})],P.prototype,"name",2);g([w({attribute:!1})],P.prototype,"defaultValue",1);g([w({attribute:"value",reflect:!1})],P.prototype,"value",1);g([w({reflect:!0})],P.prototype,"size",2);g([K("size")],P.prototype,"handleSizeChange",1);g([w()],P.prototype,"placeholder",2);g([w({type:Boolean,reflect:!0})],P.prototype,"multiple",2);g([w({attribute:"max-options-visible",type:Number})],P.prototype,"maxOptionsVisible",2);g([w({type:Boolean})],P.prototype,"disabled",2);g([w({attribute:"with-clear",type:Boolean})],P.prototype,"withClear",2);g([w({type:Boolean,reflect:!0})],P.prototype,"open",2);g([w({reflect:!0})],P.prototype,"appearance",2);g([w({type:Boolean,reflect:!0})],P.prototype,"pill",2);g([w()],P.prototype,"label",2);g([w({reflect:!0})],P.prototype,"placement",2);g([w({attribute:"hint"})],P.prototype,"hint",2);g([w({attribute:"with-label",type:Boolean})],P.prototype,"withLabel",2);g([w({attribute:"with-hint",type:Boolean})],P.prototype,"withHint",2);g([w({type:Boolean,reflect:!0})],P.prototype,"required",2);g([w({attribute:!1})],P.prototype,"getTag",2);g([K("disabled",{waitUntilFirstUpdate:!0})],P.prototype,"handleDisabledChange",1);g([K("value",{waitUntilFirstUpdate:!0})],P.prototype,"handleValueChange",1);g([K("open",{waitUntilFirstUpdate:!0})],P.prototype,"handleOpenChange",1);P=g([U("wa-select")],P);P.disableWarning?.("change-in-update");var Wo=class extends Event{constructor(){super("wa-remove",{bubbles:!0,cancelable:!1,composed:!0})}};var Uo=N`
  @layer wa-component {
    :host {
      display: inline-flex;
      gap: 0.5em;
      border-radius: var(--wa-border-radius-m);
      align-items: center;
      background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      border-color: var(--wa-color-border-normal, var(--wa-color-neutral-border-normal));
      border-style: var(--wa-border-style);
      border-width: var(--wa-border-width-s);
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      font-size: inherit;
      line-height: 1;
      white-space: nowrap;
      user-select: none;
      -webkit-user-select: none;
      height: calc(var(--wa-form-control-height) * 0.8);
      line-height: calc(var(--wa-form-control-height) - var(--wa-form-control-border-width) * 2);
      padding: 0 0.75em;
    }

    /* Appearance modifiers */
    :host([appearance='outlined']) {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: var(--wa-color-border-loud, var(--wa-color-neutral-border-loud));
    }

    :host([appearance='filled']) {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      border-color: transparent;
    }

    :host([appearance='filled-outlined']) {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      border-color: var(--wa-color-border-normal, var(--wa-color-neutral-border-normal));
    }

    :host([appearance='accent']) {
      color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
      background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));
      border-color: transparent;
    }
  }

  .content {
    font-size: var(--wa-font-size-smaller);
  }

  [part='remove-button'] {
    line-height: 1;
  }

  [part='remove-button']::part(base) {
    padding: 0;
    height: 1em;
    width: 1em;
    color: currentColor;
  }

  @media (hover: hover) {
    :host(:hover) > [part='remove-button']::part(base) {
      background-color: transparent;
      color: color-mix(in oklab, currentColor, var(--wa-color-mix-hover));
    }
  }

  :host(:active) > [part='remove-button']::part(base) {
    background-color: transparent;
    color: color-mix(in oklab, currentColor, var(--wa-color-mix-active));
  }

  /*
   * Pill modifier
   */
  :host([pill]) {
    border-radius: var(--wa-border-radius-pill);
  }
`;var _t=class extends D{constructor(){super(...arguments),this.localize=new ot(this),this.variant="neutral",this.appearance="filled-outlined",this.size="m",this.pill=!1,this.withRemove=!1}handleSizeChange(){At(this.localName,this.size)}handleRemoveClick(){this.dispatchEvent(new Wo)}render(){return $`
      <slot part="content" class="content"></slot>

      ${this.withRemove?$`
            <wa-button
              part="remove-button"
              exportparts="base:remove-button__base"
              class="remove"
              appearance="plain"
              size=${this.size}
              @click=${this.handleRemoveClick}
              tabindex="-1"
            >
              <wa-icon name="xmark" library="system" variant="solid" label=${this.localize.term("remove")}></wa-icon>
            </wa-button>
          `:""}
    `}};_t.css=[Uo,ae,pt];g([w({reflect:!0})],_t.prototype,"variant",2);g([w({reflect:!0})],_t.prototype,"appearance",2);g([w({reflect:!0})],_t.prototype,"size",2);g([K("size")],_t.prototype,"handleSizeChange",1);g([w({type:Boolean,reflect:!0})],_t.prototype,"pill",2);g([w({attribute:"with-remove",type:Boolean})],_t.prototype,"withRemove",2);_t=g([U("wa-tag")],_t);var Ho=class extends Event{constructor(){super("wa-reposition",{bubbles:!0,cancelable:!1,composed:!0})}};var jo=N`
  :host {
    --arrow-color: black;
    --arrow-size: var(--wa-tooltip-arrow-size);
    --popup-border-width: 0px;
    --show-duration: var(--wa-transition-fast);
    --hide-duration: var(--wa-transition-fast);

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45) to calculate the length of the arrow after rotation.
     *
     * The diamond will be translated inward by --arrow-base-offset, the border thickness, to centralise it on
     * the inner edge of the popup border. This also means we need to increase the size of the arrow by the
     * same amount to compensate.
     *
     * A diamond shaped clipping mask is used to avoid overlap of popup content. This extends slightly inward so
     * the popup border is covered with no sub-pixel rounding artifacts. The diamond corners are mitred at 22.5º
     * to properly merge any arrow border with the popup border. The constant 1.4142 is derived from 1 + tan(22.5).
     *
     */
    --arrow-base-offset: var(--popup-border-width);
    --arrow-size-diagonal: calc((var(--arrow-size) + var(--arrow-base-offset)) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));
    --arrow-size-div: calc(var(--arrow-size-diagonal) * 2);
    --arrow-clipping-corner: calc(var(--arrow-base-offset) * 1.4142);

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);

    /* Clear UA styles for [popover] */
    :where(&) {
      inset: unset;
      padding: unset;
      margin: unset;
      width: unset;
      height: unset;
      color: unset;
      background: unset;
      border: unset;
      overflow: unset;
    }
  }

  .popup-fixed {
    position: fixed;
  }

  .popup:not(.popup-active) {
    display: none;
  }

  .arrow {
    position: absolute;
    width: var(--arrow-size-div);
    height: var(--arrow-size-div);
    background: var(--arrow-color);
    z-index: 3;
    clip-path: polygon(
      var(--arrow-clipping-corner) 100%,
      var(--arrow-base-offset) calc(100% - var(--arrow-base-offset)),
      calc(var(--arrow-base-offset) - 2px) calc(100% - var(--arrow-base-offset)),
      calc(100% - var(--arrow-base-offset)) calc(var(--arrow-base-offset) - 2px),
      calc(100% - var(--arrow-base-offset)) var(--arrow-base-offset),
      100% var(--arrow-clipping-corner),
      100% 100%
    );
    rotate: 45deg;
  }

  :host([data-current-placement|='left']) .arrow {
    rotate: -45deg;
  }

  :host([data-current-placement|='right']) .arrow {
    rotate: 135deg;
  }

  :host([data-current-placement|='bottom']) .arrow {
    rotate: 225deg;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge-visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: 899;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }

  /* Built-in animations */
  .show {
    animation: show var(--show-duration) ease;
  }

  .hide {
    animation: show var(--hide-duration) ease reverse;
  }

  @keyframes show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .show-with-scale {
    animation: show-with-scale var(--show-duration) ease;
  }

  .hide-with-scale {
    animation: show-with-scale var(--hide-duration) ease reverse;
  }

  @keyframes show-with-scale {
    from {
      opacity: 0;
      scale: 0.8;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }
`;var gt=Math.min,dt=Math.max,qe=Math.round,De=Math.floor,vt=s=>({x:s,y:s}),ch={left:"right",right:"left",bottom:"top",top:"bottom"};function Is(s,t,e){return dt(s,gt(t,e))}function Yt(s,t){return typeof s=="function"?s(t):s}function Nt(s){return s.split("-")[0]}function Qt(s){return s.split("-")[1]}function Bs(s){return s==="x"?"y":"x"}function _i(s){return s==="y"?"height":"width"}function bt(s){let t=s[0];return t==="t"||t==="b"?"y":"x"}function Li(s){return Bs(bt(s))}function Qo(s,t,e){e===void 0&&(e=!1);let i=Qt(s),n=Li(s),r=_i(n),o=n==="x"?i===(e?"end":"start")?"right":"left":i==="start"?"bottom":"top";return t.reference[r]>t.floating[r]&&(o=Ve(o)),[o,Ve(o)]}function Go(s){let t=Ve(s);return[Mi(s),t,Mi(t)]}function Mi(s){return s.includes("start")?s.replace("start","end"):s.replace("end","start")}var Ko=["left","right"],Yo=["right","left"],uh=["top","bottom"],dh=["bottom","top"];function mh(s,t,e){switch(s){case"top":case"bottom":return e?t?Yo:Ko:t?Ko:Yo;case"left":case"right":return t?uh:dh;default:return[]}}function Xo(s,t,e,i){let n=Qt(s),r=mh(Nt(s),e==="start",i);return n&&(r=r.map(o=>o+"-"+n),t&&(r=r.concat(r.map(Mi)))),r}function Ve(s){let t=Nt(s);return ch[t]+s.slice(t.length)}function fh(s){var t,e,i,n;return{top:(t=s.top)!=null?t:0,right:(e=s.right)!=null?e:0,bottom:(i=s.bottom)!=null?i:0,left:(n=s.left)!=null?n:0}}function Vs(s){return typeof s!="number"?fh(s):{top:s,right:s,bottom:s,left:s}}function Gt(s){let{x:t,y:e,width:i,height:n}=s;return{width:i,height:n,top:e,left:t,right:t+i,bottom:e+n,x:t,y:e}}function Jo(s,t,e){let{reference:i,floating:n}=s,r=bt(t),o=Li(t),a=_i(o),l=Nt(t),h=r==="y",c=i.x+i.width/2-n.width/2,u=i.y+i.height/2-n.height/2,d=i[a]/2-n[a]/2,m;switch(l){case"top":m={x:c,y:i.y-n.height};break;case"bottom":m={x:c,y:i.y+i.height};break;case"right":m={x:i.x+i.width,y:u};break;case"left":m={x:i.x-n.width,y:u};break;default:m={x:i.x,y:i.y}}let f=Qt(t);return f&&(m[o]+=d*(f==="end"?1:-1)*(e&&h?-1:1)),m}async function Zo(s,t){var e;t===void 0&&(t={});let{x:i,y:n,platform:r,rects:o,elements:a,strategy:l}=s,{boundary:h="clippingAncestors",rootBoundary:c="viewport",elementContext:u="floating",altBoundary:d=!1,padding:m=0}=Yt(t,s),f=Vs(m),b=a[d?u==="floating"?"reference":"floating":u],v=Gt(await r.getClippingRect({element:(e=await(r.isElement==null?void 0:r.isElement(b)))==null||e?b:b.contextElement||await(r.getDocumentElement==null?void 0:r.getDocumentElement(a.floating)),boundary:h,rootBoundary:c,strategy:l})),y=u==="floating"?{x:i,y:n,width:o.floating.width,height:o.floating.height}:o.reference,_=await(r.getOffsetParent==null?void 0:r.getOffsetParent(a.floating)),S=await(r.isElement==null?void 0:r.isElement(_))&&await(r.getScale==null?void 0:r.getScale(_))||{x:1,y:1},k=Gt(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:y,offsetParent:_,strategy:l}):y);return{top:(v.top-k.top+f.top)/S.y,bottom:(k.bottom-v.bottom+f.bottom)/S.y,left:(v.left-k.left+f.left)/S.x,right:(k.right-v.right+f.right)/S.x}}var ph=50,ta=async(s,t,e)=>{let{placement:i="bottom",strategy:n="absolute",middleware:r=[],platform:o}=e,a=o.detectOverflow?o:{...o,detectOverflow:Zo},l=await(o.isRTL==null?void 0:o.isRTL(t)),h=await o.getElementRects({reference:s,floating:t,strategy:n}),{x:c,y:u}=Jo(h,i,l),d=i,m=0,f={};for(let p=0;p<r.length;p++){let b=r[p];if(!b)continue;let{name:v,fn:y}=b,{x:_,y:S,data:k,reset:C}=await y({x:c,y:u,initialPlacement:i,placement:d,strategy:n,middlewareData:f,rects:h,platform:a,elements:{reference:s,floating:t}});c=_??c,u=S??u,f[v]={...f[v],...k},C&&m<ph&&(m++,typeof C=="object"&&(C.placement&&(d=C.placement),C.rects&&(h=C.rects===!0?await o.getElementRects({reference:s,floating:t,strategy:n}):C.rects),{x:c,y:u}=Jo(h,d,l)),p=-1)}return{x:c,y:u,placement:d,strategy:n,middlewareData:f}},ea=s=>({name:"arrow",options:s,async fn(t){let{x:e,y:i,placement:n,rects:r,platform:o,elements:a,middlewareData:l}=t,{element:h,padding:c=0}=Yt(s,t)||{};if(h==null)return{};let u=Vs(c),d={x:e,y:i},m=Li(n),f=_i(m),p=await o.getDimensions(h),b=m==="y",v=b?"top":"left",y=b?"bottom":"right",_=b?"clientHeight":"clientWidth",S=r.reference[f]+r.reference[m]-d[m]-r.floating[f],k=d[m]-r.reference[m],C=await(o.getOffsetParent==null?void 0:o.getOffsetParent(h)),L=C?C[_]:0;(!L||!await(o.isElement==null?void 0:o.isElement(C)))&&(L=a.floating[_]||r.floating[f]);let E=S/2-k/2,x=L/2-p[f]/2-1,z=gt(u[v],x),I=gt(u[y],x),j=L-p[f]-I,V=L/2-p[f]/2+E,q=Is(z,V,j),B=!l.arrow&&Qt(n)!=null&&V!==q&&r.reference[f]/2-(V<z?z:I)-p[f]/2<0,W=B?V<z?V-z:V-j:0;return{[m]:d[m]+W,data:{[m]:q,centerOffset:V-q-W,...B&&{alignmentOffset:W}},reset:B}}});var ia=function(s){return s===void 0&&(s={}),{name:"flip",options:s,async fn(t){var e,i;let{placement:n,middlewareData:r,rects:o,initialPlacement:a,platform:l,elements:h}=t,{mainAxis:c=!0,crossAxis:u=!0,fallbackPlacements:d,fallbackStrategy:m="bestFit",fallbackAxisSideDirection:f="none",flipAlignment:p=!0,...b}=Yt(s,t);if((e=r.arrow)!=null&&e.alignmentOffset)return{};let v=Nt(n),y=bt(a),_=Nt(a)===a,S=await(l.isRTL==null?void 0:l.isRTL(h.floating)),k=d||(_||!p?[Ve(a)]:Go(a)),C=f!=="none";!d&&C&&k.push(...Xo(a,p,f,S));let L=[a,...k],E=await l.detectOverflow(t,b),x=[],z=((i=r.flip)==null?void 0:i.overflows)||[];if(c&&x.push(E[v]),u){let q=Qo(n,o,S);x.push(E[q[0]],E[q[1]])}if(z=[...z,{placement:n,overflows:x}],!x.every(q=>q<=0)){var I,j;let q=(((I=r.flip)==null?void 0:I.index)||0)+1,B=L[q];if(B&&(!(u==="alignment"?y!==bt(B):!1)||z.every(G=>bt(G.placement)===y?G.overflows[0]>0:!0)))return{data:{index:q,overflows:z},reset:{placement:B}};let W=(j=z.filter(tt=>tt.overflows[0]<=0).sort((tt,G)=>tt.overflows[1]-G.overflows[1])[0])==null?void 0:j.placement;if(!W)switch(m){case"bestFit":{var V;let tt=(V=z.filter(G=>{if(C){let nt=bt(G.placement);return nt===y||nt==="y"}return!0}).map(G=>[G.placement,G.overflows.filter(nt=>nt>0).reduce((nt,ke)=>nt+ke,0)]).sort((G,nt)=>G[1]-nt[1])[0])==null?void 0:V[0];tt&&(W=tt);break}case"initialPlacement":W=a;break}if(n!==W)return{reset:{placement:W}}}return{}}}};var gh=new Set(["left","top"]);async function vh(s,t){let{placement:e,platform:i,elements:n}=s,r=await(i.isRTL==null?void 0:i.isRTL(n.floating)),o=Nt(e),a=Qt(e),l=bt(e)==="y",h=gh.has(o)?-1:1,c=r&&l?-1:1,u=Yt(t,s),{mainAxis:d,crossAxis:m,alignmentAxis:f}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:u.mainAxis||0,crossAxis:u.crossAxis||0,alignmentAxis:u.alignmentAxis};return a&&typeof f=="number"&&(m=a==="end"?f*-1:f),l?{x:m*c,y:d*h}:{x:d*h,y:m*c}}var sa=function(s){return s===void 0&&(s=0),{name:"offset",options:s,async fn(t){var e,i;let{x:n,y:r,placement:o,middlewareData:a}=t,l=await vh(t,s);return o===((e=a.offset)==null?void 0:e.placement)&&(i=a.arrow)!=null&&i.alignmentOffset?{}:{x:n+l.x,y:r+l.y,data:{...l,placement:o}}}}},na=function(s){return s===void 0&&(s={}),{name:"shift",options:s,async fn(t){let{x:e,y:i,placement:n,platform:r}=t,{mainAxis:o=!0,crossAxis:a=!1,limiter:l={fn:y=>{let{x:_,y:S}=y;return{x:_,y:S}}},...h}=Yt(s,t),c={x:e,y:i},u=await r.detectOverflow(t,h),d=bt(n),m=Bs(d),f=c[m],p=c[d],b=(y,_)=>Is(_+u[y==="y"?"top":"left"],_,_-u[y==="y"?"bottom":"right"]);o&&(f=b(m,f)),a&&(p=b(d,p));let v=l.fn({...t,[m]:f,[d]:p});return{...v,data:{x:v.x-e,y:v.y-i,enabled:{[m]:o,[d]:a}}}}}};var ra=function(s){return s===void 0&&(s={}),{name:"size",options:s,async fn(t){let{placement:e,rects:i,platform:n,elements:r}=t,{apply:o=()=>{},...a}=Yt(s,t),l=await n.detectOverflow(t,a),h=Nt(e),c=Qt(e),u=bt(e)==="y",{width:d,height:m}=i.floating,f,p;h==="top"||h==="bottom"?(f=h,p=c===(await(n.isRTL==null?void 0:n.isRTL(r.floating))?"start":"end")?"left":"right"):(p=h,f=c==="end"?"top":"bottom");let b=m-l.top-l.bottom,v=d-l.left-l.right,y=gt(m-l[f],b),_=gt(d-l[p],v),S=t.middlewareData.shift,k=!S,C=y,L=_;S!=null&&S.enabled.x&&(L=v),S!=null&&S.enabled.y&&(C=b),k&&!c&&(u?L=d-2*dt(l.left,l.right):C=m-2*dt(l.top,l.bottom)),await o({...t,availableWidth:L,availableHeight:C});let E=await n.getDimensions(r.floating);return d!==E.width||m!==E.height?{reset:{rects:!0}}:{}}}};function Ei(){return typeof window<"u"}function Jt(s){return aa(s)?(s.nodeName||"").toLowerCase():"#document"}function X(s){var t;return(s==null||(t=s.ownerDocument)==null?void 0:t.defaultView)||window}function wt(s){var t;return(t=(aa(s)?s.ownerDocument:s.document)||window.document)==null?void 0:t.documentElement}function aa(s){return Ei()?s instanceof Node||s instanceof X(s).Node:!1}function mt(s){return Ei()?s instanceof Element||s instanceof X(s).Element:!1}function Et(s){return Ei()?s instanceof HTMLElement||s instanceof X(s).HTMLElement:!1}function oa(s){return!Ei()||typeof ShadowRoot>"u"?!1:s instanceof ShadowRoot||s instanceof X(s).ShadowRoot}function We(s){let{overflow:t,overflowX:e,overflowY:i,display:n}=ft(s);return/auto|scroll|overlay|hidden|clip/.test(t+i+e)&&n!=="inline"&&n!=="contents"}function la(s){return/^(table|td|th)$/.test(Jt(s))}function Ue(s){try{if(s.matches(":popover-open"))return!0}catch{}try{return s.matches(":modal")}catch{return!1}}var bh=/transform|translate|scale|rotate|perspective|filter/,wh=/paint|layout|strict|content/,Xt=s=>!!s&&s!=="none",qs;function ue(s){let t=mt(s)?ft(s):s;return Xt(t.transform)||Xt(t.translate)||Xt(t.scale)||Xt(t.rotate)||Xt(t.perspective)||!ki()&&(Xt(t.backdropFilter)||Xt(t.filter))||bh.test(t.willChange||"")||wh.test(t.contain||"")}function ha(s){let t=Ot(s);for(;Et(t)&&!de(t);){if(ue(t))return t;if(Ue(t))return null;t=Ot(t)}return null}function ki(){return qs==null&&(qs=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),qs}function de(s){return/^(html|body|#document)$/.test(Jt(s))}function ft(s){return X(s).getComputedStyle(s)}function He(s){return mt(s)?{scrollLeft:s.scrollLeft,scrollTop:s.scrollTop}:{scrollLeft:s.scrollX,scrollTop:s.scrollY}}function Ot(s){if(Jt(s)==="html")return s;let t=s.assignedSlot||s.parentNode||oa(s)&&s.host||wt(s);return oa(t)?t.host:t}function ca(s){let t=Ot(s);return de(t)?(s.ownerDocument||s).body:Et(t)&&We(t)?t:ca(t)}function Lt(s,t,e){var i;t===void 0&&(t=[]),e===void 0&&(e=!0);let n=ca(s),r=n===((i=s.ownerDocument)==null?void 0:i.body),o=X(n);if(r){let a=zi(o);return t.concat(o,o.visualViewport||[],We(n)?n:[],a&&e?Lt(a):[])}else return t.concat(n,Lt(n,[],e))}function zi(s){return s.parent&&Object.getPrototypeOf(s.parent)?s.frameElement:null}function ma(s){let t=ft(s),e=parseFloat(t.width)||0,i=parseFloat(t.height)||0,n=Et(s),r=n?s.offsetWidth:e,o=n?s.offsetHeight:i,a=qe(e)!==r||qe(i)!==o;return a&&(e=r,i=o),{width:e,height:i,$:a}}function Ws(s){return mt(s)?s:s.contextElement}function me(s){let t=Ws(s);if(!Et(t))return vt(1);let e=t.getBoundingClientRect(),{width:i,height:n,$:r}=ma(t),o=(r?qe(e.width):e.width)/i,a=(r?qe(e.height):e.height)/n;return(!o||!Number.isFinite(o))&&(o=1),(!a||!Number.isFinite(a))&&(a=1),{x:o,y:a}}var yh=vt(0);function fa(s){let t=X(s);return!ki()||!t.visualViewport?yh:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function xh(s,t,e){return t===void 0&&(t=!1),!!e&&t&&e===X(s)}function Zt(s,t,e,i){t===void 0&&(t=!1),e===void 0&&(e=!1);let n=s.getBoundingClientRect(),r=Ws(s),o=vt(1);t&&(i?mt(i)&&(o=me(i)):o=me(s));let a=xh(r,e,i)?fa(r):vt(0),l=(n.left+a.x)/o.x,h=(n.top+a.y)/o.y,c=n.width/o.x,u=n.height/o.y;if(r&&i){let d=X(r),m=mt(i)?X(i):i,f=d,p=zi(f);for(;p&&m!==f;){let b=me(p),v=p.getBoundingClientRect(),y=ft(p),_=v.left+(p.clientLeft+parseFloat(y.paddingLeft))*b.x,S=v.top+(p.clientTop+parseFloat(y.paddingTop))*b.y;l*=b.x,h*=b.y,c*=b.x,u*=b.y,l+=_,h+=S,f=X(p),p=zi(f)}}return Gt({width:c,height:u,x:l,y:h})}function Ti(s,t){let e=He(s).scrollLeft;return t?t.left+e:Zt(wt(s)).left+e}function pa(s,t){let e=s.getBoundingClientRect(),i=e.left+t.scrollLeft-Ti(s,e),n=e.top+t.scrollTop;return{x:i,y:n}}function Ch(s){let{elements:t,rect:e,offsetParent:i,strategy:n}=s,r=n==="fixed",o=wt(i),a=t?Ue(t.floating):!1;if(i===o||a&&r)return e;let l={scrollLeft:0,scrollTop:0},h=vt(1),c=vt(0),u=Et(i);if((u||!r)&&((Jt(i)!=="body"||We(o))&&(l=He(i)),u)){let m=Zt(i);h=me(i),c.x=m.x+i.clientLeft,c.y=m.y+i.clientTop}let d=o&&!u&&!r?pa(o,l):vt(0);return{width:e.width*h.x,height:e.height*h.y,x:e.x*h.x-l.scrollLeft*h.x+c.x+d.x,y:e.y*h.y-l.scrollTop*h.y+c.y+d.y}}function Sh(s){return s.getClientRects?Array.from(s.getClientRects()):[]}function Mh(s){let t=He(s),e=s.ownerDocument.body,i=dt(s.scrollWidth,s.clientWidth,e.scrollWidth,e.clientWidth),n=dt(s.scrollHeight,s.clientHeight,e.scrollHeight,e.clientHeight),r=-t.scrollLeft+Ti(s),o=-t.scrollTop;return ft(e).direction==="rtl"&&(r+=dt(s.clientWidth,e.clientWidth)-i),{width:i,height:n,x:r,y:o}}var _h=25;function Lh(s,t,e){e===void 0&&(e="viewport");let i=e==="layoutViewport",n=X(s),r=wt(s),o=n.visualViewport,a=r.clientWidth,l=r.clientHeight,h=0,c=0;if(o){let d=!ki()||t==="fixed";i?d||(h=-o.offsetLeft,c=-o.offsetTop):(a=o.width,l=o.height,d&&(h=o.offsetLeft,c=o.offsetTop))}if(Ti(r)<=0){let d=r.ownerDocument,m=d.body,f=getComputedStyle(m),p=d.compatMode==="CSS1Compat"&&parseFloat(f.marginLeft)+parseFloat(f.marginRight)||0,b=Math.abs(r.clientWidth-m.clientWidth-p),v=getComputedStyle(r).scrollbarGutter==="stable both-edges"?b/2:b;v<=_h&&(a-=v)}return{width:a,height:l,x:h,y:c}}function Eh(s,t){let e=Zt(s,!0,t==="fixed"),i=e.top+s.clientTop,n=e.left+s.clientLeft,r=me(s),o=s.clientWidth*r.x,a=s.clientHeight*r.y,l=n*r.x,h=i*r.y;return{width:o,height:a,x:l,y:h}}function ua(s,t,e){let i;if(t==="viewport"||t==="layoutViewport")i=Lh(s,e,t);else if(t==="document")i=Mh(wt(s));else if(mt(t))i=Eh(t,e);else{let n=fa(s);i={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}}return Gt(i)}function kh(s,t){let e=t.get(s);if(e)return e;let i=Lt(s,[],!1).filter(a=>mt(a)&&Jt(a)!=="body"),n=null,r=ft(s).position==="fixed",o=r?Ot(s):s;for(;mt(o)&&!de(o);){let a=ft(o),l=ue(o),h=n?n.position:r?"fixed":"";!l&&(h==="fixed"||h==="absolute"&&a.position==="static")?i=i.filter(u=>u!==o):n=a,o=Ot(o)}return t.set(s,i),i}function zh(s){let{element:t,boundary:e,rootBoundary:i,strategy:n}=s,o=[...e==="clippingAncestors"?Ue(t)?[]:kh(t,this._c):[].concat(e),i],a=ua(t,o[0],n),l=a.top,h=a.right,c=a.bottom,u=a.left;for(let d=1;d<o.length;d++){let m=ua(t,o[d],n);l=dt(m.top,l),h=gt(m.right,h),c=gt(m.bottom,c),u=dt(m.left,u)}return{width:h-u,height:c-l,x:u,y:l}}function Th(s){let{width:t,height:e}=ma(s);return{width:t,height:e}}function Ph(s,t,e){let i=Et(t),n=wt(t),r=e==="fixed",o=Zt(s,!0,r,t),a={scrollLeft:0,scrollTop:0},l=vt(0);if((i||!r)&&((Jt(t)!=="body"||We(n))&&(a=He(t)),i)){let d=Zt(t,!0,r,t);l.x=d.x+t.clientLeft,l.y=d.y+t.clientTop}!i&&n&&(l.x=Ti(n));let h=n&&!i&&!r?pa(n,a):vt(0),c=o.left+a.scrollLeft-l.x-h.x,u=o.top+a.scrollTop-l.y-h.y;return{x:c,y:u,width:o.width,height:o.height}}function Ds(s){return ft(s).position==="static"}function da(s,t){if(!Et(s)||ft(s).position==="fixed")return null;if(t)return t(s);let e=s.offsetParent;return wt(s)===e&&(e=e.ownerDocument.body),e}function ga(s,t){let e=X(s);if(Ue(s))return e;if(!Et(s)){let n=Ot(s);for(;n&&!de(n);){if(mt(n)&&!Ds(n))return n;n=Ot(n)}return e}let i=da(s,t);for(;i&&la(i)&&Ds(i);)i=da(i,t);return i&&de(i)&&Ds(i)&&!ue(i)?e:i||ha(s)||e}var Ah=async function(s){let t=this.getOffsetParent||ga,e=this.getDimensions,i=await e(s.floating);return{reference:Ph(s.reference,await t(s.floating),s.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}};function $h(s){return ft(s).direction==="rtl"}var je={convertOffsetParentRelativeRectToViewportRelativeRect:Ch,getDocumentElement:wt,getClippingRect:zh,getOffsetParent:ga,getElementRects:Ah,getClientRects:Sh,getDimensions:Th,getScale:me,isElement:mt,isRTL:$h};function va(s,t){return s.x===t.x&&s.y===t.y&&s.width===t.width&&s.height===t.height}function Rh(s,t,e){let i=null,n,r=wt(s);function o(){var c;clearTimeout(n),(c=i)==null||c.disconnect(),i=null}function a(c,u){c===void 0&&(c=!1),u===void 0&&(u=1),o();let d=s.getBoundingClientRect(),{left:m,top:f,width:p,height:b}=d;if(c||t(),!p||!b)return;let v=De(f),y=De(r.clientWidth-(m+p)),_=De(r.clientHeight-(f+b)),S=De(m),C={rootMargin:-v+"px "+-y+"px "+-_+"px "+-S+"px",threshold:dt(0,gt(1,u))||1},L=!0;function E(x){let z=x[0].intersectionRatio;if(!va(d,s.getBoundingClientRect()))return a();if(z!==u){if(!L)return a();z?a(!1,z):n=setTimeout(()=>{a(!1,1e-7)},1e3)}L=!1}try{i=new IntersectionObserver(E,{...C,root:r.ownerDocument})}catch{i=new IntersectionObserver(E,C)}i.observe(s)}let l=X(s),h=()=>a(e);return l.addEventListener("resize",h),a(!0),()=>{l.removeEventListener("resize",h),o()}}function ba(s,t,e,i){i===void 0&&(i={});let{ancestorScroll:n=!0,ancestorResize:r=!0,elementResize:o=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=i,h=Ws(s),c=n||r?[...h?Lt(h):[],...t?Lt(t):[]]:[];c.forEach(v=>{n&&v.addEventListener("scroll",e),r&&v.addEventListener("resize",e)});let u=h&&a?Rh(h,e,r):null,d=-1,m=null;o&&(m=new ResizeObserver(v=>{let[y]=v;y&&y.target===h&&m&&t&&(m.unobserve(t),cancelAnimationFrame(d),d=requestAnimationFrame(()=>{var _;(_=m)==null||_.observe(t)})),e()}),h&&!l&&m.observe(h),t&&m.observe(t));let f,p=l?Zt(s):null;l&&b();function b(){let v=Zt(s);p&&!va(p,v)&&e(),p=v,f=requestAnimationFrame(b)}return e(),()=>{var v;c.forEach(y=>{n&&y.removeEventListener("scroll",e),r&&y.removeEventListener("resize",e)}),u?.(),(v=m)==null||v.disconnect(),m=null,l&&cancelAnimationFrame(f)}}var wa=sa;var ya=na,xa=ia,Us=ra;var Ca=ea;var Sa=(s,t,e)=>{let i=new Map,n=e??{},r={...je,...n.platform,_c:i};return ta(s,t,{...n,platform:r})};function Ma(s){return Nh(s)}function Hs(s){return s.assignedSlot?s.assignedSlot:s.parentNode instanceof ShadowRoot?s.parentNode.host:s.parentNode}function Nh(s){for(let t=s;t;t=Hs(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=Hs(s);t;t=Hs(t)){if(!(t instanceof Element))continue;let e=getComputedStyle(t);if(e.display!=="contents"&&(e.position!=="static"||ue(e)||t.tagName==="BODY"))return t}return null}function _a(s){return s!==null&&typeof s=="object"&&"getBoundingClientRect"in s&&("contextElement"in s?s instanceof Element:!0)}var Oh=!!globalThis?.HTMLElement?.prototype.hasOwnProperty("popover"),R=class extends D{constructor(){super(...arguments),this.localize=new ot(this),this.SUPPORTS_POPOVER=!1,this.active=!1,this.placement="top",this.boundary="viewport",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl&&this.popup){let s=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),e=this.placement.includes("top")||this.placement.includes("bottom"),i=0,n=0,r=0,o=0,a=0,l=0,h=0,c=0;e?s.top<t.top?(i=s.left,n=s.bottom,r=s.right,o=s.bottom,a=t.left,l=t.top,h=t.right,c=t.top):(i=t.left,n=t.bottom,r=t.right,o=t.bottom,a=s.left,l=s.top,h=s.right,c=s.top):s.left<t.left?(i=s.right,n=s.top,r=t.left,o=t.top,a=s.right,l=s.bottom,h=t.left,c=t.bottom):(i=t.right,n=t.top,r=s.left,o=s.top,a=t.right,l=t.bottom,h=s.left,c=s.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${i}px`),this.style.setProperty("--hover-bridge-top-left-y",`${n}px`),this.style.setProperty("--hover-bridge-top-right-x",`${r}px`),this.style.setProperty("--hover-bridge-top-right-y",`${o}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${h}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${c}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.SUPPORTS_POPOVER=Oh,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(s){super.updated(s),s.has("active")&&(this.active?this.start():this.stop()),s.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){let s=this.getRootNode();this.anchorEl=s.getElementById(this.anchor)}else this.anchor instanceof Element||_a(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.start()}start(){!this.anchorEl||!this.active||!this.isConnected||(this.popup?.showPopover?.(),this.cleanup=ba(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(s=>{this.popup?.hidePopover?.(),this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>s())):s()})}reposition(){if(!this.active||!this.anchorEl||!this.popup)return;let s=[wa({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?s.push(Us({apply:({rects:i})=>{let n=this.sync==="width"||this.sync==="both",r=this.sync==="height"||this.sync==="both";this.popup.style.width=n?`${i.reference.width}px`:"",this.popup.style.height=r?`${i.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height="");let t;this.SUPPORTS_POPOVER&&!_a(this.anchor)&&this.boundary==="scroll"&&(t=Lt(this.anchorEl).filter(i=>i instanceof Element)),this.flip&&s.push(xa({boundary:this.flipBoundary||t,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&s.push(ya({boundary:this.shiftBoundary||t,padding:this.shiftPadding})),this.autoSize?s.push(Us({boundary:this.autoSizeBoundary||t,padding:this.autoSizePadding,apply:({availableWidth:i,availableHeight:n})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${n}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${i}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&s.push(Ca({element:this.arrowEl,padding:this.arrowPadding}));let e=this.SUPPORTS_POPOVER?i=>je.getOffsetParent(i,Ma):je.getOffsetParent;Sa(this.anchorEl,this.popup,{placement:this.placement,middleware:s,strategy:this.SUPPORTS_POPOVER?"absolute":"fixed",platform:{...je,getOffsetParent:e}}).then(({x:i,y:n,middlewareData:r,placement:o})=>{let a=this.localize.dir()==="rtl",l={top:"bottom",right:"left",bottom:"top",left:"right"}[o.split("-")[0]];if(this.setAttribute("data-current-placement",o),Object.assign(this.popup.style,{left:`${i}px`,top:`${n}px`}),this.arrow){let h=r.arrow.x,c=r.arrow.y,u="",d="",m="",f="";if(this.arrowPlacement==="start"){let p=typeof h=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";u=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",d=a?p:"",f=a?"":p}else if(this.arrowPlacement==="end"){let p=typeof h=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";d=a?"":p,f=a?p:"",m=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(f=typeof h=="number"?"calc(50% - var(--arrow-size-diagonal))":"",u=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(f=typeof h=="number"?`${h}px`:"",u=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:u,right:d,bottom:m,left:f,[l]:"calc(var(--arrow-base-offset) - var(--arrow-size-diagonal))"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.dispatchEvent(new Ho)}render(){return $`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${et({"popup-hover-bridge":!0,"popup-hover-bridge-visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        popover="manual"
        part="popup"
        class=${et({popup:!0,"popup-active":this.active,"popup-fixed":!this.SUPPORTS_POPOVER,"popup-has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?$`<div part="arrow" class="arrow" role="presentation"></div>`:""}
      </div>
    `}};R.css=jo;g([J(".popup")],R.prototype,"popup",2);g([J(".arrow")],R.prototype,"arrowEl",2);g([w({attribute:!1,type:Boolean})],R.prototype,"SUPPORTS_POPOVER",2);g([w()],R.prototype,"anchor",2);g([w({type:Boolean,reflect:!0})],R.prototype,"active",2);g([w({reflect:!0})],R.prototype,"placement",2);g([w()],R.prototype,"boundary",2);g([w({type:Number})],R.prototype,"distance",2);g([w({type:Number})],R.prototype,"skidding",2);g([w({type:Boolean})],R.prototype,"arrow",2);g([w({attribute:"arrow-placement"})],R.prototype,"arrowPlacement",2);g([w({attribute:"arrow-padding",type:Number})],R.prototype,"arrowPadding",2);g([w({type:Boolean})],R.prototype,"flip",2);g([w({attribute:"flip-fallback-placements",converter:{fromAttribute:s=>s.split(" ").map(t=>t.trim()).filter(t=>t!==""),toAttribute:s=>s.join(" ")}})],R.prototype,"flipFallbackPlacements",2);g([w({attribute:"flip-fallback-strategy"})],R.prototype,"flipFallbackStrategy",2);g([w({type:Object})],R.prototype,"flipBoundary",2);g([w({attribute:"flip-padding",type:Number})],R.prototype,"flipPadding",2);g([w({type:Boolean})],R.prototype,"shift",2);g([w({type:Object})],R.prototype,"shiftBoundary",2);g([w({attribute:"shift-padding",type:Number})],R.prototype,"shiftPadding",2);g([w({attribute:"auto-size"})],R.prototype,"autoSize",2);g([w()],R.prototype,"sync",2);g([w({type:Object})],R.prototype,"autoSizeBoundary",2);g([w({attribute:"auto-size-padding",type:Number})],R.prototype,"autoSizePadding",2);g([w({attribute:"hover-bridge",type:Boolean})],R.prototype,"hoverBridge",2);R=g([U("wa-popup")],R);function A(s){var t=s.width,e=s.height;if(t<0)throw new Error("Negative width is not allowed for Size");if(e<0)throw new Error("Negative height is not allowed for Size");return{width:t,height:e}}function yt(s,t){return s.width===t.width&&s.height===t.height}var Fh=(function(){function s(t){var e=this;this._resolutionListener=function(){return e._onResolutionChanged()},this._resolutionMediaQueryList=null,this._observers=[],this._window=t,this._installResolutionListener()}return s.prototype.dispose=function(){this._uninstallResolutionListener(),this._window=null},Object.defineProperty(s.prototype,"value",{get:function(){return this._window.devicePixelRatio},enumerable:!1,configurable:!0}),s.prototype.subscribe=function(t){var e=this,i={next:t};return this._observers.push(i),{unsubscribe:function(){e._observers=e._observers.filter(function(n){return n!==i})}}},s.prototype._installResolutionListener=function(){if(this._resolutionMediaQueryList!==null)throw new Error("Resolution listener is already installed");var t=this._window.devicePixelRatio;this._resolutionMediaQueryList=this._window.matchMedia("all and (resolution: ".concat(t,"dppx)")),this._resolutionMediaQueryList.addListener(this._resolutionListener)},s.prototype._uninstallResolutionListener=function(){this._resolutionMediaQueryList!==null&&(this._resolutionMediaQueryList.removeListener(this._resolutionListener),this._resolutionMediaQueryList=null)},s.prototype._reinstallResolutionListener=function(){this._uninstallResolutionListener(),this._installResolutionListener()},s.prototype._onResolutionChanged=function(){var t=this;this._observers.forEach(function(e){return e.next(t._window.devicePixelRatio)}),this._reinstallResolutionListener()},s})();function La(s){return new Fh(s)}var Ih=(function(){function s(t,e,i){var n;this._canvasElement=null,this._bitmapSizeChangedListeners=[],this._suggestedBitmapSize=null,this._suggestedBitmapSizeChangedListeners=[],this._devicePixelRatioObservable=null,this._canvasElementResizeObserver=null,this._canvasElement=t,this._canvasElementClientSize=A({width:this._canvasElement.clientWidth,height:this._canvasElement.clientHeight}),this._transformBitmapSize=e??(function(r){return r}),this._allowResizeObserver=(n=i?.allowResizeObserver)!==null&&n!==void 0?n:!0,this._chooseAndInitObserver()}return s.prototype.dispose=function(){var t,e;if(this._canvasElement===null)throw new Error("Object is disposed");(t=this._canvasElementResizeObserver)===null||t===void 0||t.disconnect(),this._canvasElementResizeObserver=null,(e=this._devicePixelRatioObservable)===null||e===void 0||e.dispose(),this._devicePixelRatioObservable=null,this._suggestedBitmapSizeChangedListeners.length=0,this._bitmapSizeChangedListeners.length=0,this._canvasElement=null},Object.defineProperty(s.prototype,"canvasElement",{get:function(){if(this._canvasElement===null)throw new Error("Object is disposed");return this._canvasElement},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"canvasElementClientSize",{get:function(){return this._canvasElementClientSize},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"bitmapSize",{get:function(){return A({width:this.canvasElement.width,height:this.canvasElement.height})},enumerable:!1,configurable:!0}),s.prototype.resizeCanvasElement=function(t){this._canvasElementClientSize=A(t),this.canvasElement.style.width="".concat(this._canvasElementClientSize.width,"px"),this.canvasElement.style.height="".concat(this._canvasElementClientSize.height,"px"),this._invalidateBitmapSize()},s.prototype.subscribeBitmapSizeChanged=function(t){this._bitmapSizeChangedListeners.push(t)},s.prototype.unsubscribeBitmapSizeChanged=function(t){this._bitmapSizeChangedListeners=this._bitmapSizeChangedListeners.filter(function(e){return e!==t})},Object.defineProperty(s.prototype,"suggestedBitmapSize",{get:function(){return this._suggestedBitmapSize},enumerable:!1,configurable:!0}),s.prototype.subscribeSuggestedBitmapSizeChanged=function(t){this._suggestedBitmapSizeChangedListeners.push(t)},s.prototype.unsubscribeSuggestedBitmapSizeChanged=function(t){this._suggestedBitmapSizeChangedListeners=this._suggestedBitmapSizeChangedListeners.filter(function(e){return e!==t})},s.prototype.applySuggestedBitmapSize=function(){if(this._suggestedBitmapSize!==null){var t=this._suggestedBitmapSize;this._suggestedBitmapSize=null,this._resizeBitmap(t),this._emitSuggestedBitmapSizeChanged(t,this._suggestedBitmapSize)}},s.prototype._resizeBitmap=function(t){var e=this.bitmapSize;yt(e,t)||(this.canvasElement.width=t.width,this.canvasElement.height=t.height,this._emitBitmapSizeChanged(e,t))},s.prototype._emitBitmapSizeChanged=function(t,e){var i=this;this._bitmapSizeChangedListeners.forEach(function(n){return n.call(i,t,e)})},s.prototype._suggestNewBitmapSize=function(t){var e=this._suggestedBitmapSize,i=A(this._transformBitmapSize(t,this._canvasElementClientSize)),n=yt(this.bitmapSize,i)?null:i;e===null&&n===null||e!==null&&n!==null&&yt(e,n)||(this._suggestedBitmapSize=n,this._emitSuggestedBitmapSizeChanged(e,n))},s.prototype._emitSuggestedBitmapSizeChanged=function(t,e){var i=this;this._suggestedBitmapSizeChangedListeners.forEach(function(n){return n.call(i,t,e)})},s.prototype._chooseAndInitObserver=function(){var t=this;if(!this._allowResizeObserver){this._initDevicePixelRatioObservable();return}Bh().then(function(e){return e?t._initResizeObserver():t._initDevicePixelRatioObservable()})},s.prototype._initDevicePixelRatioObservable=function(){var t=this;if(this._canvasElement!==null){var e=Ea(this._canvasElement);if(e===null)throw new Error("No window is associated with the canvas");this._devicePixelRatioObservable=La(e),this._devicePixelRatioObservable.subscribe(function(){return t._invalidateBitmapSize()}),this._invalidateBitmapSize()}},s.prototype._invalidateBitmapSize=function(){var t,e;if(this._canvasElement!==null){var i=Ea(this._canvasElement);if(i!==null){var n=(e=(t=this._devicePixelRatioObservable)===null||t===void 0?void 0:t.value)!==null&&e!==void 0?e:i.devicePixelRatio,r=this._canvasElement.getClientRects(),o=r[0]!==void 0?Vh(r[0],n):A({width:this._canvasElementClientSize.width*n,height:this._canvasElementClientSize.height*n});this._suggestNewBitmapSize(o)}}},s.prototype._initResizeObserver=function(){var t=this;this._canvasElement!==null&&(this._canvasElementResizeObserver=new ResizeObserver(function(e){var i=e.find(function(o){return o.target===t._canvasElement});if(!(!i||!i.devicePixelContentBoxSize||!i.devicePixelContentBoxSize[0])){var n=i.devicePixelContentBoxSize[0],r=A({width:n.inlineSize,height:n.blockSize});t._suggestNewBitmapSize(r)}}),this._canvasElementResizeObserver.observe(this._canvasElement,{box:"device-pixel-content-box"}))},s})();function js(s,t){if(t.type==="device-pixel-content-box")return new Ih(s,t.transform,t.options);throw new Error("Unsupported binding target")}function Ea(s){return s.ownerDocument.defaultView}function Bh(){return new Promise(function(s){var t=new ResizeObserver(function(e){s(e.every(function(i){return"devicePixelContentBoxSize"in i})),t.disconnect()});t.observe(document.body,{box:"device-pixel-content-box"})}).catch(function(){return!1})}function Vh(s,t){return A({width:Math.round(s.left*t+s.width*t)-Math.round(s.left*t),height:Math.round(s.top*t+s.height*t)-Math.round(s.top*t)})}var ka=(function(){function s(t,e,i){if(e.width===0||e.height===0)throw new TypeError("Rendering target could only be created on a media with positive width and height");if(this._mediaSize=e,i.width===0||i.height===0)throw new TypeError("Rendering target could only be created using a bitmap with positive integer width and height");this._bitmapSize=i,this._context=t}return s.prototype.useMediaCoordinateSpace=function(t){try{return this._context.save(),this._context.setTransform(1,0,0,1,0,0),this._context.scale(this._horizontalPixelRatio,this._verticalPixelRatio),t({context:this._context,mediaSize:this._mediaSize})}finally{this._context.restore()}},s.prototype.useBitmapCoordinateSpace=function(t){try{return this._context.save(),this._context.setTransform(1,0,0,1,0,0),t({context:this._context,mediaSize:this._mediaSize,bitmapSize:this._bitmapSize,horizontalPixelRatio:this._horizontalPixelRatio,verticalPixelRatio:this._verticalPixelRatio})}finally{this._context.restore()}},Object.defineProperty(s.prototype,"_horizontalPixelRatio",{get:function(){return this._bitmapSize.width/this._mediaSize.width},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"_verticalPixelRatio",{get:function(){return this._bitmapSize.height/this._mediaSize.height},enumerable:!1,configurable:!0}),s})();function kt(s,t){var e=s.canvasElementClientSize;if(e.width===0||e.height===0)return null;var i=s.bitmapSize;if(i.width===0||i.height===0)return null;var n=s.canvasElement.getContext("2d",t);return n===null?null:new ka(n,e,i)}var gl={title:"",visible:!0,hitTestTolerance:3,lastValueVisible:!0,priceLineVisible:!0,priceLineSource:0,priceLineWidth:1,priceLineColor:"",priceLineStyle:2,baseLineVisible:!0,baseLineWidth:1,baseLineColor:"#B2B5BE",baseLineStyle:0,priceFormat:{type:"price",precision:2,minMove:.01}},za,Ta;function ie(s,t){let e=(function(i,n){switch(i){case 0:default:return[];case 1:return[n,n];case 2:return[2*n,2*n];case 3:return[6*n,6*n];case 4:return[n,4*n]}})(t,s.lineWidth);return s.setLineDash(e),e}function vl(s,t,e,i){s.beginPath();let n=s.lineWidth%2?.5:0;s.moveTo(e,t+n),s.lineTo(i,t+n),s.stroke()}function Y(s,t){if(!s)throw new Error("Assertion failed"+(t?": "+t:""))}function Z(s){if(s===void 0)throw new Error("Value is undefined");return s}function M(s){if(s===null)throw new Error("Value is null");return s}function It(s){return M(Z(s))}(function(s){s[s.Simple=0]="Simple",s[s.WithSteps=1]="WithSteps",s[s.Curved=2]="Curved"})(za||(za={})),(function(s){s[s.Solid=0]="Solid",s[s.Dotted=1]="Dotted",s[s.Dashed=2]="Dashed",s[s.LargeDashed=3]="LargeDashed",s[s.SparseDotted=4]="SparseDotted"})(Ta||(Ta={}));var F=class{constructor(){this.t=[]}i(t,e,i){let n={h:t,l:e,o:i===!0};this.t.push(n)}_(t){let e=this.t.findIndex((i=>t===i.h));e>-1&&this.t.splice(e,1)}u(t){this.t=this.t.filter((e=>e.l!==t))}p(t,e,i){let n=[...this.t];this.t=this.t.filter((r=>!r.o)),n.forEach((r=>r.h(t,e,i)))}v(){return this.t.length>0}m(){this.t=[]}};function it(s,...t){for(let e of t)for(let i in e)e[i]!==void 0&&Object.prototype.hasOwnProperty.call(e,i)&&!["__proto__","constructor","prototype"].includes(i)&&(typeof e[i]!="object"||s[i]===void 0||Array.isArray(e[i])?s[i]=e[i]:it(s[i],e[i]));return s}function we(s){return typeof s=="number"&&isFinite(s)}function ei(s){return typeof s=="number"&&s%1==0}function ri(s){return typeof s=="string"}function Pi(s){return typeof s=="boolean"}function zt(s){let t=s;if(!t||typeof t!="object")return t;let e,i,n;for(i in e=Array.isArray(t)?[]:{},t)t.hasOwnProperty(i)&&(n=t[i],e[i]=n&&typeof n=="object"?zt(n):n);return e}function Pa(s){return s!==null}function cn(s){return s===null?void 0:s}var bl="-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif";function Ui(s,t,e){return t===void 0&&(t=bl),`${e=e!==void 0?`${e} `:""}${s}px ${t}`}var un=class{constructor(t){this.M={S:1,C:5,P:NaN,k:"",T:"",R:"",D:"",I:0,V:0,B:0,A:0,L:0},this.O=t}N(){let t=this.M,e=this.F(),i=this.W();return t.P===e&&t.T===i||(t.P=e,t.T=i,t.k=Ui(e,i),t.A=2.5/12*e,t.I=t.A,t.V=e/12*t.C,t.B=e/12*t.C,t.L=0),t.R=this.H(),t.D=this.U(),this.M}H(){return this.O.N().layout.textColor}U(){return this.O.$()}F(){return this.O.N().layout.fontSize}W(){return this.O.N().layout.fontFamily}};function Ks(s){return s<0?0:s>255?255:Math.round(s)||0}function Aa(s){return .199*s[0]+.687*s[1]+.114*s[2]}var dn=class{constructor(t,e){this.j=new Map,this.q=t,e&&(this.j=e)}Y(t,e){if(t==="transparent")return t;let i=this.K(t),n=i[3];return`rgba(${i[0]}, ${i[1]}, ${i[2]}, ${e*n})`}G(t){let e=this.K(t);return{Z:`rgb(${e[0]}, ${e[1]}, ${e[2]})`,X:Aa(e)>160?"black":"white"}}J(t){return Aa(this.K(t))}tt(t,e,i){let[n,r,o,a]=this.K(t),[l,h,c,u]=this.K(e),d=[Ks(n+i*(l-n)),Ks(r+i*(h-r)),Ks(o+i*(c-o)),(m=a+i*(u-a),m<=0||m>1?Math.min(Math.max(m,0),1):Math.round(1e4*m)/1e4)];var m;return`rgba(${d[0]}, ${d[1]}, ${d[2]}, ${d[3]})`}K(t){let e=this.j.get(t);if(e)return e;let i=(function(o){let a=document.createElement("div");a.style.display="none",document.body.appendChild(a),a.style.color=o;let l=window.getComputedStyle(a).color;return document.body.removeChild(a),l})(t),n=i.match(/^rgba?\s*\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)$/);if(!n){if(this.q.length)for(let o of this.q){let a=o(t);if(a)return this.j.set(t,a),a}throw new Error(`Failed to parse color: ${t}`)}let r=[parseInt(n[1],10),parseInt(n[2],10),parseInt(n[3],10),n[4]?parseFloat(n[4]):1];return this.j.set(t,r),r}},mn=class{constructor(){this.it=[]}nt(t){this.it=t}st(t,e,i){this.it.forEach((n=>{n.st(t,e,i)}))}},Bt=class{st(t,e,i){t.useBitmapCoordinateSpace((n=>this.et(n,e,i)))}},fn=class extends Bt{constructor(){super(...arguments),this.rt=null}ht(t){this.rt=t}et({context:t,horizontalPixelRatio:e,verticalPixelRatio:i}){if(this.rt===null||this.rt.lt===null)return;let n=this.rt.lt,r=this.rt,o=Math.max(1,Math.floor(e))%2/2,a=l=>{t.beginPath();for(let h=n.to-1;h>=n.from;--h){let c=r.ot[h],u=Math.round(c._t*e)+o,d=c.ut*i,m=l*i+o;t.moveTo(u,d),t.arc(u,d,m,0,2*Math.PI)}t.fill()};r.ct>0&&(t.fillStyle=r.dt,a(r.ft+r.ct)),t.fillStyle=r.vt,a(r.ft)}};function qh(){return{ot:[{_t:0,ut:0,wt:0,Mt:0}],vt:"",dt:"",ft:0,ct:0,lt:null}}var Dh={from:0,to:1},pn=class{constructor(t,e,i){this.gt=new mn,this.bt=[],this.St=[],this.xt=!0,this.O=t,this.Ct=e,this.yt=i,this.gt.nt(this.bt)}Pt(t){this.kt(),this.xt=!0}Tt(){return this.xt&&(this.Rt(),this.xt=!1),this.gt}kt(){let t=this.yt.Dt();t.length!==this.bt.length&&(this.St=t.map(qh),this.bt=this.St.map((e=>{let i=new fn;return i.ht(e),i})),this.gt.nt(this.bt))}Rt(){let t=this.Ct.N().mode===2||!this.Ct.It(),e=this.yt.Vt(),i=this.Ct.Bt(),n=this.O.Et();this.kt(),e.forEach(((r,o)=>{let a=this.St[o],l=r.At(i),h=r.Lt();!t&&l!==null&&r.It()&&h!==null?(a.vt=l.zt,a.ft=l.ft,a.ct=l.Ot,a.ot[0].Mt=l.Mt,a.ot[0].ut=r.Ft().Nt(l.Mt,h.Wt),a.dt=l.Ht??this.O.Ut(a.ot[0].ut/r.Ft().$t()),a.ot[0].wt=i,a.ot[0]._t=n.jt(i),a.lt=Dh):a.lt=null}))}},gn=class extends Bt{constructor(t){super(),this.qt=t}et({context:t,bitmapSize:e,horizontalPixelRatio:i,verticalPixelRatio:n}){if(this.qt===null)return;let r=this.qt.Yt.It,o=this.qt.Kt.It;if(!r&&!o)return;let a=Math.round(this.qt._t*i),l=Math.round(this.qt.ut*n);t.lineCap="butt",r&&a>=0&&(t.lineWidth=Math.floor(this.qt.Yt.ct*i),t.strokeStyle=this.qt.Yt.R,t.fillStyle=this.qt.Yt.R,ie(t,this.qt.Yt.Gt),(function(h,c,u,d){h.beginPath();let m=h.lineWidth%2?.5:0;h.moveTo(c+m,u),h.lineTo(c+m,d),h.stroke()})(t,a,0,e.height)),o&&l>=0&&(t.lineWidth=Math.floor(this.qt.Kt.ct*n),t.strokeStyle=this.qt.Kt.R,t.fillStyle=this.qt.Kt.R,ie(t,this.qt.Kt.Gt),vl(t,l,0,e.width))}},vn=class{constructor(t,e){this.xt=!0,this.Zt={Yt:{ct:1,Gt:0,R:"",It:!1},Kt:{ct:1,Gt:0,R:"",It:!1},_t:0,ut:0},this.Xt=new gn(this.Zt),this.Jt=t,this.yt=e}Pt(){this.xt=!0}Tt(t){return this.xt&&(this.Rt(),this.xt=!1),this.Xt}Rt(){let t=this.Jt.It(),e=this.yt.Qt().N().crosshair,i=this.Zt;if(e.mode===2)return i.Kt.It=!1,void(i.Yt.It=!1);i.Kt.It=t&&this.Jt.ti(this.yt),i.Yt.It=t&&this.Jt.ii(),i.Kt.ct=e.horzLine.width,i.Kt.Gt=e.horzLine.style,i.Kt.R=e.horzLine.color,i.Yt.ct=e.vertLine.width,i.Yt.Gt=e.vertLine.style,i.Yt.R=e.vertLine.color,i._t=this.Jt.ni(),i.ut=this.Jt.si()}};function cs(s,t,e,i,n,r){s.save(),s.globalCompositeOperation="copy",s.fillStyle=r,s.fillRect(t,e,i,n),s.restore()}function $a(s,t,e,i,n,r){s.beginPath(),s.roundRect?s.roundRect(t,e,i,n,r):(s.lineTo(t+i-r[1],e),r[1]!==0&&s.arcTo(t+i,e,t+i,e+r[1],r[1]),s.lineTo(t+i,e+n-r[2]),r[2]!==0&&s.arcTo(t+i,e+n,t+i-r[2],e+n,r[2]),s.lineTo(t+r[3],e+n),r[3]!==0&&s.arcTo(t,e+n,t,e+n-r[3],r[3]),s.lineTo(t,e+r[0]),r[0]!==0&&s.arcTo(t,e,t+r[0],e,r[0]))}function Ra(s,t,e,i,n,r,o=0,a=[0,0,0,0],l=""){if(s.save(),!o||!l||l===r)return $a(s,t,e,i,n,a),s.fillStyle=r,s.fill(),void s.restore();let h=o/2;var c;$a(s,t+h,e+h,i-o,n-o,(c=-h,a.map((u=>u===0?u:u+c)))),r!=="transparent"&&(s.fillStyle=r,s.fill()),l!=="transparent"&&(s.lineWidth=o,s.strokeStyle=l,s.closePath(),s.stroke()),s.restore()}function wl(s,t,e,i,n,r,o){s.save(),s.globalCompositeOperation="copy";let a=s.createLinearGradient(0,0,0,n);a.addColorStop(0,r),a.addColorStop(1,o),s.fillStyle=a,s.fillRect(t,e,i,n),s.restore()}var Hi=class{constructor(t,e){this.ht(t,e)}ht(t,e){this.qt=t,this.ei=e}$t(t,e){return this.qt.It?t.P+t.A+t.I:0}st(t,e,i,n){if(!this.qt.It||this.qt.ri.length===0)return;let r=this.qt.R,o=this.ei.Z,a=t.useBitmapCoordinateSpace((l=>{let h=l.context;h.font=e.k;let c=this.hi(l,e,i,n),u=c.ai;return c.li?Ra(h,u.oi,u._i,u.ui,u.ci,o,u.di,[u.ft,0,0,u.ft],o):Ra(h,u.fi,u._i,u.ui,u.ci,o,u.di,[0,u.ft,u.ft,0],o),this.qt.pi&&(h.fillStyle=r,h.fillRect(u.fi,u.mi,u.wi-u.fi,u.Mi)),this.qt.gi&&(h.fillStyle=e.D,h.fillRect(c.li?u.bi-u.di:0,u._i,u.di,u.Si-u._i)),c}));t.useMediaCoordinateSpace((({context:l})=>{let h=a.xi;l.font=e.k,l.textAlign=a.li?"right":"left",l.textBaseline="middle",l.fillStyle=r,l.fillText(this.qt.ri,h.Ci,(h._i+h.Si)/2+h.yi)}))}hi(t,e,i,n){let{context:r,bitmapSize:o,mediaSize:a,horizontalPixelRatio:l,verticalPixelRatio:h}=t,c=this.qt.pi||!this.qt.Pi?e.C:0,u=this.qt.ki?e.S:0,d=e.A+this.ei.Ti,m=e.I+this.ei.Ri,f=e.V,p=e.B,b=this.qt.ri,v=e.P,y=i.Di(r,b),_=Math.ceil(i.Ii(r,b)),S=v+d+m,k=e.S+f+p+_+c,C=Math.max(1,Math.floor(h)),L=Math.round(S*h);L%2!=C%2&&(L+=1);let E=u>0?Math.max(1,Math.floor(u*l)):0,x=Math.round(k*l),z=Math.round(c*l),I=this.ei.Vi??this.ei.Bi??this.ei.Ei,j=Math.round(I*h)-Math.floor(.5*h),V=Math.floor(j+C/2-L/2),q=V+L,B=n==="right",W=B?a.width-u:u,tt=B?o.width-E:E,G,nt,ke;return B?(G=tt-x,nt=tt-z,ke=W-c-f-u):(G=tt+x,nt=tt+z,ke=W+c+f),{li:B,ai:{_i:V,mi:j,Si:q,ui:x,ci:L,ft:2*l,di:E,oi:G,fi:tt,wi:nt,Mi:C,bi:o.width},xi:{_i:V/h,Si:q/h,Ci:ke,yi:y}}}},ye=class{constructor(t){this.Ai={Ei:0,Z:"#000",Ri:0,Ti:0},this.Li={ri:"",It:!1,pi:!0,Pi:!1,Ht:"",R:"#FFF",gi:!1,ki:!1},this.zi={ri:"",It:!1,pi:!1,Pi:!0,Ht:"",R:"#FFF",gi:!0,ki:!0},this.xt=!0,this.Oi=new(t||Hi)(this.Li,this.Ai),this.Ni=new(t||Hi)(this.zi,this.Ai)}ri(){return this.Fi(),this.Li.ri}Ei(){return this.Fi(),this.Ai.Ei}Pt(){this.xt=!0}$t(t,e=!1){return Math.max(this.Oi.$t(t,e),this.Ni.$t(t,e))}Wi(){return this.Ai.Vi??null}Hi(){return this.Ai.Vi??this.Ai.Bi??this.Ei()}Ui(t){this.Ai.Bi=t??void 0}$i(){return this.Fi(),this.Li.It||this.zi.It}ji(){return this.Fi(),this.Li.It}Tt(t){return this.Fi(),this.Li.pi=this.Li.pi&&t.N().ticksVisible,this.zi.pi=this.zi.pi&&t.N().ticksVisible,this.Oi.ht(this.Li,this.Ai),this.Ni.ht(this.zi,this.Ai),this.Oi}qi(){return this.Fi(),this.Oi.ht(this.Li,this.Ai),this.Ni.ht(this.zi,this.Ai),this.Ni}Fi(){this.xt&&(this.Li.pi=!0,this.zi.pi=!1,this.Yi(this.Li,this.zi,this.Ai))}},bn=class extends ye{constructor(t,e,i){super(),this.Jt=t,this.Ki=e,this.Gi=i}Yi(t,e,i){if(t.It=!1,this.Jt.N().mode===2)return;let n=this.Jt.N().horzLine;if(!n.labelVisible)return;let r=this.Ki.Lt();if(!this.Jt.It()||this.Ki.Zi()||r===null)return;let o=this.Ki.Xi().G(n.labelBackgroundColor);i.Z=o.Z,t.R=o.X;let a=2/12*this.Ki.P();i.Ti=a,i.Ri=a;let l=this.Gi(this.Ki);i.Ei=l.Ei,t.ri=this.Ki.Ji(l.Mt,r),t.It=!0}},Wh=/[1-9]/g,ji=class{constructor(){this.qt=null}ht(t){this.qt=t}st(t,e){if(this.qt===null||this.qt.It===!1||this.qt.ri.length===0)return;let i=t.useMediaCoordinateSpace((({context:d})=>(d.font=e.k,Math.round(e.Qi.Ii(d,M(this.qt).ri,Wh)))));if(i<=0)return;let n=e.tn,r=i+2*n,o=r/2,a=this.qt.nn,l=this.qt.Ei,h=Math.floor(l-o)+.5;h<0?(l+=Math.abs(0-h),h=Math.floor(l-o)+.5):h+r>a&&(l-=Math.abs(a-(h+r)),h=Math.floor(l-o)+.5);let c=h+r,u=Math.ceil(0+e.S+e.C+e.A+e.P+e.I);t.useBitmapCoordinateSpace((({context:d,horizontalPixelRatio:m,verticalPixelRatio:f})=>{let p=M(this.qt);d.fillStyle=p.Z;let b=Math.round(h*m),v=Math.round(0*f),y=Math.round(c*m),_=Math.round(u*f),S=Math.round(2*m);if(d.beginPath(),d.moveTo(b,v),d.lineTo(b,_-S),d.arcTo(b,_,b+S,_,S),d.lineTo(y-S,_),d.arcTo(y,_,y,_-S,S),d.lineTo(y,v),d.fill(),p.pi){let k=Math.round(p.Ei*m),C=v,L=Math.round((C+e.C)*f);d.fillStyle=p.R;let E=Math.max(1,Math.floor(m)),x=Math.floor(.5*m);d.fillRect(k-x,C,E,L-C)}})),t.useMediaCoordinateSpace((({context:d})=>{let m=M(this.qt),f=0+e.S+e.C+e.A+e.P/2;d.font=e.k,d.textAlign="left",d.textBaseline="middle",d.fillStyle=m.R;let p=e.Qi.Di(d,"Apr0");d.translate(h+n,f+p),d.fillText(m.ri,0,0)}))}},wn=class{constructor(t,e,i){this.xt=!0,this.Xt=new ji,this.Zt={It:!1,Z:"#4c525e",R:"white",ri:"",nn:0,Ei:NaN,pi:!0},this.Ct=t,this.sn=e,this.Gi=i}Pt(){this.xt=!0}Tt(){return this.xt&&(this.Rt(),this.xt=!1),this.Xt.ht(this.Zt),this.Xt}Rt(){let t=this.Zt;if(t.It=!1,this.Ct.N().mode===2)return;let e=this.Ct.N().vertLine;if(!e.labelVisible)return;let i=this.sn.Et();if(i.Zi())return;t.nn=i.nn();let n=this.Gi();if(n===null)return;t.Ei=n.Ei;let r=i.en(this.Ct.Bt());t.ri=i.rn(M(r)),t.It=!0;let o=this.sn.Xi().G(e.labelBackgroundColor);t.Z=o.Z,t.R=o.X,t.pi=i.N().ticksVisible}},Ki=class{constructor(){this.hn=null,this.an=0}ln(){return this.an}_n(t){this.an=t}Ft(){return this.hn}un(t){this.hn=t}cn(t){return[]}dn(){return[]}It(){return!0}},Na;(function(s){s[s.Normal=0]="Normal",s[s.Magnet=1]="Magnet",s[s.Hidden=2]="Hidden",s[s.MagnetOHLC=3]="MagnetOHLC"})(Na||(Na={}));var yn=class extends Ki{constructor(t,e){super(),this.yt=null,this.fn=NaN,this.pn=0,this.vn=!1,this.mn=new Map,this.wn=!1,this.Mn=new WeakMap,this.gn=new WeakMap,this.bn=NaN,this.Sn=NaN,this.xn=NaN,this.Cn=NaN,this.sn=t,this.yn=e,this.Pn=((n,r)=>o=>{let a=r(),l=n();if(o===M(this.yt).kn())return{Mt:l,Ei:a};{let h=M(o.Lt());return{Mt:o.Tn(a,h),Ei:a}}})((()=>this.fn),(()=>this.Sn));let i=((n,r)=>()=>{let o=this.sn.Et().Rn(n()),a=r();return o&&Number.isFinite(a)?{wt:o,Ei:a}:null})((()=>this.pn),(()=>this.ni()));this.Dn=new wn(this,t,i)}N(){return this.yn}In(t,e){this.xn=t,this.Cn=e}Vn(){this.xn=NaN,this.Cn=NaN}Bn(){return this.xn}En(){return this.Cn}An(t,e,i){this.wn||(this.wn=!0),this.vn=!0,this.Ln(t,e,i)}Bt(){return this.pn}ni(){return this.bn}si(){return this.Sn}It(){return this.vn}zn(){this.vn=!1,this.On(),this.fn=NaN,this.bn=NaN,this.Sn=NaN,this.yt=null,this.Vn(),this.Nn()}Fn(t){if(!this.yn.doNotSnapToHiddenSeriesIndices)return t;let e=this.sn,i=e.Et(),n=null,r=null;for(let h of e.Wn()){let c=h.Un().Hn(t,-1);if(c){if(c.$n===t)return t;(n===null||c.$n>n)&&(n=c.$n)}let u=h.Un().Hn(t,1);if(u){if(u.$n===t)return t;(r===null||u.$n<r)&&(r=u.$n)}}let o=[n,r].filter(Pa);if(o.length===0)return t;let a=i.jt(t),l=o.map((h=>Math.abs(a-i.jt(h))));return o[l.indexOf(Math.min(...l))]}jn(t){let e=this.Mn.get(t);e||(e=new vn(this,t),this.Mn.set(t,e));let i=this.gn.get(t);return i||(i=new pn(this.sn,this,t),this.gn.set(t,i)),[e,i]}ti(t){return t===this.yt&&this.yn.horzLine.visible}ii(){return this.yn.vertLine.visible}qn(t,e){this.vn&&this.yt===t||this.mn.clear();let i=[];return this.yt===t&&i.push(this.Yn(this.mn,e,this.Pn)),i}dn(){return this.vn?[this.Dn]:[]}Kn(){return this.yt}Nn(){this.sn.Gn().forEach((t=>{this.Mn.get(t)?.Pt(),this.gn.get(t)?.Pt()})),this.mn.forEach((t=>t.Pt())),this.Dn.Pt()}Zn(t){return t&&!t.kn().Zi()?t.kn():null}Ln(t,e,i){this.Xn(t,e,i)&&this.Nn()}Xn(t,e,i){let n=this.bn,r=this.Sn,o=this.fn,a=this.pn,l=this.yt,h=this.Zn(i);this.pn=t,this.bn=isNaN(t)?NaN:this.sn.Et().jt(t),this.yt=i;let c=h!==null?h.Lt():null;return h!==null&&c!==null?(this.fn=e,this.Sn=h.Nt(e,c)):(this.fn=NaN,this.Sn=NaN),n!==this.bn||r!==this.Sn||a!==this.pn||o!==this.fn||l!==this.yt}On(){let t=this.sn.Jn().map((i=>i.Un().Qn())).filter(Pa),e=t.length===0?null:Math.max(...t);this.pn=e!==null?e:NaN}Yn(t,e,i){let n=t.get(e);return n===void 0&&(n=new bn(this,e,i),t.set(e,n)),n}};function us(s){return s==="left"||s==="right"}var Q=class s{constructor(t){this.ts=new Map,this.ns=[],this.ss=t}es(t,e){let i=(function(n,r){return n===void 0?r:{rs:Math.max(n.rs,r.rs),hs:n.hs||r.hs}})(this.ts.get(t),e);this.ts.set(t,i)}ls(){return this.ss}_s(t){let e=this.ts.get(t);return e===void 0?{rs:this.ss}:{rs:Math.max(this.ss,e.rs),hs:e.hs}}us(){this.cs(),this.ns=[{ds:0}]}fs(t){this.cs(),this.ns=[{ds:1,Wt:t}]}ps(t){this.vs(),this.ns.push({ds:5,Wt:t})}cs(){this.vs(),this.ns.push({ds:6})}ws(){this.cs(),this.ns=[{ds:4}]}Ms(t){this.cs(),this.ns.push({ds:2,Wt:t})}gs(t){this.cs(),this.ns.push({ds:3,Wt:t})}bs(){return this.ns}Ss(t){for(let e of t.ns)this.xs(e);this.ss=Math.max(this.ss,t.ss),t.ts.forEach(((e,i)=>{this.es(i,e)}))}static Cs(){return new s(2)}static ys(){return new s(3)}xs(t){switch(t.ds){case 0:this.us();break;case 1:this.fs(t.Wt);break;case 2:this.Ms(t.Wt);break;case 3:this.gs(t.Wt);break;case 4:this.ws();break;case 5:this.ps(t.Wt);break;case 6:this.vs()}}vs(){let t=this.ns.findIndex((e=>e.ds===5));t!==-1&&this.ns.splice(t,1)}},Yi=class{formatTickmarks(t){return t.map((e=>this.format(e)))}},Oa=".";function Tt(s,t){if(!we(s))return"n/a";if(!ei(t))throw new TypeError("invalid length");if(t<0||t>16)throw new TypeError("invalid length");return t===0?s.toString():("0000000000000000"+s.toString()).slice(-t)}var xe=class extends Yi{constructor(t,e){if(super(),e||(e=1),we(t)&&ei(t)||(t=100),t<0)throw new TypeError("invalid base");this.Ki=t,this.Ps=e,this.ks()}format(t){let e=t<0?"\u2212":"";return t=Math.abs(t),e+this.Ts(t)}ks(){if(this.Rs=0,this.Ki>0&&this.Ps>0){let t=this.Ki;for(;t>1;)t/=10,this.Rs++}}Ts(t){let e=this.Ki/this.Ps,i=Math.floor(t),n="",r=this.Rs!==void 0?this.Rs:NaN;if(e>1){let o=+(Math.round(t*e)-i*e).toFixed(this.Rs);o>=e&&(o-=e,i+=1),n=Oa+Tt(+o.toFixed(this.Rs)*this.Ps,r)}else i=Math.round(i*e)/e,r>0&&(n=Oa+Tt(0,r));return i.toFixed(0)+n}},Qi=class extends xe{constructor(t=100){super(t)}format(t){return`${super.format(t)}%`}},xn=class extends Yi{constructor(t){super(),this.Ds=t}format(t){let e="";return t<0&&(e="-",t=-t),t<995?e+this.Is(t):t<999995?e+this.Is(t/1e3)+"K":t<999999995?(t=1e3*Math.round(t/1e3),e+this.Is(t/1e6)+"M"):(t=1e6*Math.round(t/1e6),e+this.Is(t/1e9)+"B")}Is(t){let e,i=Math.pow(10,this.Ds);return e=(t=Math.round(t*i)/i)>=1e-15&&t<1?t.toFixed(this.Ds).replace(/\.?0+$/,""):String(t),e.replace(/(\.[1-9]*)0+$/,((n,r)=>r))}},Uh=/[2-9]/g,Ce=class{constructor(t=50){this.Vs=0,this.Bs=1,this.Es=1,this.As={},this.Ls=new Map,this.zs=t}Os(){this.Vs=0,this.Ls.clear(),this.Bs=1,this.Es=1,this.As={}}Ii(t,e,i){return this.Ns(t,e,i).width}Di(t,e,i){let n=this.Ns(t,e,i);return((n.actualBoundingBoxAscent||0)-(n.actualBoundingBoxDescent||0))/2}Ns(t,e,i){let n=i||Uh,r=String(e).replace(n,"0");if(this.Ls.has(r))return Z(this.Ls.get(r)).Fs;if(this.Vs===this.zs){let a=this.As[this.Es];delete this.As[this.Es],this.Ls.delete(a),this.Es++,this.Vs--}t.save(),t.textBaseline="middle";let o=t.measureText(r);return t.restore(),o.width===0&&e.length||(this.Ls.set(r,{Fs:o,Ws:this.Bs}),this.As[this.Bs]=r,this.Vs++,this.Bs++),o}},Cn=class{constructor(t){this.Hs=null,this.M=null,this.Us="right",this.$s=t}js(t,e,i){this.Hs=t,this.M=e,this.Us=i}st(t){this.M!==null&&this.Hs!==null&&this.Hs.st(t,this.M,this.$s,this.Us)}},Gi=class{constructor(t,e,i){this.qs=t,this.$s=new Ce(50),this.Ys=e,this.O=i,this.F=-1,this.Xt=new Cn(this.$s)}Tt(){let t=this.O.Ks(this.Ys);if(t===null)return null;let e=t.Gs(this.Ys)?t.Zs():this.Ys.Ft();if(e===null)return null;let i=t.Xs(e);if(i==="overlay")return null;let n=this.O.Js();return n.P!==this.F&&(this.F=n.P,this.$s.Os()),this.Xt.js(this.qs.qi(),n,i),this.Xt}},Sn=class extends Bt{constructor(){super(...arguments),this.qt=null}ht(t){this.qt=t}Qs(t,e){if(!this.qt?.It)return null;let{ut:i,ct:n,te:r}=this.qt;return e>=i-n-7&&e<=i+n+7?{ie:this.qt,ne:Math.abs(e-i),se:2,ee:"price-line",te:r}:null}et({context:t,bitmapSize:e,horizontalPixelRatio:i,verticalPixelRatio:n}){if(this.qt===null||this.qt.It===!1)return;let r=Math.round(this.qt.ut*n);r<0||r>e.height||(t.lineCap="butt",t.strokeStyle=this.qt.R,t.lineWidth=Math.floor(this.qt.ct*i),ie(t,this.qt.Gt),vl(t,r,0,e.width))}},ii=class{constructor(t){this.re={ut:0,R:"rgba(0, 0, 0, 0)",ct:1,Gt:0,It:!1},this.he=new Sn,this.xt=!0,this.ae=t,this.le=t.Qt(),this.he.ht(this.re)}Pt(){this.xt=!0}Tt(){return this.ae.It()?(this.xt&&(this.oe(),this.xt=!1),this.he):null}},Mn=class extends ii{constructor(t){super(t)}oe(){this.re.It=!1;let t=this.ae.Ft(),e=t._e()._e;if(e!==2&&e!==3)return;let i=this.ae.N();if(!i.baseLineVisible||!this.ae.It())return;let n=this.ae.Lt();n!==null&&(this.re.It=!0,this.re.ut=t.Nt(n.Wt,n.Wt),this.re.R=i.baseLineColor,this.re.ct=i.baseLineWidth,this.re.Gt=i.baseLineStyle)}},_n=class extends Bt{constructor(){super(...arguments),this.qt=null}ht(t){this.qt=t}ue(){return this.qt}et({context:t,horizontalPixelRatio:e,verticalPixelRatio:i}){let n=this.qt;if(n===null)return;let r=Math.max(1,Math.floor(e)),o=r%2/2,a=Math.round(n.ce.x*e)+o,l=n.ce.y*i;t.fillStyle=n.de,t.beginPath();let h=Math.max(2,1.5*n.fe)*e;t.arc(a,l,h,0,2*Math.PI,!1),t.fill(),t.fillStyle=n.pe,t.beginPath(),t.arc(a,l,n.ft*e,0,2*Math.PI,!1),t.fill(),t.lineWidth=r,t.strokeStyle=n.ve,t.beginPath(),t.arc(a,l,n.ft*e+r/2,0,2*Math.PI,!1),t.stroke()}},Hh=[{me:0,we:.25,Me:4,ge:10,be:.25,Se:0,xe:.4,Ce:.8},{me:.25,we:.525,Me:10,ge:14,be:0,Se:0,xe:.8,Ce:0},{me:.525,we:1,Me:14,ge:14,be:0,Se:0,xe:0,Ce:0}],Ln=class{constructor(t){this.Xt=new _n,this.xt=!0,this.ye=!0,this.Pe=performance.now(),this.ke=this.Pe-1,this.Te=t}Re(){this.ke=this.Pe-1,this.Pt()}De(){if(this.Pt(),this.Te.N().lastPriceAnimation===2){let t=performance.now(),e=this.ke-t;if(e>0)return void(e<650&&(this.ke+=2600));this.Pe=t,this.ke=t+2600}}Pt(){this.xt=!0}Ie(){this.ye=!0}It(){return this.Te.N().lastPriceAnimation!==0}Ve(){switch(this.Te.N().lastPriceAnimation){case 0:return!1;case 1:return!0;case 2:return performance.now()<=this.ke}}Tt(){return this.xt?(this.Rt(),this.xt=!1,this.ye=!1):this.ye&&(this.Be(),this.ye=!1),this.Xt}Rt(){this.Xt.ht(null);let t=this.Te.Qt().Et(),e=t.Ee(),i=this.Te.Lt();if(e===null||i===null)return;let n=this.Te.Ae(!0);if(n.Le||!e.ze(n.$n))return;let r={x:t.jt(n.$n),y:this.Te.Ft().Nt(n.Mt,i.Wt)},o=n.R,a=this.Te.N().lineWidth,l=this.Oe(this.Ne(),o);this.Xt.ht({de:o,fe:a,pe:l.pe,ve:l.ve,ft:l.ft,ce:r})}Be(){let t=this.Xt.ue();if(t!==null){let e=this.Oe(this.Ne(),t.de);t.pe=e.pe,t.ve=e.ve,t.ft=e.ft}}Ne(){return this.Ve()?performance.now()-this.Pe:2599}Fe(t,e,i,n){let r=i+(n-i)*e;return this.Te.Qt().Xi().Y(t,r)}Oe(t,e){let i=t%2600/2600,n;for(let h of Hh)if(i>=h.me&&i<=h.we){n=h;break}Y(n!==void 0,"Last price animation internal logic error");let r=(i-n.me)/(n.we-n.me);return{pe:this.Fe(e,r,n.be,n.Se),ve:this.Fe(e,r,n.xe,n.Ce),ft:(o=r,a=n.Me,l=n.ge,a+(l-a)*o)};var o,a,l}},En=class extends ii{constructor(t){super(t)}oe(){let t=this.re;t.It=!1;let e=this.ae.N();if(!e.priceLineVisible||!this.ae.It())return;let i=this.ae.Ae(e.priceLineSource===0);i.Le||(t.It=!0,t.ut=i.Ei,t.R=this.ae.We(i.R),t.ct=e.priceLineWidth,t.Gt=e.priceLineStyle)}},kn=class extends ye{constructor(t){super(),this.Jt=t}Yi(t,e,i){t.It=!1,e.It=!1;let n=this.Jt;if(!n.It())return;let r=n.N(),o=r.lastValueVisible,a=n.He()!=="",l=r.seriesLastValueMode===0,h=n.Ae(!1);if(h.Le)return;o&&(t.ri=this.Ue(h,o,l),t.It=t.ri.length!==0),(a||l)&&(e.ri=this.$e(h,o,a,l),e.It=e.ri.length>0);let c=n.We(h.R),u=this.Jt.Qt().Xi().G(c);i.Z=u.Z,i.Ei=h.Ei,e.Ht=n.Qt().Ut(h.Ei/n.Ft().$t()),t.Ht=c,t.R=u.X,e.R=u.X}$e(t,e,i,n){let r="",o=this.Jt.He();return i&&o.length!==0&&(r+=`${o} `),e&&n&&(r+=this.Jt.Ft().je()?t.qe:t.Ye),r.trim()}Ue(t,e,i){return e?i?this.Jt.Ft().je()?t.Ye:t.qe:t.ri:""}};function Fa(s,t,e,i){let n=Number.isFinite(t),r=Number.isFinite(e);return n&&r?s(t,e):n||r?n?t:e:i}var st=class s{constructor(t,e){this.Ke=t,this.Ge=e}Ze(t){return t!==null&&this.Ke===t.Ke&&this.Ge===t.Ge}Xe(){return new s(this.Ke,this.Ge)}Je(){return this.Ke}Qe(){return this.Ge}tr(){return this.Ge-this.Ke}Zi(){return this.Ge===this.Ke||Number.isNaN(this.Ge)||Number.isNaN(this.Ke)}Ss(t){return t===null?this:new s(Fa(Math.min,this.Je(),t.Je(),-1/0),Fa(Math.max,this.Qe(),t.Qe(),1/0))}ir(t){if(!we(t)||this.Ge-this.Ke===0)return;let e=.5*(this.Ge+this.Ke),i=this.Ge-e,n=this.Ke-e;i*=t,n*=t,this.Ge=e+i,this.Ke=e+n}nr(t){we(t)&&(this.Ge+=t,this.Ke+=t)}sr(){return{minValue:this.Ke,maxValue:this.Ge}}static er(t){return t===null?null:new s(t.minValue,t.maxValue)}},Xi=class s{constructor(t,e){this.rr=t,this.hr=e||null}ar(){return this.rr}lr(){return this.hr}sr(){return{priceRange:this.rr===null?null:this.rr.sr(),margins:this.hr||void 0}}static er(t){return t===null?null:new s(st.er(t.priceRange),t.margins)}},jh=[2,4,8,16,32,64,128,256,512],Kh="Custom series with conflation reducer must have a priceValueBuilder method",zn=class extends ii{constructor(t,e){super(t),this._r=e}oe(){let t=this.re;t.It=!1;let e=this._r.N();if(!this.ae.It()||!e.lineVisible)return;let i=this._r.ur();i!==null&&(t.It=!0,t.ut=i,t.R=e.color,t.ct=e.lineWidth,t.Gt=e.lineStyle,t.te=this._r.N().id)}},Tn=class extends ye{constructor(t,e){super(),this.Te=t,this._r=e}Yi(t,e,i){t.It=!1,e.It=!1;let n=this._r.N(),r=n.axisLabelVisible,o=n.title!=="",a=this.Te;if(!r||!a.It())return;let l=this._r.ur();if(l===null)return;o&&(e.ri=n.title,e.It=!0),e.Ht=a.Qt().Ut(l/a.Ft().$t()),t.ri=this.cr(n.price),t.It=!0;let h=this.Te.Qt().Xi().G(n.axisLabelColor||n.color);i.Z=h.Z;let c=n.axisLabelTextColor||h.X;t.R=c,e.R=c,i.Ei=l}cr(t){let e=this.Te.Lt();return e===null?"":this.Te.Ft().Ji(t,e.Wt)}},Pn=class{constructor(t,e){this.Te=t,this.yn=e,this.dr=new zn(t,this),this.qs=new Tn(t,this),this.pr=new Gi(this.qs,t,t.Qt())}vr(t){it(this.yn,t),this.Pt(),this.Te.Qt().mr()}N(){return this.yn}wr(){return this.dr}Mr(){return this.pr}gr(){return this.qs}Pt(){this.dr.Pt(),this.qs.Pt()}ur(){let t=this.Te,e=t.Ft();if(t.Qt().Et().Zi()||e.Zi())return null;let i=t.Lt();return i===null?null:e.Nt(this.yn.price,i.Wt)}},An=class{constructor(){this.br=new WeakMap}Sr(t,e,i){let n=1/e*i;if(t>=n)return 1;let r=n/t,o=Math.pow(2,Math.floor(Math.log2(r)));return Math.min(o,512)}Cr(t,e,i,n=!1,r){if(t.length===0||e<=1)return t;let o=this.yr(e);if(o<=1)return t;let a=this.Pr(t),l=a.kr.get(o);return l!==void 0||(l=this.Tr(t,o,i,n,r,a.kr),a.kr.set(o,l)),l}Rr(t,e,i,n,r=!1,o){if(i<1||t.length===0)return t;let a=this.Pr(t),l=a.kr.get(i);if(!l)return this.Cr(t,i,n,r,o);let h=this.Dr(t,e,i,l,r,n,o);return a.kr.set(i,h),h}yr(t){if(t<=2)return 2;for(let e of jh)if(t<=e)return e;return 512}Ir(t){if(t.length===0)return 0;let e=t[0],i=t[t.length-1];return 31*t.length+17*e.$n+13*i.$n}Tr(t,e,i,n=!1,r,o=new Map){if(e===2)return this.Vr(t,2,i,n,r);let a=e/2,l=o.get(a);return l||(l=this.Tr(t,a,i,n,r,o),o.set(a,l)),this.Br(l,i,n,r)}Vr(t,e,i,n=!1,r){let o=this.Er(t,e,i,n,r);return this.Ar(o,n)}Br(t,e,i=!1,n){let r=this.Er(t,2,e,i,n);return this.Ar(r,i)}Er(t,e,i,n=!1,r){let o=[];for(let a=0;a<t.length;a+=e)if(t.length-a>=e){let l=this.Lr(t[a],t[a+1],i,n,r);l.zr=!1,o.push(l)}else if(o.length===0)o.push(this.Or(t[a],!0));else{let l=o[o.length-1];o[o.length-1]=this.Nr(l,t[a],i,n,r)}return o}Fr(t,e){return(t??1)+(e??1)}Lr(t,e,i,n=!1,r){if(!n||!i||!r){let h=t.Wt[1]>e.Wt[1]?t.Wt[1]:e.Wt[1],c=t.Wt[2]<e.Wt[2]?t.Wt[2]:e.Wt[2];return{Wr:t.$n,Hr:e.$n,Ur:t.wt,$r:e.wt,jr:t.Wt[0],qr:h,Yr:c,Kr:e.Wt[3],Gr:this.Fr(t.Gr,e.Gr),Zr:void 0,zr:!1}}let o=i(this.Xr(t,r),this.Xr(e,r)),a=r(o),l=a.length?a[a.length-1]:0;return{Wr:t.$n,Hr:e.$n,Ur:t.wt,$r:e.wt,jr:t.Wt[0],qr:Math.max(t.Wt[1],l),Yr:Math.min(t.Wt[2],l),Kr:l,Gr:this.Fr(t.Gr,e.Gr),Zr:o,zr:!1}}Nr(t,e,i,n=!1,r){if(!n||!i||!r)return{Wr:t.Wr,Hr:e.$n,Ur:t.Ur,$r:e.wt,jr:t.jr,qr:t.qr>e.Wt[1]?t.qr:e.Wt[1],Yr:t.Yr<e.Wt[2]?t.Yr:e.Wt[2],Kr:e.Wt[3],Gr:t.Gr+(e.Gr??1),Zr:t.Zr,zr:!1};let o=t.Zr,a=this.Xr(e,r),l=o?{data:o,index:t.Wr,originalTime:t.Ur,time:t.Ur,priceValues:r(o)}:null,h=l?i(l,a):a.data,c=l?r(h):a.priceValues,u=c.length?c[c.length-1]:0;return{Wr:t.Wr,Hr:e.$n,Ur:t.Ur,$r:e.wt,jr:t.jr,qr:Math.max(t.qr,u),Yr:Math.min(t.Yr,u),Kr:u,Gr:t.Gr+(e.Gr??1),Zr:h,zr:!1}}Jr(t,e,i,n,r,o,a=!1,l){let h=e===n?r:t[e];if(i-e==1)return this.Or(h,!0);let c=e+1===n?r:t[e+1],u=this.Lr(h,c,o,a,l);for(let d=e+2;d<i;d++){let m=d===n?r:t[d];u=this.Nr(u,m,o,a,l)}return u}Xr(t,e){let i=t.ue??{};return{data:t.ue,index:t.$n,originalTime:t.Qr,time:t.wt,priceValues:e(i)}}th(t,e=!1){let i=e===!0,n=!!t.Zr;return{$n:t.Wr,wt:t.Ur,Qr:t.Ur,Wt:[i?t.Kr:t.jr,t.qr,t.Yr,t.Kr],Gr:t.Gr,ue:i?n?t.Zr:{wt:t.Ur}:void 0}}Ar(t,e=!1){return t.map((i=>this.th(i,e)))}Dr(t,e,i,n,r=!1,o,a){if(n.length===0)return n;let l=t.length-1,h=Math.floor(l/i)*i;if(Math.min(h+i,t.length)-h<i&&t.length>i){let c=t.slice();return c[c.length-1]=e,this.Cr(c,i,o,r,a)}if(Math.floor((l-1)/i)===Math.floor(l/i)||n.length===1){let c=Math.min(h+i,t.length),u=c-h;if(u<=0)return n;let d=u===1?this.Or(h===l?e:t[h],!0):this.Jr(t,h,c,l,e,o,r,a);return n[n.length-1]=this.th(d,r),n}{let c=t.slice();return c[c.length-1]=e,this.Cr(c,i,o,r,a)}}Or(t,e=!1){return{Wr:t.$n,Hr:t.$n,Ur:t.wt,$r:t.wt,jr:t.Wt[0],qr:t.Wt[1],Yr:t.Wt[2],Kr:t.Wt[3],Gr:t.Gr??1,Zr:t.ue,zr:e}}Pr(t){let e=this.ih(t),i=this.Ir(t);return e.nh!==i&&(e.kr.clear(),e.nh=i),e}ih(t){let e=this.br.get(t);return e===void 0&&(e={nh:this.Ir(t),kr:new Map},this.br.set(t,e)),e}},$n=class extends Ki{constructor(t){super(),this.sn=t}Qt(){return this.sn}},Yh={Bar:(s,t,e,i)=>{let n=t.upColor,r=t.downColor,o=M(s(e,i)),a=It(o.Wt[0])<=It(o.Wt[3]);return{sh:o.R??(a?n:r)}},Candlestick:(s,t,e,i)=>{let n=t.upColor,r=t.downColor,o=t.borderUpColor,a=t.borderDownColor,l=t.wickUpColor,h=t.wickDownColor,c=M(s(e,i)),u=It(c.Wt[0])<=It(c.Wt[3]);return{sh:c.R??(u?n:r),eh:c.Ht??(u?o:a),rh:c.hh??(u?l:h)}},Custom:(s,t,e,i)=>({sh:M(s(e,i)).R??t.color}),Area:(s,t,e,i)=>{let n=M(s(e,i));return{sh:n.vt??t.lineColor,vt:n.vt??t.lineColor,ah:n.ah??t.topColor,oh:n.oh??t.bottomColor}},Baseline:(s,t,e,i)=>{let n=M(s(e,i));return{sh:n.Wt[3]>=t.baseValue.price?t.topLineColor:t.bottomLineColor,_h:n._h??t.topLineColor,uh:n.uh??t.bottomLineColor,dh:n.dh??t.topFillColor1,fh:n.fh??t.topFillColor2,ph:n.ph??t.bottomFillColor1,mh:n.mh??t.bottomFillColor2}},Line:(s,t,e,i)=>{let n=M(s(e,i));return{sh:n.R??t.color,vt:n.R??t.color}},Histogram:(s,t,e,i)=>({sh:M(s(e,i)).R??t.color})},Rn=class{constructor(t){this.wh=(e,i)=>i!==void 0?i.Wt:this.Te.Un().Mh(e),this.Te=t,this.gh=Yh[t.bh()]}Sh(t,e){return this.gh(this.wh,this.Te.N(),t,e)}};function yl(s,t,e,i,n=0,r=t.length){let o=r-n;for(;0<o;){let a=o>>1,l=n+a;i(t[l],e)===s?(n=l+1,o-=a+1):o=a}return n}var se=yl.bind(null,!0),Sr=yl.bind(null,!1),Ia;(function(s){s[s.NearestLeft=-1]="NearestLeft",s[s.None=0]="None",s[s.NearestRight=1]="NearestRight"})(Ia||(Ia={}));var Ft=30,Nn=class{constructor(){this.xh=[],this.Ch=new Map,this.yh=new Map,this.Ph=[]}kh(){return this.Th()>0?this.xh[this.xh.length-1]:null}Rh(){return this.Th()>0?this.Dh(0):null}Qn(){return this.Th()>0?this.Dh(this.xh.length-1):null}Th(){return this.xh.length}Zi(){return this.Th()===0}ze(t){return this.Ih(t,0)!==null}Mh(t){return this.Hn(t)}Hn(t,e=0){let i=this.Ih(t,e);return i===null?null:{...this.Vh(i),$n:this.Dh(i)}}Bh(){return this.xh}Eh(t,e,i){if(this.Zi())return null;let n=null;for(let r of i)n=Ai(n,this.Ah(t,e,r));return n}ht(t){this.yh.clear(),this.Ch.clear(),this.xh=t,this.Ph=t.map((e=>e.$n))}Lh(){return this.Ph}Dh(t){return this.xh[t].$n}Vh(t){return this.xh[t]}Ih(t,e){let i=this.zh(t);if(i===null&&e!==0)switch(e){case-1:return this.Oh(t);case 1:return this.Nh(t);default:throw new TypeError("Unknown search mode")}return i}Oh(t){let e=this.Fh(t);return e>0&&(e-=1),e!==this.xh.length&&this.Dh(e)<t?e:null}Nh(t){let e=this.Wh(t);return e!==this.xh.length&&t<this.Dh(e)?e:null}zh(t){let e=this.Fh(t);return e===this.xh.length||t<this.xh[e].$n?null:e}Fh(t){return se(this.xh,t,((e,i)=>e.$n<i))}Wh(t){return Sr(this.xh,t,((e,i)=>e.$n>i))}Hh(t,e,i){let n=null;for(let r=t;r<e;r++){let o=this.xh[r].Wt[i];Number.isNaN(o)||(n===null?n={Uh:o,$h:o}:(o<n.Uh&&(n.Uh=o),o>n.$h&&(n.$h=o)))}return n}Ah(t,e,i){if(this.Zi())return null;let n=null,r=M(this.Rh()),o=M(this.Qn()),a=Math.max(t,r),l=Math.min(e,o),h=Math.ceil(a/Ft)*Ft,c=Math.max(h,Math.floor(l/Ft)*Ft);{let d=this.Fh(a),m=this.Wh(Math.min(l,h,e));n=Ai(n,this.Hh(d,m,i))}let u=this.Ch.get(i);u===void 0&&(u=new Map,this.Ch.set(i,u));for(let d=Math.max(h+1,a);d<c;d+=Ft){let m=Math.floor(d/Ft),f=u.get(m);if(f===void 0){let p=this.Fh(m*Ft),b=this.Wh((m+1)*Ft-1);f=this.Hh(p,b,i),u.set(m,f)}n=Ai(n,f)}{let d=this.Fh(c),m=this.Wh(l);n=Ai(n,this.Hh(d,m,i))}return n}};function Ai(s,t){return s===null?t:t===null?s:{Uh:Math.min(s.Uh,t.Uh),$h:Math.max(s.$h,t.$h)}}function Ys(){return new Nn}var Ji={setLineStyle:ie},On=class{constructor(t){this.jh=t}st(t,e,i){this.jh.draw(t,Ji)}qh(t,e,i){this.jh.drawBackground?.(t,Ji)}},Fn=class{constructor(t){this.Ls=null,this.Yh=t}Tt(){let t=this.Yh.renderer();if(t===null)return null;if(this.Ls?.Kh===t)return this.Ls.Gh;let e=new On(t);return this.Ls={Kh:t,Gh:e},e}Zh(){return this.Yh.zOrder?.()??"normal"}},Zi=class{constructor(t){this.Xh=null,this.Jh=t}Qh(){return this.Jh}Nn(){this.Jh.updateAllViews?.()}jn(){let t=this.Jh.paneViews?.()??[];if(this.Xh?.Kh===t)return this.Xh.Gh;let e=t.map((i=>new Fn(i)));return this.Xh={Kh:t,Gh:e},e}Qs(t,e){return this.Jh.hitTest?.(t,e)??null}},Qh=class extends Zi{cn(){return[]}},In=class{constructor(t){this.jh=t}st(t,e,i){this.jh.draw(t,Ji)}qh(t,e,i){this.jh.drawBackground?.(t,Ji)}},ts=class{constructor(t){this.Ls=null,this.Yh=t}Tt(){let t=this.Yh.renderer();if(t===null)return null;if(this.Ls?.Kh===t)return this.Ls.Gh;let e=new In(t);return this.Ls={Kh:t,Gh:e},e}Zh(){return this.Yh.zOrder?.()??"normal"}};function xl(s){return{ri:s.text(),Ei:s.coordinate(),Vi:s.fixedCoordinate?.(),R:s.textColor(),Z:s.backColor(),It:s.visible?.()??!0,pi:s.tickVisible?.()??!0}}var Bn=class{constructor(t,e){this.Xt=new ji,this.ta=t,this.ia=e}Tt(){return this.Xt.ht({nn:this.ia.nn(),...xl(this.ta)}),this.Xt}},Vn=class extends ye{constructor(t,e){super(),this.ta=t,this.Ki=e}Yi(t,e,i){let n=xl(this.ta);i.Z=n.Z,t.R=n.R;let r=2/12*this.Ki.P();i.Ti=r,i.Ri=r,i.Ei=n.Ei,i.Vi=n.Vi,t.ri=n.ri,t.It=n.It,t.pi=n.pi}},qn=class extends Zi{constructor(t,e){super(t),this.na=null,this.sa=null,this.ea=null,this.ra=null,this.Te=e}dn(){let t=this.Jh.timeAxisViews?.()??[];if(this.na?.Kh===t)return this.na.Gh;let e=this.Te.Qt().Et(),i=t.map((n=>new Bn(n,e)));return this.na={Kh:t,Gh:i},i}qn(){let t=this.Jh.priceAxisViews?.()??[];if(this.sa?.Kh===t)return this.sa.Gh;let e=this.Te.Ft(),i=t.map((n=>new Vn(n,e)));return this.sa={Kh:t,Gh:i},i}ha(){let t=this.Jh.priceAxisPaneViews?.()??[];if(this.ea?.Kh===t)return this.ea.Gh;let e=t.map((i=>new ts(i)));return this.ea={Kh:t,Gh:e},e}aa(){let t=this.Jh.timeAxisPaneViews?.()??[];if(this.ra?.Kh===t)return this.ra.Gh;let e=t.map((i=>new ts(i)));return this.ra={Kh:t,Gh:e},e}la(t,e){return this.Jh.autoscaleInfo?.(t,e)??null}};function $i(s,t,e,i){s.forEach((n=>{t(n).forEach((r=>{r.Zh()===e&&i.push(r)}))}))}function Ri(s){return s.jn()}function Gh(s){return s.ha()}function Xh(s){return s.aa()}var Jh=["Area","Line","Baseline"],Se=class extends $n{constructor(t,e,i,n,r){super(t),this.qt=Ys(),this.dr=new En(this),this.oa=[],this._a=new Mn(this),this.ua=null,this.ca=null,this.da=null,this.fa=[],this.pa=new An,this.va=new Map,this.ma=null,this.yn=i,this.wa=e;let o=new kn(this);if(this.mn=[o],this.pr=new Gi(o,this,t),Jh.includes(this.wa)&&(this.ua=new Ln(this)),this.Ma(),this.Yh=n(this,this.Qt(),r),this.wa==="Custom"){let a=this.Yh;a.ga&&this.ba(a.ga)}}m(){this.da!==null&&clearTimeout(this.da)}We(t){return this.yn.priceLineColor||t}Ae(t){let e={Le:!0},i=this.Ft();if(this.Qt().Et().Zi()||i.Zi()||this.qt.Zi())return e;let n=this.Qt().Et().Ee(),r=this.Lt();if(n===null||r===null)return e;let o,a;if(t){let u=this.qt.kh();if(u===null)return e;o=u,a=u.$n}else{let u=this.qt.Hn(n.bi(),-1);if(u===null||(o=this.qt.Mh(u.$n),o===null))return e;a=u.$n}let l=o.Wt[3],h=this.Sa().Sh(a,{Wt:o}),c=i.Nt(l,r.Wt);return{Le:!1,Mt:l,ri:i.Ji(l,r.Wt),qe:i.xa(l),Ye:i.Ca(l,r.Wt),R:h.sh,Ei:c,$n:a}}Sa(){return this.ca!==null||(this.ca=new Rn(this)),this.ca}N(){return this.yn}vr(t){let e=this.Qt(),{priceScaleId:i,visible:n,priceFormat:r}=t;i!==void 0&&i!==this.yn.priceScaleId&&e.ya(this,i),n!==void 0&&n!==this.yn.visible&&e.Pa();let o=t.conflationThresholdFactor!==void 0;it(this.yn,t),Object.prototype.hasOwnProperty.call(t,"autoscaleInfoProvider")&&t.autoscaleInfoProvider===void 0&&(this.yn.autoscaleInfoProvider=void 0),o&&(this.va.clear(),this.Qt().mr()),r!==void 0&&(this.Ma(),e.ka()),e.Ta(this),e.Ra(),this.Yh.Pt("options")}ht(t,e){this.qt.ht(t),this.va.clear();let i=this.Qt().Et().N();i.enableConflation&&i.precomputeConflationOnInit&&this.Da(i.precomputeConflationPriority),this.Ia(),this.ua!==null&&(e&&e.Va?this.ua.De():t.length===0&&this.ua.Re());let n=this.Qt().Ks(this);this.Qt().Ba(n),this.Qt().Ta(this),this.Qt().Ra(),this.Qt().mr()}Ia(){this.Yh.Pt("data")}Ea(t){let e=new Pn(this,t);return this.oa.push(e),this.Qt().Ta(this),e}Aa(t){let e=this.oa.indexOf(t);e!==-1&&this.oa.splice(e,1),this.Qt().Ta(this)}La(){return this.oa}bh(){return this.wa}Lt(){let t=this.za();return t===null?null:{Wt:t.Wt[3],Oa:t.wt}}za(){let t=this.Qt().Et().Ee();if(t===null)return null;let e=t.Na();return this.qt.Hn(e,1)}Un(){return this.qt}ba(t){this.ma=t,this.va.clear()}Fa(){return!!this.Qt().Et().N().enableConflation&&this.Wa()>1}Rr(t){if(!this.Fa())return;let e=this.Wa();if(!this.va.has(e))return;let i=this.wa==="Custom",n=i&&this.ma||void 0,r=i&&this.Yh.Ha?l=>{let h=l,c=this.Yh.Ha(h);return Array.isArray(c)?c:[typeof c=="number"?c:0]}:void 0,o=this.pa.Rr(this.qt.Bh(),t,e,n,i,r),a=Ys();a.ht(o),this.va.set(e,a)}Ua(){let t=this.Qt().Et().N().enableConflation;if(this.wa==="Custom"&&this.ma===null)return this.qt;if(!t)return this.qt;let e=this.Wa(),i=this.va.get(e);return i||(this.$a(e),this.va.get(e)??this.qt)}ja(t){let e=this.qt.Mh(t);return e===null?null:this.wa==="Bar"||this.wa==="Candlestick"||this.wa==="Custom"?{jr:e.Wt[0],qr:e.Wt[1],Yr:e.Wt[2],Kr:e.Wt[3]}:e.Wt[3]}qa(t){let e=[];$i(this.fa,Ri,"top",e);let i=this.ua;return i!==null&&i.It()&&(this.da===null&&i.Ve()&&(this.da=setTimeout((()=>{this.da=null,this.Qt().Ya()}),0)),i.Ie(),e.unshift(i)),e}jn(){let t=[];this.Ka()||t.push(this._a),t.push(this.Yh,this.dr);let e=this.oa.map((i=>i.wr()));return t.push(...e),$i(this.fa,Ri,"normal",t),t}Ga(){let t=this.Yh.Ga?.()??null;if(t===null)return null;let e=[];this.Ka()||e.push(this._a),e.push(...t.Za),$i(this.fa,Ri,"normal",e);let i=[];i.push(...t.qa,this.dr);let n=this.oa.map((r=>r.wr()));return i.push(...n),{Za:e,qa:i}}Xa(){return this.Ja(Ri,"bottom")}Qa(t){return this.Ja(Gh,t)}tl(t){return this.Ja(Xh,t)}il(t,e){return this.fa.map((i=>i.Qs(t,e))).filter((i=>i!==null))}cn(){return[this.pr,...this.oa.map((t=>t.Mr()))]}qn(t,e){if(e!==this.hn&&!this.Ka())return[];let i=[...this.mn];for(let n of this.oa)i.push(n.gr());return this.fa.forEach((n=>{i.push(...n.qn())})),i}dn(){let t=[];return this.fa.forEach((e=>{t.push(...e.dn())})),t}la(t,e){if(this.yn.autoscaleInfoProvider!==void 0){let i=this.yn.autoscaleInfoProvider((()=>{let n=this.nl(t,e);return n===null?null:n.sr()}));return Xi.er(i)}return this.nl(t,e)}Kh(){let t=this.yn.priceFormat;return t.base??1/t.minMove}sl(){return this.el}Nn(){this.Yh.Pt();for(let t of this.mn)t.Pt();for(let t of this.oa)t.Pt();this.dr.Pt(),this._a.Pt(),this.ua?.Pt(),this.fa.forEach((t=>t.Nn()))}Ft(){return M(super.Ft())}At(t){if(!((this.wa==="Line"||this.wa==="Area"||this.wa==="Baseline")&&this.yn.crosshairMarkerVisible))return null;let e=this.qt.Mh(t);return e===null?null:{Mt:e.Wt[3],ft:this.rl(),Ht:this.hl(),Ot:this.al(),zt:this.ll(t)}}He(){return this.yn.title}It(){return this.yn.visible}ol(t){this.fa.push(new qn(t,this))}_l(t){this.fa=this.fa.filter((e=>e.Qh()!==t))}ul(){if(this.wa==="Custom")return t=>this.Yh.Ha(t)}cl(){if(this.wa==="Custom")return t=>this.Yh.dl(t)}fl(){return this.qt.Lh()}Ka(){return!us(this.Ft().pl())}nl(t,e){if(!ei(t)||!ei(e)||this.qt.Zi())return null;let i=this.wa==="Line"||this.wa==="Area"||this.wa==="Baseline"||this.wa==="Histogram"?[3]:[2,1],n=this.qt.Eh(t,e,i),r=n!==null?new st(n.Uh,n.$h):null,o=null;if(this.bh()==="Histogram"){let a=this.yn.base,l=new st(a,a);r=r!==null?r.Ss(l):l}return this.fa.forEach((a=>{let l=a.la(t,e);if(l?.priceRange){let h=new st(l.priceRange.minValue,l.priceRange.maxValue);r=r!==null?r.Ss(h):h}l?.margins&&(o=l.margins)})),new Xi(r,o)}rl(){switch(this.wa){case"Line":case"Area":case"Baseline":return this.yn.crosshairMarkerRadius}return 0}hl(){switch(this.wa){case"Line":case"Area":case"Baseline":{let t=this.yn.crosshairMarkerBorderColor;if(t.length!==0)return t}}return null}al(){switch(this.wa){case"Line":case"Area":case"Baseline":return this.yn.crosshairMarkerBorderWidth}return 0}ll(t){switch(this.wa){case"Line":case"Area":case"Baseline":{let e=this.yn.crosshairMarkerBackgroundColor;if(e.length!==0)return e}}return this.Sa().Sh(t).sh}Ma(){switch(this.yn.priceFormat.type){case"custom":{let t=this.yn.priceFormat.formatter;this.el={format:t,formatTickmarks:this.yn.priceFormat.tickmarksFormatter??(e=>e.map(t))};break}case"volume":this.el=new xn(this.yn.priceFormat.precision);break;case"percent":this.el=new Qi(this.yn.priceFormat.precision);break;default:{let t=Math.pow(10,this.yn.priceFormat.precision);this.el=new xe(t,this.yn.priceFormat.minMove*t)}}this.hn!==null&&this.hn.vl()}Ja(t,e){let i=[];return $i(this.fa,t,e,i),i}Wa(){let{ml:t,wl:e,Ml:i}=this.gl();return this.pa.Sr(t,e,i)}gl(){let t=this.Qt().Et(),e=t.ml(),i=window.devicePixelRatio||1,n=t.N().conflationThresholdFactor;return{ml:e,wl:i,Ml:this.yn.conflationThresholdFactor??n??1}}bl(t){let e=this.qt.Bh(),i;if(this.wa==="Custom"&&this.ma!==null){let r=this.ul();if(!r)throw new Error(Kh);i=this.pa.Cr(e,t,this.ma,!0,(o=>r(o)))}else i=this.pa.Cr(e,t);let n=Ys();return n.ht(i),n}$a(t){let e=this.bl(t);this.va.set(t,e)}Da(t){if(this.wa==="Custom"&&(this.ma===null||!this.ul()))return;this.va.clear();let e=this.Qt().Et().Sl();for(let i of e){let n=()=>{this.xl(i)},r=typeof window=="object"&&window||typeof self=="object"&&self;r?.yl?.Cl?r.yl.Cl((()=>{n()}),{se:t}):Promise.resolve().then((()=>n()))}}xl(t){if(this.va.has(t)||this.qt.Bh().length===0)return;let e=this.bl(t);this.va.set(t,e)}},Zh=[3],tc=[0,1,2,3],Dn=class{constructor(t){this.yn=t}Pl(t,e,i){let n=t;if(this.yn.mode===0)return n;let r=i.kn(),o=r.Lt();if(o===null)return n;let a=r.Nt(t,o),l=i.kl().filter((c=>c instanceof Se)).reduce(((c,u)=>{if(i.Gs(u)||!u.It())return c;let d=u.Ft(),m=u.Un();if(d.Zi()||!m.ze(e))return c;let f=m.Mh(e);if(f===null)return c;let p=It(u.Lt()),b=this.yn.mode===3?tc:Zh;return c.concat(b.map((v=>d.Nt(f.Wt[v],p.Wt))))}),[]);if(l.length===0)return n;l.sort(((c,u)=>Math.abs(c-a)-Math.abs(u-a)));let h=l[0];return n=r.Tn(h,o),n}};function Xe(s,t,e){return Math.min(Math.max(s,t),e)}function Ni(s,t,e){return t-s<=e}var Wn=class extends Bt{constructor(){super(...arguments),this.qt=null}ht(t){this.qt=t}et({context:t,bitmapSize:e,horizontalPixelRatio:i,verticalPixelRatio:n}){if(this.qt===null)return;let r=Math.max(1,Math.floor(i));t.lineWidth=r,(function(o,a){o.save(),o.lineWidth%2&&o.translate(.5,.5),a(),o.restore()})(t,(()=>{let o=M(this.qt);if(o.Tl){t.strokeStyle=o.Rl,ie(t,o.Dl),t.beginPath();for(let a of o.Il){let l=Math.round(a.Vl*i);t.moveTo(l,-r),t.lineTo(l,e.height+r)}t.stroke()}if(o.Bl){t.strokeStyle=o.El,ie(t,o.Al),t.beginPath();for(let a of o.Ll){let l=Math.round(a.Vl*n);t.moveTo(-r,l),t.lineTo(e.width+r,l)}t.stroke()}}))}},Un=class{constructor(t){this.Xt=new Wn,this.xt=!0,this.yt=t}Pt(){this.xt=!0}Tt(){if(this.xt){let t=this.yt.Qt().N().grid,e={Bl:t.horzLines.visible,Tl:t.vertLines.visible,El:t.horzLines.color,Rl:t.vertLines.color,Al:t.horzLines.style,Dl:t.vertLines.style,Ll:this.yt.kn().zl(),Il:(this.yt.Qt().Et().zl()||[]).map((i=>({Vl:i.coord})))};this.Xt.ht(e),this.xt=!1}return this.Xt}},Hn=class{constructor(t){this.Yh=new Un(t)}wr(){return this.Yh}},Qs={Ol:4,Nl:1e-4};function ge(s,t){let e=100*(s-t)/t;return t<0?-e:e}function ec(s,t){let e=ge(s.Je(),t),i=ge(s.Qe(),t);return new st(e,i)}function Je(s,t){let e=100*(s-t)/t+100;return t<0?-e:e}function ic(s,t){let e=Je(s.Je(),t),i=Je(s.Qe(),t);return new st(e,i)}function es(s,t){let e=Math.abs(s);if(e<1e-15)return 0;let i=Math.log10(e+t.Nl)+t.Ol;return s<0?-i:i}function Ze(s,t){let e=Math.abs(s);if(e<1e-15)return 0;let i=Math.pow(10,e-t.Ol)-t.Nl;return s<0?-i:i}function Ke(s,t){if(s===null)return null;let e=es(s.Je(),t),i=es(s.Qe(),t);return new st(e,i)}function ve(s,t){if(s===null)return null;let e=Ze(s.Je(),t),i=Ze(s.Qe(),t);return new st(e,i)}function Gs(s){if(s===null)return Qs;let t=Math.abs(s.Qe()-s.Je());if(t>=1||t<1e-15)return Qs;let e=Math.ceil(Math.abs(Math.log10(t))),i=Qs.Ol+e;return{Ol:i,Nl:1/Math.pow(10,i)}}var ti=class{constructor(t,e){if(this.Fl=t,this.Wl=e,(function(i){if(i<0)return!1;if(i>1e18)return!0;for(let n=i;n>1;n/=10)if(n%10!=0)return!1;return!0})(this.Fl))this.Hl=[2,2.5,2];else{this.Hl=[];for(let i=this.Fl;i!==1;){if(i%2==0)this.Hl.push(2),i/=2;else{if(i%5!=0)throw new Error("unexpected base");this.Hl.push(2,2.5),i/=5}if(this.Hl.length>100)throw new Error("something wrong with base")}}}Ul(t,e,i){let n=this.Fl===0?0:1/this.Fl,r=Math.pow(10,Math.max(0,Math.ceil(Math.log10(t-e)))),o=0,a=this.Wl[0];for(;;){let u=Ni(r,n,1e-14)&&r>n+1e-14,d=Ni(r,i*a,1e-14),m=Ni(r,1,1e-14);if(!(u&&d&&m))break;r/=a,a=this.Wl[++o%this.Wl.length]}if(r<=n+1e-14&&(r=n),r=Math.max(1,r),this.Hl.length>0&&(l=r,h=1,c=1e-14,Math.abs(l-h)<c))for(o=0,a=this.Hl[0];Ni(r,i*a,1e-14)&&r>n+1e-14;)r/=a,a=this.Hl[++o%this.Hl.length];var l,h,c;return r}},is=class{constructor(t,e,i,n){this.$l=[],this.Ki=t,this.Fl=e,this.jl=i,this.ql=n}Ul(t,e){if(t<e)throw new Error("high < low");let i=this.Ki.$t(),n=(t-e)*this.Yl()/i,r=new ti(this.Fl,[2,2.5,2]),o=new ti(this.Fl,[2,2,2.5]),a=new ti(this.Fl,[2.5,2,2]),l=[];return l.push(r.Ul(t,e,n),o.Ul(t,e,n),a.Ul(t,e,n)),(function(h){if(h.length<1)throw Error("array is empty");let c=h[0];for(let u=1;u<h.length;++u)h[u]<c&&(c=h[u]);return c})(l)}Kl(){let t=this.Ki,e=t.Lt();if(e===null)return void(this.$l=[]);let i=t.$t(),n=this.jl(i-1,e),r=this.jl(0,e),o=this.Ki.N().entireTextOnly?this.Gl()/2:0,a=o,l=i-1-o,h=Math.max(n,r),c=Math.min(n,r);if(h===c)return void(this.$l=[]);let u=this.Ul(h,c);if(this.Zl(e,u,h,c,a,l),t.Xl()&&this.Jl(u,c,h)){let f=this.Ki.Ql();this.io(e,u,a,l,f,2*f)}let d=this.$l.map((f=>f.no)),m=this.Ki.so(d);for(let f=0;f<this.$l.length;f++)this.$l[f].eo=m[f]}zl(){return this.$l}Gl(){return this.Ki.P()}Yl(){return Math.ceil(this.Gl()*this.Ki.N().tickMarkDensity)}Zl(t,e,i,n,r,o){let a=this.$l,l=this.Ki,h=i%e;h+=h<0?e:0;let c=i>=n?1:-1,u=null,d=0;for(let m=i-h;m>n;m-=e){let f=this.ql(m,t,!0);u!==null&&Math.abs(f-u)<this.Yl()||f<r||f>o||(d<a.length?(a[d].Vl=f,a[d].eo=l.ro(m),a[d].no=m):a.push({Vl:f,eo:l.ro(m),no:m}),d++,u=f,l.ho()&&(e=this.Ul(m*c,n)))}a.length=d}io(t,e,i,n,r,o){let a=this.$l,l=this.ao(t,i,r,o),h=this.ao(t,n,-o,-r),c=this.ql(0,t,!0)-this.ql(e,t,!0);a.length>0&&a[0].Vl-l.Vl<c/2&&a.shift(),a.length>0&&h.Vl-a[a.length-1].Vl<c/2&&a.pop(),a.unshift(l),a.push(h)}ao(t,e,i,n){let r=(i+n)/2,o=this.jl(e+i,t),a=this.jl(e+n,t),l=Math.min(o,a),h=Math.max(o,a),c=Math.max(.1,this.Ul(h,l)),u=this.jl(e+r,t),d=u-u%c,m=this.ql(d,t,!0);return{eo:this.Ki.ro(d),Vl:m,no:d}}Jl(t,e,i){let n=It(this.Ki.ar());return this.Ki.ho()&&(n=ve(n,this.Ki.lo())),n.Je()-e<t&&i-n.Qe()<t}};function Cl(s){return s.slice().sort(((t,e)=>M(t.ln())-M(e.ln())))}var Ba;(function(s){s[s.Normal=0]="Normal",s[s.Logarithmic=1]="Logarithmic",s[s.Percentage=2]="Percentage",s[s.IndexedTo100=3]="IndexedTo100"})(Ba||(Ba={}));var Va=new Qi,qa=new xe(100,1),jn=class{constructor(t,e,i,n,r){this.oo=0,this._o=null,this.rr=null,this.uo=null,this.co={do:!1,fo:null},this.po=!1,this.vo=0,this.mo=0,this.wo=new F,this.Mo=new F,this.bo=[],this.So=null,this.xo=null,this.Co=null,this.yo=null,this.Po=null,this.el=qa,this.ko=Gs(null),this.To=t,this.yn=e,this.Ro=i,this.Do=n,this.Io=r,this.Vo=new is(this,100,this.Bo.bind(this),this.Eo.bind(this))}pl(){return this.To}N(){return this.yn}vr(t){if(it(this.yn,t),this.vl(),t.mode!==void 0&&this.Ao({_e:t.mode}),t.scaleMargins!==void 0){let e=Z(t.scaleMargins.top),i=Z(t.scaleMargins.bottom);if(e<0||e>1)throw new Error(`Invalid top margin - expect value between 0 and 1, given=${e}`);if(i<0||i>1)throw new Error(`Invalid bottom margin - expect value between 0 and 1, given=${i}`);if(e+i>1)throw new Error(`Invalid margins - sum of margins must be less than 1, given=${e+i}`);this.Lo(),this.Co=null}}zo(){return this.yn.autoScale}Oo(){return this.po}ho(){return this.yn.mode===1}je(){return this.yn.mode===2}No(){return this.yn.mode===3}lo(){return this.ko}_e(){return{hs:this.yn.autoScale,Fo:this.yn.invertScale,_e:this.yn.mode}}Ao(t){let e=this._e(),i=null;t.hs!==void 0&&(this.yn.autoScale=t.hs),t._e!==void 0&&(this.yn.mode=t._e,t._e!==2&&t._e!==3||(this.yn.autoScale=!0),this.co.do=!1),e._e===1&&t._e!==e._e&&((function(r,o){if(r===null)return!1;let a=Ze(r.Je(),o),l=Ze(r.Qe(),o);return isFinite(a)&&isFinite(l)})(this.rr,this.ko)?(i=ve(this.rr,this.ko),i!==null&&this.Wo(i)):this.yn.autoScale=!0),t._e===1&&t._e!==e._e&&(i=Ke(this.rr,this.ko),i!==null&&this.Wo(i));let n=e._e!==this.yn.mode;n&&(e._e===2||this.je())&&this.vl(),n&&(e._e===3||this.No())&&this.vl(),t.Fo!==void 0&&e.Fo!==t.Fo&&(this.yn.invertScale=t.Fo,this.Ho()),this.Mo.p(e,this._e())}Uo(){return this.Mo}P(){return this.Ro.fontSize}$t(){return this.oo}$o(t){this.oo!==t&&(this.oo=t,this.Lo(),this.Co=null)}jo(){if(this._o)return this._o;let t=this.$t()-this.qo()-this.Yo();return this._o=t,t}ar(){return this.Ko(),this.rr}Wo(t,e){let i=this.rr;(e||i===null&&t!==null||i!==null&&!i.Ze(t))&&(this.Co=null,this.rr=t)}Go(t){this.Wo(t),this.Zo(t!==null)}Zi(){return this.Ko(),this.oo===0||!this.rr||this.rr.Zi()}Xo(t){return this.Fo()?t:this.$t()-1-t}Nt(t,e){return this.je()?t=ge(t,e):this.No()&&(t=Je(t,e)),this.Eo(t,e)}Jo(t,e,i){this.Ko();let n=this.Yo(),r=M(this.ar()),o=r.Je(),a=r.Qe(),l=this.jo()-1,h=this.Fo(),c=l/(a-o),u=i===void 0?0:i.from,d=i===void 0?t.length:i.to,m=this.Qo();for(let f=u;f<d;f++){let p=t[f],b=p.Mt;if(isNaN(b))continue;let v=b;m!==null&&(v=m(p.Mt,e));let y=n+c*(v-o),_=h?y:this.oo-1-y;p.ut=_}}t_(t,e,i){this.Ko();let n=this.Yo(),r=M(this.ar()),o=r.Je(),a=r.Qe(),l=this.jo()-1,h=this.Fo(),c=l/(a-o),u=i===void 0?0:i.from,d=i===void 0?t.length:i.to,m=this.Qo();for(let f=u;f<d;f++){let p=t[f],b=p.jr,v=p.qr,y=p.Yr,_=p.Kr;m!==null&&(b=m(p.jr,e),v=m(p.qr,e),y=m(p.Yr,e),_=m(p.Kr,e));let S=n+c*(b-o),k=h?S:this.oo-1-S;p.i_=k,S=n+c*(v-o),k=h?S:this.oo-1-S,p.n_=k,S=n+c*(y-o),k=h?S:this.oo-1-S,p.s_=k,S=n+c*(_-o),k=h?S:this.oo-1-S,p.e_=k}}Tn(t,e){let i=this.Bo(t,e);return this.r_(i,e)}r_(t,e){let i=t;return this.je()?i=(function(n,r){return r<0&&(n=-n),n/100*r+r})(i,e):this.No()&&(i=(function(n,r){return n-=100,r<0&&(n=-n),n/100*r+r})(i,e)),i}kl(){return this.bo}Dt(){return this.xo||(this.xo=Cl(this.bo)),this.xo}h_(t){this.bo.indexOf(t)===-1&&(this.bo.push(t),this.vl(),this.a_())}l_(t){let e=this.bo.indexOf(t);if(e===-1)throw new Error("source is not attached to scale");this.bo.splice(e,1),this.bo.length===0&&(this.Ao({hs:!0}),this.Wo(null)),this.vl(),this.a_()}Lt(){let t=null;for(let e of this.bo){let i=e.Lt();i!==null&&(t===null||i.Oa<t.Oa)&&(t=i)}return t===null?null:t.Wt}Fo(){return this.yn.invertScale}zl(){let t=this.Lt()===null;if(this.Co!==null&&(t||this.Co.o_===t))return this.Co.zl;this.Vo.Kl();let e=this.Vo.zl();return this.Co={zl:e,o_:t},this.wo.p(),e}__(){return this.wo}u_(t){this.je()||this.No()||this.yo===null&&this.uo===null&&(this.Zi()||(this.yo=this.oo-t,this.uo=M(this.ar()).Xe()))}c_(t){if(this.je()||this.No()||this.yo===null)return;this.Ao({hs:!1}),(t=this.oo-t)<0&&(t=0);let e=(this.yo+.2*(this.oo-1))/(t+.2*(this.oo-1)),i=M(this.uo).Xe();e=Math.max(e,.1),i.ir(e),this.Wo(i)}d_(){this.je()||this.No()||(this.yo=null,this.uo=null)}f_(t){this.zo()||this.Po===null&&this.uo===null&&(this.Zi()||(this.Po=t,this.uo=M(this.ar()).Xe()))}p_(t){if(this.zo()||this.Po===null)return;let e=M(this.ar()).tr()/(this.jo()-1),i=t-this.Po;this.Fo()&&(i*=-1);let n=i*e,r=M(this.uo).Xe();r.nr(n),this.Wo(r,!0),this.Co=null}v_(){this.zo()||this.Po!==null&&(this.Po=null,this.uo=null)}sl(){return this.el||this.vl(),this.el}Ji(t,e){switch(this.yn.mode){case 2:return this.m_(ge(t,e));case 3:return this.sl().format(Je(t,e));default:return this.cr(t)}}ro(t){switch(this.yn.mode){case 2:return this.m_(t);case 3:return this.sl().format(t);default:return this.cr(t)}}so(t){switch(this.yn.mode){case 2:return this.w_(t);case 3:return this.sl().formatTickmarks(t);default:return this.M_(t)}}xa(t){return this.cr(t,M(this.So).sl())}Ca(t,e){return t=ge(t,e),this.m_(t,Va)}g_(){return this.bo}b_(t){this.co={fo:t,do:!1}}Nn(){this.bo.forEach((t=>t.Nn()))}Xl(){return this.yn.ensureEdgeTickMarksVisible&&this.zo()}Ql(){return this.P()/2}vl(){this.Co=null;let t=1/0;this.So=null;for(let i of this.bo)i.ln()<t&&(t=i.ln(),this.So=i);let e=100;this.So!==null&&(e=Math.round(this.So.Kh())),this.el=qa,this.je()?(this.el=Va,e=100):this.No()?(this.el=new xe(100,1),e=100):this.So!==null&&(this.el=this.So.sl()),this.Vo=new is(this,e,this.Bo.bind(this),this.Eo.bind(this)),this.Vo.Kl()}a_(){this.xo=null}S_(){return this.So===null||this.je()||this.No()?1:1/this.So.Kh()}Xi(){return this.Io}Zo(t){this.po=t}qo(){return this.Fo()?this.yn.scaleMargins.bottom*this.$t()+this.mo:this.yn.scaleMargins.top*this.$t()+this.vo}Yo(){return this.Fo()?this.yn.scaleMargins.top*this.$t()+this.vo:this.yn.scaleMargins.bottom*this.$t()+this.mo}Ko(){this.co.do||(this.co.do=!0,this.x_())}Lo(){this._o=null}Eo(t,e){if(this.Ko(),this.Zi())return 0;t=this.ho()&&t?es(t,this.ko):t;let i=M(this.ar()),n=this.Yo()+(this.jo()-1)*(t-i.Je())/i.tr();return this.Xo(n)}Bo(t,e){if(this.Ko(),this.Zi())return 0;let i=this.Xo(t),n=M(this.ar()),r=n.Je()+n.tr()*((i-this.Yo())/(this.jo()-1));return this.ho()?Ze(r,this.ko):r}Ho(){this.Co=null,this.Vo.Kl()}x_(){if(this.Oo()&&!this.zo())return;let t=this.co.fo;if(t===null)return;let e=null,i=this.g_(),n=0,r=0;for(let l of i){if(!l.It())continue;let h=l.Lt();if(h===null)continue;let c=l.la(t.Na(),t.bi()),u=c&&c.ar();if(u!==null){switch(this.yn.mode){case 1:u=Ke(u,this.ko);break;case 2:u=ec(u,h.Wt);break;case 3:u=ic(u,h.Wt)}if(e=e===null?u:e.Ss(M(u)),c!==null){let d=c.lr();d!==null&&(n=Math.max(n,d.above),r=Math.max(r,d.below))}}}if(this.Xl()&&(n=Math.max(n,this.Ql()),r=Math.max(r,this.Ql())),n===this.vo&&r===this.mo||(this.vo=n,this.mo=r,this.Co=null,this.Lo()),e!==null){if(e.Je()===e.Qe()){let l=5*this.S_();this.ho()&&(e=ve(e,this.ko)),e=new st(e.Je()-l,e.Qe()+l),this.ho()&&(e=Ke(e,this.ko))}if(this.ho()){let l=ve(e,this.ko),h=Gs(l);if(o=h,a=this.ko,o.Ol!==a.Ol||o.Nl!==a.Nl){let c=this.uo!==null?ve(this.uo,this.ko):null;this.ko=h,e=Ke(l,h),c!==null&&(this.uo=Ke(c,h))}}this.Wo(e)}else this.rr===null&&(this.Wo(new st(-.5,.5)),this.ko=Gs(null));var o,a}Qo(){return this.je()?ge:this.No()?Je:this.ho()?t=>es(t,this.ko):null}C_(t,e,i){return e===void 0?(i===void 0&&(i=this.sl()),i.format(t)):e(t)}y_(t,e,i){return e===void 0?(i===void 0&&(i=this.sl()),i.formatTickmarks(t)):e(t)}cr(t,e){return this.C_(t,this.Do.priceFormatter,e)}M_(t,e){let i=this.Do.priceFormatter;return this.y_(t,this.Do.tickmarksPriceFormatter??(i?n=>n.map(i):void 0),e)}m_(t,e){return this.C_(t,this.Do.percentageFormatter,e)}w_(t,e){let i=this.Do.percentageFormatter;return this.y_(t,this.Do.tickmarksPercentageFormatter??(i?n=>n.map(i):void 0),e)}};function Da(s){return s instanceof Se}var si=class{constructor(t,e){this.bo=[],this.P_=new Map,this.oo=0,this.k_=0,this.T_=1,this.xo=null,this.R_=null,this.D_=!1,this.I_=new F,this.fa=[],this.ia=t,this.sn=e,this.V_=new Hn(this);let i=e.N();this.B_=this.E_("left",i.leftPriceScale),this.A_=this.E_("right",i.rightPriceScale),this.B_.Uo().i(this.L_.bind(this,this.B_),this),this.A_.Uo().i(this.L_.bind(this,this.A_),this),this.z_(i)}z_(t){if(t.leftPriceScale&&this.B_.vr(t.leftPriceScale),t.rightPriceScale&&this.A_.vr(t.rightPriceScale),t.localization&&(this.B_.vl(),this.A_.vl()),t.overlayPriceScales){let e=Array.from(this.P_.values());for(let i of e){let n=M(i[0].Ft());n.vr(t.overlayPriceScales),t.localization&&n.vl()}}}O_(t){switch(t){case"left":return this.B_;case"right":return this.A_}return this.P_.has(t)?Z(this.P_.get(t))[0].Ft():null}m(){this.Qt().N_().u(this),this.B_.Uo().u(this),this.A_.Uo().u(this),this.bo.forEach((t=>{t.m&&t.m()})),this.fa=this.fa.filter((t=>{let e=t.Qh();return e.detached&&e.detached(),!1})),this.I_.p()}F_(){return this.T_}W_(t){this.T_=t}Qt(){return this.sn}nn(){return this.k_}$t(){return this.oo}H_(t){this.k_=t,this.U_()}$o(t){this.oo=t,this.B_.$o(t),this.A_.$o(t),this.bo.forEach((e=>{if(this.Gs(e)){let i=e.Ft();i!==null&&i.$o(t)}})),this.U_()}j_(t){this.D_=t}q_(){return this.D_}Y_(){return this.bo.filter(Da)}kl(){return this.bo}Gs(t){let e=t.Ft();return e===null||this.B_!==e&&this.A_!==e}h_(t,e,i){this.K_(t,e,i?t.ln():this.bo.length)}l_(t,e){let i=this.bo.indexOf(t);Y(i!==-1,"removeDataSource: invalid data source"),this.bo.splice(i,1),e||this.bo.forEach(((o,a)=>o._n(a)));let n=M(t.Ft()).pl();if(this.P_.has(n)){let o=Z(this.P_.get(n)),a=o.indexOf(t);a!==-1&&(o.splice(a,1),o.length===0&&this.P_.delete(n))}let r=t.Ft();r&&r.kl().indexOf(t)>=0&&(r.l_(t),this.G_(r)),this.Z_()}Xs(t){return t===this.B_?"left":t===this.A_?"right":"overlay"}X_(){return this.B_}J_(){return this.A_}Q_(t,e){t.u_(e)}tu(t,e){t.c_(e),this.U_()}iu(t){t.d_()}nu(t,e){t.f_(e)}su(t,e){t.p_(e),this.U_()}eu(t){t.v_()}U_(){this.bo.forEach((t=>{t.Nn()}))}kn(){let[t,e]=this.ru(),i=null;return t.N().visible&&t.kl().length!==0?i=t:e.N().visible&&e.kl().length!==0?i=e:this.bo.length!==0&&(i=this.bo[0].Ft()),i===null&&(i=this.Zs()??t),i}Zs(){let[t,e]=this.ru();return t.N().visible?t:e.N().visible?e:null}G_(t){t!==null&&t.zo()&&this.hu(t)}au(t){let e=this.ia.Ee();t.Ao({hs:!0}),e!==null&&t.b_(e),this.U_()}lu(){this.hu(this.B_),this.hu(this.A_)}ou(){this.G_(this.B_),this.G_(this.A_),this.bo.forEach((t=>{this.Gs(t)&&this.G_(t.Ft())})),this.U_(),this.sn.mr()}Dt(){return this.xo===null&&(this.xo=Cl(this.bo)),this.xo}_u(){let t=this.Dt(),e=this.sn.cu()?.uu,i=this.sn.N().hoveredSeriesOnTop,n=this.R_;if(n!==null&&n.Kh===t&&n.du===e&&n.fu===i)return n.pu;let r=(function(o,a,l){if(!l)return o;let h=o.indexOf(a);if(h===-1||h===o.length-1)return o;let c=[];for(let u=0;u<o.length;u++)u!==h&&c.push(o[u]);return c.push(o[h]),c})(t,e,i);return this.R_={Kh:t,du:e,fu:i,pu:r},r}vu(t,e){e=Xe(e,0,this.bo.length-1);let i=this.bo.indexOf(t);Y(i!==-1,"setSeriesOrder: invalid data source"),this.bo.splice(i,1),this.bo.splice(e,0,t),this.bo.forEach(((n,r)=>n._n(r))),this.Z_();for(let n of[this.B_,this.A_])n.a_(),n.vl();this.sn.mr()}Vt(){return this.Dt().filter(Da)}mu(){return this.I_}wu(){return this.V_}ol(t){this.fa.push(new Qh(t))}_l(t){this.fa=this.fa.filter((e=>e.Qh()!==t)),t.detached&&t.detached(),this.sn.mr()}Mu(){return this.fa}il(t,e){return this.fa.map((i=>i.Qs(t,e))).filter((i=>i!==null))}hu(t){let e=t.g_();if(e&&e.length>0&&!this.ia.Zi()){let i=this.ia.Ee();i!==null&&t.b_(i)}t.Nn()}K_(t,e,i){let n=this.O_(e);if(n===null&&(n=this.E_(e,this.sn.N().overlayPriceScales)),this.bo.splice(i,0,t),!us(e)){let r=this.P_.get(e)||[];r.push(t),this.P_.set(e,r)}t._n(i),n.h_(t),t.un(n),this.G_(n),this.Z_()}Z_(){this.xo=null,this.R_=null}ru(){return this.sn.N().defaultVisiblePriceScaleId==="left"?[this.B_,this.A_]:[this.A_,this.B_]}L_(t,e,i){e._e!==i._e&&this.hu(t)}E_(t,e){let i={visible:!0,autoScale:!0,...zt(e)},n=new jn(t,i,this.sn.N().layout,this.sn.N().localization,this.sn.Xi());return n.$o(this.$t()),n}};function Kn(s,t){return t===null||s.se===2&&t.se!==2||(t.se!==2||s.se===2)&&s.ne!==t.ne&&s.ne<t.ne}function Sl(s){return{te:s.te,ie:s.ie}}function sc(s){return{ne:s.distance??0,se:s.hitTestPriority??(s.itemType==="marker"?2:0),ee:s.itemType??"primitive",gu:s.cursorStyle,te:s.externalId}}function Oi(s){return{uu:s.uu,bu:Sl(s.Su),gu:s.Su.gu,ee:s.Su.ee??"primitive"}}function nc(s,t,e,i){let n=null;for(let r of s){let o=r.Qs?.(t,e,i)??null;if(o===null){let a=r.Tt(i);o=a!==null&&a.Qs?a.Qs(t,e):null}if(o!==null){let a={xu:r,Su:o};(n===null||Kn(a.Su,n.Su))&&(n=a)}}return n}function rc(s){return s.jn!==void 0}function Ml(s,t,e){let i=[s,...s.Dt()].reverse(),n=(function(a,l,h){let c,u,d;for(let p of a){let b=p.il?.(l,h)??[];for(let v of b){let y=sc(v);m=v.zOrder,f=c?.zOrder,(!f||m==="top"&&f!=="top"||m==="normal"&&f==="bottom"||v.zOrder===c?.zOrder&&u!==void 0&&Kn(y,u)||v.zOrder===c?.zOrder&&u===void 0)&&(c=v,u=y,d=p)}}var m,f;return c&&d&&u?{Su:u,Cu:c,uu:d}:null})(i,t,e);if(n?.Cu.zOrder==="top")return Oi(n);let r=null,o=null;for(let a of i){if(n&&n.uu===a&&n.Cu.zOrder!=="bottom"&&!n.Cu.isBackground)return r??Oi(n);if(rc(a)){let l=nc(a.jn(s),t,e,s);if(l!==null){let h={uu:a,xu:l.xu,bu:Sl(l.Su),gu:l.Su.gu,ee:l.Su.ee??"primitive"};(r===null||Kn(l.Su,o))&&(r=h,o=l.Su)}}if(n&&n.uu===a&&n.Cu.zOrder!=="bottom"&&n.Cu.isBackground)return r??Oi(n)}return r!==null?r:n?.Cu?Oi(n):null}var Yn=class{constructor(t,e,i=50){this.Vs=0,this.Bs=1,this.Es=1,this.Ls=new Map,this.As=new Map,this.yu=t,this.Pu=e,this.zs=i}ku(t){let e=t.time,i=this.Pu.cacheKey(e),n=this.Ls.get(i);if(n!==void 0)return n.Tu;if(this.Vs===this.zs){let o=this.As.get(this.Es);this.As.delete(this.Es),this.Ls.delete(Z(o)),this.Es++,this.Vs--}let r=this.yu(t);return this.Ls.set(i,{Tu:r,Ws:this.Bs}),this.As.set(this.Bs,i),this.Vs++,this.Bs++,r}},ee=class{constructor(t,e){Y(t<=e,"right should be >= left"),this.Ru=t,this.Du=e}Na(){return this.Ru}bi(){return this.Du}Iu(){return this.Du-this.Ru+1}ze(t){return this.Ru<=t&&t<=this.Du}Ze(t){return this.Ru===t.Na()&&this.Du===t.bi()}};function Wa(s,t){return s===null||t===null?s===t:s.Ze(t)}var Qn=class{constructor(){this.Vu=new Map,this.Ls=null,this.Bu=!1}Eu(t){this.Bu=t,this.Ls=null}Au(t,e){this.Lu(e),this.Ls=null;for(let i=e;i<t.length;++i){let n=t[i],r=this.Vu.get(n.timeWeight);r===void 0&&(r=[],this.Vu.set(n.timeWeight,r)),r.push({index:i,time:n.time,weight:n.timeWeight,originalTime:n.originalTime})}}zu(t,e,i,n,r){let o=Math.ceil(e/t);return this.Ls!==null&&this.Ls.Ou===o&&r===this.Ls.Nu&&i===this.Ls.Fu||(this.Ls={Nu:r,Fu:i,zl:this.Wu(o,i,n),Ou:o}),this.Ls.zl}Lu(t){if(t===0)return void this.Vu.clear();let e=[];this.Vu.forEach(((i,n)=>{t<=i[0].index?e.push(n):i.splice(se(i,t,(r=>r.index<t)),1/0)}));for(let i of e)this.Vu.delete(i)}Wu(t,e,i){let n=[],r=o=>!e||i.has(o.index);for(let o of Array.from(this.Vu.keys()).sort(((a,l)=>l-a))){if(!this.Vu.get(o))continue;let a=n;n=[];let l=a.length,h=0,c=Z(this.Vu.get(o)),u=c.length,d=1/0,m=-1/0;for(let f=0;f<u;f++){let p=c[f],b=p.index;for(;h<l;){let v=a[h],y=v.index;if(!(y<b&&r(v))){d=y;break}h++,n.push(v),m=y,d=1/0}if(d-b>=t&&b-m>=t&&r(p))n.push(p),m=b;else if(this.Bu)return a}for(;h<l;h++)r(a[h])&&n.push(a[h])}return n}},be=class s{constructor(t){this.Hu=t}Uu(){return this.Hu===null?null:new ee(Math.floor(this.Hu.Na()),Math.ceil(this.Hu.bi()))}$u(){return this.Hu}static ju(){return new s(null)}};function oc(s,t){return s.weight>t.weight?s:t}var Gn=class{constructor(t,e,i,n){this.k_=0,this.qu=null,this.Yu=[],this.Po=null,this.yo=null,this.Ku=new Qn,this.Gu=new Map,this.Zu=be.ju(),this.Xu=!0,this.Ju=new F,this.Qu=new F,this.tc=new F,this.nc=null,this.sc=null,this.ec=new Map,this.rc=-1,this.hc=[],this.ac=1,this.yn=e,this.Do=i,this.lc=e.rightOffset,this.oc=e.barSpacing,this.sn=t,this._c(e),this.Pu=n,this.uc(),this.Ku.Eu(e.uniformDistribution),this.cc(),this.dc()}N(){return this.yn}fc(t){it(this.Do,t),this.vc(),this.uc()}vr(t,e){it(this.yn,t),this.yn.fixLeftEdge&&this.mc(),this.yn.fixRightEdge&&this.wc(),t.barSpacing!==void 0&&this.sn.Ms(t.barSpacing),t.rightOffset!==void 0&&this.sn.gs(t.rightOffset),this._c(t),t.minBarSpacing===void 0&&t.maxBarSpacing===void 0||this.sn.Ms(t.barSpacing??this.oc),t.ignoreWhitespaceIndices!==void 0&&t.ignoreWhitespaceIndices!==this.yn.ignoreWhitespaceIndices&&this.dc(),this.vc(),this.uc(),t.enableConflation===void 0&&t.conflationThresholdFactor===void 0||this.cc(),this.tc.p()}Rn(t){return this.Yu[t]?.time??null}en(t){return this.Yu[t]??null}Mc(t,e){if(this.Yu.length<1)return null;if(this.Pu.key(t)>this.Pu.key(this.Yu[this.Yu.length-1].time))return e?this.Yu.length-1:null;let i=se(this.Yu,this.Pu.key(t),((n,r)=>this.Pu.key(n.time)<r));return this.Pu.key(t)<this.Pu.key(this.Yu[i].time)?e?i:null:i}Zi(){return this.k_===0||this.Yu.length===0||this.qu===null}gc(){return this.Yu.length>0}Ee(){return this.bc(),this.Zu.Uu()}Sc(){return this.bc(),this.Zu.$u()}xc(){let t=this.Ee();if(t===null)return null;let e={from:t.Na(),to:t.bi()};return this.Cc(e)}Cc(t){let e=Math.round(t.from),i=Math.round(t.to),n=M(this.yc()),r=M(this.Pc());return{from:M(this.en(Math.max(n,e))),to:M(this.en(Math.min(r,i)))}}kc(t){return{from:M(this.Mc(t.from,!0)),to:M(this.Mc(t.to,!0))}}nn(){return this.k_}H_(t){if(!isFinite(t)||t<=0||this.k_===t)return;let e=this.Sc(),i=this.k_;if(this.k_=t,this.Xu=!0,this.yn.lockVisibleTimeRangeOnResize&&i!==0){let n=this.oc*t/i;this.oc=n}if(this.yn.fixLeftEdge&&e!==null&&e.Na()<=0){let n=i-t;this.lc-=Math.round(n/this.oc)+1,this.Xu=!0}this.Tc(),this.Rc()}jt(t){if(this.Zi()||!ei(t))return 0;let e=this.Dc()+this.lc-t;return this.k_-(e+.5)*this.oc-1}Ic(t,e){let i=this.Dc(),n=e===void 0?0:e.from,r=e===void 0?t.length:e.to;for(let o=n;o<r;o++){let a=t[o].wt,l=i+this.lc-a,h=this.k_-(l+.5)*this.oc-1;t[o]._t=h}}Vc(t,e){let i=Math.ceil(this.Bc(t));return e&&this.yn.ignoreWhitespaceIndices&&!this.Ec(i)?this.Ac(i):i}gs(t){this.Xu=!0,this.lc=t,this.Rc(),this.sn.Lc(),this.sn.mr()}ml(){return this.oc}Ms(t){let e=this.oc;if(this.zc(t),this.yn.rightOffsetPixels!==void 0&&e!==0){let i=this.lc*e/this.oc;this.lc=i}this.Rc(),this.sn.Lc(),this.sn.mr()}Oc(){return this.lc}zl(){if(this.Zi())return null;if(this.sc!==null)return this.sc;let t=this.oc,e=5*(this.sn.N().layout.fontSize+4)/8*(this.yn.tickMarkMaxCharacterLength||8),i=Math.round(e/t),n=M(this.Ee()),r=Math.max(n.Na(),n.Na()-i),o=Math.max(n.bi(),n.bi()-i),a=this.Ku.zu(t,e,this.yn.ignoreWhitespaceIndices,this.ec,this.rc),l=this.yc()+i,h=this.Pc()-i,c=this.Nc(),u=this.yn.fixLeftEdge||c,d=this.yn.fixRightEdge||c,m=0;for(let f of a){if(!(r<=f.index&&f.index<=o))continue;let p;m<this.hc.length?(p=this.hc[m],p.coord=this.jt(f.index),p.label=this.Fc(f),p.weight=f.weight):(p={needAlignCoordinate:!1,coord:this.jt(f.index),label:this.Fc(f),weight:f.weight},this.hc.push(p)),this.oc>e/2&&!c?p.needAlignCoordinate=!1:p.needAlignCoordinate=u&&f.index<=l||d&&f.index>=h,m++}return this.hc.length=m,this.sc=this.hc,this.hc}Wc(){let t;this.Xu=!0,this.Ms(this.yn.barSpacing),t=this.yn.rightOffsetPixels!==void 0?this.yn.rightOffsetPixels/this.ml():this.yn.rightOffset,this.gs(t)}Hc(t){this.Xu=!0,this.qu=t,this.Rc(),this.mc()}Uc(t,e){let i=this.Bc(t),n=this.ml(),r=n+e*(n/10);this.Ms(r),this.yn.rightBarStaysOnScroll||this.gs(this.Oc()+(i-this.Bc(t)))}u_(t){this.Po&&this.v_(),this.yo===null&&this.nc===null&&(this.Zi()||(this.yo=t,this.$c()))}c_(t){if(this.nc===null)return;let e=Xe(this.k_-t,0,this.k_),i=Xe(this.k_-M(this.yo),0,this.k_);e!==0&&i!==0&&this.Ms(this.nc.ml*e/i)}d_(){this.yo!==null&&(this.yo=null,this.jc())}f_(t){this.Po===null&&this.nc===null&&(this.Zi()||(this.Po=t,this.$c()))}p_(t){if(this.Po===null)return;let e=(this.Po-t)/this.ml();this.lc=M(this.nc).Oc+e,this.Xu=!0,this.Rc()}v_(){this.Po!==null&&(this.Po=null,this.jc())}qc(){this.Yc(this.yn.rightOffset)}Yc(t,e=400){if(!isFinite(t))throw new RangeError("offset is required and must be finite number");if(!isFinite(e)||e<=0)throw new RangeError("animationDuration (optional) must be finite positive number");let i=this.lc,n=performance.now();this.sn.ps({Kc:r=>(r-n)/e>=1,Gc:r=>{let o=(r-n)/e;return o>=1?t:i+(t-i)*o}})}Pt(t,e){this.Xu=!0,this.Yu=t,this.Ku.Au(t,e),this.Rc()}Zc(){return this.Ju}Xc(){return this.Qu}Jc(){return this.tc}Dc(){return this.qu||0}Qc(t,e){let i=t.Iu(),n=e&&this.yn.rightOffsetPixels||0;this.zc((this.k_-n)/i),this.lc=t.bi()-this.Dc(),e&&(this.lc=n?n/this.ml():this.yn.rightOffset),this.Rc(),this.Xu=!0,this.sn.Lc(),this.sn.mr()}td(){let t=this.yc(),e=this.Pc();if(t===null||e===null)return;let i=!this.yn.rightOffsetPixels&&this.yn.rightOffset||0;this.Qc(new ee(t,e+i),!0)}nd(t){let e=new ee(t.from,t.to);this.Qc(e)}rn(t){return this.Do.timeFormatter!==void 0?this.Do.timeFormatter(t.originalTime):this.Pu.formatHorzItem(t.time)}dc(){if(!this.yn.ignoreWhitespaceIndices)return;this.ec.clear();let t=this.sn.Jn();for(let e of t)for(let i of e.fl())this.ec.set(i,!0);this.rc++}sd(){return this.ac}Sl(){let t=1/(window.devicePixelRatio||1),e=this.yn.minBarSpacing;if(e>=t)return[1];let i=[1],n=2;for(;n<=512;)e<t/n&&i.push(n),n*=2;return i}Nc(){let t=this.sn.N().handleScroll,e=this.sn.N().handleScale;return!(t.horzTouchDrag||t.mouseWheel||t.pressedMouseMove||t.vertTouchDrag||e.axisDoubleClickReset.time||e.axisPressedMouseMove.time||e.mouseWheel||e.pinch)}yc(){return this.Yu.length===0?null:0}Pc(){return this.Yu.length===0?null:this.Yu.length-1}ed(t){return(this.k_-1-t)/this.oc}Bc(t){let e=this.ed(t),i=this.Dc()+this.lc-e;return Math.round(1e6*i)/1e6}zc(t){let e=this.oc;this.oc=t,this.Tc(),e!==this.oc&&(this.Xu=!0,this.rd(),this.cc())}bc(){if(!this.Xu)return;if(this.Xu=!1,this.Zi())return void this.hd(be.ju());let t=this.Dc(),e=this.k_/this.oc,i=this.lc+t,n=new ee(i-e+1,i);this.hd(new be(n))}Tc(){let t=Xe(this.oc,this.ad(),this.ld());this.oc!==t&&(this.oc=t,this.Xu=!0)}ld(){return this.yn.maxBarSpacing>0?this.yn.maxBarSpacing:.5*this.k_}ad(){return this.yn.fixLeftEdge&&this.yn.fixRightEdge&&this.Yu.length!==0?this.k_/this.Yu.length:this.yn.minBarSpacing}cc(){if(!this.yn.enableConflation)return void(this.ac=1);let t=1/(window.devicePixelRatio||1)*(this.yn.conflationThresholdFactor??1);if(this.oc>=t)return void(this.ac=1);let e=t/this.oc,i=Math.pow(2,Math.floor(Math.log2(e)));this.ac=Math.min(i,512)}Rc(){let t=this.od();t!==null&&this.lc<t&&(this.lc=t,this.Xu=!0);let e=this._d();this.lc>e&&(this.lc=e,this.Xu=!0)}od(){let t=this.yc(),e=this.qu;return t===null||e===null?null:t-e-1+(this.yn.fixLeftEdge?this.k_/this.oc:Math.min(2,this.Yu.length))}_d(){return this.yn.fixRightEdge?0:this.k_/this.oc-Math.min(2,this.Yu.length)}$c(){this.nc={ml:this.ml(),Oc:this.Oc()}}jc(){this.nc=null}Fc(t){let e=this.Gu.get(t.weight);return e===void 0&&(e=new Yn((i=>this.ud(i)),this.Pu),this.Gu.set(t.weight,e)),e.ku(t)}ud(t){return this.Pu.formatTickmark(t,this.Do)}hd(t){let e=this.Zu;this.Zu=t,Wa(e.Uu(),this.Zu.Uu())||this.Ju.p(),Wa(e.$u(),this.Zu.$u())||this.Qu.p(),this.rd()}rd(){this.sc=null}vc(){this.rd(),this.Gu.clear()}uc(){this.Pu.updateFormatter(this.Do)}mc(){if(!this.yn.fixLeftEdge)return;let t=this.yc();if(t===null)return;let e=this.Ee();if(e===null)return;let i=e.Na()-t;if(i<0){let n=this.lc-i-1;this.gs(n)}this.Tc()}wc(){this.Rc(),this.Tc()}Ec(t){return!this.yn.ignoreWhitespaceIndices||this.ec.get(t)||!1}Ac(t){let e=(function*(n){let r=Math.round(n),o=r<n,a=1;for(;;)o?(yield r+a,yield r-a):(yield r-a,yield r+a),a++})(t),i=this.Pc();for(;i;){let n=e.next().value;if(this.ec.get(n))return n;if(n<0||n>i)break}return t}_c(t){if(t.rightOffsetPixels!==void 0){let e=t.rightOffsetPixels/(t.barSpacing||this.oc);this.sn.gs(e)}}},Ua,Ha,ja,ni,Ka;(function(s){s[s.OnTouchEnd=0]="OnTouchEnd",s[s.OnNextTap=1]="OnNextTap"})(Ua||(Ua={}));var Xn=class{constructor(t,e,i){this.dd=[],this.fd=[],this.pd=null,this.k_=0,this.vd=null,this.md=new F,this.wd=new F,this.Md=null,this.gd=t,this.yn=e,this.Pu=i,this.Io=new dn(this.yn.layout.colorParsers),this.bd=new un(this),this.ia=new Gn(this,e.timeScale,this.yn.localization,i),this.Ct=new yn(this,e.crosshair),this.Sd=new Dn(e.crosshair),e.addDefaultPane&&(this.xd(0),this.dd[0].W_(2)),this.Cd=this.yd(0),this.Pd=this.yd(1)}ka(){this.kd(Q.ys())}mr(){this.kd(Q.Cs())}Ya(){this.kd(new Q(1))}Ta(t){let e=this.Td(t);this.kd(e)}cu(){return this.vd}Rd(t){if(this.vd?.uu===t?.uu&&this.vd?.bu?.te===t?.bu?.te&&this.vd?.bu?.ie===t?.bu?.ie&&this.vd?.gu===t?.gu&&this.vd?.ee===t?.ee)return;let e=this.vd;this.vd=t,e!==null&&this.Ta(e.uu),t!==null&&t.uu!==e?.uu&&this.Ta(t.uu)}N(){return this.yn}vr(t){it(this.yn,t),this.dd.forEach((e=>e.z_(t))),t.timeScale!==void 0&&this.ia.vr(t.timeScale),t.localization!==void 0&&this.ia.fc(t.localization),(t.leftPriceScale||t.rightPriceScale)&&this.md.p(),this.Cd=this.yd(0),this.Pd=this.yd(1),this.ka()}Dd(t,e,i=0){let n=this.dd[i];if(n===void 0)return;if(t==="left")return it(this.yn,{leftPriceScale:e}),n.z_({leftPriceScale:e}),this.md.p(),void this.ka();if(t==="right")return it(this.yn,{rightPriceScale:e}),n.z_({rightPriceScale:e}),this.md.p(),void this.ka();let r=this.Id(t,i);r!==null&&(r.Ft.vr(e),this.md.p())}Id(t,e){let i=this.dd[e];if(i===void 0)return null;let n=i.O_(t);return n!==null?{Kn:i,Ft:n}:null}Et(){return this.ia}Gn(){return this.dd}Vd(){return this.Ct}Bd(){return this.wd}Ed(t,e){t.$o(e),this.Lc()}H_(t){this.k_=t,this.ia.H_(this.k_),this.dd.forEach((e=>e.H_(t))),this.Lc()}Ad(t){this.dd.length!==1&&(Y(t>=0&&t<this.dd.length,"Invalid pane index"),this.dd.splice(t,1),this.ka())}Ld(t,e){if(this.dd.length<2)return;Y(t>=0&&t<this.dd.length,"Invalid pane index");let i=this.dd[t],n=this.dd.reduce(((u,d)=>u+d.F_()),0),r=this.dd.reduce(((u,d)=>u+d.$t()),0),o=r-30*(this.dd.length-1);e=Math.min(o,Math.max(30,e));let a=n/r,l=i.$t();i.W_(e*a);let h=e-l,c=this.dd.length-1;for(let u of this.dd)if(u!==i){let d=Math.min(o,Math.max(30,u.$t()-h/c));h-=u.$t()-d,c-=1;let m=d*a;u.W_(m)}this.ka()}zd(t,e){Y(t>=0&&t<this.dd.length&&e>=0&&e<this.dd.length,"Invalid pane index");let i=this.dd[t],n=this.dd[e];this.dd[t]=n,this.dd[e]=i,this.ka()}Od(t,e){if(Y(t>=0&&t<this.dd.length&&e>=0&&e<this.dd.length,"Invalid pane index"),t===e)return;let[i]=this.dd.splice(t,1);this.dd.splice(e,0,i),this.ka()}Q_(t,e,i){t.Q_(e,i)}tu(t,e,i){t.tu(e,i),this.Ra(),this.kd(this.Nd(t,2))}iu(t,e){t.iu(e),this.kd(this.Nd(t,2))}nu(t,e,i){e.zo()||t.nu(e,i)}su(t,e,i){e.zo()||(t.su(e,i),this.Ra(),this.kd(this.Nd(t,2)))}eu(t,e){e.zo()||(t.eu(e),this.kd(this.Nd(t,2)))}au(t,e){t.au(e),this.kd(this.Nd(t,2))}Fd(t){this.ia.u_(t)}Wd(t,e){let i=this.Et();if(i.Zi()||e===0)return;let n=i.nn();t=Math.max(1,Math.min(t,n)),i.Uc(t,e),this.Lc()}Hd(t){this.Ud(0),this.$d(t),this.jd()}qd(t){this.ia.c_(t),this.Lc()}Yd(){this.ia.d_(),this.mr()}Ud(t){this.ia.f_(t)}$d(t){this.ia.p_(t),this.Lc()}jd(){this.ia.v_(),this.mr()}Jn(){return this.fd}Wn(){return this.pd===null&&(this.pd=this.fd.filter((t=>t.It()))),this.pd}Pa(){this.pd=null}Kd(t,e,i,n,r){this.Ct.In(t,e);let o=NaN,a=this.ia.Vc(t,!0),l=this.ia.Ee();l!==null&&(a=Math.min(Math.max(l.Na(),a),l.bi())),a=this.Ct.Fn(a);let h=n.kn(),c=h.Lt();if(c!==null&&(o=h.Tn(e,c)),o=this.Sd.Pl(o,a,n),this.Ct.An(a,o,n),this.Ya(),!r){let u=Ml(n,t,e);this.Rd(u&&{uu:u.uu,bu:u.bu,gu:u.gu||null,ee:u.ee}),this.wd.p(this.Ct.Bt(),{x:t,y:e},i)}}Gd(t,e,i){let n=i.kn(),r=n.Lt(),o=n.Nt(t,M(r)),a=this.ia.Mc(e,!0),l=this.ia.jt(M(a));this.Kd(l,o,null,i,!0)}Zd(t){this.Vd().zn(),this.Ya(),t||this.wd.p(null,null,null)}Ra(){let t=this.Ct.Kn();if(t!==null){let e=this.Ct.Bn(),i=this.Ct.En();this.Kd(e,i,null,t)}this.Ct.Nn()}Xd(t,e,i){let n=this.ia.Rn(0);e!==void 0&&i!==void 0&&this.ia.Pt(e,i);let r=this.ia.Rn(0),o=this.ia.Dc(),a=this.ia.Ee();if(a!==null&&n!==null&&r!==null){let l=a.ze(o),h=this.Pu.key(n)>this.Pu.key(r),c=t!==null&&t>o&&!h,u=this.ia.N().allowShiftVisibleRangeOnWhitespaceReplacement,d=l&&(i!==void 0||u)&&this.ia.N().shiftVisibleRangeOnNewBar;if(c&&!d){let m=t-o;this.ia.gs(this.ia.Oc()-m)}}this.ia.Hc(t)}Ba(t){t!==null&&t.ou()}Ks(t){if((function(i){return i instanceof si})(t))return t;let e=this.dd.find((i=>i.Dt().includes(t)));return e===void 0?null:e}Lc(){this.dd.forEach((t=>t.ou())),this.Ra()}m(){this.dd.forEach((t=>t.m())),this.dd.length=0,this.yn.localization.priceFormatter=void 0,this.yn.localization.percentageFormatter=void 0,this.yn.localization.timeFormatter=void 0}Jd(){return this.bd}Js(){return this.bd.N()}N_(){return this.md}Qd(t,e){let i=this.xd(e);this.tf(t,i),this.fd.push(t),this.Pa(),this.fd.length===1?this.ka():this.mr()}if(t){let e=this.Ks(t),i=this.fd.indexOf(t);Y(i!==-1,"Series not found");let n=M(e);this.fd.splice(i,1),n.l_(t),t.m&&t.m(),this.Pa(),this.ia.dc(),this.nf(n)}ya(t,e){let i=M(this.Ks(t));i.l_(t,!0),i.h_(t,e,!0)}td(){let t=Q.Cs();t.us(),this.kd(t)}sf(t){let e=Q.Cs();e.fs(t),this.kd(e)}ws(){let t=Q.Cs();t.ws(),this.kd(t)}Ms(t){let e=Q.Cs();e.Ms(t),this.kd(e)}gs(t){let e=Q.Cs();e.gs(t),this.kd(e)}ps(t){let e=Q.Cs();e.ps(t),this.kd(e)}cs(){let t=Q.Cs();t.cs(),this.kd(t)}ef(){let t=this.yn.defaultVisiblePriceScaleId,e=this.yn.leftPriceScale.visible;return e!==this.yn.rightPriceScale.visible?e?"left":"right":t}rf(t,e){if(Y(e>=0,"Index should be greater or equal to 0"),e===this.hf(t))return;let i=M(this.Ks(t));i.l_(t);let n=this.xd(e);this.tf(t,n);let r=!1;i.kl().length===0&&(r=this.nf(i)),r||this.ka()}af(){return this.Pd}$(){return this.Cd}Ut(t){let e=this.Pd,i=this.Cd;if(e===i)return e;if(t=Math.max(0,Math.min(100,Math.round(100*t))),this.Md===null||this.Md.ah!==i||this.Md.oh!==e)this.Md={ah:i,oh:e,lf:new Map};else{let r=this.Md.lf.get(t);if(r!==void 0)return r}let n=this.Io.tt(i,e,t/100);return this.Md.lf.set(t,n),n}_f(t){return this.dd.indexOf(t)}Xi(){return this.Io}uf(){return this.cf()}cf(t){let e=new si(this.ia,this);this.dd.push(e);let i=t??this.dd.length-1,n=Q.ys();return n.es(i,{rs:0,hs:!0}),this.kd(n),e}xd(t){return Y(t>=0,"Index should be greater or equal to 0"),(t=Math.min(this.dd.length,t))<this.dd.length?this.dd[t]:this.cf(t)}hf(t){return this.dd.findIndex((e=>e.Y_().includes(t)))}Nd(t,e){let i=new Q(e);if(t!==null){let n=this.dd.indexOf(t);i.es(n,{rs:e})}return i}Td(t,e){return e===void 0&&(e=2),this.Nd(this.Ks(t),e)}kd(t){this.gd&&this.gd(t),this.dd.forEach((e=>e.wu().wr().Pt()))}tf(t,e){let i=t.N().priceScaleId,n=i!==void 0?i:this.ef();e.h_(t,n),us(n)||t.vr(t.N())}yd(t){let e=this.yn.layout;return e.background.type==="gradient"?t===0?e.background.topColor:e.background.bottomColor:e.background.color}nf(t){return!t.q_()&&t.kl().length===0&&this.dd.length>1&&(this.dd.splice(this._f(t),1),this.ka(),!0)}};function _l(s){if(s>=1)return 0;let t=0;for(;t<8;t++){let e=Math.round(s);if(Math.abs(e-s)<1e-8)return t;s*=10}return t}function Jn(s){return!we(s)&&!ri(s)}function Ll(s){return we(s)}(function(s){s[s.Disabled=0]="Disabled",s[s.Continuous=1]="Continuous",s[s.OnDataUpdate=2]="OnDataUpdate"})(Ha||(Ha={})),(function(s){s[s.LastBar=0]="LastBar",s[s.LastVisible=1]="LastVisible"})(ja||(ja={})),(function(s){s.Solid="solid",s.VerticalGradient="gradient"})(ni||(ni={})),(function(s){s[s.Year=0]="Year",s[s.Month=1]="Month",s[s.DayOfMonth=2]="DayOfMonth",s[s.Time=3]="Time",s[s.TimeWithSeconds=4]="TimeWithSeconds"})(Ka||(Ka={}));var Ya=s=>s.getUTCFullYear();function ac(s,t,e){return t.replace(/yyyy/g,(i=>Tt(Ya(i),4))(s)).replace(/yy/g,(i=>Tt(Ya(i)%100,2))(s)).replace(/MMMM/g,((i,n)=>new Date(i.getUTCFullYear(),i.getUTCMonth(),1).toLocaleString(n,{month:"long"}))(s,e)).replace(/MMM/g,((i,n)=>new Date(i.getUTCFullYear(),i.getUTCMonth(),1).toLocaleString(n,{month:"short"}))(s,e)).replace(/MM/g,(i=>Tt((n=>n.getUTCMonth()+1)(i),2))(s)).replace(/dd/g,(i=>Tt((n=>n.getUTCDate())(i),2))(s))}var ss=class{constructor(t="yyyy-MM-dd",e="default"){this.df=t,this.ff=e}ku(t){return ac(t,this.df,this.ff)}},Zn=class{constructor(t){this.pf=t||"%h:%m:%s"}ku(t){return this.pf.replace("%h",Tt(t.getUTCHours(),2)).replace("%m",Tt(t.getUTCMinutes(),2)).replace("%s",Tt(t.getUTCSeconds(),2))}},lc={vf:"yyyy-MM-dd",mf:"%h:%m:%s",wf:" ",Mf:"default"},tr=class{constructor(t={}){let e={...lc,...t};this.gf=new ss(e.vf,e.Mf),this.bf=new Zn(e.mf),this.Sf=e.wf}ku(t){return`${this.gf.ku(t)}${this.Sf}${this.bf.ku(t)}`}};function Fi(s){return 60*s*60*1e3}function Xs(s){return 60*s*1e3}var Ii=[{xf:(Qa=1,1e3*Qa),Cf:10},{xf:Xs(1),Cf:20},{xf:Xs(5),Cf:21},{xf:Xs(30),Cf:22},{xf:Fi(1),Cf:30},{xf:Fi(3),Cf:31},{xf:Fi(6),Cf:32},{xf:Fi(12),Cf:33}],Qa;function Ga(s,t){if(s.getUTCFullYear()!==t.getUTCFullYear())return 70;if(s.getUTCMonth()!==t.getUTCMonth())return 60;if(s.getUTCDate()!==t.getUTCDate())return 50;for(let e=Ii.length-1;e>=0;--e)if(Math.floor(t.getTime()/Ii[e].xf)!==Math.floor(s.getTime()/Ii[e].xf))return Ii[e].Cf;return 0}function Js(s){let t=s;if(ri(s)&&(t=Mr(s)),!Jn(t))throw new Error("time must be of type BusinessDay");let e=new Date(Date.UTC(t.year,t.month-1,t.day,0,0,0,0));return{yf:Math.round(e.getTime()/1e3),Pf:t}}function Xa(s){if(!Ll(s))throw new Error("time must be of type isUTCTimestamp");return{yf:s}}function Mr(s){let t=new Date(s);if(isNaN(t.getTime()))throw new Error(`Invalid date string=${s}, expected format=yyyy-mm-dd`);return{day:t.getUTCDate(),month:t.getUTCMonth()+1,year:t.getUTCFullYear()}}function Ja(s){ri(s.time)&&(s.time=Mr(s.time))}var ns=class{options(){return this.yn}setOptions(t){this.yn=t,this.updateFormatter(t.localization)}preprocessData(t){Array.isArray(t)?(function(e){e.forEach(Ja)})(t):Ja(t)}createConverterToInternalObj(t){return M((function(e){return e.length===0?null:Jn(e[0].time)||ri(e[0].time)?Js:Xa})(t))}key(t){return typeof t=="object"&&"yf"in t?t.yf:this.key(this.convertHorzItemToInternal(t))}cacheKey(t){let e=t;return e.Pf===void 0?new Date(1e3*e.yf).getTime():new Date(Date.UTC(e.Pf.year,e.Pf.month-1,e.Pf.day)).getTime()}convertHorzItemToInternal(t){return Ll(e=t)?Xa(e):Jn(e)?Js(e):Js(Mr(e));var e}updateFormatter(t){if(!this.yn)return;let e=t.dateFormat;this.yn.timeScale.timeVisible?this.kf=new tr({vf:e,mf:this.yn.timeScale.secondsVisible?"%h:%m:%s":"%h:%m",wf:"   ",Mf:t.locale}):this.kf=new ss(e,t.locale)}formatHorzItem(t){let e=t;return this.kf.ku(new Date(1e3*e.yf))}formatTickmark(t,e){let i=(function(r,o,a){switch(r){case 0:case 10:return o?a?4:3:2;case 20:case 21:case 22:case 30:case 31:case 32:case 33:return o?3:2;case 50:return 2;case 60:return 1;case 70:return 0}})(t.weight,this.yn.timeScale.timeVisible,this.yn.timeScale.secondsVisible),n=this.yn.timeScale;if(n.tickMarkFormatter!==void 0){let r=n.tickMarkFormatter(t.originalTime,i,e.locale);if(r!==null)return r}return(function(r,o,a){let l={};switch(o){case 0:l.year="numeric";break;case 1:l.month="short";break;case 2:l.day="numeric";break;case 3:l.hour12=!1,l.hour="2-digit",l.minute="2-digit";break;case 4:l.hour12=!1,l.hour="2-digit",l.minute="2-digit",l.second="2-digit"}let h=r.Pf===void 0?new Date(1e3*r.yf):new Date(Date.UTC(r.Pf.year,r.Pf.month-1,r.Pf.day));return new Date(h.getUTCFullYear(),h.getUTCMonth(),h.getUTCDate(),h.getUTCHours(),h.getUTCMinutes(),h.getUTCSeconds(),h.getUTCMilliseconds()).toLocaleString(a,l)})(t.time,i,e.locale)}maxTickMarkWeight(t){let e=t.reduce(oc,t[0]).weight;return e>30&&e<50&&(e=30),e}fillWeightsForPoints(t,e){(function(i,n=0){if(i.length===0)return;let r=n===0?null:i[n-1].time.yf,o=r!==null?new Date(1e3*r):null,a=0;for(let l=n;l<i.length;++l){let h=i[l],c=new Date(1e3*h.time.yf);o!==null&&(h.timeWeight=Ga(c,o)),a+=h.time.yf-(r||h.time.yf),r=h.time.yf,o=c}if(n===0&&i.length>1){let l=Math.ceil(a/(i.length-1)),h=new Date(1e3*(i[0].time.yf-l));i[0].timeWeight=Ga(new Date(1e3*i[0].time.yf),h)}})(t,e)}static Tf(t){return it({localization:{dateFormat:"dd MMM 'yy"}},t??{})}},Me=typeof window<"u";function Za(){return!!Me&&window.navigator.userAgent.toLowerCase().indexOf("firefox")>-1}function Zs(){return!!Me&&/iPhone|iPad|iPod/.test(window.navigator.platform)}function hc(s,t){switch(s){case"custom":return t!==void 0?"custom-object":"series";case"price-line":return"custom-price-line";case"marker":return"series-marker";case"primitive":return"primitive";default:return"series"}}function er(s){return s+s%2}function cc(s){Me&&window.chrome!==void 0&&s.addEventListener("mousedown",(t=>{if(t.button===1)return t.preventDefault(),!1}))}var _e=class{constructor(t,e,i){this.Rf=0,this.Df=null,this.If={_t:Number.NEGATIVE_INFINITY,ut:Number.POSITIVE_INFINITY},this.Vf=0,this.Bf=null,this.Ef={_t:Number.NEGATIVE_INFINITY,ut:Number.POSITIVE_INFINITY},this.Af=null,this.Lf=!1,this.zf=null,this.Of=null,this.Nf=!1,this.Ff=!1,this.Wf=!1,this.Hf=null,this.Uf=null,this.$f=null,this.jf=null,this.qf=null,this.Yf=null,this.Kf=null,this.Gf=0,this.Zf=!1,this.Xf=!1,this.Jf=!1,this.Qf=0,this.tp=null,this.ip=!Zs(),this.np=n=>{this.sp(n)},this.ep=n=>{if(this.rp(n)){let r=this.hp(n);if(++this.Vf,this.Bf&&this.Vf>1){let{ap:o}=this.lp(xt(n),this.Ef);o<30&&!this.Wf&&this.op(r,this.up._p),this.cp()}}else{let r=this.hp(n);if(++this.Rf,this.Df&&this.Rf>1){let{ap:o}=this.lp(xt(n),this.If);o<5&&!this.Ff&&this.dp(r,this.up.fp),this.pp()}}},this.vp=t,this.up=e,this.yn=i,this.mp()}m(){this.Hf!==null&&(this.Hf(),this.Hf=null),this.Uf!==null&&(this.Uf(),this.Uf=null),this.jf!==null&&(this.jf(),this.jf=null),this.qf!==null&&(this.qf(),this.qf=null),this.Yf!==null&&(this.Yf(),this.Yf=null),this.$f!==null&&(this.$f(),this.$f=null),this.wp(),this.pp()}Mp(t){this.jf&&this.jf();let e=this.gp.bind(this);if(this.jf=()=>{this.vp.removeEventListener("mousemove",e)},this.vp.addEventListener("mousemove",e),this.rp(t))return;let i=this.hp(t);this.dp(i,this.up.bp),this.ip=!0}pp(){this.Df!==null&&clearTimeout(this.Df),this.Rf=0,this.Df=null,this.If={_t:Number.NEGATIVE_INFINITY,ut:Number.POSITIVE_INFINITY}}cp(){this.Bf!==null&&clearTimeout(this.Bf),this.Vf=0,this.Bf=null,this.Ef={_t:Number.NEGATIVE_INFINITY,ut:Number.POSITIVE_INFINITY}}gp(t){if(this.Jf||this.Of!==null||this.rp(t))return;let e=this.hp(t);this.dp(e,this.up.Sp),this.ip=!0}xp(t){let e=tn(t.changedTouches,M(this.tp));if(e===null||(this.Qf=Bi(t),this.Kf!==null)||this.Xf)return;this.Zf=!0;let i=this.lp(xt(e),M(this.Of)),{Cp:n,yp:r,ap:o}=i;if(this.Nf||!(o<5)){if(!this.Nf){let a=.5*n,l=r>=a&&!this.yn.Pp(),h=a>r&&!this.yn.kp();l||h||(this.Xf=!0),this.Nf=!0,this.Wf=!0,this.wp(),this.cp()}if(!this.Xf){let a=this.hp(t,e);this.op(a,this.up.Tp),fe(t)}}}Rp(t){if(t.button!==0)return;let e=this.lp(xt(t),M(this.zf)),{ap:i}=e;if(i>=5&&(this.Ff=!0,this.pp()),this.Ff){let n=this.hp(t);this.dp(n,this.up.Dp)}}lp(t,e){let i=Math.abs(e._t-t._t),n=Math.abs(e.ut-t.ut);return{Cp:i,yp:n,ap:i+n}}Ip(t){let e=tn(t.changedTouches,M(this.tp));if(e===null&&t.touches.length===0&&(e=t.changedTouches[0]),e===null)return;this.tp=null,this.Qf=Bi(t),this.wp(),this.Of=null,this.Yf&&(this.Yf(),this.Yf=null);let i=this.hp(t,e);if(this.op(i,this.up.Vp),++this.Vf,this.Bf&&this.Vf>1){let{ap:n}=this.lp(xt(e),this.Ef);n<30&&!this.Wf&&this.op(i,this.up._p),this.cp()}else this.Wf||(this.op(i,this.up.Bp),this.up.Bp&&fe(t));this.Vf===0&&fe(t),t.touches.length===0&&this.Lf&&(this.Lf=!1,fe(t))}sp(t){if(t.button!==0)return;let e=this.hp(t);if(this.zf=null,this.Jf=!1,this.qf&&(this.qf(),this.qf=null),Za()&&this.vp.ownerDocument.documentElement.removeEventListener("mouseleave",this.np),!this.rp(t))if(this.dp(e,this.up.Ep),++this.Rf,this.Df&&this.Rf>1){let{ap:i}=this.lp(xt(t),this.If);i<5&&!this.Ff&&this.dp(e,this.up.fp),this.pp()}else this.Ff||this.dp(e,this.up.Ap)}wp(){this.Af!==null&&(clearTimeout(this.Af),this.Af=null)}Lp(t){if(this.tp!==null)return;let e=t.changedTouches[0];this.tp=e.identifier,this.Qf=Bi(t);let i=this.vp.ownerDocument.documentElement;this.Wf=!1,this.Nf=!1,this.Xf=!1,this.Of=xt(e),this.Yf&&(this.Yf(),this.Yf=null);{let r=this.xp.bind(this),o=this.Ip.bind(this);this.Yf=()=>{i.removeEventListener("touchmove",r),i.removeEventListener("touchend",o)},i.addEventListener("touchmove",r,{passive:!1}),i.addEventListener("touchend",o,{passive:!1}),this.wp(),this.Af=setTimeout(this.zp.bind(this,t),240)}let n=this.hp(t,e);this.op(n,this.up.Op),this.Bf||(this.Vf=0,this.Bf=setTimeout(this.cp.bind(this),500),this.Ef=xt(e))}Np(t){if(t.button!==0)return;let e=this.vp.ownerDocument.documentElement;Za()&&e.addEventListener("mouseleave",this.np),this.Ff=!1,this.zf=xt(t),this.qf&&(this.qf(),this.qf=null);{let n=this.Rp.bind(this),r=this.sp.bind(this);this.qf=()=>{e.removeEventListener("mousemove",n),e.removeEventListener("mouseup",r)},e.addEventListener("mousemove",n),e.addEventListener("mouseup",r)}if(this.Jf=!0,this.rp(t))return;let i=this.hp(t);this.dp(i,this.up.Fp),this.Df||(this.Rf=0,this.Df=setTimeout(this.pp.bind(this),500),this.If=xt(t))}mp(){this.vp.addEventListener("mouseenter",this.Mp.bind(this)),this.vp.addEventListener("touchcancel",this.wp.bind(this));{let t=this.vp.ownerDocument,e=i=>{this.up.Wp&&(i.composed&&this.vp.contains(i.composedPath()[0])||i.target&&this.vp.contains(i.target)||this.up.Wp())};this.Uf=()=>{t.removeEventListener("touchstart",e)},this.Hf=()=>{t.removeEventListener("mousedown",e)},t.addEventListener("mousedown",e),t.addEventListener("touchstart",e,{passive:!0})}Zs()&&(this.$f=()=>{this.vp.removeEventListener("dblclick",this.ep)},this.vp.addEventListener("dblclick",this.ep)),this.vp.addEventListener("mouseleave",this.Hp.bind(this)),this.vp.addEventListener("touchstart",this.Lp.bind(this),{passive:!0}),cc(this.vp),this.vp.addEventListener("mousedown",this.Np.bind(this)),this.Up(),this.vp.addEventListener("touchmove",(()=>{}),{passive:!1})}Up(){this.up.$p===void 0&&this.up.jp===void 0&&this.up.qp===void 0||(this.vp.addEventListener("touchstart",(t=>this.Yp(t.touches)),{passive:!0}),this.vp.addEventListener("touchmove",(t=>{if(t.touches.length===2&&this.Kf!==null&&this.up.jp!==void 0){let e=tl(t.touches[0],t.touches[1])/this.Gf;this.up.jp(this.Kf,e),fe(t)}}),{passive:!1}),this.vp.addEventListener("touchend",(t=>{this.Yp(t.touches)})))}Yp(t){t.length===1&&(this.Zf=!1),t.length!==2||this.Zf||this.Lf?this.Kp():this.Gp(t)}Gp(t){let e=this.vp.getBoundingClientRect()||{left:0,top:0};this.Kf={_t:(t[0].clientX-e.left+(t[1].clientX-e.left))/2,ut:(t[0].clientY-e.top+(t[1].clientY-e.top))/2},this.Gf=tl(t[0],t[1]),this.up.$p!==void 0&&this.up.$p(),this.wp()}Kp(){this.Kf!==null&&(this.Kf=null,this.up.qp!==void 0&&this.up.qp())}Hp(t){if(this.jf&&this.jf(),this.rp(t)||!this.ip)return;let e=this.hp(t);this.dp(e,this.up.Zp),this.ip=!Zs()}zp(t){let e=tn(t.touches,M(this.tp));if(e===null)return;let i=this.hp(t,e);this.op(i,this.up.Xp),this.Wf=!0,this.Lf=!0}rp(t){return t.sourceCapabilities&&t.sourceCapabilities.firesTouchEvents!==void 0?t.sourceCapabilities.firesTouchEvents:Bi(t)<this.Qf+500}op(t,e){e&&e.call(this.up,t)}dp(t,e){e&&e.call(this.up,t)}hp(t,e){let i=e||t,n=this.vp.getBoundingClientRect()||{left:0,top:0};return{clientX:i.clientX,clientY:i.clientY,pageX:i.pageX,pageY:i.pageY,screenX:i.screenX,screenY:i.screenY,localX:i.clientX-n.left,localY:i.clientY-n.top,ctrlKey:t.ctrlKey,altKey:t.altKey,shiftKey:t.shiftKey,metaKey:t.metaKey,Jp:!t.type.startsWith("mouse")&&t.type!=="contextmenu"&&t.type!=="click",Qp:t.type,tv:i.target,xu:t.view,iv:()=>{t.type!=="touchstart"&&fe(t)}}}};function tl(s,t){let e=s.clientX-t.clientX,i=s.clientY-t.clientY;return Math.sqrt(e*e+i*i)}function fe(s){s.cancelable&&s.preventDefault()}function xt(s){return{_t:s.pageX,ut:s.pageY}}function Bi(s){return s.timeStamp||performance.now()}function tn(s,t){for(let e=0;e<s.length;++e)if(s[e].identifier===t)return s[e];return null}var ir=class{constructor(t,e,i){this.nv=null,this.sv=null,this.ev=!0,this.rv=null,this.hv=t,this.av=t.lv()[e],this.ov=t.lv()[i],this._v=document.createElement("tr"),this._v.style.height="1px",this.uv=document.createElement("td"),this.uv.style.position="relative",this.uv.style.padding="0",this.uv.style.margin="0",this.uv.setAttribute("colspan","3"),this.cv(),this._v.appendChild(this.uv),this.ev=this.hv.N().layout.panes.enableResize,this.ev?this.dv():(this.nv=null,this.sv=null)}m(){this.sv!==null&&this.sv.m()}fv(){return this._v}pv(){return A({width:this.av.pv().width,height:1})}vv(){return A({width:this.av.vv().width,height:1*window.devicePixelRatio})}mv(t,e,i){let n=this.vv();t.fillStyle=this.hv.N().layout.panes.separatorColor,t.fillRect(e,i,n.width,n.height)}Pt(){this.cv(),this.hv.N().layout.panes.enableResize!==this.ev&&(this.ev=this.hv.N().layout.panes.enableResize,this.ev?this.dv():(this.nv!==null&&(this.uv.removeChild(this.nv.wv),this.uv.removeChild(this.nv.Mv),this.nv=null),this.sv!==null&&(this.sv.m(),this.sv=null)))}dv(){let t=document.createElement("div"),e=t.style;e.position="fixed",e.display="none",e.zIndex="49",e.top="0",e.left="0",e.width="100%",e.height="100%",e.cursor="row-resize",this.uv.appendChild(t);let i=document.createElement("div"),n=i.style;n.position="absolute",n.zIndex="50",n.top="-4px",n.height="9px",n.width="100%",n.backgroundColor="",n.cursor="row-resize",this.uv.appendChild(i);let r={bp:this.gv.bind(this),Zp:this.bv.bind(this),Fp:this.Sv.bind(this),Op:this.Sv.bind(this),Dp:this.xv.bind(this),Tp:this.xv.bind(this),Ep:this.Cv.bind(this),Vp:this.Cv.bind(this)};this.sv=new _e(i,r,{Pp:()=>!1,kp:()=>!0}),this.nv={Mv:i,wv:t}}cv(){this.uv.style.background=this.hv.N().layout.panes.separatorColor}gv(t){this.nv!==null&&(this.nv.Mv.style.backgroundColor=this.hv.N().layout.panes.separatorHoverColor)}bv(t){this.nv!==null&&this.rv===null&&(this.nv.Mv.style.backgroundColor="")}Sv(t){if(this.nv===null)return;let e=this.av.yv().F_()+this.ov.yv().F_(),i=e/(this.av.pv().height+this.ov.pv().height),n=30*i;e<=2*n||(this.rv={Pv:t.pageY,kv:this.av.yv().F_(),Tv:e-n,Rv:e,Dv:i,Iv:n},this.nv.wv.style.display="block")}xv(t){let e=this.rv;if(e===null)return;let i=(t.pageY-e.Pv)*e.Dv,n=Xe(e.kv+i,e.Iv,e.Tv);this.av.yv().W_(n),this.ov.yv().W_(e.Rv-n),this.hv.Qt().ka()}Cv(t){this.rv!==null&&this.nv!==null&&(this.rv=null,this.nv.wv.style.display="none")}};function en(s,t){return s.Vv-t.Vv}function sn(s,t,e){let i=(s.Vv-t.Vv)/(s.wt-t.wt);return Math.sign(i)*Math.min(Math.abs(i),e)}var sr=class{constructor(t,e,i,n){this.Bv=null,this.Ev=null,this.Av=null,this.Lv=null,this.zv=null,this.Ov=0,this.Nv=0,this.Fv=t,this.Wv=e,this.Hv=i,this.Ps=n}Uv(t,e){if(this.Bv!==null){if(this.Bv.wt===e)return void(this.Bv.Vv=t);if(Math.abs(this.Bv.Vv-t)<this.Ps)return}this.Lv=this.Av,this.Av=this.Ev,this.Ev=this.Bv,this.Bv={wt:e,Vv:t}}me(t,e){if(this.Bv===null||this.Ev===null||e-this.Bv.wt>50)return;let i=0,n=sn(this.Bv,this.Ev,this.Wv),r=en(this.Bv,this.Ev),o=[n],a=[r];if(i+=r,this.Av!==null){let h=sn(this.Ev,this.Av,this.Wv);if(Math.sign(h)===Math.sign(n)){let c=en(this.Ev,this.Av);if(o.push(h),a.push(c),i+=c,this.Lv!==null){let u=sn(this.Av,this.Lv,this.Wv);if(Math.sign(u)===Math.sign(n)){let d=en(this.Av,this.Lv);o.push(u),a.push(d),i+=d}}}}let l=0;for(let h=0;h<o.length;++h)l+=a[h]/i*o[h];Math.abs(l)<this.Fv||(this.zv={Vv:t,wt:e},this.Nv=l,this.Ov=(function(h,c){let u=Math.log(c);return Math.log(1*u/-h)/u})(Math.abs(l),this.Hv))}Gc(t){let e=M(this.zv),i=t-e.wt;return e.Vv+this.Nv*(Math.pow(this.Hv,i)-1)/Math.log(this.Hv)}Kc(t){return this.zv===null||this.$v(t)===this.Ov}$v(t){let e=t-M(this.zv).wt;return Math.min(e,this.Ov)}},nr=class{constructor(t,e){this.jv=void 0,this.qv=void 0,this.Yv=void 0,this.vn=!1,this.Kv=t,this.Gv=e,this.Zv()}Pt(){this.Zv()}Xv(){this.jv&&this.Kv.removeChild(this.jv),this.qv&&this.Kv.removeChild(this.qv),this.jv=void 0,this.qv=void 0}Jv(){return this.vn!==this.Qv()||this.Yv!==this.tm()}tm(){return this.Gv.Qt().Xi().J(this.Gv.N().layout.textColor)>160?"dark":"light"}Qv(){return this.Gv.N().layout.attributionLogo}im(){let t=new URL(location.href);return t.hostname?"&utm_source="+t.hostname+t.pathname:""}Zv(){this.Jv()&&(this.Xv(),this.vn=this.Qv(),this.vn&&(this.Yv=this.tm(),this.qv=document.createElement("style"),this.qv.innerText="a#tv-attr-logo{--fill:#131722;--stroke:#fff;position:absolute;left:10px;bottom:10px;height:19px;width:35px;margin:0;padding:0;border:0;z-index:3;}a#tv-attr-logo[data-dark]{--fill:#D1D4DC;--stroke:#131722;}",this.jv=document.createElement("a"),this.jv.href=`https://www.tradingview.com/?utm_medium=lwc-link&utm_campaign=lwc-chart${this.im()}`,this.jv.title="Charting by TradingView",this.jv.id="tv-attr-logo",this.jv.target="_blank",this.jv.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="35" height="19" fill="none"><g fill-rule="evenodd" clip-path="url(#a)" clip-rule="evenodd"><path fill="var(--stroke)" d="M2 0H0v10h6v9h21.4l.5-1.3 6-15 1-2.7H23.7l-.5 1.3-.2.6a5 5 0 0 0-7-.9V0H2Zm20 17h4l5.2-13 .8-2h-7l-1 2.5-.2.5-1.5 3.8-.3.7V17Zm-.8-10a3 3 0 0 0 .7-2.7A3 3 0 1 0 16.8 7h4.4ZM14 7V2H2v6h6v9h4V7h2Z"/><path fill="var(--fill)" d="M14 2H2v6h6v9h6V2Zm12 15h-7l6-15h7l-6 15Zm-7-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></g><defs><clipPath id="a"><path fill="var(--stroke)" d="M0 0h35v19H0z"/></clipPath></defs></svg>',this.jv.toggleAttribute("data-dark",this.Yv==="dark"),this.Kv.appendChild(this.qv),this.Kv.appendChild(this.jv)))}};function ne(s,t){let e=M(s.ownerDocument).createElement("canvas");s.appendChild(e);let i=js(e,{type:"device-pixel-content-box",options:{allowResizeObserver:!0},transform:(n,r)=>({width:Math.max(n.width,r.width),height:Math.max(n.height,r.height)})});return i.resizeCanvasElement(t),i}function re(s){s.width=1,s.height=1,s.getContext("2d")?.clearRect(0,0,1,1)}function qi(s,t,e,i){s.qh&&s.qh(t,e,i)}function Qe(s,t,e,i){s.st(t,e,i)}function rr(s,t,e,i){El(s(e,i),t,i)}function El(s,t,e){for(let i of s){let n=i.Tt(e);n!==null&&t(n)}}function nn(s,t){return e=>(function(i){return i.Ft!==void 0})(e)?(e.Ft()?.pl()??"")!==t?[]:e.Qa?.(s)??[]:[]}function el(s,t,e,i){if(!s.length)return;let n=0,r=s[0].$t(i,!0),o=t===1?e/2-(s[0].Hi()-r/2):s[0].Hi()-r/2-e/2;o=Math.max(0,o);for(let a=1;a<s.length;a++){let l=s[a],h=s[a-1],c=h.$t(i,!1),u=l.Hi(),d=h.Hi();if(t===1?u>d-c:u<d+c){let m=d-c*t;l.Ui(m);let f=m-t*c/2;if((t===1?f<0:f>e)&&o>0){let p=t===1?-1-f:f-e,b=Math.min(p,o);for(let v=n;v<s.length;v++)s[v].Ui(s[v].Hi()+t*b);o-=b}}else n=a,o=t===1?d-c-u:u-(d+c)}}var rs=class{constructor(t,e,i,n){this.Ki=null,this.nm=null,this.sm=!1,this.rm=new Ce(200),this.hm=null,this.am=0,this.lm=!1,this.om=()=>{this.lm||this.yt._m().Qt().mr()},this.um=()=>{this.lm||this.yt._m().Qt().mr()},this.yt=t,this.yn=e,this.Ro=e.layout,this.bd=i,this.dm=n==="left",this.fm=nn("normal",n),this.pm=nn("top",n),this.vm=nn("bottom",n),this.uv=document.createElement("div"),this.uv.style.height="100%",this.uv.style.overflow="hidden",this.uv.style.width="25px",this.uv.style.left="0",this.uv.style.position="relative",this.wm=ne(this.uv,A({width:16,height:16})),this.wm.subscribeSuggestedBitmapSizeChanged(this.om);let r=this.wm.canvasElement;r.style.position="absolute",r.style.zIndex="1",r.style.left="0",r.style.top="0",this.Mm=ne(this.uv,A({width:16,height:16})),this.Mm.subscribeSuggestedBitmapSizeChanged(this.um);let o=this.Mm.canvasElement;o.style.position="absolute",o.style.zIndex="2",o.style.left="0",o.style.top="0";let a={Fp:this.Sv.bind(this),Op:this.Sv.bind(this),Dp:this.xv.bind(this),Tp:this.xv.bind(this),Wp:this.gm.bind(this),Ep:this.Cv.bind(this),Vp:this.Cv.bind(this),fp:this.bm.bind(this),_p:this.bm.bind(this),bp:this.Sm.bind(this),Zp:this.bv.bind(this)};this.sv=new _e(this.Mm.canvasElement,a,{Pp:()=>!this.yn.handleScroll.vertTouchDrag,kp:()=>!0})}m(){this.sv.m(),this.Mm.unsubscribeSuggestedBitmapSizeChanged(this.um),re(this.Mm.canvasElement),this.Mm.dispose(),this.wm.unsubscribeSuggestedBitmapSizeChanged(this.om),re(this.wm.canvasElement),this.wm.dispose(),this.Ki!==null&&this.Ki.__().u(this),this.Ki=null}fv(){return this.uv}P(){return this.Ro.fontSize}xm(){let t=this.bd.N();return this.hm!==t.k&&(this.rm.Os(),this.hm=t.k),t}Cm(){if(this.Ki===null)return 0;let t=0,e=this.xm(),i=M(this.wm.canvasElement.getContext("2d",{colorSpace:this.yt._m().N().layout.colorSpace}));i.save();let n=this.Ki.zl();i.font=this.ym(),n.length>0&&(t=Math.max(this.rm.Ii(i,n[0].eo),this.rm.Ii(i,n[n.length-1].eo)));let r=this.Pm();for(let h=r.length;h--;){let c=this.rm.Ii(i,r[h].ri());c>t&&(t=c)}let o=this.Ki.Lt();if(o!==null&&this.nm!==null&&(a=this.yn.crosshair).mode!==2&&a.horzLine.visible&&a.horzLine.labelVisible){let h=this.Ki.Tn(1,o),c=this.Ki.Tn(this.nm.height-2,o);t=Math.max(t,this.rm.Ii(i,this.Ki.Ji(Math.floor(Math.min(h,c))+.11111111111111,o)),this.rm.Ii(i,this.Ki.Ji(Math.ceil(Math.max(h,c))-.11111111111111,o)))}var a;i.restore();let l=t||34;return er(Math.ceil(e.S+e.C+e.V+e.B+5+l))}km(t){this.nm!==null&&yt(this.nm,t)||(this.nm=t,this.lm=!0,this.wm.resizeCanvasElement(t),this.Mm.resizeCanvasElement(t),this.lm=!1,this.uv.style.width=`${t.width}px`,this.uv.style.height=`${t.height}px`)}Tm(){return M(this.nm).width}un(t){this.Ki!==t&&(this.Ki!==null&&this.Ki.__().u(this),this.Ki=t,t.__().i(this.wo.bind(this),this))}Ft(){return this.Ki}Os(){let t=this.yt.yv();this.yt._m().Qt().au(t,M(this.Ft()))}Rm(t){if(this.nm===null)return;let e={colorSpace:this.yt._m().N().layout.colorSpace};if(t!==1){this.Dm(),this.wm.applySuggestedBitmapSize();let n=kt(this.wm,e);n!==null&&(n.useBitmapCoordinateSpace((r=>{this.Im(r),this.Vm(r)})),this.yt.Bm(n,this.vm),this.Em(n),this.yt.Bm(n,this.fm),this.Am(n))}this.Mm.applySuggestedBitmapSize();let i=kt(this.Mm,e);i!==null&&(i.useBitmapCoordinateSpace((({context:n,bitmapSize:r})=>{n.clearRect(0,0,r.width,r.height)})),this.Lm(i),this.yt.Bm(i,this.pm))}vv(){return this.wm.bitmapSize}mv(t,e,i,n){let r=this.vv();if(r.width>0&&r.height>0&&(t.drawImage(this.wm.canvasElement,e,i),n)){let o=this.Mm.canvasElement;t.drawImage(o,e,i)}}Pt(){this.Ki?.zl()}Sv(t){if(this.Ki===null||this.Ki.Zi()||!this.yn.handleScale.axisPressedMouseMove.price)return;let e=this.yt._m().Qt(),i=this.yt.yv();this.sm=!0,e.Q_(i,this.Ki,t.localY)}xv(t){if(this.Ki===null||!this.yn.handleScale.axisPressedMouseMove.price)return;let e=this.yt._m().Qt(),i=this.yt.yv(),n=this.Ki;e.tu(i,n,t.localY)}gm(){if(this.Ki===null||!this.yn.handleScale.axisPressedMouseMove.price)return;let t=this.yt._m().Qt(),e=this.yt.yv(),i=this.Ki;this.sm&&(this.sm=!1,t.iu(e,i))}Cv(t){if(this.Ki===null||!this.yn.handleScale.axisPressedMouseMove.price)return;let e=this.yt._m().Qt(),i=this.yt.yv();this.sm=!1,e.iu(i,this.Ki)}bm(t){this.yn.handleScale.axisDoubleClickReset.price&&this.Os()}Sm(t){this.Ki!==null&&(!this.yt._m().Qt().N().handleScale.axisPressedMouseMove.price||this.Ki.je()||this.Ki.No()||this.zm(1))}bv(t){this.zm(0)}Pm(){let t=[],e=this.Ki===null?void 0:this.Ki;return(i=>{for(let n=0;n<i.length;++n){let r=i[n].qn(this.yt.yv(),e);for(let o=0;o<r.length;o++)t.push(r[o])}})(this.yt.yv().Dt()),t}Im({context:t,bitmapSize:e}){let{width:i,height:n}=e,r=this.yt.yv().Qt(),o=r.$(),a=r.af();o===a?cs(t,0,0,i,n,o):wl(t,0,0,i,n,o,a)}Vm({context:t,bitmapSize:e,horizontalPixelRatio:i}){if(this.nm===null||this.Ki===null||!this.Ki.N().borderVisible)return;t.fillStyle=this.Ki.N().borderColor;let n=Math.max(1,Math.floor(this.xm().S*i)),r;r=this.dm?e.width-n:0,t.fillRect(r,0,n,e.height)}Em(t){if(this.nm===null||this.Ki===null)return;let e=this.Ki.zl(),i=this.Ki.N(),n=this.xm(),r=this.dm?this.nm.width-n.C:0;i.borderVisible&&i.ticksVisible&&t.useBitmapCoordinateSpace((({context:o,horizontalPixelRatio:a,verticalPixelRatio:l})=>{o.fillStyle=i.borderColor;let h=Math.max(1,Math.floor(l)),c=Math.floor(.5*l),u=Math.round(n.C*a);o.beginPath();for(let d of e)o.rect(Math.floor(r*a),Math.round(d.Vl*l)-c,u,h);o.fill()})),t.useMediaCoordinateSpace((({context:o})=>{o.font=this.ym(),o.fillStyle=i.textColor??this.Ro.textColor,o.textAlign=this.dm?"right":"left",o.textBaseline="middle";let a=this.dm?Math.round(r-n.V):Math.round(r+n.C+n.V),l=e.map((h=>this.rm.Di(o,h.eo)));for(let h=e.length;h--;){let c=e[h];o.fillText(c.eo,a,c.Vl+l[h])}}))}Dm(){if(this.nm===null||this.Ki===null)return;let t=this.nm.height/2,e=[],i=this.Ki.Dt().slice(),n=this.yt.yv(),r=this.xm();this.Ki===n.Zs()&&this.yt.yv().Dt().forEach((l=>{n.Gs(l)&&i.push(l)}));let o=this.Ki.kl()[0],a=this.Ki;i.forEach((l=>{let h=l.qn(n,a);h.forEach((c=>{c.$i()&&c.Wi()===null&&(c.Ui(null),e.push(c))})),o===l&&h.length>0&&(t=h[0].Ei())})),this.Ki.N().alignLabels&&this.Om(e,r,t)}Om(t,e,i){if(this.nm===null)return;let n=t.filter((o=>o.Ei()<=i)),r=t.filter((o=>o.Ei()>i));n.sort(((o,a)=>a.Ei()-o.Ei())),n.length&&r.length&&r.push(n[0]),r.sort(((o,a)=>o.Ei()-a.Ei()));for(let o of t){let a=Math.floor(o.$t(e)/2),l=o.Ei();l>-a&&l<a&&o.Ui(a),l>this.nm.height-a&&l<this.nm.height+a&&o.Ui(this.nm.height-a)}el(n,1,this.nm.height,e),el(r,-1,this.nm.height,e)}Am(t){if(this.nm===null)return;let e=this.Pm(),i=this.xm(),n=this.dm?"right":"left";e.forEach((r=>{r.ji()&&r.Tt(M(this.Ki)).st(t,i,this.rm,n)}))}Lm(t){if(this.nm===null||this.Ki===null)return;let e=this.yt._m().Qt(),i=[],n=this.yt.yv(),r=e.Vd().qn(n,this.Ki);r.length&&i.push(r);let o=this.xm(),a=this.dm?"right":"left";i.forEach((l=>{l.forEach((h=>{h.Tt(M(this.Ki)).st(t,o,this.rm,a)}))}))}zm(t){this.uv.style.cursor=t===1?"ns-resize":"default"}wo(){let t=this.Cm();this.am<t&&this.yt._m().Qt().ka(),this.am=t}ym(){return Ui(this.Ro.fontSize,this.Ro.fontFamily)}};function uc(s,t){return s.Xa?.(t)??[]}function rn(s,t){return s.jn?.(t)??[]}function il(s,t){return s.cn?.(t)??[]}function dc(s,t){return s.qa?.(t)??[]}var or=class s{constructor(t,e){this.nm=A({width:0,height:0}),this.Nm=null,this.Fm=null,this.Wm=null,this.Hm=null,this.Um=!1,this.$m=new F,this.jm=new F,this.qm=0,this.Ym=!1,this.Km=null,this.Gm=!1,this.Zm=null,this.Xm=null,this.lm=!1,this.om=()=>{this.lm||this.Jm===null||this.sn().mr()},this.um=()=>{this.lm||this.Jm===null||this.sn().mr()},this.Gv=t,this.Jm=e,this.Jm.mu().i(this.Qm.bind(this),this,!0),this.tw=document.createElement("td"),this.tw.style.padding="0",this.tw.style.position="relative";let i=document.createElement("div");i.style.width="100%",i.style.height="100%",i.style.position="relative",i.style.overflow="hidden",this.iw=document.createElement("td"),this.iw.style.padding="0",this.nw=document.createElement("td"),this.nw.style.padding="0",this.tw.appendChild(i),this.wm=ne(i,A({width:16,height:16})),this.wm.subscribeSuggestedBitmapSizeChanged(this.om);let n=this.wm.canvasElement;n.style.position="absolute",n.style.zIndex="1",n.style.left="0",n.style.top="0",this.Mm=ne(i,A({width:16,height:16})),this.Mm.subscribeSuggestedBitmapSizeChanged(this.um);let r=this.Mm.canvasElement;r.style.position="absolute",r.style.zIndex="2",r.style.left="0",r.style.top="0",this._v=document.createElement("tr"),this._v.appendChild(this.iw),this._v.appendChild(this.tw),this._v.appendChild(this.nw),this.sw(),this.sv=new _e(this.Mm.canvasElement,this,{Pp:()=>this.Km===null&&!this.Gv.N().handleScroll.vertTouchDrag,kp:()=>this.Km===null&&!this.Gv.N().handleScroll.horzTouchDrag})}m(){this.Nm!==null&&this.Nm.m(),this.Fm!==null&&this.Fm.m(),this.Wm=null,this.Mm.unsubscribeSuggestedBitmapSizeChanged(this.um),re(this.Mm.canvasElement),this.Mm.dispose(),this.wm.unsubscribeSuggestedBitmapSizeChanged(this.om),re(this.wm.canvasElement),this.wm.dispose(),this.Jm!==null&&(this.Jm.mu().u(this),this.Jm.m()),this.sv.m()}yv(){return M(this.Jm)}ew(t){this.Jm!==null&&this.Jm.mu().u(this),this.Jm=t,this.Jm!==null&&this.Jm.mu().i(s.prototype.Qm.bind(this),this,!0),this.sw(),this.Gv.lv().indexOf(this)===this.Gv.lv().length-1?(this.Wm=this.Wm??new nr(this.tw,this.Gv),this.Wm.Pt()):(this.Wm?.Xv(),this.Wm=null)}_m(){return this.Gv}fv(){return this._v}sw(){if(this.Jm!==null&&(this.rw(),this.sn().Jn().length!==0)){if(this.Nm!==null){let t=this.Jm.X_();this.Nm.un(M(t))}if(this.Fm!==null){let t=this.Jm.J_();this.Fm.un(M(t))}}}hw(){this.Nm!==null&&this.Nm.Pt(),this.Fm!==null&&this.Fm.Pt()}F_(){return this.Jm!==null?this.Jm.F_():0}W_(t){this.Jm&&this.Jm.W_(t)}bp(t){if(!this.Jm)return;this.aw();let e=t.localX,i=t.localY;this.lw(e,i,t)}Fp(t){this.aw(),this.ow(),this.lw(t.localX,t.localY,t)}Sp(t){if(!this.Jm)return;this.aw();let e=t.localX,i=t.localY;this.lw(e,i,t)}Ap(t){this.Jm!==null&&(this.aw(),this.lw(t.localX,t.localY,t),this._w(t))}fp(t){this.Jm!==null&&this.uw(this.jm,t)}_p(t){this.fp(t)}Dp(t){this.aw(),this.cw(t),this.lw(t.localX,t.localY,t)}Ep(t){this.Jm!==null&&(this.aw(),this.Ym=!1,this.dw(t))}Bp(t){this.Jm!==null&&this._w(t)}Xp(t){if(this.Ym=!0,this.Km===null){let e={x:t.localX,y:t.localY};this.fw(e,e,t)}}Zp(t){this.Jm!==null&&(this.aw(),this.Jm.Qt().Rd(null),this.pw())}mw(){return this.$m}ww(){return this.jm}$p(){this.qm=1,this.sn().cs()}jp(t,e){if(!this.Gv.N().handleScale.pinch)return;let i=5*(e-this.qm);this.qm=e,this.sn().Wd(t._t,i)}Op(t){this.Ym=!1,this.Gm=this.Km!==null,this.ow();let e=this.sn().Vd();this.Km!==null&&e.It()&&(this.Zm={x:e.ni(),y:e.si()},this.Km={x:t.localX,y:t.localY})}Tp(t){if(this.Jm===null)return;let e=t.localX,i=t.localY;if(this.Km===null)this.cw(t);else{this.Gm=!1;let n=M(this.Zm),r=n.x+(e-this.Km.x),o=n.y+(i-this.Km.y);this.lw(r,o,t)}}Vp(t){this._m().N().trackingMode.exitMode===0&&(this.Gm=!0),this.Mw(),this.dw(t)}Qs(t,e){let i=this.Jm;return i===null?null:Ml(i,t,e)}gw(t,e){M(e==="left"?this.Nm:this.Fm).km(A({width:t,height:this.nm.height}))}pv(){return this.nm}km(t){yt(this.nm,t)||(this.nm=t,this.lm=!0,this.wm.resizeCanvasElement(t),this.Mm.resizeCanvasElement(t),this.lm=!1,this.tw.style.width=t.width+"px",this.tw.style.height=t.height+"px")}bw(){let t=M(this.Jm);t.G_(t.X_()),t.G_(t.J_());for(let e of t.kl())if(t.Gs(e)){let i=e.Ft();i!==null&&t.G_(i),e.Nn()}for(let e of t.Mu())e.Nn()}vv(){return this.wm.bitmapSize}mv(t,e,i,n){let r=this.vv();if(r.width>0&&r.height>0&&(t.drawImage(this.wm.canvasElement,e,i),n)){let o=this.Mm.canvasElement;t!==null&&t.drawImage(o,e,i)}}Rm(t){if(t===0||this.Jm===null)return;t>1&&this.bw(),this.Nm!==null&&this.Nm.Rm(t),this.Fm!==null&&this.Fm.Rm(t);let e={colorSpace:this.Gv.N().layout.colorSpace};if(t!==1){this.wm.applySuggestedBitmapSize();let n=kt(this.wm,e);n!==null&&(n.useBitmapCoordinateSpace((r=>{this.Im(r)})),this.Jm&&(this.Sw(n,uc),this.xw(n),this.Sw(n,rn),this.Sw(n,il)))}this.Mm.applySuggestedBitmapSize();let i=kt(this.Mm,e);i!==null&&(i.useBitmapCoordinateSpace((({context:n,bitmapSize:r})=>{n.clearRect(0,0,r.width,r.height)})),this.Cw(i),this.Sw(i,dc),this.Sw(i,il))}yw(){return this.Nm}Pw(){return this.Fm}Bm(t,e){this.Sw(t,e)}Qm(){this.Jm!==null&&this.Jm.mu().u(this),this.Jm=null}_w(t){this.uw(this.$m,t)}uw(t,e){let i=e.localX,n=e.localY;t.v()&&t.p(this.sn().Et().Vc(i),{x:i,y:n},e)}Im({context:t,bitmapSize:e}){let{width:i,height:n}=e,r=this.sn(),o=r.$(),a=r.af();o===a?cs(t,0,0,i,n,a):wl(t,0,0,i,n,o,a)}xw(t){let e=M(this.Jm),i=e.wu().wr().Tt(e);i!==null&&i.st(t,!1)}Cw(t){this.kw(t,rn,Qe,this.sn().Vd())}Sw(t,e){let i=M(this.Jm),n=e===rn?this.Tw():null,r=n===null?null:this.Rw(n,i),o=i.Mu();if(r===null||n===null){let h=i._u();return this.Dw(t,e,qi,o,h),void this.Dw(t,e,Qe,o,h)}let a=i.Dt(),l=h=>h===n?r.Za:void 0;this.Dw(t,e,qi,o,a,l),this.Dw(t,e,Qe,o,a,l),this.kw(t,e,qi,n,r.qa),this.kw(t,e,Qe,n,r.qa)}Dw(t,e,i,n,r,o){for(let a of n)this.kw(t,e,i,a);if(o!==void 0)for(let a of r)this.kw(t,e,i,a,o(a));else for(let a of r)this.kw(t,e,i,a)}Tw(){let t=M(this.Jm),e=t.Qt().cu()?.uu;if(!t.Qt().N().hoveredSeriesOnTop||e===void 0)return null;for(let i of t.Dt())if(i===e)return i;return null}Rw(t,e){let i=t.Ga?.(e)??null;return i===null||i.qa.length===0?null:i}kw(t,e,i,n,r){let o=M(this.Jm),a=o.Qt().cu(),l=a!==null&&a.uu===n,h=a!==null&&l&&a.bu!==void 0?a.bu.ie:void 0,c=u=>i(u,t,l,h);r===void 0?rr(e,c,n,o):El(r,c,o)}rw(){if(this.Jm===null)return;let t=this.Gv,e=this.Jm.X_().N().visible,i=this.Jm.J_().N().visible;e||this.Nm===null||(this.iw.removeChild(this.Nm.fv()),this.Nm.m(),this.Nm=null),i||this.Fm===null||(this.nw.removeChild(this.Fm.fv()),this.Fm.m(),this.Fm=null);let n=t.Qt().Jd();e&&this.Nm===null&&(this.Nm=new rs(this,t.N(),n,"left"),this.iw.appendChild(this.Nm.fv())),i&&this.Fm===null&&(this.Fm=new rs(this,t.N(),n,"right"),this.nw.appendChild(this.Fm.fv()))}Iw(t){return t.Jp&&this.Ym||this.Km!==null}lw(t,e,i){t=Math.max(0,Math.min(t,this.nm.width-1)),e=Math.max(0,Math.min(e,this.nm.height-1)),this.sn().Kd(t,e,i,M(this.Jm))}pw(){this.sn().Zd()}Mw(){this.Gm&&(this.Km=null,this.pw())}fw(t,e,i){this.Km=t,this.Gm=!1,this.lw(e.x,e.y,i);let n=this.sn().Vd();this.Zm={x:n.ni(),y:n.si()}}sn(){return this.Gv.Qt()}dw(t){if(!this.Um)return;let e=this.sn(),i=this.yv();if(e.eu(i,i.kn()),this.Hm=null,this.Um=!1,e.jd(),this.Xm!==null){let n=performance.now(),r=e.Et();this.Xm.me(r.Oc(),n),this.Xm.Kc(n)||e.ps(this.Xm)}}aw(){this.Km=null}ow(){if(this.Jm){if(this.sn().cs(),document.activeElement!==document.body&&document.activeElement!==document.documentElement)M(document.activeElement).blur();else{let t=document.getSelection();t!==null&&t.removeAllRanges()}!this.Jm.kn().Zi()&&this.sn().Et().Zi()}}cw(t){if(this.Jm===null)return;let e=this.sn(),i=e.Et();if(i.Zi())return;let n=this.Gv.N(),r=n.handleScroll,o=n.kineticScroll;if((!r.pressedMouseMove||t.Jp)&&(!r.horzTouchDrag&&!r.vertTouchDrag||!t.Jp))return;let a=this.Jm.kn(),l=performance.now();if(this.Hm!==null||this.Iw(t)||(this.Hm={x:t.clientX,y:t.clientY,yf:l,Vw:t.localX,Bw:t.localY}),this.Hm!==null&&!this.Um&&(this.Hm.x!==t.clientX||this.Hm.y!==t.clientY)){if(t.Jp&&o.touch||!t.Jp&&o.mouse){let h=i.ml();this.Xm=new sr(.2/h,7/h,.997,15/h),this.Xm.Uv(i.Oc(),this.Hm.yf)}else this.Xm=null;a.Zi()||e.nu(this.Jm,a,t.localY),e.Ud(t.localX),this.Um=!0}this.Um&&(a.Zi()||e.su(this.Jm,a,t.localY),e.$d(t.localX),this.Xm!==null&&this.Xm.Uv(i.Oc(),l))}},os=class{constructor(t,e,i,n,r){this.xt=!0,this.nm=A({width:0,height:0}),this.om=()=>this.Rm(3),this.dm=t==="left",this.bd=i.Jd,this.yn=e,this.Ew=n,this.Aw=r,this.uv=document.createElement("div"),this.uv.style.width="25px",this.uv.style.height="100%",this.uv.style.overflow="hidden",this.wm=ne(this.uv,A({width:16,height:16})),this.wm.subscribeSuggestedBitmapSizeChanged(this.om)}m(){this.wm.unsubscribeSuggestedBitmapSizeChanged(this.om),re(this.wm.canvasElement),this.wm.dispose()}fv(){return this.uv}pv(){return this.nm}km(t){yt(this.nm,t)||(this.nm=t,this.wm.resizeCanvasElement(t),this.uv.style.width=`${t.width}px`,this.uv.style.height=`${t.height}px`,this.xt=!0)}Rm(t){if(t<3&&!this.xt||this.nm.width===0||this.nm.height===0)return;this.xt=!1,this.wm.applySuggestedBitmapSize();let e=kt(this.wm,{colorSpace:this.yn.layout.colorSpace});e!==null&&e.useBitmapCoordinateSpace((i=>{this.Im(i),this.Vm(i)}))}vv(){return this.wm.bitmapSize}mv(t,e,i){let n=this.vv();n.width>0&&n.height>0&&t.drawImage(this.wm.canvasElement,e,i)}Vm({context:t,bitmapSize:e,horizontalPixelRatio:i,verticalPixelRatio:n}){if(!this.Ew())return;t.fillStyle=this.yn.timeScale.borderColor;let r=Math.floor(this.bd.N().S*i),o=Math.floor(this.bd.N().S*n),a=this.dm?e.width-r:0;t.fillRect(a,0,r,o)}Im({context:t,bitmapSize:e}){cs(t,0,0,e.width,e.height,this.Aw())}};function _r(s){return t=>t.tl?.(s)??[]}var mc=_r("normal"),fc=_r("top"),pc=_r("bottom"),ar=class{constructor(t,e){this.Lw=null,this.zw=null,this.M=null,this.Ow=!1,this.nm=A({width:0,height:0}),this.Nw=new F,this.rm=new Ce(5),this.lm=!1,this.om=()=>{this.lm||this.Gv.Qt().mr()},this.um=()=>{this.lm||this.Gv.Qt().mr()},this.Gv=t,this.Pu=e,this.yn=t.N().layout,this.jv=document.createElement("tr"),this.Fw=document.createElement("td"),this.Fw.style.padding="0",this.Ww=document.createElement("td"),this.Ww.style.padding="0",this.uv=document.createElement("td"),this.uv.style.height="25px",this.uv.style.padding="0",this.Hw=document.createElement("div"),this.Hw.style.width="100%",this.Hw.style.height="100%",this.Hw.style.position="relative",this.Hw.style.overflow="hidden",this.uv.appendChild(this.Hw),this.wm=ne(this.Hw,A({width:16,height:16})),this.wm.subscribeSuggestedBitmapSizeChanged(this.om);let i=this.wm.canvasElement;i.style.position="absolute",i.style.zIndex="1",i.style.left="0",i.style.top="0",this.Mm=ne(this.Hw,A({width:16,height:16})),this.Mm.subscribeSuggestedBitmapSizeChanged(this.um);let n=this.Mm.canvasElement;n.style.position="absolute",n.style.zIndex="2",n.style.left="0",n.style.top="0",this.jv.appendChild(this.Fw),this.jv.appendChild(this.uv),this.jv.appendChild(this.Ww),this.Uw(),this.Gv.Qt().N_().i(this.Uw.bind(this),this),this.sv=new _e(this.Mm.canvasElement,this,{Pp:()=>!0,kp:()=>!this.Gv.N().handleScroll.horzTouchDrag})}m(){this.sv.m(),this.Lw!==null&&this.Lw.m(),this.zw!==null&&this.zw.m(),this.Mm.unsubscribeSuggestedBitmapSizeChanged(this.um),re(this.Mm.canvasElement),this.Mm.dispose(),this.wm.unsubscribeSuggestedBitmapSizeChanged(this.om),re(this.wm.canvasElement),this.wm.dispose()}fv(){return this.jv}$w(){return this.Lw}jw(){return this.zw}Fp(t){if(this.Ow)return;this.Ow=!0;let e=this.Gv.Qt();!e.Et().Zi()&&this.Gv.N().handleScale.axisPressedMouseMove.time&&e.Fd(t.localX)}Op(t){this.Fp(t)}Wp(){let t=this.Gv.Qt();!t.Et().Zi()&&this.Ow&&(this.Ow=!1,this.Gv.N().handleScale.axisPressedMouseMove.time&&t.Yd())}Dp(t){let e=this.Gv.Qt();!e.Et().Zi()&&this.Gv.N().handleScale.axisPressedMouseMove.time&&e.qd(t.localX)}Tp(t){this.Dp(t)}Ep(){this.Ow=!1;let t=this.Gv.Qt();t.Et().Zi()&&!this.Gv.N().handleScale.axisPressedMouseMove.time||t.Yd()}Vp(){this.Ep()}fp(){this.Gv.N().handleScale.axisDoubleClickReset.time&&this.Gv.Qt().ws()}_p(){this.fp()}bp(){this.Gv.Qt().N().handleScale.axisPressedMouseMove.time&&this.zm(1)}Zp(){this.zm(0)}pv(){return this.nm}qw(){return this.Nw}Yw(t,e,i){yt(this.nm,t)||(this.nm=t,this.lm=!0,this.wm.resizeCanvasElement(t),this.Mm.resizeCanvasElement(t),this.lm=!1,this.uv.style.width=`${t.width}px`,this.uv.style.height=`${t.height}px`,this.Nw.p(t)),this.Lw!==null&&this.Lw.km(A({width:e,height:t.height})),this.zw!==null&&this.zw.km(A({width:i,height:t.height}))}Kw(){let t=this.Gw();return Math.ceil(t.S+t.C+t.P+t.A+t.I+t.Zw)}Pt(){this.Gv.Qt().Et().zl()}vv(){return this.wm.bitmapSize}mv(t,e,i,n){let r=this.vv();if(r.width>0&&r.height>0&&(t.drawImage(this.wm.canvasElement,e,i),n)){let o=this.Mm.canvasElement;t.drawImage(o,e,i)}}Rm(t){if(t===0)return;let e={colorSpace:this.yn.colorSpace};if(t!==1){this.wm.applySuggestedBitmapSize();let n=kt(this.wm,e);n!==null&&(n.useBitmapCoordinateSpace((r=>{this.Im(r),this.Vm(r),this.Xw(n,pc)})),this.Em(n),this.Xw(n,mc)),this.Lw!==null&&this.Lw.Rm(t),this.zw!==null&&this.zw.Rm(t)}this.Mm.applySuggestedBitmapSize();let i=kt(this.Mm,e);i!==null&&(i.useBitmapCoordinateSpace((({context:n,bitmapSize:r})=>{n.clearRect(0,0,r.width,r.height)})),this.Jw([...this.Gv.Qt().Jn(),this.Gv.Qt().Vd()],i),this.Xw(i,fc))}Xw(t,e){let i=this.Gv.Qt().Jn();for(let n of i)rr(e,(r=>qi(r,t,!1,void 0)),n,void 0);for(let n of i)rr(e,(r=>Qe(r,t,!1,void 0)),n,void 0)}Im({context:t,bitmapSize:e}){cs(t,0,0,e.width,e.height,this.Gv.Qt().af())}Vm({context:t,bitmapSize:e,verticalPixelRatio:i}){if(this.Gv.N().timeScale.borderVisible){t.fillStyle=this.Qw();let n=Math.max(1,Math.floor(this.Gw().S*i));t.fillRect(0,0,e.width,n)}}Em(t){let e=this.Gv.Qt().Et(),i=e.zl();if(!i||i.length===0)return;let n=this.Pu.maxTickMarkWeight(i),r=this.Gw(),o=e.N();o.borderVisible&&o.ticksVisible&&t.useBitmapCoordinateSpace((({context:a,horizontalPixelRatio:l,verticalPixelRatio:h})=>{a.strokeStyle=this.Qw(),a.fillStyle=this.Qw();let c=Math.max(1,Math.floor(l)),u=Math.floor(.5*l);a.beginPath();let d=Math.round(r.C*h);for(let m=i.length;m--;){let f=Math.round(i[m].coord*l);a.rect(f-u,0,c,d)}a.fill()})),t.useMediaCoordinateSpace((({context:a})=>{let l=r.S+r.C+r.A+r.P/2;a.textAlign="center",a.textBaseline="middle",a.fillStyle=this.H(),a.font=this.ym();for(let h of i)if(h.weight<n){let c=h.needAlignCoordinate?this.tM(a,h.coord,h.label):h.coord;a.fillText(h.label,c,l)}this.Gv.N().timeScale.allowBoldLabels&&(a.font=this.iM());for(let h of i)if(h.weight>=n){let c=h.needAlignCoordinate?this.tM(a,h.coord,h.label):h.coord;a.fillText(h.label,c,l)}}))}tM(t,e,i){let n=this.rm.Ii(t,i),r=n/2,o=Math.floor(e-r)+.5;return o<0?e+=Math.abs(0-o):o+n>this.nm.width&&(e-=Math.abs(this.nm.width-(o+n))),e}Jw(t,e){let i=this.Gw();for(let n of t)for(let r of n.dn())r.Tt().st(e,i)}Qw(){return this.Gv.N().timeScale.borderColor}H(){return this.yn.textColor}F(){return this.yn.fontSize}ym(){return Ui(this.F(),this.yn.fontFamily)}iM(){return Ui(this.F(),this.yn.fontFamily,"bold")}Gw(){this.M===null&&(this.M={S:1,L:NaN,A:NaN,I:NaN,tn:NaN,C:5,P:NaN,k:"",Qi:new Ce,Zw:0});let t=this.M,e=this.ym();if(t.k!==e){let i=this.F();t.P=i,t.k=e,t.A=3*i/12,t.I=3*i/12,t.tn=9*i/12,t.L=0,t.Zw=4*i/12,t.Qi.Os()}return this.M}zm(t){this.uv.style.cursor=t===1?"ew-resize":"default"}Uw(){let t=this.Gv.Qt(),e=t.N();e.leftPriceScale.visible||this.Lw===null||(this.Fw.removeChild(this.Lw.fv()),this.Lw.m(),this.Lw=null),e.rightPriceScale.visible||this.zw===null||(this.Ww.removeChild(this.zw.fv()),this.zw.m(),this.zw=null);let i={Jd:this.Gv.Qt().Jd()},n=()=>e.leftPriceScale.borderVisible&&t.Et().N().borderVisible,r=()=>t.af();e.leftPriceScale.visible&&this.Lw===null&&(this.Lw=new os("left",e,i,n,r),this.Fw.appendChild(this.Lw.fv())),e.rightPriceScale.visible&&this.zw===null&&(this.zw=new os("right",e,i,n,r),this.Ww.appendChild(this.zw.fv()))}},gc=!!Me&&!!navigator.userAgentData&&navigator.userAgentData.brands.some((s=>s.brand.includes("Chromium")))&&!!Me&&(navigator?.userAgentData?.platform?navigator.userAgentData.platform==="Windows":navigator.userAgent.toLowerCase().indexOf("win")>=0),lr=class{constructor(t,e,i){var n;this.nM=[],this.sM=[],this.eM=0,this.oo=0,this.k_=0,this.rM=0,this.hM=0,this.aM=null,this.lM=!1,this.$m=new F,this.jm=new F,this.wd=new F,this.oM=null,this._M=null,this.Kv=t,this.yn=e,this.Pu=i,this.jv=document.createElement("div"),this.jv.classList.add("tv-lightweight-charts"),this.jv.style.overflow="hidden",this.jv.style.direction="ltr",this.jv.style.width="100%",this.jv.style.height="100%",(n=this.jv).style.userSelect="none",n.style.webkitUserSelect="none",n.style.msUserSelect="none",n.style.MozUserSelect="none",n.style.webkitTapHighlightColor="transparent",this.uM=document.createElement("table"),this.uM.setAttribute("cellspacing","0"),this.jv.appendChild(this.uM),this.cM=this.dM.bind(this),on(this.yn)&&this.fM(!0),this.sn=new Xn(this.gd.bind(this),this.yn,i),this.Qt().Bd().i(this.pM.bind(this),this),this.vM=new ar(this,this.Pu),this.uM.appendChild(this.vM.fv());let r=e.autoSize&&this.mM(),o=this.yn.width,a=this.yn.height;if(r||o===0||a===0){let l=t.getBoundingClientRect();o=o||l.width,a=a||l.height}this.wM(o,a),this.MM(),t.appendChild(this.jv),this.gM(),this.sn.Et().Jc().i(this.sn.ka.bind(this.sn),this),this.sn.N_().i(this.sn.ka.bind(this.sn),this)}Qt(){return this.sn}N(){return this.yn}lv(){return this.nM}bM(){return this.vM}m(){this.fM(!1),this.eM!==0&&window.cancelAnimationFrame(this.eM),this.sn.Bd().u(this),this.sn.Et().Jc().u(this),this.sn.N_().u(this),this.sn.m();for(let t of this.nM)this.uM.removeChild(t.fv()),t.mw().u(this),t.ww().u(this),t.m();this.nM=[];for(let t of this.sM)this.SM(t);this.sM=[],M(this.vM).m(),this.jv.parentElement!==null&&this.jv.parentElement.removeChild(this.jv),this.wd.m(),this.$m.m(),this.jm.m(),this.xM()}wM(t,e,i=!1){if(this.oo===e&&this.k_===t)return;let n=(function(a){let l=Math.floor(a.width),h=Math.floor(a.height);return A({width:l-l%2,height:h-h%2})})(A({width:t,height:e}));this.oo=n.height,this.k_=n.width;let r=this.oo+"px",o=this.k_+"px";if(this.CM()||(M(this.jv).style.height=r,M(this.jv).style.width=o),this.uM.style.height=r,this.uM.style.width=o,i){this.eM!==0&&(window.cancelAnimationFrame(this.eM),this.eM=0),this.lM=!1;let a=Q.ys();this.aM!==null&&(a.Ss(this.aM),this.aM=null),this.yM(a,performance.now())}else this.sn.ka()}Rm(t){t===void 0&&(t=Q.ys());for(let e=0;e<this.nM.length;e++)this.nM[e].Rm(t._s(e).rs);this.yn.timeScale.visible&&this.vM.Rm(t.ls())}vr(t){let e=on(this.yn);this.sn.vr(t);let i=on(this.yn);i!==e&&this.fM(i),t.layout?.panes&&this.PM(),this.gM(),this.kM(t)}mw(){return this.$m}ww(){return this.jm}Bd(){return this.wd}TM(t=!1){this.aM!==null&&(this.yM(this.aM,performance.now()),this.aM=null);let e=this.RM(null),i=document.createElement("canvas");i.width=e.width,i.height=e.height;let n=M(i.getContext("2d"));return this.RM(n,t),i}DM(t){return t==="left"&&!this.IM()||t==="right"&&!this.VM()||this.nM.length===0?0:M(t==="left"?this.nM[0].yw():this.nM[0].Pw()).Tm()}CM(){return this.yn.autoSize&&this.oM!==null}Mv(){return this.jv}BM(t){this._M=t,this._M?this.Mv().style.setProperty("cursor",t):this.Mv().style.removeProperty("cursor")}EM(){return this._M}AM(t){return Z(this.nM[t]).pv()}PM(){this.sM.forEach((t=>{t.Pt()}))}kM(t){(t.autoSize!==void 0||!this.oM||t.width===void 0&&t.height===void 0)&&(t.autoSize&&!this.oM&&this.mM(),t.autoSize===!1&&this.oM!==null&&this.xM(),t.autoSize||t.width===void 0&&t.height===void 0||this.wM(t.width||this.k_,t.height||this.oo))}RM(t,e){let i=0,n=0,r=this.nM[0],o=(l,h)=>{let c=0;for(let u=0;u<this.nM.length;u++){let d=this.nM[u],m=M(l==="left"?d.yw():d.Pw()),f=m.vv();if(t!==null&&m.mv(t,h,c,e),c+=f.height,u<this.nM.length-1){let p=this.sM[u],b=p.vv();t!==null&&p.mv(t,h,c),c+=b.height}}};this.IM()&&(o("left",0),i+=M(r.yw()).vv().width);for(let l=0;l<this.nM.length;l++){let h=this.nM[l],c=h.vv();if(t!==null&&h.mv(t,i,n,e),n+=c.height,l<this.nM.length-1){let u=this.sM[l],d=u.vv();t!==null&&u.mv(t,i,n),n+=d.height}}i+=r.vv().width,this.VM()&&(o("right",i),i+=M(r.Pw()).vv().width);let a=(l,h,c)=>{M(l==="left"?this.vM.$w():this.vM.jw()).mv(M(t),h,c)};if(this.yn.timeScale.visible){let l=this.vM.vv();if(t!==null){let h=0;this.IM()&&(a("left",h,n),h=M(r.yw()).vv().width),this.vM.mv(t,h,n,e),h+=l.width,this.VM()&&a("right",h,n)}n+=l.height}return A({width:i,height:n})}LM(){let t=0,e=0,i=0;for(let b of this.nM)this.IM()&&(e=Math.max(e,M(b.yw()).Cm(),this.yn.leftPriceScale.minimumWidth)),this.VM()&&(i=Math.max(i,M(b.Pw()).Cm(),this.yn.rightPriceScale.minimumWidth)),t+=b.F_();e=er(e),i=er(i);let n=this.k_,r=this.oo,o=Math.max(n-e-i,0),a=1*this.sM.length,l=this.yn.timeScale.visible,h=l?Math.max(this.vM.Kw(),this.yn.timeScale.minimumHeight):0;var c;h=(c=h)+c%2;let u=a+h,d=r<u?0:r-u,m=d/t,f=0,p=window.devicePixelRatio||1;for(let b=0;b<this.nM.length;++b){let v=this.nM[b];v.ew(this.sn.Gn()[b]);let y=0,_=0;_=b===this.nM.length-1?Math.ceil((d-f)*p)/p:Math.round(v.F_()*m*p)/p,y=Math.max(_,2),f+=y,v.km(A({width:o,height:y})),this.IM()&&v.gw(e,"left"),this.VM()&&v.gw(i,"right"),v.yv()&&this.sn.Ed(v.yv(),y)}this.vM.Yw(A({width:l?o:0,height:h}),l?e:0,l?i:0),this.sn.H_(o),this.rM!==e&&(this.rM=e),this.hM!==i&&(this.hM=i)}fM(t){t?this.jv.addEventListener("wheel",this.cM,{passive:!1}):this.jv.removeEventListener("wheel",this.cM)}zM(t){switch(t.deltaMode){case t.DOM_DELTA_PAGE:return 120;case t.DOM_DELTA_LINE:return 32}return gc?1/window.devicePixelRatio:1}dM(t){if(!(t.deltaX!==0&&this.yn.handleScroll.mouseWheel||t.deltaY!==0&&this.yn.handleScale.mouseWheel))return;let e=this.zM(t),i=e*t.deltaX/100,n=-e*t.deltaY/100;if(t.cancelable&&t.preventDefault(),n!==0&&this.yn.handleScale.mouseWheel){let r=Math.sign(n)*Math.min(1,Math.abs(n)),o=t.clientX-this.jv.getBoundingClientRect().left;this.Qt().Wd(o,r)}i!==0&&this.yn.handleScroll.mouseWheel&&this.Qt().Hd(-80*i)}yM(t,e){let i=t.ls();i===3&&this.OM(),i!==3&&i!==2||(this.NM(t),this.FM(t,e),this.vM.Pt(),this.nM.forEach((n=>{n.hw()})),this.aM?.ls()===3&&(this.aM.Ss(t),this.OM(),this.NM(this.aM),this.FM(this.aM,e),t=this.aM,this.aM=null)),this.Rm(t)}FM(t,e){for(let i of t.bs())this.xs(i,e)}NM(t){let e=this.sn.Gn();for(let i=0;i<e.length;i++)t._s(i).hs&&e[i].lu()}xs(t,e){let i=this.sn.Et();switch(t.ds){case 0:i.td();break;case 1:i.nd(t.Wt);break;case 2:i.Ms(t.Wt);break;case 3:i.gs(t.Wt);break;case 4:i.Wc();break;case 5:t.Wt.Kc(e)||i.gs(t.Wt.Gc(e))}}gd(t){this.aM!==null?this.aM.Ss(t):this.aM=t,this.lM||(this.lM=!0,this.eM=window.requestAnimationFrame((e=>{if(this.lM=!1,this.eM=0,this.aM!==null){let i=this.aM;this.aM=null,this.yM(i,e);for(let n of i.bs())if(n.ds===5&&!n.Wt.Kc(e)){this.Qt().ps(n.Wt);break}}})))}OM(){this.MM()}SM(t){this.uM.removeChild(t.fv()),t.m()}MM(){let t=this.sn.Gn(),e=t.length,i=this.nM.length;for(let n=e;n<i;n++){let r=Z(this.nM.pop());this.uM.removeChild(r.fv()),r.mw().u(this),r.ww().u(this),r.m();let o=this.sM.pop();o!==void 0&&this.SM(o)}for(let n=i;n<e;n++){let r=new or(this,t[n]);if(r.mw().i(this.WM.bind(this,r),this),r.ww().i(this.HM.bind(this,r),this),this.nM.push(r),n>0){let o=new ir(this,n-1,n);this.sM.push(o),this.uM.insertBefore(o.fv(),this.vM.fv())}this.uM.insertBefore(r.fv(),this.vM.fv())}for(let n=0;n<e;n++){let r=t[n],o=this.nM[n];o.yv()!==r?o.ew(r):o.sw()}this.gM(),this.LM()}UM(t,e,i,n){let r=new Map;t!==null&&this.sn.Jn().forEach((c=>{let u=c.Un().Hn(t);u!==null&&r.set(c,u)}));let o;if(t!==null){let c=this.sn.Et().en(t)?.originalTime;c!==void 0&&(o=c)}let a=this.Qt().cu(),l=this.$M(n),h=(function(c,u){let d=c!==null&&c.uu instanceof Se?c.uu:void 0,m=c?.bu?.te,f=u!==void 0&&u!==-1?u:void 0;return c===null||c.ee===void 0?{jM:d,qM:m}:{jM:d,qM:m,YM:{ds:c.ee,KM:(p=c.uu,b=c.ee,p instanceof si?"pane-primitive":b==="marker"||b==="primitive"?"series-primitive":"series"),GM:hc(c.ee,m),Y_:d,ZM:m,XM:f}};var p,b})(a,l);return{Qr:o,$n:t??void 0,JM:e??void 0,XM:l!==-1?l:void 0,jM:h.jM,QM:r,qM:h.qM,YM:h.YM,tg:i??void 0}}$M(t){let e=-1;if(t)e=this.nM.indexOf(t);else{let i=this.Qt().Vd().Kn();i!==null&&(e=this.Qt().Gn().indexOf(i))}return e}WM(t,e,i,n){this.$m.p((()=>this.UM(e,i,n,t)))}HM(t,e,i,n){this.jm.p((()=>this.UM(e,i,n,t)))}pM(t,e,i){this.BM(this.Qt().cu()?.gu??null),this.wd.p((()=>this.UM(t,e,i)))}gM(){let t=this.yn.timeScale.visible?"":"none";this.vM.fv().style.display=t}IM(){return this.nM[0].yv().X_().N().visible}VM(){return this.nM[0].yv().J_().N().visible}mM(){return"ResizeObserver"in window&&(this.oM=new ResizeObserver((t=>{let e=t[t.length-1];if(!e)return;let i=e.contentRect.width,n=e.contentRect.height;this.wM(i,n,!0)})),this.oM.observe(this.Kv,{box:"border-box"}),!0)}xM(){this.oM!==null&&this.oM.disconnect(),this.oM=null}};function on(s){return!!(s.handleScroll.mouseWheel||s.handleScale.mouseWheel)}function vc(s){return s.open===void 0&&s.value===void 0}function bc(s){return(function(t){return t.open!==void 0})(s)||(function(t){return t.value!==void 0})(s)}function sl(s,t,e,i){let n=e.value,r={$n:t,wt:s,Wt:[n,n,n,n],Qr:i};return e.color!==void 0&&(r.R=e.color),r}function wc(s,t,e,i){let n=e.value,r={$n:t,wt:s,Wt:[n,n,n,n],Qr:i};return e.lineColor!==void 0&&(r.vt=e.lineColor),e.topColor!==void 0&&(r.ah=e.topColor),e.bottomColor!==void 0&&(r.oh=e.bottomColor),r}function yc(s,t,e,i){let n=e.value,r={$n:t,wt:s,Wt:[n,n,n,n],Qr:i};return e.topLineColor!==void 0&&(r._h=e.topLineColor),e.bottomLineColor!==void 0&&(r.uh=e.bottomLineColor),e.topFillColor1!==void 0&&(r.dh=e.topFillColor1),e.topFillColor2!==void 0&&(r.fh=e.topFillColor2),e.bottomFillColor1!==void 0&&(r.ph=e.bottomFillColor1),e.bottomFillColor2!==void 0&&(r.mh=e.bottomFillColor2),r}function xc(s,t,e,i){let n={$n:t,wt:s,Wt:[e.open,e.high,e.low,e.close],Qr:i};return e.color!==void 0&&(n.R=e.color),n}function Cc(s,t,e,i){let n={$n:t,wt:s,Wt:[e.open,e.high,e.low,e.close],Qr:i};return e.color!==void 0&&(n.R=e.color),e.borderColor!==void 0&&(n.Ht=e.borderColor),e.wickColor!==void 0&&(n.hh=e.wickColor),n}function Sc(s,t,e,i,n){let r=Z(n)(e),o=Math.max(...r),a=Math.min(...r),l=r[r.length-1],h=[l,o,a,l],{time:c,color:u,...d}=e;return{$n:t,wt:s,Wt:h,Qr:i,ue:d,R:u}}function pe(s){return s.Wt!==void 0}function nl(s,t){return t.customValues!==void 0&&(s.ig=t.customValues),s}function te(s){return(t,e,i,n,r,o)=>(function(a,l){return l?l(a):vc(a)})(i,o)?nl({wt:t,$n:e,Qr:n},i):nl(s(t,e,i,n,r),i)}function rl(s){return{Candlestick:te(Cc),Bar:te(xc),Area:te(wc),Baseline:te(yc),Histogram:te(sl),Line:te(sl),Custom:te(Sc)}[s]}function ol(s){return{$n:0,ng:new Map,Oa:s}}function al(s,t){if(s!==void 0&&s.length!==0)return{sg:t.key(s[0].wt),eg:t.key(s[s.length-1].wt)}}function ll(s){let t;return s.forEach((e=>{t===void 0&&(t=e.Qr)})),Z(t)}var hr=class{constructor(t){this.rg=new Map,this.hg=new Map,this.ag=new Map,this.lg=[],this.Pu=t}m(){this.rg.clear(),this.hg.clear(),this.ag.clear(),this.lg=[]}og(t,e){let i=this.rg.size!==0,n=!1,r=this.hg.get(t);if(r!==void 0)if(this.hg.size===1)i=!1,n=!0,this.rg.clear();else for(let l of this.lg)l.pointData.ng.delete(t)&&(n=!0);let o=[];if(e.length!==0){let l=e.map((m=>m.time)),h=this.Pu.createConverterToInternalObj(e),c=rl(t.bh()),u=t.ul(),d=t.cl();o=e.map(((m,f)=>{let p=h(m.time),b=this.Pu.key(p),v=this.rg.get(b);v===void 0&&(v=ol(p),this.rg.set(b,v),n=!0);let y=c(p,v.$n,m,l[f],u,d);return v.ng.set(t,y),y}))}i&&this._g(),this.ug(t,o);let a=-1;if(n){let l=[];this.rg.forEach((h=>{l.push({timeWeight:0,time:h.Oa,pointData:h,originalTime:ll(h.ng)})})),l.sort(((h,c)=>this.Pu.key(h.time)-this.Pu.key(c.time))),a=this.cg(l)}return this.dg(t,a,(function(l,h,c){let u=al(l,c),d=al(h,c);if(u!==void 0&&d!==void 0)return{fg:!1,Va:u.eg>=d.eg&&u.sg>=d.sg}})(this.hg.get(t),r,this.Pu))}if(t){return this.og(t,[])}pg(t,e,i){if(i&&t.Fa())throw new Error("Historical updates are not supported when conflation is enabled. Conflation requires data to be processed in order.");let n=e;(function(v){v.Qr===void 0&&(v.Qr=v.time)})(n),this.Pu.preprocessData(e);let r=this.Pu.createConverterToInternalObj([e])(e.time),o=this.ag.get(t);if(!i&&o!==void 0&&this.Pu.key(r)<this.Pu.key(o))throw new Error(`Cannot update oldest data, last time=${o}, new time=${r}`);let a=this.rg.get(this.Pu.key(r));if(i&&a===void 0)throw new Error("Cannot update non-existing data point when historicalUpdate is true");let l=a===void 0;a===void 0&&(a=ol(r),this.rg.set(this.Pu.key(r),a));let h=rl(t.bh()),c=t.ul(),u=t.cl(),d=h(r,a.$n,e,n.Qr,c,u),m=!i&&!l&&o!==void 0&&this.Pu.key(r)===this.Pu.key(o);a.ng.set(t,d),i?this.vg(t,d,a.$n):m&&t.Fa()&&pe(d)?(t.Rr(d),this.mg(t,d)):this.mg(t,d);let f={Va:pe(d),fg:i};if(!l)return this.dg(t,-1,f);let p={timeWeight:0,time:a.Oa,pointData:a,originalTime:ll(a.ng)},b=se(this.lg,this.Pu.key(p.time),((v,y)=>this.Pu.key(v.time)<y));this.lg.splice(b,0,p);for(let v=b;v<this.lg.length;++v)Vi(this.lg[v].pointData,v);return this.Pu.fillWeightsForPoints(this.lg,b),this.dg(t,b,f)}wg(t,e){let i=this.hg.get(t);if(i===void 0||e<=0)return[[],this.Mg()];e=Math.min(e,i.length);let n=i.splice(-e).reverse();i.length===0?this.ag.delete(t):this.ag.set(t,i[i.length-1].wt);for(let r of n){let o=this.rg.get(this.Pu.key(r.wt));if(o&&(o.ng.delete(t),o.ng.size===0)){this.rg.delete(this.Pu.key(o.Oa)),this.lg.splice(o.$n,1);for(let a=o.$n;a<this.lg.length;++a)Vi(this.lg[a].pointData,a)}}return[n,this.dg(t,this.lg.length-1,{fg:!1,Va:!1})]}mg(t,e){let i=this.hg.get(t);i===void 0&&(i=[],this.hg.set(t,i));let n=i.length!==0?i[i.length-1]:null;n===null||this.Pu.key(e.wt)>this.Pu.key(n.wt)?pe(e)&&i.push(e):pe(e)?i[i.length-1]=e:i.splice(-1,1),this.ag.set(t,e.wt)}vg(t,e,i){let n=this.hg.get(t);if(n===void 0)return;let r=se(n,i,((o,a)=>o.$n<a));pe(e)?n[r]=e:n.splice(r,1)}ug(t,e){e.length!==0?(this.hg.set(t,e.filter(pe)),this.ag.set(t,e[e.length-1].wt)):(this.hg.delete(t),this.ag.delete(t))}_g(){for(let t of this.lg)t.pointData.ng.size===0&&this.rg.delete(this.Pu.key(t.time))}cg(t){let e=-1;for(let i=0;i<this.lg.length&&i<t.length;++i){let n=this.lg[i],r=t[i];if(this.Pu.key(n.time)!==this.Pu.key(r.time)){e=i;break}r.timeWeight=n.timeWeight,Vi(r.pointData,i)}if(e===-1&&this.lg.length!==t.length&&(e=Math.min(this.lg.length,t.length)),e===-1)return-1;for(let i=e;i<t.length;++i)Vi(t[i].pointData,i);return this.Pu.fillWeightsForPoints(t,e),this.lg=t,e}gg(){if(this.hg.size===0)return null;let t=0;return this.hg.forEach((e=>{e.length!==0&&(t=Math.max(t,e[e.length-1].$n))})),t}dg(t,e,i){let n=this.Mg();if(e!==-1)this.hg.forEach(((r,o)=>{n.Y_.set(o,{ue:r,bg:o===t?i:void 0})})),this.hg.has(t)||n.Y_.set(t,{ue:[],bg:i}),n.Et.Sg=this.lg,n.Et.xg=e;else{let r=this.hg.get(t);n.Y_.set(t,{ue:r||[],bg:i})}return n}Mg(){return{Y_:new Map,Et:{Dc:this.gg()}}}};function Vi(s,t){s.$n=t,s.ng.forEach((e=>{e.$n=t}))}function Mc(s,t){return s._t<t}function _c(s,t){return t<s._t}function cr(s,t,e,i){return se(s,t,Mc,e,i)}function ur(s,t,e,i){return Sr(s,t,_c,e,i)}function Di(s,t,e){return{ne:s,se:t,ee:e}}function hl(s,t,e,i){return s>=t-i&&s<=e+i}function Ge(s,t,e,i,n,r){let o=n-e,a=r-i;if(o===0&&a===0)return Math.hypot(s-e,t-i);let l=((s-e)*o+(t-i)*a)/(o*o+a*a),h=Math.max(0,Math.min(1,l)),c=e+o*h,u=i+a*h;return Math.hypot(s-c,t-u)}var an=[0,0];function Lc(s,t,e){return t===void 0||t.wt!==s.wt-1?s._t-e/2:(t._t+s._t)/2}function Ec(s,t,e){return t===void 0||t.wt!==s.wt+1?s._t+e/2:(s._t+t._t)/2}function kc(s,t,e,i,n,r,o){if(t===null||t.from>=t.to||s.length===0)return null;let a=n/2+r,l=cr(s,e-a,t.from,t.to),h=ur(s,e+a,l,t.to);if(l>=h)return null;let c=Number.POSITIVE_INFINITY;for(let u=l;u<h;u++){let d=s[u],m=u>t.from?s[u-1]:void 0,f=u<t.to-1?s[u+1]:void 0,p=Lc(d,m,n)-r,b=Ec(d,f,n)+r;if(e<p||e>b)continue;o(d,an);let v=an[0],y=an[1],_=Math.min(v,y),S=Math.max(v,y),k=_-r,C=S+r;if(i>=_&&i<=S)c=Math.min(c,0);else if(i>=k&&i<=C){let L=Math.min(Math.abs(i-_),Math.abs(S-i));c=Math.min(c,L)}}return Number.isFinite(c)?Di(c,0,"series-range"):null}function zc(s,t){return s.wt<t}function Tc(s,t){return t<s.wt}function Pc(s,t,e){let i=t.Na(),n=t.bi(),r=se(s,i,zc),o=Sr(s,n,Tc);if(!e)return{from:r,to:o};let a=r,l=o;return r>0&&r<s.length&&s[r].wt>=i&&(a=r-1),o>0&&o<s.length&&s[o-1].wt<=n&&(l=o+1),{from:a,to:l}}var as=class{constructor(t,e,i){this.Cg=!0,this.yg=!0,this.Pg=!0,this.kg=[],this.Tg=null,this.Rg=-1,this.ae=t,this.le=e,this.Dg=i}Pt(t){this.Cg=!0,t==="data"&&(this.yg=!0),t==="options"&&(this.Pg=!0)}Tt(){return this.ae.It()?(this.Ig(),this.Tg===null?null:this.Vg):null}Qs(t,e){return this.ae.It()?(this.Ig(),this.Tg===null?null:this.Bg(t,e)):null}Bg(t,e){return null}Eg(){this.kg=this.kg.map((t=>({...t,...this.ae.Sa().Sh(t.wt)})))}Ag(){this.Tg=null}Ig(){let t=this.le.Et(),e=t.N().enableConflation?t.sd():0;e!==this.Rg&&(this.yg=!0,this.Rg=e),this.yg&&(this.Lg(),this.yg=!1),this.Pg&&(this.Eg(),this.Pg=!1),this.Cg&&(this.zg(),this.Cg=!1)}zg(){let t=this.ae.Ft(),e=this.le.Et();if(this.Ag(),e.Zi()||t.Zi())return;let i=e.Ee();if(i===null||this.ae.Un().Th()===0)return;let n=this.ae.Lt();n!==null&&(this.Tg=Pc(this.kg,i,this.Dg),this.Og(t,e,n.Wt),this.Ng())}},dr=class{constructor(t,e){this.Fg=t,this.Ki=e}st(t,e,i){this.Fg.draw(t,this.Ki,e,i)}};function Ac(s){switch(s){case"point":return 2;case"range":return 0;default:return 1}}var mr=class extends as{constructor(t,e,i){super(t,e,!1),this.Yh=i,this.Fg=this.Yh.renderer(),this.Vg=new dr(this.Fg,(n=>this.Wg(n)))}get ga(){return this.Yh.conflationReducer}Ha(t){return this.Yh.priceValueBuilder(t)}dl(t){return this.Yh.isWhitespace(t)}Bg(t,e){let i=this.Fg.hitTest?.(t,e,(o=>this.Wg(o)));if(i!=null)return{ne:(n=i).distance,se:Ac(n.type),ee:"custom",gu:n.cursorStyle,te:n.objectId,ie:n.hitTestData};var n;let r=kc(this.kg,this.Tg,t,e,this.le.Et().ml(),this.ae.N().hitTestTolerance,((o,a)=>{let l=o.Hg,h=NaN,c=NaN;if(l!==void 0&&!this.Yh.isWhitespace(l))for(let u of this.Yh.priceValueBuilder(l)){let d=this.Wg(u);d!==null&&(h=Number.isNaN(h)?d:Math.min(h,d),c=Number.isNaN(c)?d:Math.max(c,d))}a[0]=h,a[1]=c}));return r===null?null:{...r,ee:"custom"}}Lg(){let t=this.ae.Sa();this.kg=this.ae.Ua().Bh().map((e=>({wt:e.$n,_t:NaN,...t.Sh(e.$n),Hg:e.ue})))}Og(t,e){e.Ic(this.kg,cn(this.Tg))}Ng(){this.Yh.update({bars:this.kg.map($c),barSpacing:this.le.Et().ml(),visibleRange:this.Tg,conflationFactor:this.le.Et().sd()},this.ae.N())}Wg(t){let e=this.ae.Lt();return e===null?null:this.ae.Ft().Nt(t,e.Wt)}};function $c(s){return{x:s._t,time:s.wt,originalData:s.Hg,barColor:s.sh}}var Rc={color:"#2196f3"},Nc=(s,t,e)=>{let i=It(e);return new mr(s,t,i)};function Lr(s){let t={value:s.Wt[3],time:s.Qr};return s.ig!==void 0&&(t.customValues=s.ig),t}function cl(s){let t=Lr(s);return s.R!==void 0&&(t.color=s.R),t}function Oc(s){let t=Lr(s);return s.vt!==void 0&&(t.lineColor=s.vt),s.ah!==void 0&&(t.topColor=s.ah),s.oh!==void 0&&(t.bottomColor=s.oh),t}function Fc(s){let t=Lr(s);return s._h!==void 0&&(t.topLineColor=s._h),s.uh!==void 0&&(t.bottomLineColor=s.uh),s.dh!==void 0&&(t.topFillColor1=s.dh),s.fh!==void 0&&(t.topFillColor2=s.fh),s.ph!==void 0&&(t.bottomFillColor1=s.ph),s.mh!==void 0&&(t.bottomFillColor2=s.mh),t}function kl(s){let t={open:s.Wt[0],high:s.Wt[1],low:s.Wt[2],close:s.Wt[3],time:s.Qr};return s.ig!==void 0&&(t.customValues=s.ig),t}function Ic(s){let t=kl(s);return s.R!==void 0&&(t.color=s.R),t}function Bc(s){let t=kl(s),{R:e,Ht:i,hh:n}=s;return e!==void 0&&(t.color=e),i!==void 0&&(t.borderColor=i),n!==void 0&&(t.wickColor=n),t}function Wi(s){return{Area:Oc,Line:cl,Baseline:Fc,Histogram:cl,Bar:Ic,Candlestick:Bc,Custom:Vc}[s]}function Vc(s){let t=s.Qr;return{...s.ue,time:t}}var qc={vertLine:{color:"#9598A1",width:1,style:3,visible:!0,labelVisible:!0,labelBackgroundColor:"#131722"},horzLine:{color:"#9598A1",width:1,style:3,visible:!0,labelVisible:!0,labelBackgroundColor:"#131722"},mode:1,doNotSnapToHiddenSeriesIndices:!1},Dc={vertLines:{color:"#D6DCDE",style:0,visible:!0},horzLines:{color:"#D6DCDE",style:0,visible:!0}},Wc={background:{type:"solid",color:"#FFFFFF"},textColor:"#191919",fontSize:12,fontFamily:bl,panes:{enableResize:!0,separatorColor:"#E0E3EB",separatorHoverColor:"rgba(178, 181, 189, 0.2)"},attributionLogo:!0,colorSpace:"srgb",colorParsers:[]},ln={autoScale:!0,mode:0,invertScale:!1,alignLabels:!0,borderVisible:!0,borderColor:"#2B2B43",entireTextOnly:!1,visible:!1,ticksVisible:!1,scaleMargins:{bottom:.1,top:.2},minimumWidth:0,ensureEdgeTickMarksVisible:!1,tickMarkDensity:2.5},Uc={rightOffset:0,barSpacing:6,minBarSpacing:.5,maxBarSpacing:0,fixLeftEdge:!1,fixRightEdge:!1,lockVisibleTimeRangeOnResize:!1,rightBarStaysOnScroll:!1,borderVisible:!0,borderColor:"#2B2B43",visible:!0,timeVisible:!1,secondsVisible:!0,shiftVisibleRangeOnNewBar:!0,allowShiftVisibleRangeOnWhitespaceReplacement:!1,ticksVisible:!1,uniformDistribution:!1,minimumHeight:0,allowBoldLabels:!0,ignoreWhitespaceIndices:!1,enableConflation:!1,conflationThresholdFactor:1,precomputeConflationOnInit:!1,precomputeConflationPriority:"background"};function ul(){return{addDefaultPane:!0,hoveredSeriesOnTop:!0,width:0,height:0,autoSize:!1,layout:Wc,crosshair:qc,grid:Dc,overlayPriceScales:{...ln},leftPriceScale:{...ln,visible:!1},rightPriceScale:{...ln,visible:!0},defaultVisiblePriceScaleId:"right",timeScale:Uc,localization:{locale:Me?navigator.language:"",dateFormat:"dd MMM 'yy"},handleScroll:{mouseWheel:!0,pressedMouseMove:!0,horzTouchDrag:!0,vertTouchDrag:!0},handleScale:{axisPressedMouseMove:{time:!0,price:!0},axisDoubleClickReset:{time:!0,price:!0},mouseWheel:!0,pinch:!0},kineticScroll:{mouse:!1,touch:!0},trackingMode:{exitMode:1}}}var ls=class{constructor(t,e,i){this.hv=t,this.Ug=e,this.$g=i??0}applyOptions(t){this.hv.Qt().Dd(this.Ug,t,this.$g)}options(){return this.Ki().N()}width(){return us(this.Ug)?this.hv.DM(this.Ug):0}setVisibleRange(t){this.setAutoScale(!1),this.Ki().Go(new st(t.from,t.to))}getVisibleRange(){let t,e,i=this.Ki().ar();if(i===null)return null;if(this.Ki().ho()){let n=this.Ki().S_(),r=_l(n);i=ve(i,this.Ki().lo()),t=Number((Math.round(i.Je()/n)*n).toFixed(r)),e=Number((Math.round(i.Qe()/n)*n).toFixed(r))}else t=i.Je(),e=i.Qe();return{from:t,to:e}}setAutoScale(t){this.applyOptions({autoScale:t})}Ki(){return M(this.hv.Qt().Id(this.Ug,this.$g)).Ft}},fr=class{constructor(t,e,i,n){this.hv=t,this.yt=i,this.jg=e,this.qg=n}getHeight(){return this.yt.$t()}setHeight(t){let e=this.hv.Qt(),i=e._f(this.yt);e.Ld(i,t)}getStretchFactor(){return this.yt.F_()}setStretchFactor(t){this.yt.W_(t),this.hv.Qt().ka()}paneIndex(){return this.hv.Qt()._f(this.yt)}moveTo(t){let e=this.paneIndex();e!==t&&(Y(t>=0&&t<this.hv.lv().length,"Invalid pane index"),this.hv.Qt().Od(e,t))}getSeries(){return this.yt.Y_().map((t=>this.jg(t)))??[]}getHTMLElement(){let t=this.hv.lv();return t&&t.length!==0&&t[this.paneIndex()]?t[this.paneIndex()].fv():null}attachPrimitive(t){this.yt.ol(t),t.attached&&t.attached({chart:this.qg,requestUpdate:()=>this.yt.Qt().ka()})}detachPrimitive(t){this.yt._l(t)}priceScale(t){if(this.yt.O_(t)===null)throw new Error(`Cannot find price scale with id: ${t}`);return new ls(this.hv,t,this.paneIndex())}setPreserveEmptyPane(t){this.yt.j_(t)}preserveEmptyPane(){return this.yt.q_()}addCustomSeries(t,e={},i=0){return this.qg.addCustomSeries(t,e,i)}addSeries(t,e={}){return this.qg.addSeries(t,e,this.paneIndex())}},Hc={color:"#FF0000",price:0,lineStyle:2,lineWidth:1,lineVisible:!0,axisLabelVisible:!0,title:"",axisLabelColor:"",axisLabelTextColor:""},hs=class{constructor(t){this._r=t}applyOptions(t){this._r.vr(t)}options(){return this._r.N()}Yg(){return this._r}},pr=class{constructor(t,e,i,n,r,o){this.Kg=new F,this.ae=t,this.Gg=e,this.Zg=i,this.Pu=r,this.qg=n,this.Xg=o}m(){this.Kg.m()}priceFormatter(){return this.ae.sl()}priceToCoordinate(t){let e=this.ae.Lt();return e===null?null:this.ae.Ft().Nt(t,e.Wt)}coordinateToPrice(t){let e=this.ae.Lt();return e===null?null:this.ae.Ft().Tn(t,e.Wt)}barsInLogicalRange(t){if(t===null)return null;let e=new be(new ee(t.from,t.to)).Uu(),i=this.ae.Un();if(i.Zi())return null;let n=i.Hn(e.Na(),1),r=i.Hn(e.bi(),-1),o=M(i.Rh()),a=M(i.Qn());if(n!==null&&r!==null&&n.$n>r.$n)return{barsBefore:t.from-o,barsAfter:a-t.to};let l={barsBefore:n===null||n.$n===o?t.from-o:n.$n-o,barsAfter:r===null||r.$n===a?a-t.to:a-r.$n};return n!==null&&r!==null&&(l.from=n.Qr,l.to=r.Qr),l}setData(t){this.Pu,this.ae.bh(),this.Gg.Jg(this.ae,t),this.Qg("full")}update(t,e=!1){this.ae.bh(),this.Gg.tb(this.ae,t,e),this.Qg("update")}pop(t=1){let e=this.Gg.ib(this.ae,t);e.length!==0&&this.Qg("update");let i=Wi(this.seriesType());return e.map((n=>i(n)))}dataByIndex(t,e){let i=this.ae.Un().Hn(t,e);return i===null?null:Wi(this.seriesType())(i)}data(){let t=Wi(this.seriesType());return this.ae.Un().Bh().map((e=>t(e)))}subscribeDataChanged(t){this.Kg.i(t)}unsubscribeDataChanged(t){this.Kg._(t)}applyOptions(t){this.ae.vr(t)}options(){return zt(this.ae.N())}priceScale(){return this.Zg.priceScale(this.ae.Ft().pl(),this.getPane().paneIndex())}createPriceLine(t){let e=it(zt(Hc),t),i=this.ae.Ea(e);return new hs(i)}removePriceLine(t){this.ae.Aa(t.Yg())}priceLines(){return this.ae.La().map((t=>new hs(t)))}seriesType(){return this.ae.bh()}lastValueData(t){let e=this.ae.Ae(t);return e.Le?{noData:!0}:{noData:!1,price:e.Mt,color:e.R}}attachPrimitive(t){this.ae.ol(t),t.attached&&t.attached({chart:this.qg,series:this,requestUpdate:()=>this.ae.Qt().ka(),horzScaleBehavior:this.Pu})}detachPrimitive(t){this.ae._l(t),t.detached&&t.detached(),this.ae.Qt().ka()}getPane(){let t=this.ae,e=M(this.ae.Qt().Ks(t));return this.Xg(e)}moveToPane(t){this.ae.Qt().rf(this.ae,t)}seriesOrder(){let t=this.ae.Qt().Ks(this.ae);return t===null?-1:t.Y_().indexOf(this.ae)}setSeriesOrder(t){let e=this.ae.Qt().Ks(this.ae);e!==null&&e.vu(this.ae,t)}Qg(t){this.Kg.v()&&this.Kg.p(t)}},gr=class{constructor(t,e,i){this.nb=new F,this.Qu=new F,this.Nw=new F,this.sn=t,this.ia=t.Et(),this.vM=e,this.ia.Zc().i(this.sb.bind(this)),this.ia.Xc().i(this.eb.bind(this)),this.vM.qw().i(this.rb.bind(this)),this.Pu=i}m(){this.ia.Zc().u(this),this.ia.Xc().u(this),this.vM.qw().u(this),this.nb.m(),this.Qu.m(),this.Nw.m()}scrollPosition(){return this.ia.Oc()}scrollToPosition(t,e){e?this.ia.Yc(t,1e3):this.sn.gs(t)}scrollToRealTime(){this.ia.qc()}getVisibleRange(){let t=this.ia.xc();return t===null?null:{from:t.from.originalTime,to:t.to.originalTime}}setVisibleRange(t){let e={from:this.Pu.convertHorzItemToInternal(t.from),to:this.Pu.convertHorzItemToInternal(t.to)},i=this.ia.kc(e);this.sn.sf(i)}getVisibleLogicalRange(){let t=this.ia.Sc();return t===null?null:{from:t.Na(),to:t.bi()}}setVisibleLogicalRange(t){Y(t.from<=t.to,"The from index cannot be after the to index."),this.sn.sf(t)}resetTimeScale(){this.sn.ws()}fitContent(){this.sn.td()}logicalToCoordinate(t){let e=this.sn.Et();return e.Zi()?null:e.jt(t)}coordinateToLogical(t){return this.ia.Zi()?null:this.ia.Vc(t)}timeToIndex(t,e){let i=this.Pu.convertHorzItemToInternal(t);return this.ia.Mc(i,e)}timeToCoordinate(t){let e=this.timeToIndex(t,!1);return e===null?null:this.ia.jt(e)}coordinateToTime(t){let e=this.sn.Et(),i=e.Vc(t),n=e.en(i);return n===null?null:n.originalTime}width(){return this.vM.pv().width}height(){return this.vM.pv().height}subscribeVisibleTimeRangeChange(t){this.nb.i(t)}unsubscribeVisibleTimeRangeChange(t){this.nb._(t)}subscribeVisibleLogicalRangeChange(t){this.Qu.i(t)}unsubscribeVisibleLogicalRangeChange(t){this.Qu._(t)}subscribeSizeChange(t){this.Nw.i(t)}unsubscribeSizeChange(t){this.Nw._(t)}applyOptions(t){this.ia.vr(t)}options(){return{...zt(this.ia.N()),barSpacing:this.ia.ml()}}sb(){this.nb.v()&&this.nb.p(this.getVisibleRange())}eb(){this.Qu.v()&&this.Qu.p(this.getVisibleLogicalRange())}rb(t){this.Nw.p(t.width,t.height)}};function dl(s){return(function(t){if(Pi(t.handleScale)){let i=t.handleScale;t.handleScale={axisDoubleClickReset:{time:i,price:i},axisPressedMouseMove:{time:i,price:i},mouseWheel:i,pinch:i}}else if(t.handleScale!==void 0){let{axisPressedMouseMove:i,axisDoubleClickReset:n}=t.handleScale;Pi(i)&&(t.handleScale.axisPressedMouseMove={time:i,price:i}),Pi(n)&&(t.handleScale.axisDoubleClickReset={time:n,price:n})}let e=t.handleScroll;Pi(e)&&(t.handleScroll={horzTouchDrag:e,vertTouchDrag:e,mouseWheel:e,pressedMouseMove:e})})(s),s}var vr=class{constructor(t,e,i){this.hb=new Map,this.ab=new Map,this.lb=new F,this.ob=new F,this._b=new F,this.dd=new WeakMap,this.ub=new hr(e);let n=i===void 0?zt(ul()):it(zt(ul()),dl(i));this.cb=e,this.hv=new lr(t,n,e),this.hv.mw().i((o=>{this.lb.v()&&this.lb.p(this.fb(o()))}),this),this.hv.ww().i((o=>{this.ob.v()&&this.ob.p(this.fb(o()))}),this),this.hv.Bd().i((o=>{this._b.v()&&this._b.p(this.fb(o()))}),this);let r=this.hv.Qt();this.pb=new gr(r,this.hv.bM(),this.cb)}remove(){this.hv.mw().u(this),this.hv.ww().u(this),this.hv.Bd().u(this),this.pb.m(),this.hv.m(),this.hb.clear(),this.ab.clear(),this.lb.m(),this.ob.m(),this._b.m(),this.ub.m()}resize(t,e,i){this.autoSizeActive()||this.hv.wM(t,e,i)}addCustomSeries(t,e={},i=0){let n=(r=>({type:"Custom",isBuiltIn:!1,defaultOptions:{...Rc,...r.defaultOptions()},mb:Nc,wb:r}))(It(t));return this.Mb(n,e,i)}addSeries(t,e={},i=0){return this.Mb(t,e,i)}removeSeries(t){let e=Z(this.hb.get(t)),i=this.ub.if(e);this.hv.Qt().if(e),this.gb(i),this.hb.delete(t),this.ab.delete(e)}Jg(t,e){this.gb(this.ub.og(t,e))}tb(t,e,i){this.gb(this.ub.pg(t,e,i))}ib(t,e){let[i,n]=this.ub.wg(t,e);return i.length!==0&&this.gb(n),i}subscribeClick(t){this.lb.i(t)}unsubscribeClick(t){this.lb._(t)}subscribeCrosshairMove(t){this._b.i(t)}unsubscribeCrosshairMove(t){this._b._(t)}subscribeDblClick(t){this.ob.i(t)}unsubscribeDblClick(t){this.ob._(t)}priceScale(t,e=0){return new ls(this.hv,t,e)}timeScale(){return this.pb}applyOptions(t){this.hv.vr(dl(t))}options(){return this.hv.N()}takeScreenshot(t=!1,e=!1){let i,n;try{e||(i=this.hv.Qt().N().crosshair.mode,this.hv.vr({crosshair:{mode:2}})),n=this.hv.TM(t)}finally{e||i===void 0||this.hv.Qt().vr({crosshair:{mode:i}})}return n}addPane(t=!1){let e=this.hv.Qt().uf();return e.j_(t),this.bb(e)}removePane(t){this.hv.Qt().Ad(t)}swapPanes(t,e){this.hv.Qt().zd(t,e)}autoSizeActive(){return this.hv.CM()}chartElement(){return this.hv.Mv()}panes(){return this.hv.Qt().Gn().map((t=>this.bb(t)))}paneSize(t=0){let e=this.hv.AM(t);return{height:e.height,width:e.width}}setCrosshairPosition(t,e,i){let n=this.hb.get(i);if(n===void 0)return;let r=this.hv.Qt().Ks(n);r!==null&&this.hv.Qt().Gd(t,e,r)}clearCrosshairPosition(){this.hv.Qt().Zd(!0)}horzBehaviour(){return this.cb}Mb(t,e={},i=0){Y(t.mb!==void 0),(function(l){if(l===void 0||l.type==="custom")return;let h=l;h.minMove!==void 0&&h.precision===void 0&&(h.precision=_l(h.minMove))})(e.priceFormat),t.type==="Candlestick"&&(function(l){l.borderColor!==void 0&&(l.borderUpColor=l.borderColor,l.borderDownColor=l.borderColor),l.wickColor!==void 0&&(l.wickUpColor=l.wickColor,l.wickDownColor=l.wickColor)})(e);let n=it(zt(gl),zt(t.defaultOptions),e),r=t.mb,o=new Se(this.hv.Qt(),t.type,n,r,t.wb);this.hv.Qt().Qd(o,i);let a=new pr(o,this,this,this,this.cb,(l=>this.bb(l)));return this.hb.set(a,o),this.ab.set(o,a),a}gb(t){let e=this.hv.Qt();for(let i of t.Y_.keys())i.Ia();e.Xd(t.Et.Dc,t.Et.Sg,t.Et.xg),t.Y_.forEach(((i,n)=>n.ht(i.ue,i.bg))),e.Et().dc(),e.Lc()}Sb(t){return Z(this.ab.get(t))}xb(t){return t!==void 0&&this.ab.has(t)?this.Sb(t):void 0}fb(t){let e=new Map;t.QM.forEach(((r,o)=>{let a=o.bh(),l=Wi(a)(r);if(a!=="Custom")Y(bc(l));else{let h=o.cl();Y(!h||h(l)===!1)}e.set(this.Sb(o),l)}));let i=this.xb(t.jM),n=t.YM===void 0?void 0:{type:t.YM.ds,sourceKind:t.YM.KM,objectKind:t.YM.GM,series:this.xb(t.YM.Y_),objectId:t.YM.ZM,paneIndex:t.YM.XM};return{time:t.Qr,logical:t.$n,point:t.JM,paneIndex:t.XM,hoveredInfo:n,hoveredSeries:i,hoveredObjectId:t.qM,seriesData:e,sourceEvent:t.tg}}bb(t){let e=this.dd.get(t);return e||(e=new fr(this.hv,(i=>this.Sb(i)),t,this),this.dd.set(t,e)),e}};function jc(s){if(ri(s)){let t=document.getElementById(s);return Y(t!==null,`Cannot find element in DOM with id=${s}`),t}return s}function Kc(s,t,e){let i=jc(s),n=new vr(i,t,e);return t.setOptions(n.options()),n}function Er(s,t){return Kc(s,new ns,ns.Tf(t))}function Ye(s,t,e,i){return Math.hypot(e-s,i-t)}function Yc(s,t,e,i,n,r,o,a=0){if(t.length===0||i.from>=t.length||i.to<=0)return;let{context:l,horizontalPixelRatio:h,verticalPixelRatio:c}=s,u=t[i.from],d=r(s,u),m=u;if(i.to-i.from<2){let f=n/2;l.beginPath();let p={_t:u._t-f,ut:u.ut},b={_t:u._t+f,ut:u.ut};l.moveTo(p._t*h,p.ut*c),l.lineTo(b._t*h,b.ut*c),o(s,d,p,b)}else{let f=a>0,p=0,b=(y,_)=>{if(o(s,d,m,_),l.beginPath(),d=y,m=_,f){let S=p%a;l.lineDashOffset=S,p=S}},v=m;l.beginPath(),l.moveTo(u._t*h,u.ut*c);for(let y=i.from+1;y<i.to;++y){v=t[y];let _=v._t*h,S=v.ut*c,k=r(s,v);switch(e){case 0:if(l.lineTo(_,S),f){let C=t[y-1],L=C._t*h,E=C.ut*c;p+=Ye(L,E,_,S)}break;case 1:{let C=t[y-1],L=C.ut*c;l.lineTo(_,L),f&&(p+=Math.abs(v._t-C._t)*h),k!==d&&(b(k,v),l.lineTo(_,L)),l.lineTo(_,S),f&&(p+=Math.abs(v.ut-C.ut)*c);break}case 2:{let[C,L]=kr(t,y-1,y),E=C._t*h,x=C.ut*c,z=L._t*h,I=L.ut*c;if(l.bezierCurveTo(E,x,z,I,_,S),f){let j=t[y-1],V=j._t*h,q=j.ut*c,B=Ye(V,q,_,S),W=Ye(V,q,E,x)+Ye(E,x,z,I)+Ye(z,I,_,S);p+=(B+W)/2}break}}e!==1&&k!==d&&(b(k,v),l.moveTo(_,S))}(m!==v||m===v&&e===1)&&o(s,d,m,v),f&&(l.lineDashOffset=0)}}var ml=6;function hn(s,t){return{_t:s._t-t._t,ut:s.ut-t.ut}}function fl(s,t){return{_t:s._t/t,ut:s.ut/t}}function kr(s,t,e){let i=Math.max(0,t-1),n=Math.min(s.length-1,e+1);var r,o;return[(r=s[t],o=fl(hn(s[e],s[i]),ml),{_t:r._t+o._t,ut:r.ut+o.ut}),hn(s[e],fl(hn(s[n],s[t]),ml))]}function Qc(s,t){let e=s.context;e.strokeStyle=t,e.stroke()}var br=class extends Bt{constructor(){super(...arguments),this.rt=null}ht(t){this.rt=t}et(t){if(this.rt===null)return;let{ot:e,lt:i,Cb:n,yb:r,ct:o,Gt:a,Pb:l}=this.rt;if(i===null)return;let h=t.context;h.lineCap="butt",h.lineWidth=o*t.verticalPixelRatio;let c=ie(h,a);h.lineJoin="round";let u=this.kb.bind(this),d=(function(m){return m.reduce(((f,p)=>f+p),0)})(c);r!==void 0&&Yc(t,e,r,i,n,u,Qc,d),l&&(function(m,f,p,b,v){if(b.to-b.from<=0)return;let{horizontalPixelRatio:y,verticalPixelRatio:_,context:S}=m,k=null,C=Math.max(1,Math.floor(y))%2/2,L=p*_+C;for(let E=b.to-1;E>=b.from;--E){let x=f[E];if(x){let z=v(m,x);z!==k&&(k!==null&&S.fill(),S.beginPath(),S.fillStyle=z,k=z);let I=Math.round(x._t*y)+C,j=x.ut*_;S.moveTo(I,j),S.arc(I,j,L,0,2*Math.PI)}}S.fill()})(t,e,l,i,u)}},wr=class extends br{kb(t,e){return e.vt}};function pl(s,t,e,i,n){let r=1-n;return r*r*r*s+3*r*r*n*t+3*r*n*n*e+n*n*n*i}function Gc(s,t,e,i,n){if(e===2){let[r,o]=kr(i,n-1,n);return[Math.min(s._t,t._t,r._t,o._t),Math.max(s._t,t._t,r._t,o._t)]}return[Math.min(s._t,t._t),Math.max(s._t,t._t)]}function Xc(s,t,e,i,n,r,o,a){switch(n){case 1:{let l=Ge(s,t,e._t,e.ut,i._t,e.ut),h=Ge(s,t,i._t,e.ut,i._t,i.ut),c=Math.min(l,h);return c<=a?c:null}case 2:{let[l,h]=kr(r,o-1,o),c=(function(u,d,m){let f=Number.POSITIVE_INFINITY,p=m[0];for(let b=1;b<=12;b++){let v=b/12,y={_t:pl(m[0]._t,m[1]._t,m[2]._t,m[3]._t,v),ut:pl(m[0].ut,m[1].ut,m[2].ut,m[3].ut,v)};f=Math.min(f,Ge(u,d,p._t,p.ut,y._t,y.ut)),p=y}return f})(s,t,[e,l,h,i]);return c<=a?c:null}default:{let l=Ge(s,t,e._t,e.ut,i._t,i.ut);return l<=a?l:null}}}var yr=class extends as{constructor(t,e){super(t,e,!0)}Og(t,e,i){e.Ic(this.kg,cn(this.Tg)),t.Jo(this.kg,i,cn(this.Tg))}Tb(t,e){return{wt:t,Mt:e,_t:NaN,ut:NaN}}Lg(){let t=this.ae.Sa();this.kg=this.ae.Ua().Bh().map((e=>{let i;if((e.Gr??1)>1){let n=e.Wt[1],r=e.Wt[2],o=e.Wt[3];i=Math.abs(n-o)>Math.abs(r-o)?n:r}else i=e.Wt[3];return this.Rb(e.$n,i,t)}))}},xr=class extends yr{Bg(t,e){let i=this.ae.N();return(function(n,r,o,a,l,h,c,u=0,d=0){if(r===null||r.from>=r.to||n.length===0)return null;let m=Math.max(h/2,c??0)+d,f=Number.POSITIVE_INFINITY;if(c!==void 0){let S=c+d,k=cr(n,o-S,r.from,r.to),C=ur(n,o+S,k,r.to);for(let L=k;L<C;L++){let E=n[L];if(!hl(o,E._t,E._t,c+d))continue;let x=Math.hypot(o-E._t,a-E.ut);x<=c+d&&(f=Math.min(f,x))}}if(r.to-r.from<2){let S=n[r.from],k=Math.max(u/2,m),C=Ge(o,a,S._t-k,S.ut,S._t+k,S.ut);return C<=m&&(f=Math.min(f,C)),Number.isFinite(f)?Di(f,2,"series-point"):null}let p=Number.POSITIVE_INFINITY,b=cr(n,o-m,r.from,r.to),v=ur(n,o+m,b,r.to),y=Math.max(r.from+1,b),_=Math.min(r.to,v+1);for(let S=y;S<_;S++){let k=n[S-1],C=n[S],[L,E]=Gc(k,C,l,n,S);if(!hl(o,L,E,m))continue;let x=Xc(o,a,k,C,l,n,S,m);x!==null&&(p=Math.min(p,x))}return Number.isFinite(f)?Di(f,2,"series-point"):Number.isFinite(p)?Di(p,1,"series-line"):null})(this.kg,this.Tg,t,e,i.lineType,i.lineVisible?i.lineWidth:1,i.pointMarkersVisible?i.pointMarkersRadius||i.lineWidth/2+2:void 0,this.le.Et().ml(),i.hitTestTolerance)}},Cr=class extends xr{constructor(){super(...arguments),this.Vg=new wr}Rb(t,e,i){return{...this.Tb(t,e),...i.Sh(t)}}Ng(){let t=this.ae.N(),e={ot:this.kg,Gt:t.lineStyle,yb:t.lineVisible?t.lineType:void 0,ct:t.lineWidth,Pb:t.pointMarkersVisible?t.pointMarkersRadius||t.lineWidth/2+2:void 0,lt:this.Tg,Cb:this.le.Et().ml()};this.Vg.ht(e)}},zr={type:"Line",isBuiltIn:!0,defaultOptions:{color:"#2196f3",lineStyle:0,lineWidth:3,lineType:0,lineVisible:!0,crosshairMarkerVisible:!0,crosshairMarkerRadius:4,crosshairMarkerBorderColor:"",crosshairMarkerBorderWidth:2,crosshairMarkerBackgroundColor:"",lastPriceAnimation:0,pointMarkersVisible:!1},mb:(s,t)=>new Cr(s,t)};var Mv={...gl,color:"#2196f3"};var zl=["median","mean","min","max","ops","peak_memory"],Tl=["overview","trend","comparison"],Jc=["view","metric","x-axis","benchmark","machine","python","memory","theme"],ds=[["--_benched-accent-color","#3e96ff"],["--wa-color-orange-60","#f46a45"],["--wa-color-green-60","#00ac49"],["--wa-color-purple-60","#b678f5"],["--wa-color-pink-60","#e66ba3"],["--wa-color-cyan-60","#00a3c0"],["--wa-color-indigo-60","#808aff"],["--wa-color-yellow-60","#da7e00"],["--wa-color-red-60","#f3676c"]];function ms(s){let t=s.currentTarget.value;return typeof t=="string"?t:""}function Le(s){return s==null?"\u2014":s.toLocaleString(void 0,{maximumSignificantDigits:6})}function Vt(s){let t=s?.match(/^(\d+)\.(\d+)/);return t?`${t[1]}.${t[2]}`:s??"unknown"}function fs(s){let t=s?.machine.metadata?.memory_gib;return typeof t=="number"&&Number.isFinite(t)?String(t):"unknown"}function Tr(s){return s==="unknown"?"Unknown":`${s} GiB`}function Ee(s,t){return s===null?new Set(t):new Set(s.split(",").filter(e=>t.includes(e)))}function Pl(s){let t=Math.max(0,...s.filter(Number.isFinite).map(i=>Math.abs(i))),e=t===0?2:Math.min(12,Math.max(0,2-Math.floor(Math.log10(t))));return{type:"price",precision:e,minMove:10**-e}}function Al(s){if(typeof s!="object"||s===null)throw new Error("report must be an object");let t=s;if(t.schema_version!==1)throw new Error(`unsupported report schema version ${String(t.schema_version)}`);if(!Array.isArray(t.runs)||!Array.isArray(t.benchmarks)||!Array.isArray(t.warnings))throw new Error("report is missing runs, benchmarks, or warnings");return t}function $l(s,t,e){let i=document.createElement("table");i.className="benched-table",i.setAttribute("aria-label",e);let n=i.createTHead().insertRow();for(let o of s){let a=document.createElement("th");a.scope="col",a.textContent=o,n.append(a)}let r=i.createTBody();for(let o of t){let a=r.insertRow();for(let l of o){let h=a.insertCell();h.textContent=l}}return i}var Pr=class extends HTMLElement{static get observedAttributes(){return["src","view","metric","benchmark","machine","python","memory","x-axis","hide-controls","data-theme"]}report;charts=new Map;chartResizeObserver;chartVisibilityObserver;chartRenderers=new Map;request;media;themeObserver;inheritedChartStyle;theme="light";handleMediaChange=t=>{this.inheritsTheme()?this.setTheme(this.inheritedTheme()):!this.savedTheme()&&!this.getAttribute("data-theme")&&this.setTheme(t.matches?"dark":"light")};handleThemeChange=t=>{this.inheritsTheme()||this.setTheme(t.detail)};connectedCallback(){this.media=matchMedia("(prefers-color-scheme: dark)"),this.theme=this.preferredTheme(),this.applyTheme(),this.media.addEventListener("change",this.handleMediaChange),window.addEventListener("benched-theme-change",this.handleThemeChange),this.observeInheritedTheme(),this.load()}disconnectedCallback(){this.request?.abort(),this.removeChart(),this.media?.removeEventListener("change",this.handleMediaChange),window.removeEventListener("benched-theme-change",this.handleThemeChange),this.themeObserver?.disconnect()}attributeChangedCallback(t,e,i){if(!(!this.isConnected||e===i))if(t==="src")this.load();else if(t==="data-theme"){let n=this.preferredTheme(),r=n!==this.theme;this.setTheme(n),!r&&this.report&&this.render()}else this.report&&this.render()}set data(t){this.request?.abort(),this.report=Al(t),this.isConnected&&this.render()}get data(){return this.report}get view(){let t=this.getAttribute("view");return t&&Tl.includes(t)?t:"overview"}get metric(){let t=this.getAttribute("metric");return t&&zl.includes(t)?t:"median"}get xAxis(){return this.getAttribute("x-axis")==="time"?"time":"version"}get hiddenControls(){let t=this.getAttribute("hide-controls")?.split(",")??[];return new Set(t.map(e=>e.trim()).filter(e=>Jc.includes(e)))}savedTheme(){try{let t=localStorage.getItem("benched-theme");return t==="light"||t==="dark"?t:null}catch{return null}}preferredTheme(){let t=this.getAttribute("data-theme");return t==="light"||t==="dark"?t:t==="inherit"?this.inheritedTheme():this.savedTheme()??(this.media?.matches?"dark":"light")}inheritsTheme(){return this.getAttribute("data-theme")==="inherit"}inheritedTheme(){let t=this.parentElement??document.documentElement;for(let i=t;i;i=i.parentElement){let n=getComputedStyle(i).backgroundColor.match(/^rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)(?:[, /]+\s*([\d.]+))?\s*\)$/);if(!n||n[4]!==void 0&&Number(n[4])===0)continue;return Number(n[1])*.2126+Number(n[2])*.7152+Number(n[3])*.0722<128?"dark":"light"}let e=getComputedStyle(t).colorScheme.split(/\s+/);return e[0]==="dark"||e[0]==="light"?e[0]:this.media?.matches?"dark":"light"}observeInheritedTheme(){this.themeObserver?.disconnect(),this.inheritedChartStyle=this.chartStyleSignature(),this.themeObserver=new MutationObserver(()=>{if(!this.inheritsTheme())return;let t=this.inheritedTheme();if(t!==this.theme){this.setTheme(t),this.inheritedChartStyle=this.chartStyleSignature();return}let e=this.chartStyleSignature();e!==this.inheritedChartStyle&&(this.inheritedChartStyle=e,this.report&&this.render())});for(let t=this.parentElement;t;t=t.parentElement)this.themeObserver.observe(t,{attributes:!0,attributeFilter:["class","style","data-theme"]})}chartStyleSignature(){let t=getComputedStyle(this);return[t.color,t.getPropertyValue("--_benched-grid-color"),...ds.map(([e])=>t.getPropertyValue(e))].join("\0")}applyTheme(){this.classList.toggle("wa-dark",this.theme==="dark"),this.classList.toggle("wa-light",this.theme==="light"),this.dataset.resolvedTheme=this.theme}setTheme(t){if(!(t!=="light"&&t!=="dark")){if(this.theme===t){this.applyTheme();return}this.theme=t,this.applyTheme(),this.report&&this.render()}}toggleTheme(){let t=this.theme==="dark"?"light":"dark";try{localStorage.setItem("benched-theme",t)}catch{}window.dispatchEvent(new CustomEvent("benched-theme-change",{detail:t}))}async load(){this.request?.abort();let t=this.getAttribute("src");if(!t){this.report=void 0,this.renderMessage("No report data source.");return}this.renderMessage("Loading report\u2026","status");let e=new AbortController;this.request=e;try{let i=await fetch(t,{signal:e.signal});if(!i.ok)throw new Error(`${i.status} ${i.statusText}`);this.report=Al(await i.json()),this.render()}catch(i){if(e.signal.aborted)return;let n=i instanceof Error?i.message:String(i);this.report=void 0,this.renderMessage(`Unable to load report: ${n}`,"alert")}}renderMessage(t,e="status"){this.removeChart();let i=document.createElement("wa-callout");i.className="benched-message",i.setAttribute("appearance",e==="alert"?"accent":"outlined"),i.setAttribute("role",e),i.textContent=t,this.replaceChildren(i)}renderViewMessage(t,e){let i=document.createElement("wa-callout");i.className="benched-message benched-view-message",i.setAttribute("appearance","outlined"),i.setAttribute("role","status"),i.textContent=e,t.replaceChildren(i)}render(){this.removeChart();let t=this.report;if(!t)return;if(t.benchmarks.length===0){this.renderMessage("No benchmark data matches this report.");return}this.innerHTML=`
      <wa-card class="benched-card" appearance="outlined" with-header>
        <div slot="header" class="benched-header">
          <div><strong>Benched report</strong><small></small></div>
          <div class="benched-controls" aria-label="Report controls"></div>
        </div>
        <div class="benched-warnings"></div>
        <section class="benched-view" aria-live="polite"></section>
      </wa-card>
    `;let e=this.querySelector(".benched-header small");e&&(e.textContent=`${t.runs.length} runs \xB7 ${t.benchmarks.length} benchmarks`),this.renderControls(),this.renderWarnings();let i=this.querySelector(".benched-view");i&&(this.view==="overview"&&this.renderOverview(i),this.view==="trend"&&this.renderTrend(i),this.view==="comparison"&&this.renderComparison(i))}select(t,e,i,n){let r=document.createElement("wa-select");r.className=e,r.setAttribute("label",t),r.setAttribute("size","small");for(let[o,a]of i){let l=document.createElement("wa-option");l.setAttribute("value",o),l.textContent=a,r.append(l)}return r.value=n,r}filterPanel(t,e,i,n,r){let o=document.createElement("fieldset");o.className=`benched-filter-panel ${e}`;let a=document.createElement("legend");a.textContent=t;let l=document.createElement("div");for(let[h,c]of i){let u=document.createElement("wa-button"),d=n.has(h);u.setAttribute("size","small"),u.setAttribute("appearance",d?"filled":"outlined"),u.setAttribute("variant",d?"brand":"neutral"),u.setAttribute("aria-pressed",String(d)),u.textContent=c,u.addEventListener("click",()=>{let m=new Set(n);if(m.has(h)){if(m.size===1)return;m.delete(h)}else m.add(h);r(m)}),l.append(u)}return o.append(a,l),o}updateSelectionAttribute(t,e,i){e.size===i.length?this.removeAttribute(t):this.setAttribute(t,i.filter(n=>e.has(n)).join(","))}renderControls(){let t=this.report,e=this.hiddenControls,i=this.querySelector(".benched-controls"),n=[...new Set(t.runs.map(x=>x.machine.id).filter(x=>!!x))].sort(),r=Ee(this.getAttribute("machine"),n),o=[...new Set(t.runs.map(x=>Vt(x.environment.python_version)).filter(x=>!!x))].sort(),a=this.getAttribute("python"),l=Ee(a?.split(",").map(x=>Vt(x)).join(",")??null,o),h=[...new Set(t.runs.map(x=>fs(x)).filter(x=>x!=="unknown"))].sort((x,z)=>Number(x)-Number(z)),c=Ee(this.getAttribute("memory"),h),u=this.visibleBenchmarks(),d=this.getAttribute("benchmark")??"",m=t.benchmarks.find(x=>x.benchmark_id===d&&!u.includes(x)),f=m?[m,...u]:u,p=f.findIndex(x=>x.benchmark_id===d),b=this.select("View","benched-view-select",Tl.map(x=>[x,x[0].toUpperCase()+x.slice(1)]),this.view),v=this.select("Metric","benched-metric-select",zl.map(x=>[x,x]),this.metric),y=this.select("X axis","benched-x-axis-select",[["version","Package version"],["time","Time"]],this.xAxis),_=this.filterPanel("Machine","benched-machine-select",n.map(x=>[x,x]),r,x=>this.updateSelectionAttribute("machine",x,n)),S=this.filterPanel("Python","benched-python-select",o.map(x=>[x,x]),l,x=>this.updateSelectionAttribute("python",x,o)),k=this.filterPanel("Memory","benched-memory-select",h.map(x=>[x,Tr(x)]),c,x=>this.updateSelectionAttribute("memory",x,h)),C=this.select("Benchmark","benched-benchmark-select",[["all","All benchmarks"],...f.map((x,z)=>[`benchmark-${z}`,x.name])],p<0?"all":`benchmark-${p}`),L=document.createElement("wa-button");L.className="benched-theme-toggle",L.setAttribute("appearance","plain"),L.setAttribute("size","small"),L.setAttribute("aria-label",`Switch to ${this.theme==="dark"?"light":"dark"} mode`),L.setAttribute("title",`Switch to ${this.theme==="dark"?"light":"dark"} mode`),L.innerHTML=this.theme==="dark"?`<svg data-icon="sun" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path>
          </svg>`:`<svg data-icon="moon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path>
          </svg>`,C.toggleAttribute("disabled",f.length===0),b.addEventListener("change",x=>this.setAttribute("view",ms(x))),v.addEventListener("change",x=>this.setAttribute("metric",ms(x))),y.addEventListener("change",x=>this.setAttribute("x-axis",ms(x))),C.addEventListener("change",x=>{let z=ms(x),I=f[Number(z.replace("benchmark-",""))];I?this.setAttribute("benchmark",I.benchmark_id):this.removeAttribute("benchmark")}),L.addEventListener("click",()=>this.toggleTheme()),e.has("view")||i.append(b),this.view!=="overview"&&!e.has("metric")&&i.append(v),this.view==="trend"&&!e.has("x-axis")&&i.append(y),e.has("benchmark")||i.append(C),!e.has("theme")&&!this.inheritsTheme()&&i.append(L);let E=document.createElement("div");E.className="benched-filter-panels",e.has("machine")||E.append(_),e.has("python")||E.append(S),h.length>0&&!e.has("memory")&&E.append(k),E.childElementCount>0&&i.append(E),i.childElementCount===0&&i.remove()}renderWarnings(){let t=this.report,e=this.querySelector(".benched-warnings");for(let i of t.warnings){let n=document.createElement("wa-callout");n.setAttribute("appearance","outlined"),n.textContent=i,e.append(n)}}activeMachines(){let t=this.report,e=[...new Set(t.runs.map(i=>i.machine.id).filter(Boolean))];return Ee(this.getAttribute("machine"),e)}activePythonVersions(){let t=this.report,e=[...new Set(t.runs.map(r=>Vt(r.environment.python_version)))],n=this.getAttribute("python")?.split(",").map(r=>Vt(r)).join(",");return Ee(n??null,e)}activeMemory(){let t=this.report,e=[...new Set(t.runs.map(i=>fs(i)).filter(i=>i!=="unknown"))];return Ee(this.getAttribute("memory"),e)}activeRuns(){let t=this.report,e=this.activeMachines(),i=this.activePythonVersions(),n=this.activeMemory(),r=this.hasAttribute("machine"),o=this.hasAttribute("python"),a=this.hasAttribute("memory");return t.runs.filter(l=>(!r||e.has(l.machine.id??""))&&(!o||i.has(Vt(l.environment.python_version)))&&(!a||n.has(fs(l))))}visibleBenchmarks(){let t=this.report;if(!this.hasAttribute("machine")&&!this.hasAttribute("python")&&!this.hasAttribute("memory"))return t.benchmarks;let e=new Set(this.activeRuns().map(i=>i.run_id));return t.benchmarks.filter(i=>i.series.some(n=>e.has(n.run_id)))}activeBenchmark(){let t=this.visibleBenchmarks(),e=this.getAttribute("benchmark");return t.find(i=>i.benchmark_id===e)}displayedBenchmarks(){let t=this.visibleBenchmarks(),e=this.getAttribute("benchmark");if(!e)return t;let i=t.find(n=>n.benchmark_id===e);return i?[i]:[]}points(t){let e=new Set(this.activeRuns().map(i=>i.run_id));return t.series.filter(i=>e.has(i.run_id))}pointsBySeries(t){let e=this.report,i=new Map(e.runs.map(r=>[r.run_id,r])),n=new Map;for(let r of this.points(t)){let o=i.get(r.run_id),a=o?.machine.id??"unknown",l=Vt(o?.environment.python_version),h=fs(o),c=`${a}\0${l}\0${h}`,u=`${a} \xB7 Python ${l}${h==="unknown"?"":` \xB7 ${Tr(h)}`}`,d=n.get(c)??{label:u,machine:a,python:l,memory:h,points:[]};d.points.push(r),n.set(c,d)}return[...n.values()].sort((r,o)=>r.label.localeCompare(o.label))}renderOverview(t){let e=this.activeRuns(),i=this.visibleBenchmarks();if(e.length===0||i.length===0){this.renderViewMessage(t,"No benchmark data matches the selected filters.");return}let n=new Set(e.map(u=>u.machine.id).filter(Boolean)),r=new Set(e.map(u=>Vt(u.environment.python_version))),o=[["Runs",String(e.length)],["Benchmarks",String(i.length)],["Machines",String(n.size)],["Python Versions",String(r.size)]],a=document.createElement("div");a.className="benched-summary-grid";for(let[u,d]of o){let m=document.createElement("wa-card"),f=document.createElement("strong"),p=document.createElement("span");f.textContent=d,p.textContent=u,m.append(f,p),a.append(m)}let l=document.createElement("h2");l.textContent="Benchmarks";let h=document.createElement("ul");h.className="benched-benchmark-list";let c=new Map(e.map(u=>[u.run_id,u]));for(let u of i){let d=this.points(u),m=d.map(_=>c.get(_.run_id)).filter(_=>!!_),f=new Set(m.map(_=>_.machine.id)),p=new Set(m.map(_=>Vt(_.environment.python_version))),b=document.createElement("li"),v=document.createElement("a"),y=document.createElement("span");v.href=`#${encodeURIComponent(u.benchmark_id)}`,v.textContent=u.name,v.addEventListener("click",_=>{_.preventDefault(),this.setAttribute("benchmark",u.benchmark_id),this.setAttribute("view","trend")}),y.textContent=`${d.length} points \xB7 ${f.size} machines \xB7 ${p.size} Python versions`,b.append(v,y),h.append(b)}t.append(a,l,h)}renderTrend(t){if(!this.hasAttribute("benchmark")){this.renderTrendMatrix(t);return}let e=this.activeBenchmark();if(!e){this.renderViewMessage(t,"No benchmark data matches the selected filters.");return}let i=this.report,n=new Map(i.runs.map(C=>[C.run_id,C])),r=this.pointsBySeries(e).map(C=>({...C,points:C.points.filter(L=>L.metrics[this.metric]!=null)})).filter(C=>C.points.length>0),o=r.flatMap(C=>C.points);if(o.length===0){this.renderViewMessage(t,`No ${this.metric} data matches the selected filters.`);return}let a=document.createElement("h2");a.textContent=e.name;let l=document.createElement("output");l.className="benched-chart-value",l.setAttribute("aria-live","polite"),l.textContent=r.length===1?`${r[0].label} \xB7 ${this.metric}: ${Le(r[0].points[r[0].points.length-1]?.metrics[this.metric])} ${e.unit}`:`${r.length} series \xB7 ${this.metric}`;let h=document.createElement("div");h.className="benched-chart-legend",h.setAttribute("aria-label","Chart series");let c=document.createElement("div");c.className="benched-chart",c.setAttribute("aria-label",`${e.name} ${this.metric} by ${this.xAxis==="version"?"package version":"time"}`),t.append(a,l,h,c);let u=getComputedStyle(this),d=new Map,m=new Map;if(this.xAxis==="version"){let C=o.map(L=>n.get(L.run_id)).filter(L=>!!L).sort((L,E)=>L.started_at.localeCompare(E.started_at));for(let L of C){let E=L.subject.version??L.subject.revision??L.run_id;if(m.has(E))continue;let x=m.size+1;m.set(E,x),d.set(x,E)}}let f=C=>{let L=n.get(C.run_id);if(this.xAxis==="version"){let E=L?.subject.version??L?.subject.revision??C.run_id;return m.get(E)}return Math.floor(Date.parse(L?.started_at??"")/1e3)},p=Er(c,{autoSize:!0,height:480,handleScale:!1,handleScroll:!1,layout:{attributionLogo:!1,background:{type:ni.Solid,color:"transparent"},textColor:u.color},grid:{vertLines:{color:u.getPropertyValue("--_benched-grid-color").trim()||"#d8dee9"},horzLines:{color:u.getPropertyValue("--_benched-grid-color").trim()||"#d8dee9"}},localization:this.xAxis==="version"?{timeFormatter:C=>d.get(Number(C))??"unknown"}:void 0,timeScale:this.xAxis==="version"?{tickMarkFormatter:C=>d.get(Number(C))??""}:void 0}),b=Pl(o.map(C=>C.metrics[this.metric])),v=r.map((C,L)=>{let[E,x]=ds[L%ds.length],z=u.getPropertyValue(E).trim()||x,I=p.addSeries(zr,{color:z,priceFormat:b,title:C.label}),j=new Map;for(let B of C.points)j.set(f(B),B.metrics[this.metric]);I?.setData([...j].sort(([B],[W])=>Number(B)-Number(W)).map(([B,W])=>({time:B,value:W})));let V=document.createElement("span"),q=document.createElement("i");return q.style.backgroundColor=z,V.append(q,C.label),h.append(V),{line:I,label:C.label}});p.subscribeCrosshairMove(C=>{for(let L of v){if(!L.line)continue;let E=C.seriesData.get(L.line);if(E&&"value"in E){l.textContent=`${L.label} \xB7 ${this.metric}: ${Le(E.value)} ${e.unit}`;break}}}),this.trackChart(c,p);let y=r.flatMap(C=>C.points.map(L=>{let E=n.get(L.run_id);return{group:C,point:L,run:E}})).sort((C,L)=>(L.run?.started_at??"").localeCompare(C.run?.started_at??"")),_=y.slice(0,100).map(({group:C,point:L,run:E})=>[E?.started_at??L.run_id,E?.subject.version??"\u2014",C.machine,E?.environment.python_version??C.python,Tr(C.memory),Le(L.metrics[this.metric])]),S=document.createElement("details");S.className="benched-exact-values",S.open=y.length<=100;let k=document.createElement("summary");k.textContent=`Recent values (${_.length} of ${y.length})`,S.append(k,$l(["Run","Package","Machine","Python","Memory",this.metric],_,`${e.name} recent trend values`)),t.append(S)}renderTrendMatrix(t){let e=this.visibleBenchmarks(),i=this.activeRuns();if(i.length===0||e.length===0){this.renderViewMessage(t,"No benchmark data matches the selected filters.");return}let n=document.createElement("h2");n.textContent="Benchmark trends";let r=document.createElement("p");r.className="benched-trend-description",r.textContent=`Each line averages ${this.metric} across selected results at each ${this.xAxis==="version"?"package version":"day"}.`;let o=document.createElement("div");o.className="benched-trend-grid",t.append(n,r,o);let a=new Map(i.map(p=>[p.run_id,p])),l=new Map,h=new Map;if(this.xAxis==="version")for(let p of[...i].sort((b,v)=>b.started_at.localeCompare(v.started_at))){let b=p.subject.version??p.subject.revision??p.run_id;if(h.has(b))continue;let v=h.size+1;h.set(b,v),l.set(v,b)}let c=p=>{let b=a.get(p.run_id);if(this.xAxis==="version"){let y=b?.subject.version??b?.subject.revision??p.run_id;return h.get(y)}let v=Date.parse(b?.started_at??"");return Math.floor(v/864e5)*86400},u=getComputedStyle(this),[d,m]=ds[0],f=u.getPropertyValue(d).trim()||m;for(let p of e){let b=new Map,v=this.points(p).filter(E=>E.metrics[this.metric]!=null);for(let E of v){let x=c(E),z=b.get(x)??[];z.push(E.metrics[this.metric]),b.set(x,z)}let y=[...b].sort(([E],[x])=>Number(E)-Number(x)).map(([E,x])=>({time:E,value:x.reduce((z,I)=>z+I,0)/x.length})),_=document.createElement("wa-card");_.className="benched-trend-card",_.setAttribute("appearance","outlined"),_.setAttribute("with-header","");let S=document.createElement("div");S.className="benched-trend-card-header",S.setAttribute("slot","header");let k=document.createElement("a");k.href=`#${encodeURIComponent(p.benchmark_id)}`,k.textContent=p.name,k.addEventListener("click",E=>{E.preventDefault(),this.setAttribute("benchmark",p.benchmark_id)});let C=document.createElement("span");C.textContent=y.length?`${Le(y[y.length-1].value)} ${p.unit}`:`No ${this.metric} data`,S.append(k,C);let L=document.createElement("div");L.className="benched-mini-chart",L.setAttribute("aria-label",`${p.name} aggregate ${this.metric} by ${this.xAxis==="version"?"package version":"time"}`),_.append(S,L),o.append(_),y.length!==0&&this.renderChartWhenVisible(L,()=>{let E=Er(L,{autoSize:!0,height:240,handleScale:!1,handleScroll:!1,layout:{attributionLogo:!1,background:{type:ni.Solid,color:"transparent"},textColor:u.color},grid:{vertLines:{color:u.getPropertyValue("--_benched-grid-color").trim()||"#d8dee9"},horzLines:{color:u.getPropertyValue("--_benched-grid-color").trim()||"#d8dee9"}},localization:this.xAxis==="version"?{timeFormatter:z=>l.get(Number(z))??"unknown"}:void 0,timeScale:this.xAxis==="version"?{tickMarkFormatter:z=>l.get(Number(z))??""}:void 0});E.addSeries(zr,{color:f,priceFormat:Pl(y.map(z=>z.value))}).setData(y),this.trackChart(L,E)})}}renderComparison(t){let e=this.displayedBenchmarks().flatMap(i=>this.pointsBySeries(i).map(n=>{let r=n.points.map(h=>h.metrics[this.metric]).filter(h=>h!=null),o=r[r.length-2],a=r[r.length-1],l=o==null||a==null||o===0?null:(a-o)/o*100;return[i.name,n.label,Le(o),Le(a),l==null?"\u2014":`${l>=0?"+":""}${l.toFixed(2)}%`]}));if(e.length===0){this.renderViewMessage(t,"No benchmark data matches the selected filters.");return}t.append($l(["Benchmark","Context",`Previous ${this.metric}`,`Latest ${this.metric}`,"Change"],e,"Latest benchmark comparison"))}trackChart(t,e){this.charts.set(t,e),this.chartResizeObserver??=new ResizeObserver(i=>{for(let n of i)this.charts.get(n.target)?.timeScale().fitContent()}),this.chartResizeObserver.observe(t),requestAnimationFrame(()=>{requestAnimationFrame(()=>{this.charts.get(t)===e&&e.timeScale().fitContent()})})}renderChartWhenVisible(t,e){if(!("IntersectionObserver"in window)){e();return}this.chartRenderers.set(t,e),this.chartVisibilityObserver??=new IntersectionObserver(i=>{for(let n of i){let r=n.target;n.isIntersecting?this.charts.has(r)||this.chartRenderers.get(r)?.():this.removeTrackedChart(r)}},{rootMargin:"480px 0px"}),this.chartVisibilityObserver.observe(t)}removeTrackedChart(t){let e=this.charts.get(t);e&&(this.chartResizeObserver?.unobserve(t),e.remove(),this.charts.delete(t))}removeChart(){this.chartVisibilityObserver?.disconnect(),this.chartVisibilityObserver=void 0,this.chartRenderers.clear(),this.chartResizeObserver?.disconnect(),this.chartResizeObserver=void 0;for(let t of this.charts.values())t.remove();this.charts.clear()}};customElements.get("benched-report")||customElements.define("benched-report",Pr);export{Pr as BenchedReport,Pl as chartPriceFormat};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
lit-html/directive.js:
lit-html/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@awesome.me/webawesome/dist/chunks/chunk.LCEGCF5S.js:
@awesome.me/webawesome/dist/chunks/chunk.RPQJAXXR.js:
@awesome.me/webawesome/dist/chunks/chunk.G5ZZIGWB.js:
@awesome.me/webawesome/dist/chunks/chunk.XNTP7DEQ.js:
@awesome.me/webawesome/dist/chunks/chunk.PZAN6FPN.js:
@awesome.me/webawesome/dist/chunks/chunk.7VGCIHDG.js:
@awesome.me/webawesome/dist/chunks/chunk.AOKMSJXD.js:
@awesome.me/webawesome/dist/chunks/chunk.C6MKRB3S.js:
@awesome.me/webawesome/dist/components/callout/callout.js:
@awesome.me/webawesome/dist/chunks/chunk.R7QX4M6R.js:
@awesome.me/webawesome/dist/chunks/chunk.VC3BPUZJ.js:
@awesome.me/webawesome/dist/chunks/chunk.KBXNFZQL.js:
@awesome.me/webawesome/dist/chunks/chunk.RWNXKUCF.js:
@awesome.me/webawesome/dist/chunks/chunk.S35PLDPD.js:
@awesome.me/webawesome/dist/chunks/chunk.KQHZRDPB.js:
@awesome.me/webawesome/dist/chunks/chunk.56IHH3HP.js:
@awesome.me/webawesome/dist/chunks/chunk.5PQVPZTW.js:
@awesome.me/webawesome/dist/chunks/chunk.W7A2VLCT.js:
@awesome.me/webawesome/dist/chunks/chunk.DVA7QY5T.js:
@awesome.me/webawesome/dist/chunks/chunk.YDQCS2HK.js:
@awesome.me/webawesome/dist/chunks/chunk.WDIIGUNP.js:
@awesome.me/webawesome/dist/chunks/chunk.O74G5RVH.js:
@awesome.me/webawesome/dist/chunks/chunk.HGBRCPUS.js:
@awesome.me/webawesome/dist/chunks/chunk.KKI7M5DP.js:
@awesome.me/webawesome/dist/chunks/chunk.44TPNLVU.js:
@awesome.me/webawesome/dist/chunks/chunk.ZRLTNBWF.js:
@awesome.me/webawesome/dist/chunks/chunk.AL6UNYSC.js:
@awesome.me/webawesome/dist/components/button/button.js:
@awesome.me/webawesome/dist/chunks/chunk.ATI2KDM5.js:
@awesome.me/webawesome/dist/chunks/chunk.YKC4SGGJ.js:
@awesome.me/webawesome/dist/components/card/card.js:
@awesome.me/webawesome/dist/chunks/chunk.C3KOHXUM.js:
@awesome.me/webawesome/dist/chunks/chunk.B632VLM3.js:
@awesome.me/webawesome/dist/components/option/option.js:
@awesome.me/webawesome/dist/chunks/chunk.7KLMRZOI.js:
@awesome.me/webawesome/dist/chunks/chunk.VQZ46MYI.js:
@awesome.me/webawesome/dist/chunks/chunk.4ZAKP7NY.js:
@awesome.me/webawesome/dist/chunks/chunk.MQODJ75V.js:
@awesome.me/webawesome/dist/chunks/chunk.PX3HMKF7.js:
@awesome.me/webawesome/dist/chunks/chunk.3NKIHICW.js:
@awesome.me/webawesome/dist/chunks/chunk.JTOY5KP3.js:
@awesome.me/webawesome/dist/chunks/chunk.3H2FQERJ.js:
@awesome.me/webawesome/dist/chunks/chunk.GWSUX3V5.js:
@awesome.me/webawesome/dist/chunks/chunk.JPBXG7RE.js:
@awesome.me/webawesome/dist/chunks/chunk.F25QOBDY.js:
@awesome.me/webawesome/dist/chunks/chunk.L6CIKOFQ.js:
@awesome.me/webawesome/dist/chunks/chunk.CWBSN34U.js:
@awesome.me/webawesome/dist/chunks/chunk.HPULLNVR.js:
@awesome.me/webawesome/dist/chunks/chunk.4AHPL3WP.js:
@awesome.me/webawesome/dist/chunks/chunk.37OOIOGE.js:
@awesome.me/webawesome/dist/chunks/chunk.ZWQCGLB5.js:
@awesome.me/webawesome/dist/chunks/chunk.HS5AYC6E.js:
@awesome.me/webawesome/dist/chunks/chunk.64OG2H45.js:
@awesome.me/webawesome/dist/components/select/select.js:
  (*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
lit-html/directives/if-defined.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/static.js:
lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lightweight-charts/dist/lightweight-charts.production.mjs:
  (*!
   * @license
   * TradingView Lightweight Charts™ v5.2.1
   * Copyright (c) 2026 TradingView, Inc.
   * Licensed under Apache License 2.0 https://www.apache.org/licenses/LICENSE-2.0
   *)
*/
//# sourceMappingURL=index.js.map

import{resolve as fe,relative as We,extname as Ue,join as Se,dirname as ne,basename as ze,sep as ft}from"path";import{createFilter as Le,makeLegalIdentifier as pe,attachScopes as pt,extractAssignedNames as Be}from"../pluginutils@5.3.0/index.js";import{statSync as Ve,existsSync as mt,readFileSync as ht}from"fs";import yt from"../../commondir@1.0.1/index.js";import gt from"../../glob@8.1.0/index.js";import{walk as xt}from"../../estree-walker@2.0.2/index.js";import $t from"../../magic-string@0.30.21/index.js";import vt from"../../is-reference@1.2.1/index.js";var wt="25.0.8",jt={rollup:"^2.68.0||^3.0.0||^4.0.0"};function Ge(e,t,n){try{return e(t,{allowReturnOutsideFunction:!0})}catch(r){throw r.message+=` in ${n}`,r}}const Et=/\b(?:require|module|exports|global)\b/,bt=/\b(?:require|module|exports)\b/;function Rt(e,t){return(t?bt:Et).test(e)}function qt(e,t,n){const r=Ge(e,t,n);let s=!1,i=!1,a=!1;for(const u of r.body)switch(u.type){case"ExportDefaultDeclaration":s=!0,i=!0;break;case"ExportNamedDeclaration":if(s=!0,u.declaration)a=!0;else for(const l of u.specifiers)l.exported.name==="default"?i=!0:a=!0;break;case"ExportAllDeclaration":s=!0,u.exported&&u.exported.name==="default"?i=!0:a=!0;break;case"ImportDeclaration":s=!0;break}return{isEsModule:s,hasDefaultExport:i,hasNamedExports:a,ast:r}}function T(e,t,n){let r=1,s=pe(n);const i=()=>e.some(a=>a.contains(s))||t.has(s);for(;i();)s=pe(`${n}_${r}`),r+=1;for(const a of e)a.declarations[s]=!0;return s}function Y(e){const t=pe(ze(e,Ue(e)));return t!=="index"?t:pe(ze(ne(e)))}function se(e){return e.replace(/\\/g,"/")}const He=(e,t)=>`/${se(We(t,e))}`;function _e(e){return e[0].toUpperCase()+e.slice(1)}function St({strictRequires:e}){switch(e){case!0:return{strictRequiresFilter:()=>!0,detectCyclesAndConditional:!1};case void 0:case"auto":case"debug":case null:return{strictRequiresFilter:()=>!1,detectCyclesAndConditional:!0};case!1:return{strictRequiresFilter:()=>!1,detectCyclesAndConditional:!1};default:if(typeof e=="string"||Array.isArray(e))return{strictRequiresFilter:Le(e),detectCyclesAndConditional:!1};throw new Error('Unexpected value for "strictRequires" option.')}}function _t(e){let t="index.js";try{mt(Se(e,"package.json"))&&(t=JSON.parse(ht(Se(e,"package.json"),{encoding:"utf8"})).main||t)}catch{}return t}function It(e){try{if(Ve(e).isDirectory())return!0}catch{}return!1}function Dt(e,t){const n=new Map,r=new Set;for(const s of!e||Array.isArray(e)?e||[]:[e]){const i=s.startsWith("!"),a=(u,l)=>i?n.delete(u):n.set(u,l);for(const u of gt.sync(i?s.substr(1):s)){const l=fe(u),p=se(l);if(It(l)){r.add(l);const w=fe(Se(l,_t(u)));a(p,w),a(se(w),w)}else r.add(ne(l)),a(p,l)}}return{commonDir:r.size?yt([...r,t]):null,dynamicRequireModules:n}}const Ye=`throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');`,Ie="commonjsRequire",De="createCommonjsRequire";function Nt(e,t,n,r){if(!e)return`export function ${Ie}(path) {
	${Ye}
}`;const s=[...t.values()].map((a,u)=>`import ${a.endsWith(".json")?`json${u}`:`{ __require as require${u} }`} from ${JSON.stringify(a)};`).join(`
`),i=[...t.keys()].map((a,u)=>`		${JSON.stringify(He(a,n))}: ${a.endsWith(".json")?`function () { return json${u}; }`:`require${u}`}`).join(`,
`);return`${s}

var dynamicModules;

function getDynamicModules() {
	return dynamicModules || (dynamicModules = {
${i}
	});
}

export function ${De}(originalModuleDir) {
	function handleRequire(path) {
		var resolvedPath = commonjsResolve(path, originalModuleDir);
		if (resolvedPath !== null) {
			return getDynamicModules()[resolvedPath]();
		}
		${r?"return require(path);":Ye}
	}
	handleRequire.resolve = function (path) {
		var resolvedPath = commonjsResolve(path, originalModuleDir);
		if (resolvedPath !== null) {
			return resolvedPath;
		}
		return require.resolve(path);
	}
	return handleRequire;
}

function commonjsResolve (path, originalModuleDir) {
	var shouldTryNodeModules = isPossibleNodeModulesPath(path);
	path = normalize(path);
	var relPath;
	if (path[0] === '/') {
		originalModuleDir = '';
	}
	var modules = getDynamicModules();
	var checkedExtensions = ['', '.js', '.json'];
	while (true) {
		if (!shouldTryNodeModules) {
			relPath = normalize(originalModuleDir + '/' + path);
		} else {
			relPath = normalize(originalModuleDir + '/node_modules/' + path);
		}

		if (relPath.endsWith('/..')) {
			break; // Travelled too far up, avoid infinite loop
		}

		for (var extensionIndex = 0; extensionIndex < checkedExtensions.length; extensionIndex++) {
			var resolvedPath = relPath + checkedExtensions[extensionIndex];
			if (modules[resolvedPath]) {
				return resolvedPath;
			}
		}
		if (!shouldTryNodeModules) break;
		var nextDir = normalize(originalModuleDir + '/..');
		if (nextDir === originalModuleDir) break;
		originalModuleDir = nextDir;
	}
	return null;
}

function isPossibleNodeModulesPath (modulePath) {
	var c0 = modulePath[0];
	if (c0 === '/' || c0 === '\\\\') return false;
	var c1 = modulePath[1], c2 = modulePath[2];
	if ((c0 === '.' && (!c1 || c1 === '/' || c1 === '\\\\')) ||
		(c0 === '.' && c1 === '.' && (!c2 || c2 === '/' || c2 === '\\\\'))) return false;
	if (c1 === ':' && (c2 === '/' || c2 === '\\\\')) return false;
	return true;
}

function normalize (path) {
	path = path.replace(/\\\\/g, '/');
	var parts = path.split('/');
	var slashed = parts[0] === '';
	for (var i = 1; i < parts.length; i++) {
		if (parts[i] === '.' || parts[i] === '') {
			parts.splice(i--, 1);
		}
	}
	for (var i = 1; i < parts.length; i++) {
		if (parts[i] !== '..') continue;
		if (i > 0 && parts[i - 1] !== '..' && parts[i - 1] !== '.') {
			parts.splice(--i, 2);
			i--;
		}
	}
	path = parts.join('/');
	if (slashed && path[0] !== '/') path = '/' + path;
	else if (path.length === 0) path = '.';
	return path;
}`}const _=(e,t)=>e.endsWith(t),L=(e,t)=>`\0${e}${t}`,Z=(e,t)=>e.slice(1,-t.length),ie="?commonjs-proxy",Ne="?commonjs-wrapped",B="?commonjs-external",me="?commonjs-exports",he="?commonjs-module",Q="?commonjs-entry",F="?commonjs-es-import",ye="\0commonjs-dynamic-modules",W="\0commonjsHelpers.js",C="withRequireFunction",Ot=`
export var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

export function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

export function getDefaultExportFromNamespaceIfPresent (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
}

export function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

export function getAugmentedNamespace(n) {
  if (n.__esModule) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			if (this instanceof a) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}
`;function Mt(){return Ot}function Ze(e,t){if(t===!0||e.endsWith(".json"))return`export { default } from ${JSON.stringify(e)};`;const n=Y(e),r=t==="auto"?`import { getDefaultExportFromNamespaceIfNotNamed } from "${W}"; export default /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(${n});`:t==="preferred"?`import { getDefaultExportFromNamespaceIfPresent } from "${W}"; export default /*@__PURE__*/getDefaultExportFromNamespaceIfPresent(${n});`:t?`export default ${n};`:`import { getAugmentedNamespace } from "${W}"; export default /*@__PURE__*/getAugmentedNamespace(${n});`;return`import * as ${n} from ${JSON.stringify(e)}; ${r}`}async function Pt(e,t,n){const r=Y(e),{meta:{commonjs:s}}=await n({id:e});return s?s.isCommonJS?`export { __moduleExports as default } from ${JSON.stringify(e)};`:t?t!==!0&&(t==="namespace"||!s.hasDefaultExport||t==="auto"&&s.hasNamedExports)?`import * as ${r} from ${JSON.stringify(e)}; export default ${r};`:`export { default } from ${JSON.stringify(e)};`:`import { getAugmentedNamespace } from "${W}"; import * as ${r} from ${JSON.stringify(e)}; export default /*@__PURE__*/getAugmentedNamespace(${r});`:Ze(e,t)}function Ct(e,t,n,r){const{meta:{commonjs:s},hasDefaultExport:i}=n(e);if(!s||s.isCommonJS!==C){const u=JSON.stringify(e);let l=`export * from ${u};`;return i&&(l+=`export { default } from ${u};`),r+l}const a=Qe(e,t);return{...a,code:r+a.code}}function Qe(e,t){const n=Y(e),r=`${n}Exports`,s=`require${_e(n)}`;let i=`import { getDefaultExportFromCjs } from "${W}";
import { __require as ${s} } from ${JSON.stringify(e)};
var ${r} = ${s}();
export { ${r} as __moduleExports };`;return t===!0?i+=`
export { ${r} as default };`:i+=`export default /*@__PURE__*/getDefaultExportFromCjs(${r});`,{code:i,syntheticNamedExports:"__moduleExports"}}function kt(e,t){return[e+t,`${e}${ft}index${t}`]}function At(e,t){return t.reduce((n,r)=>n.concat(kt(e,r)),[e])}function Ke(e,t,n){if(e[0]!=="."||!t)return;const r=fe(ne(t),e),s=At(r,n);for(let i=0;i<s.length;i+=1)try{if(Ve(s[i]).isFile())return{id:s[i]}}catch{}}function Jt(e,t){const n=new Map;return{currentlyResolving:n,async resolveId(r,s,i){const a=i.custom;if(a&&a["node-resolve"]&&a["node-resolve"].isRequire)return null;const u=n.get(s);if(u&&u.has(r))return this.warn({code:"THIS_RESOLVE_WITHOUT_OPTIONS",message:`It appears a plugin has implemented a "resolveId" hook that uses "this.resolve" without forwarding the third "options" parameter of "resolveId". This is problematic as it can lead to wrong module resolutions especially for the node-resolve plugin and in certain cases cause early exit errors for the commonjs plugin.
In rare cases, this warning can appear if the same file is both imported and required from the same mixed ES/CommonJS module, in which case it can be ignored.`,url:"https://rollupjs.org/guide/en/#resolveid"}),null;if(_(r,Ne))return Z(r,Ne);if(r.endsWith(Q)||_(r,he)||_(r,me)||_(r,ie)||_(r,F)||_(r,B)||r.startsWith(W)||r===ye)return r;if(s){if(s===ye||_(s,ie)||_(s,F)||s.endsWith(Q))return r;if(_(s,B))return await this.resolve(r,s,Object.assign({skipSelf:!0},i))?{id:r,external:!0}:null}if(r.startsWith("\0"))return null;const l=await this.resolve(r,s,Object.assign({skipSelf:!0},i))||Ke(r,s,e);if(!l||l.external||l.id.endsWith(Q)||_(l.id,F)||!t(l.id))return l;const p=await this.load(l),{meta:{commonjs:w}}=p;if(w){const{isCommonJS:R}=w;if(R){if(i.isEntry)return p.moduleSideEffects=!0,l.id+Q;if(R===C)return{id:L(l.id,F),meta:{commonjs:{resolved:l}}}}}return l}}}function Tt(e,t,n){const r=Object.create(null),s=Object.create(null),i=Object.create(null),a=Object.create(null),u=c=>a[c]||(a[c]=new Set),l=c=>{const m=new Set(u(c));for(const h of m){if(h===c)return!0;for(const g of u(h))m.add(g)}return!1},p=Object.create(null),w=c=>{const m=r[c];return m!==!0||!t||p[c]?m:l(c)?r[c]=C:m},R=(c,m)=>{p[c]||(r[c]=m,t&&r[c]===!0&&s[c]&&!i[c]&&(r[c]=C))},b=async(c,m,h,g)=>{const y=m.id;s[y]=!0,h||r[c]===C||(i[y]=!0),u(c).add(y),l(y)||await g(m)},E=async(c,m)=>{if(c.id in r)return r[c.id];const{meta:{commonjs:h}}=await m(c);return h&&h.isCommonJS||!1};return{getWrappedIds:()=>Object.keys(r).filter(c=>r[c]===C),isRequiredId:c=>s[c],async shouldTransformCachedModule({id:c,resolvedSources:m,meta:{commonjs:h}}){if(h&&h.isCommonJS||(r[c]=!1),_(c,F))return!1;const g=h&&h.requires;if(g){if(R(c,h.initialCommonJSType),await Promise.all(g.map(({resolved:$,isConditional:v})=>b(c,$,v,this.load))),w(c)!==h.isCommonJS)return!0;for(const{resolved:{id:$}}of g)if(w($)!==h.isRequiredCommonJS[$])return!0;p[c]=!0;for(const{resolved:{id:$}}of g)p[$]=!0}const y=new Set((g||[]).map(({resolved:{id:$}})=>$));return(await Promise.all(Object.keys(m).map($=>m[$]).filter(({id:$,external:v})=>!(v||y.has($))).map(async $=>_($.id,F)?await E((await this.load({id:$.id})).meta.commonjs.resolved,this.load)!==C:await E($,this.load)===C))).some($=>$)},resolveRequireSourcesAndUpdateMeta:c=>async(m,h,g,y)=>{g.initialCommonJSType=h,g.requires=[],g.isRequiredCommonJS=Object.create(null),R(m,h);const $=n.get(m)||new Set;n.set(m,$);const v=await Promise.all(y.map(async({source:x,isConditional:M})=>{if(x.startsWith("\0"))return{id:x,allowProxy:!1};$.add(x);const j=await c.resolve(x,m,{skipSelf:!1,custom:{"node-resolve":{isRequire:!0}}})||Ke(x,m,e);if($.delete(x),!j)return{id:L(x,B),allowProxy:!1};const I=j.id;return j.external?{id:L(I,B),allowProxy:!1}:(g.requires.push({resolved:j,isConditional:M}),await b(m,j,M,c.load),{id:I,allowProxy:!0})}));return g.isCommonJS=w(m),p[m]=!0,v.map(({id:x,allowProxy:M},j)=>{const I=g.isRequiredCommonJS[x]=w(x);return p[x]=!0,{source:y[j].source,id:M?I===C?L(x,Ne):L(x,ie):x,isCommonJS:I}})},isCurrentlyResolving(c,m){const h=n.get(m);return h&&h.has(c)}}}function Xe(e,t,n){const r=/\^(\d+\.\d+\.\d+)/g;let s=1/0,i=1/0,a=1/0,u;for(;u=r.exec(t);){const[R,b,E]=u[1].split(".").map(Number);R<s&&(s=R,i=b,a=E)}if(!e)throw new Error(`Insufficient ${n} version: "@rollup/plugin-commonjs" requires at least ${n}@${s}.${i}.${a}.`);const[l,p,w]=e.split(".").map(Number);if(l<s||l===s&&(p<i||p===i&&w<a))throw new Error(`Insufficient ${n} version: "@rollup/plugin-commonjs" requires at least ${n}@${s}.${i}.${a} but found ${n}@${e}.`)}const ge={"==":e=>et(e.left,e.right,!1),"!=":e=>Oe(ge["=="](e)),"===":e=>et(e.left,e.right,!0),"!==":e=>Oe(ge["==="](e)),"!":e=>xe(e.argument),"&&":e=>A(e.left)&&A(e.right),"||":e=>A(e.left)||A(e.right)};function Oe(e){return e===null?e:!e}function et(e,t,n){return e.type!==t.type?null:e.type==="Literal"?n?e.value===t.value:e.value==t.value:null}function A(e){return e?e.type==="Literal"?!!e.value:e.type==="ParenthesizedExpression"?A(e.expression):e.operator in ge?ge[e.operator](e):null:!1}function xe(e){return Oe(A(e))}function Me(e){const t=[];for(;e.type==="MemberExpression";){if(e.computed)return null;t.unshift(e.property.name),e=e.object}if(e.type!=="Identifier")return null;const{name:n}=e;return t.unshift(n),{name:n,keypath:t.join(".")}}const tt="__esModule";function Ft(e){const t=rt(e,"exports"),n=t||rt(e,"module.exports");return n&&n.key===tt&&A(n.value)?t?"exports":"module":!1}function rt(e,t){const{callee:{object:n,property:r}}=e;if(!n||n.type!=="Identifier"||n.name!=="Object"||!r||r.type!=="Identifier"||r.name!=="defineProperty"||e.arguments.length!==3)return;const s=t.split("."),[i,a,u]=e.arguments;if(s.length===1&&(i.type!=="Identifier"||i.name!==s[0])||s.length===2&&(i.type!=="MemberExpression"||i.object.name!==s[0]||i.property.name!==s[1])||u.type!=="ObjectExpression"||!u.properties)return;const l=u.properties.find(p=>p.key&&p.key.name==="value");if(!(!l||!l.value))return{key:a.value,value:l.value}}function Wt(e){return e&&e.type==="Property"&&e.shorthand}function Ut(e,t,n,r,s){const i=[],a=[];t.module&&(i.push("module"),a.push(n)),t.exports&&(i.push("exports"),a.push(t.module?`${n}.exports`:r)),e.trim().indent("	",{exclude:s}).prepend(`(function (${i.join(", ")}) {
`).append(` 
} (${a.join(", ")}));`)}function zt(e,t,n,r,s,i,a,u,l,p,w,R,b,E,c,m,h){const g=[],y=[];return m?Lt(e,s,E,g,i,u,t,n,h,p):E==="replace"?Bt(e,g,y,i,a,n,c,b):(E==="module"?(y.push(`var ${r} = ${t}.exports`),g.push(`${r} as __moduleExports`)):g.push(`${n} as __moduleExports`),s?y.push(Pe(r,c,b)):Vt(e,g,y,i,u,w,l,t,n,r,p,b,c,E)),g.length&&y.push(`export { ${g.join(", ")} }`),`

${y.join(`;
`)};`}function Lt(e,t,n,r,s,i,a,u,l,p){if(r.push(`${l} as __require`),!t)if(n==="replace")ot(e,s,u);else{ot(e,s,`${a}.exports`);for(const[w,{nodes:R}]of i)for(const{node:b,type:E}of R)e.overwrite(b.start,b.left.end,`${n==="module"&&E==="module"?`${a}.exports`:u}.${w}`);nt(p,e,n,a,u)}}function Bt(e,t,n,r,s,i,a,u){for(const{left:l}of r)e.overwrite(l.start,l.end,i);e.prependRight(s.left.start,"var "),t.push(`${i} as __moduleExports`),n.push(Pe(i,a,u))}function Pe(e,t,n){return`export default ${t===!0?e:t===!1?`${e}.default`:`/*@__PURE__*/${n}.getDefaultExportFromCjs(${e})`}`}function Vt(e,t,n,r,s,i,a,u,l,p,w,R,b,E){let c;for(const{left:h}of r)e.overwrite(h.start,h.end,`${u}.exports`);for(const[h,{nodes:g}]of s){const y=i[h];let $=!0;for(const{node:v,type:x}of g){let M=`${y} = ${E==="module"&&x==="module"?`${u}.exports`:l}.${h}`;$&&a.has(v)&&(M=`var ${M}`,$=!1),e.overwrite(v.start,v.left.end,M)}$&&e.prepend(`var ${y};
`),h==="default"?c=y:t.push(h===y?h:`${y} as ${h}`)}const m=nt(w,e,E,u,l);b===!1||b==="auto"&&m&&r.length===0?t.push(`${c||p} as default`):b===!0||!m&&r.length===0?t.push(`${p} as default`):n.push(Pe(p,b,R))}function ot(e,t,n){for(const{left:r}of t)e.overwrite(r.start,r.end,n)}function nt(e,t,n,r,s){let i=!1;for(const{node:a,type:u}of e){i=!0;const l=a.type==="CallExpression"?a.arguments[0]:a.left.object;t.overwrite(l.start,l.end,n==="module"&&u==="module"?`${r}.exports`:s)}return i}function Gt(e,t){return!e||e.type!=="CallExpression"||e.arguments.length===0?!1:st(e.callee,t)}function st(e,t){return e.type==="Identifier"&&e.name==="require"&&!t.contains("require")||e.type==="MemberExpression"&&it(e,t)}function it({object:e,property:t},n){return e.type==="Identifier"&&e.name==="module"&&t.type==="Identifier"&&t.name==="require"&&!n.contains("module")}function Ht(e){return e.arguments.length>1||e.arguments[0].type!=="Literal"&&(e.arguments[0].type!=="TemplateLiteral"||e.arguments[0].expressions.length>0)}const Yt={resolve:!0,cache:!0,main:!0};function Zt(e){return e&&e.property&&Yt[e.property.name]}function Qt(e){return e.arguments[0].type==="Literal"?e.arguments[0].value:e.arguments[0].quasis[0].value.cooked}function Kt(){const e=[];function t(r,s,i,a,u,l,p){e.push({sourceId:r,node:s,scope:i,usesReturnValue:a,isInsideTryBlock:u,isInsideConditional:l,toBeRemoved:p})}async function n(r,s,i,a,u,l,p,w,R,b,E,c,m,h,g){const y=[];y.push(`import * as ${a} from "${W}"`),u&&y.push(`import { ${m?De:Ie} as ${u} } from "${ye}"`),R==="module"?y.push(`import { __module as ${l} } from ${JSON.stringify(L(w,he))}`,`var ${p} = ${l}.exports`):R==="exports"&&y.push(`import { __exports as ${p} } from ${JSON.stringify(L(w,me))}`);const $=Xt(e),v=await b(w,E?C:!c,g,Object.keys($).map(x=>({source:x,isConditional:$[x].every(M=>M.isInsideConditional)})));return er(y,v,$,h,r),y.length?`${y.join(`;
`)};

`:""}return{addRequireExpression:t,rewriteRequireExpressionsAndGetImportBlock:n}}function Xt(e){const t=Object.create(null);for(const n of e){const{sourceId:r}=n;t[r]||(t[r]=[]),t[r].push(n)}return t}function er(e,t,n,r,s){const i=tr();for(const{source:a,id:u,isCommonJS:l}of t){const p=n[a],w=i(p);let R=!1,b=!1;for(const{node:E,usesReturnValue:c,toBeRemoved:m,isInsideTryBlock:h}of p){const{canConvertRequire:g,shouldRemoveRequire:y}=h&&_(u,B)?r(a):{canConvertRequire:!0,shouldRemoveRequire:!1};y?c?s.overwrite(E.start,E.end,"undefined"):s.remove(m.start,m.end):g&&(b=!0,l===C?s.overwrite(E.start,E.end,`${w}()`):c?(R=!0,s.overwrite(E.start,E.end,w)):s.remove(m.start,m.end))}b&&(l===C?e.push(`import { __require as ${w} } from ${JSON.stringify(u)}`):e.push(`import ${R?`${w} from `:""}${JSON.stringify(u)}`))}}function tr(){let e=0;return t=>{let n;const r=({scope:s})=>s.contains(n);do n=`require$$${e}`,e+=1;while(t.some(r));return n}}const rr=/^(?:module\.)?exports(?:\.([a-zA-Z_$][a-zA-Z_$0-9]*))?$/,at=/^(?:FunctionDeclaration|FunctionExpression|ArrowFunctionExpression)$/;async function or(e,t,n,r,s,i,a,u,l,p,w,R,b,E,c,m,h,g,y){const $=b||Ge(e,t,n),v=new $t(t),x={module:!1,exports:!1,global:!1,require:!1},M=p&&He(ne(n),R);let j=pt($,"scope"),I=0,J=0,f=0,d=null,q=!1;const N=new Set;let O=null;const U=new Set,{addRequireExpression:$e,rewriteRequireExpressionsAndGetImportBlock:z}=Kt(),ae=new Set,ue=[],P=new Set,V=new Set([j]),Ce=new Set([j]),le=[];let ce=null;const K=new Map,ke=new Set,X=[],ve=[],G=[],Ae=new Set,we=[];xt($,{enter(o,D){if(P.has(o)){this.skip();return}switch(d!==null&&o.start>d&&(d=null),O!==null&&o.start>O&&(O=null),O===null&&U.has(o)&&(O=o.end),J+=1,o.scope&&({scope:j}=o),at.test(o.type)&&(I+=1),l&&(v.addSourcemapLocation(o.start),v.addSourcemapLocation(o.end)),o.type){case"AssignmentExpression":if(o.left.type==="MemberExpression"){const S=Me(o.left);if(!S||j.contains(S.name))return;const re=rr.exec(S.keypath);if(!re||S.keypath==="exports")return;const[,k]=re;if(x[S.name]=!0,S.keypath==="module.exports")le.push(o),J>3?V.add(j):ce||(ce=o);else if(k===tt)J>3?q=!0:X.push({node:o,type:S.name});else{const oe=K.get(k)||{nodes:[],scopes:new Set};oe.nodes.push({node:o,type:S.name}),oe.scopes.add(j),Ce.add(j),K.set(k,oe),J<=3&&ke.add(o)}P.add(o.left)}else for(const S of Be(o.left))ae.add(S);return;case"CallExpression":{const S=Ft(o);if(S){J===3&&D.type==="ExpressionStatement"?(P.add(o.arguments[0]),X.push({node:o,type:S})):q=!0;return}if(p&&o.callee.object&&st(o.callee.object,j)&&o.callee.property.name==="resolve"){g(o.start),x.require=!0;const k=o.callee.object;G.push(k),P.add(o.callee);return}if(!Gt(o,j)){const k=Me(o.callee);k&&Ae.has(k.name)&&(O=1/0);return}if(P.add(o.callee),x.require=!0,Ht(o)){p&&g(o.start),a||G.push(o.callee);return}const re=Qt(o);if(!i(re)){const k=D.type!=="ExpressionStatement",oe=D.type==="ExpressionStatement"&&(!O||d!==null&&d<O)?D:o;if($e(re,o,j,k,d!==null,O!==null,oe),D.type==="VariableDeclarator"&&D.id.type==="Identifier")for(const dt of Be(D.id))Ae.add(dt)}return}case"ClassBody":f+=1;return;case"ConditionalExpression":case"IfStatement":xe(o.test)?P.add(o.consequent):A(o.test)?o.alternate&&P.add(o.alternate):(U.add(o.consequent),o.alternate&&U.add(o.alternate));return;case"ArrowFunctionExpression":case"FunctionDeclaration":case"FunctionExpression":O===null&&!(D.type==="CallExpression"&&D.callee===o)&&(O=o.end);return;case"Identifier":{const{name:S}=o;if(!vt(o,D)||j.contains(S)||D.type==="PropertyDefinition"&&D.key===o)return;switch(S){case"require":if(x.require=!0,Zt(D))return;a||(Wt(D)&&(P.add(D.value),v.prependRight(o.start,"require: ")),G.push(o));return;case"module":case"exports":q=!0,x[S]=!0;return;case"global":x.global=!0,s||ve.push(o);return;case"define":v.overwrite(o.start,o.end,"undefined",{storeName:!0});return;default:N.add(S);return}}case"LogicalExpression":o.operator==="&&"?xe(o.left)?P.add(o.right):A(o.left)||U.add(o.right):o.operator==="||"&&(A(o.left)?P.add(o.right):xe(o.left)||U.add(o.right));return;case"MemberExpression":!p&&it(o,j)&&(x.require=!0,G.push(o),P.add(o.object),P.add(o.property));return;case"ReturnStatement":I===0&&(q=!0);return;case"ThisExpression":I===0&&!f&&(x.global=!0,s||ve.push(o));return;case"TryStatement":d===null&&(d=o.block.end),O===null&&(O=o.end);return;case"UnaryExpression":if(o.operator==="typeof"){const S=Me(o.argument);if(!S||j.contains(S.name))return;!r&&(S.keypath==="module.exports"||S.keypath==="module"||S.keypath==="exports")&&v.overwrite(o.start,o.end,"'object'",{storeName:!1})}return;case"VariableDeclaration":j.parent||ue.push(o);return;case"TemplateElement":o.value.raw.includes(`
`)&&we.push([o.start,o.end])}},leave(o){J-=1,o.scope&&(j=j.parent),at.test(o.type)&&(I-=1),o.type==="ClassBody"&&(f-=1)}});const ee=Y(n),H=T([...Ce],N,ee),de=T([...V],N,`${ee}Module`),Je=T([j],N,`require${_e(ee)}`),je=T([j],N,`hasRequired${_e(ee)}`),Ee=T([j],N,"commonjsHelpers"),be=G.length>0&&T([j],N,p?De:Ie),Te=Object.create(null);for(const[o,{scopes:D}]of K)Te[o]=T([...D],N,o);for(const o of ve)v.overwrite(o.start,o.end,`${Ee}.commonjsGlobal`,{storeName:!0});for(const o of G)v.overwrite(o.start,o.end,p?`${be}(${JSON.stringify(M)})`:be,{contentOnly:!0,storeName:!0});if(q=!r&&(q||x.exports&&le.length>0),!(q||h||c||x.module||x.exports||x.require||X.length>0)&&(s||!x.global))return{meta:{commonjs:{isCommonJS:!1}}};let Fe="";if(t.startsWith("/*")){const o=t.indexOf("*/",2)+2;Fe=`${t.slice(0,o)}
`,v.remove(0,o).trim()}let Re="";if(t.startsWith("#!")){const o=t.indexOf(`
`)+1;Re=t.slice(0,o),v.remove(0,o).trim()}const te=r?"none":q?x.module?"module":"exports":ce?K.size===0&&X.length===0?"replace":"module":le.length===0?"exports":"module",ut=te==="module"?T([],N,`${ee}Exports`):H,lt=await z(v,ue,ae,Ee,be,de,H,n,te,m,c,r,p,u,y),qe=y.isCommonJS===C,ct=r?"":zt(v,de,H,ut,q,le,ce,K,ke,X,Te,t,Ee,te,E,qe,Je);if(q&&Ut(v,x,de,H,we),qe){v.trim().indent("	",{exclude:we});const o=te==="module"?`${de}.exports`:H;v.prepend(`var ${je};

function ${Je} () {
	if (${je}) return ${o};
	${je} = 1;
`).append(`
	return ${o};
}`),te==="replace"&&v.prepend(`var ${H};
`)}return v.trim().prepend(Re+Fe+lt).append(ct),{code:v.toString(),map:l?v.generateMap():null,syntheticNamedExports:r||qe?!1:"__moduleExports",meta:{commonjs:{...y,shebang:Re}}}}const nr="commonjs";function sr(e={}){const{ignoreGlobal:t,ignoreDynamicRequires:n,requireReturnsDefault:r,defaultIsModuleExports:s,esmExternals:i}=e,a=e.extensions||[".js"],u=Le(e.include,e.exclude),l=f=>{const d=Ue(f);return d===".cjs"||a.includes(d)&&u(f)},{strictRequiresFilter:p,detectCyclesAndConditional:w}=St(e),R=typeof r=="function"?r:()=>r;let b;const E=typeof i=="function"?i:Array.isArray(i)?(b=new Set(i),f=>b.has(f)):()=>i,c=typeof s=="function"?s:()=>typeof s=="boolean"?s:"auto",m=typeof e.dynamicRequireRoot=="string"?fe(e.dynamicRequireRoot):process.cwd(),{commonDir:h,dynamicRequireModules:g}=Dt(e.dynamicRequireTargets,m),y=g.size>0,$=typeof e.ignore=="function"?e.ignore:Array.isArray(e.ignore)?f=>e.ignore.includes(f):()=>!1,v=f=>{const d=typeof e.ignoreTryCatch=="function"?e.ignoreTryCatch(f):Array.isArray(e.ignoreTryCatch)?e.ignoreTryCatch.includes(f):typeof e.ignoreTryCatch<"u"?e.ignoreTryCatch:!0;return{canConvertRequire:d!=="remove"&&d!==!0,shouldRemoveRequire:d==="remove"}},{currentlyResolving:x,resolveId:M}=Jt(a,l),j=e.sourceMap!==!1;let I;function J(f,d){const q=se(d),{isEsModule:N,hasDefaultExport:O,hasNamedExports:U,ast:$e}=qt(this.parse,f,d),z=this.getModuleInfo(d).meta.commonjs||{};if(O&&(z.hasDefaultExport=!0),U&&(z.hasNamedExports=!0),!g.has(q)&&(!(Rt(f,t)||I.isRequiredId(d))||N&&!e.transformMixedEsModules))return z.isCommonJS=!1,{meta:{commonjs:z}};const ae=!N&&(g.has(q)||p(d)),ue=P=>{const V=se(m);q.indexOf(V)!==0&&this.error({code:"DYNAMIC_REQUIRE_OUTSIDE_ROOT",normalizedId:q,normalizedDynamicRequireRoot:V,message:`"${q}" contains dynamic require statements but it is not within the current dynamicRequireRoot "${V}". You should set dynamicRequireRoot to "${ne(q)}" or one of its parent directories.`},P)};return or(this.parse,f,d,N,t||N,$,n&&!y,v,j,y,g,h,$e,c(d),ae,I.resolveRequireSourcesAndUpdateMeta(this),I.isRequiredId(d),ue,z)}return{name:nr,version:wt,options(f){const d=Array.isArray(f.plugins)?[...f.plugins]:f.plugins?[f.plugins]:[];return d.unshift({name:"commonjs--resolver",resolveId:M}),{...f,plugins:d}},buildStart({plugins:f}){Xe(this.meta.rollupVersion,jt.rollup,"rollup");const d=f.find(({name:q})=>q==="node-resolve");d&&Xe(d.version,"^13.0.6","@rollup/plugin-node-resolve"),e.namedExports!=null&&this.warn('The namedExports option from "@rollup/plugin-commonjs" is deprecated. Named exports are now handled automatically.'),I=Tt(a,w,x)},buildEnd(){if(e.strictRequires==="debug"){const f=I.getWrappedIds();f.length?this.warn({code:"WRAPPED_IDS",ids:f,message:`The commonjs plugin automatically wrapped the following files:
[
${f.map(d=>`	${JSON.stringify(We(process.cwd(),d))}`).join(`,
`)}
]`}):this.warn({code:"WRAPPED_IDS",ids:f,message:"The commonjs plugin did not wrap any files."})}},load(f){if(f===W)return Mt();if(_(f,he)){const d=Y(Z(f,he));return{code:`var ${d} = {exports: {}}; export {${d} as __module}`,meta:{commonjs:{isCommonJS:!1}}}}if(_(f,me)){const d=Y(Z(f,me));return{code:`var ${d} = {}; export {${d} as __exports}`,meta:{commonjs:{isCommonJS:!1}}}}if(_(f,B)){const d=Z(f,B);return Ze(d,E(d)?R(d):!0)}if(f.endsWith(Q)){const d=f.slice(0,-Q.length),{meta:{commonjs:q}}=this.getModuleInfo(d),N=q?.shebang??"";return Ct(d,c(d),this.getModuleInfo,N)}if(_(f,F)){const d=Z(f,F);return Qe(d,c(d))}if(f===ye)return Nt(y,g,h,n);if(_(f,ie)){const d=Z(f,ie);return Pt(d,R(d),this.load)}return null},shouldTransformCachedModule(...f){return I.shouldTransformCachedModule.call(this,...f)},transform(f,d){if(!l(d))return null;try{return J.call(this,f,d)}catch(q){return this.error(q,q.pos)}}}}export{sr as default};

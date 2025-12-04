import{PasswordPrompt as I,TextPrompt as _,ConfirmPrompt as q,SelectPrompt as O,SelectKeyPrompt as W,MultiSelectPrompt as G,GroupMultiSelectPrompt as F,isCancel as N,block as Z}from"../core@0.3.5/index.js";import{isCancel as be}from"../core@0.3.5/index.js";import h from"node:process";import e from"../../picocolors@1.1.1/index.js";import{cursor as R,erase as T}from"../../sisteransi@1.0.5/index.js";function z(){return h.platform!=="win32"?h.env.TERM!=="linux":!!h.env.CI||!!h.env.WT_SESSION||!!h.env.TERMINUS_SUBLIME||h.env.ConEmuTask==="{cmd::Cmder}"||h.env.TERM_PROGRAM==="Terminus-Sublime"||h.env.TERM_PROGRAM==="vscode"||h.env.TERM==="xterm-256color"||h.env.TERM==="alacritty"||h.env.TERMINAL_EMULATOR==="JetBrains-JediTerm"}const M=z(),u=(s,a)=>M?s:a,D=u("\u25C6","*"),A=u("\u25A0","x"),E=u("\u25B2","x"),b=u("\u25C7","o"),U=u("\u250C","T"),n=u("\u2502","|"),d=u("\u2514","\u2014"),C=u("\u25CF",">"),x=u("\u25CB"," "),S=u("\u25FB","[\u2022]"),f=u("\u25FC","[+]"),P=u("\u25FB","[ ]"),J=u("\u25AA","\u2022"),V=u("\u2500","-"),K=u("\u256E","+"),L=u("\u251C","+"),Y=u("\u256F","+"),H=u("\u25CF","\u2022"),Q=u("\u25C6","*"),X=u("\u25B2","!"),ee=u("\u25A0","x"),y=s=>{switch(s){case"initial":case"active":return e.cyan(D);case"cancel":return e.red(A);case"error":return e.yellow(E);case"submit":return e.green(b)}},te=s=>new _({validate:s.validate,placeholder:s.placeholder,defaultValue:s.defaultValue,initialValue:s.initialValue,render(){const a=`${e.gray(n)}
${y(this.state)}  ${s.message}
`,r=s.placeholder?e.inverse(s.placeholder[0])+e.dim(s.placeholder.slice(1)):e.inverse(e.hidden("_")),t=this.value?this.valueWithCursor:r;switch(this.state){case"error":return`${a.trim()}
${e.yellow(n)}  ${t}
${e.yellow(d)}  ${e.yellow(this.error)}
`;case"submit":return`${a}${e.gray(n)}  ${e.dim(this.value||s.placeholder)}`;case"cancel":return`${a}${e.gray(n)}  ${e.strikethrough(e.dim(this.value??""))}${this.value?.trim()?`
`+e.gray(n):""}`;default:return`${a}${e.cyan(n)}  ${t}
${e.cyan(d)}
`}}}).prompt(),se=s=>new I({validate:s.validate,mask:s.mask??J,render(){const a=`${e.gray(n)}
${y(this.state)}  ${s.message}
`,r=this.valueWithCursor,t=this.masked;switch(this.state){case"error":return`${a.trim()}
${e.yellow(n)}  ${t}
${e.yellow(d)}  ${e.yellow(this.error)}
`;case"submit":return`${a}${e.gray(n)}  ${e.dim(t)}`;case"cancel":return`${a}${e.gray(n)}  ${e.strikethrough(e.dim(t??""))}${t?`
`+e.gray(n):""}`;default:return`${a}${e.cyan(n)}  ${r}
${e.cyan(d)}
`}}}).prompt(),ie=s=>{const a=s.active??"Yes",r=s.inactive??"No";return new q({active:a,inactive:r,initialValue:s.initialValue??!0,render(){const t=`${e.gray(n)}
${y(this.state)}  ${s.message}
`,i=this.value?a:r;switch(this.state){case"submit":return`${t}${e.gray(n)}  ${e.dim(i)}`;case"cancel":return`${t}${e.gray(n)}  ${e.strikethrough(e.dim(i))}
${e.gray(n)}`;default:return`${t}${e.cyan(n)}  ${this.value?`${e.green(C)} ${a}`:`${e.dim(x)} ${e.dim(a)}`} ${e.dim("/")} ${this.value?`${e.dim(x)} ${e.dim(r)}`:`${e.green(C)} ${r}`}
${e.cyan(d)}
`}}}).prompt()},re=s=>{const a=(t,i)=>{const o=t.label??String(t.value);return i==="active"?`${e.green(C)} ${o} ${t.hint?e.dim(`(${t.hint})`):""}`:i==="selected"?`${e.dim(o)}`:i==="cancelled"?`${e.strikethrough(e.dim(o))}`:`${e.dim(x)} ${e.dim(o)}`};let r=0;return new O({options:s.options,initialValue:s.initialValue,render(){const t=`${e.gray(n)}
${y(this.state)}  ${s.message}
`;switch(this.state){case"submit":return`${t}${e.gray(n)}  ${a(this.options[this.cursor],"selected")}`;case"cancel":return`${t}${e.gray(n)}  ${a(this.options[this.cursor],"cancelled")}
${e.gray(n)}`;default:{const i=s.maxItems===void 0?1/0:Math.max(s.maxItems,5);this.cursor>=r+i-3?r=Math.max(Math.min(this.cursor-i+3,this.options.length-i),0):this.cursor<r+2&&(r=Math.max(this.cursor-2,0));const o=i<this.options.length&&r>0,c=i<this.options.length&&r+i<this.options.length;return`${t}${e.cyan(n)}  ${this.options.slice(r,r+i).map((l,m,$)=>m===0&&o?e.dim("..."):m===$.length-1&&c?e.dim("..."):a(l,m+r===this.cursor?"active":"inactive")).join(`
${e.cyan(n)}  `)}
${e.cyan(d)}
`}}}}).prompt()},ae=s=>{const a=(r,t="inactive")=>{const i=r.label??String(r.value);return t==="selected"?`${e.dim(i)}`:t==="cancelled"?`${e.strikethrough(e.dim(i))}`:t==="active"?`${e.bgCyan(e.gray(` ${r.value} `))} ${i} ${r.hint?e.dim(`(${r.hint})`):""}`:`${e.gray(e.bgWhite(e.inverse(` ${r.value} `)))} ${i} ${r.hint?e.dim(`(${r.hint})`):""}`};return new W({options:s.options,initialValue:s.initialValue,render(){const r=`${e.gray(n)}
${y(this.state)}  ${s.message}
`;switch(this.state){case"submit":return`${r}${e.gray(n)}  ${a(this.options.find(t=>t.value===this.value),"selected")}`;case"cancel":return`${r}${e.gray(n)}  ${a(this.options[0],"cancelled")}
${e.gray(n)}`;default:return`${r}${e.cyan(n)}  ${this.options.map((t,i)=>a(t,i===this.cursor?"active":"inactive")).join(`
${e.cyan(n)}  `)}
${e.cyan(d)}
`}}}).prompt()},ne=s=>{const a=(r,t)=>{const i=r.label??String(r.value);return t==="active"?`${e.cyan(S)} ${i} ${r.hint?e.dim(`(${r.hint})`):""}`:t==="selected"?`${e.green(f)} ${e.dim(i)}`:t==="cancelled"?`${e.strikethrough(e.dim(i))}`:t==="active-selected"?`${e.green(f)} ${i} ${r.hint?e.dim(`(${r.hint})`):""}`:t==="submitted"?`${e.dim(i)}`:`${e.dim(P)} ${e.dim(i)}`};return new G({options:s.options,initialValues:s.initialValues,required:s.required??!0,cursorAt:s.cursorAt,validate(r){if(this.required&&r.length===0)return`Please select at least one option.
${e.reset(e.dim(`Press ${e.gray(e.bgWhite(e.inverse(" space ")))} to select, ${e.gray(e.bgWhite(e.inverse(" enter ")))} to submit`))}`},render(){let r=`${e.gray(n)}
${y(this.state)}  ${s.message}
`;switch(this.state){case"submit":return`${r}${e.gray(n)}  ${this.options.filter(({value:t})=>this.value.includes(t)).map(t=>a(t,"submitted")).join(e.dim(", "))||e.dim("none")}`;case"cancel":{const t=this.options.filter(({value:i})=>this.value.includes(i)).map(i=>a(i,"cancelled")).join(e.dim(", "));return`${r}${e.gray(n)}  ${t.trim()?`${t}
${e.gray(n)}`:""}`}case"error":{const t=this.error.split(`
`).map((i,o)=>o===0?`${e.yellow(d)}  ${e.yellow(i)}`:`   ${i}`).join(`
`);return r+e.yellow(n)+"  "+this.options.map((i,o)=>{const c=this.value.includes(i.value),l=o===this.cursor;return l&&c?a(i,"active-selected"):c?a(i,"selected"):a(i,l?"active":"inactive")}).join(`
${e.yellow(n)}  `)+`
`+t+`
`}default:return`${r}${e.cyan(n)}  ${this.options.map((t,i)=>{const o=this.value.includes(t.value),c=i===this.cursor;return c&&o?a(t,"active-selected"):o?a(t,"selected"):a(t,c?"active":"inactive")}).join(`
${e.cyan(n)}  `)}
${e.cyan(d)}
`}}}).prompt()},oe=s=>{const a=(r,t,i=[])=>{const o=r.label??String(r.value),c=typeof r.group=="string",l=c&&(i[i.indexOf(r)+1]??{group:!0}),m=c&&l.group===!0,$=c?`${m?d:n} `:"";return t==="active"?`${e.dim($)}${e.cyan(S)} ${o} ${r.hint?e.dim(`(${r.hint})`):""}`:t==="group-active"?`${$}${e.cyan(S)} ${e.dim(o)}`:t==="group-active-selected"?`${$}${e.green(f)} ${e.dim(o)}`:t==="selected"?`${e.dim($)}${e.green(f)} ${e.dim(o)}`:t==="cancelled"?`${e.strikethrough(e.dim(o))}`:t==="active-selected"?`${e.dim($)}${e.green(f)} ${o} ${r.hint?e.dim(`(${r.hint})`):""}`:t==="submitted"?`${e.dim(o)}`:`${e.dim($)}${e.dim(P)} ${e.dim(o)}`};return new F({options:s.options,initialValues:s.initialValues,required:s.required??!0,cursorAt:s.cursorAt,validate(r){if(this.required&&r.length===0)return`Please select at least one option.
${e.reset(e.dim(`Press ${e.gray(e.bgWhite(e.inverse(" space ")))} to select, ${e.gray(e.bgWhite(e.inverse(" enter ")))} to submit`))}`},render(){let r=`${e.gray(n)}
${y(this.state)}  ${s.message}
`;switch(this.state){case"submit":return`${r}${e.gray(n)}  ${this.options.filter(({value:t})=>this.value.includes(t)).map(t=>a(t,"submitted")).join(e.dim(", "))}`;case"cancel":{const t=this.options.filter(({value:i})=>this.value.includes(i)).map(i=>a(i,"cancelled")).join(e.dim(", "));return`${r}${e.gray(n)}  ${t.trim()?`${t}
${e.gray(n)}`:""}`}case"error":{const t=this.error.split(`
`).map((i,o)=>o===0?`${e.yellow(d)}  ${e.yellow(i)}`:`   ${i}`).join(`
`);return`${r}${e.yellow(n)}  ${this.options.map((i,o,c)=>{const l=this.value.includes(i.value)||i.group===!0&&this.isGroupSelected(`${i.value}`),m=o===this.cursor;return!m&&typeof i.group=="string"&&this.options[this.cursor].value===i.group?a(i,l?"group-active-selected":"group-active",c):m&&l?a(i,"active-selected",c):l?a(i,"selected",c):a(i,m?"active":"inactive",c)}).join(`
${e.yellow(n)}  `)}
${t}
`}default:return`${r}${e.cyan(n)}  ${this.options.map((t,i,o)=>{const c=this.value.includes(t.value)||t.group===!0&&this.isGroupSelected(`${t.value}`),l=i===this.cursor;return!l&&typeof t.group=="string"&&this.options[this.cursor].value===t.group?a(t,c?"group-active-selected":"group-active",o):l&&c?a(t,"active-selected",o):c?a(t,"selected",o):a(t,l?"active":"inactive",o)}).join(`
${e.cyan(n)}  `)}
${e.cyan(d)}
`}}}).prompt()},j=s=>s.replace(me(),""),ce=(s="",a="")=>{const r=`
${s}
`.split(`
`),t=j(a).length,i=Math.max(r.reduce((c,l)=>(l=j(l),l.length>c?l.length:c),0),t)+2,o=r.map(c=>`${e.gray(n)}  ${e.dim(c)}${" ".repeat(i-j(c).length)}${e.gray(n)}`).join(`
`);process.stdout.write(`${e.gray(n)}
${e.green(b)}  ${e.reset(a)} ${e.gray(V.repeat(Math.max(i-t-1,1))+K)}
${o}
${e.gray(L+V.repeat(i+2)+Y)}
`)},le=(s="")=>{process.stdout.write(`${e.gray(d)}  ${e.red(s)}

`)},ue=(s="")=>{process.stdout.write(`${e.gray(U)}  ${s}
`)},$e=(s="")=>{process.stdout.write(`${e.gray(n)}
${e.gray(d)}  ${s}

`)},v={message:(s="",{symbol:a=e.gray(n)}={})=>{const r=[`${e.gray(n)}`];if(s){const[t,...i]=s.split(`
`);r.push(`${a}  ${t}`,...i.map(o=>`${e.gray(n)}  ${o}`))}process.stdout.write(`${r.join(`
`)}
`)},info:s=>{v.message(s,{symbol:e.blue(H)})},success:s=>{v.message(s,{symbol:e.green(Q)})},step:s=>{v.message(s,{symbol:e.green(b)})},warn:s=>{v.message(s,{symbol:e.yellow(X)})},warning:s=>{v.warn(s)},error:s=>{v.message(s,{symbol:e.red(ee)})}},de=()=>{const s=M?["\u25D2","\u25D0","\u25D3","\u25D1"]:["\u2022","o","O","0"],a=M?80:120;let r,t,i=!1,o="";const c=(g="")=>{i=!0,r=Z(),o=g.replace(/\.+$/,""),process.stdout.write(`${e.gray(n)}
`);let p=0,w=0;t=setInterval(()=>{const k=e.magenta(s[p]),B=".".repeat(Math.floor(w)).slice(0,3);process.stdout.write(R.move(-999,0)),process.stdout.write(T.down(1)),process.stdout.write(`${k}  ${o}${B}`),p=p+1<s.length?p+1:0,w=w<s.length?w+.125:0},a)},l=(g="",p=0)=>{o=g??o,i=!1,clearInterval(t);const w=p===0?e.green(b):p===1?e.red(A):e.red(E);process.stdout.write(R.move(-999,0)),process.stdout.write(T.down(1)),process.stdout.write(`${w}  ${o}
`),r()},m=(g="")=>{o=g??o},$=g=>{const p=g>1?"Something went wrong":"Canceled";i&&l(p,g)};return process.on("uncaughtExceptionMonitor",()=>$(2)),process.on("unhandledRejection",()=>$(2)),process.on("SIGINT",()=>$(1)),process.on("SIGTERM",()=>$(1)),process.on("exit",$),{start:c,stop:l,message:m}};function me(){const s=["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)","(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");return new RegExp(s,"g")}const he=async(s,a)=>{const r={},t=Object.keys(s);for(const i of t){const o=s[i],c=await o({results:r})?.catch(l=>{throw l});if(typeof a?.onCancel=="function"&&N(c)){r[i]="canceled",a.onCancel({results:r});continue}r[i]=c}return r};export{le as cancel,ie as confirm,he as group,oe as groupMultiselect,ue as intro,be as isCancel,v as log,ne as multiselect,ce as note,$e as outro,se as password,re as select,ae as selectKey,de as spinner,te as text};

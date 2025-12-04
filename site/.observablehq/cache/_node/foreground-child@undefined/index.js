import{spawn as d}from"child_process";import y from"../cross-spawn@7.0.6/index.js";import{onExit as I}from"../signal-exit@undefined/index.js";import k from"node:constants";const g=Object.keys(k).filter(o=>o.startsWith("SIG")&&o!=="SIGPROF"&&o!=="SIGKILL"),h=o=>{const t=new Map;for(const s of g){const r=()=>{try{o.kill(s)}catch{}};try{process.on(s,r),t.set(s,r)}catch{}}const e=()=>{for(const[s,r]of t)process.removeListener(s,r)};return o.on("exit",e),e},S=String.raw`
const pid = parseInt(process.argv[1], 10)
process.title = 'node (foreground-child watchdog pid=' + pid + ')'
if (!isNaN(pid)) {
  let barked = false
  // keepalive
  const interval = setInterval(() => {}, 60000)
  const bark = () => {
    clearInterval(interval)
    if (barked) return
    barked = true
    process.removeListener('SIGHUP', bark)
    setTimeout(() => {
      try {
        process.kill(pid, 'SIGKILL')
        setTimeout(() => process.exit(), 200)
      } catch (_) {}
    }, 500)
  })
  process.on('SIGHUP', bark)
}
`,b=o=>{let t=!1;const e=d(process.execPath,["-e",S,String(o.pid)],{stdio:"ignore"});return e.on("exit",()=>t=!0),o.on("exit",()=>{t||e.kill("SIGKILL")}),e},G=process?.platform==="win32"?y:d,u=o=>{let[t,e=[],s={},r=()=>{}]=o;if(typeof e=="function"?(r=e,s={},e=[]):e&&typeof e=="object"&&!Array.isArray(e)?(typeof s=="function"&&(r=s),s=e,e=[]):typeof s=="function"&&(r=s,s={}),Array.isArray(t)){const[n,...a]=t;t=n,e=a}return[t,e,{...s},r]};function v(...o){const[t,e,s,r]=u(o);s.stdio=[0,1,2],process.send&&s.stdio.push("ipc");const n=G(t,e,s),a=I(()=>{try{n.kill("SIGHUP")}catch{n.kill("SIGTERM")}});h(n);const m=b(n);let f=!1;return n.on("close",async(c,i)=>{if(f)return;f=!0;const l=r(c,i,{watchdogPid:m.pid}),p=x(l)?await l:l;if(a(),p!==!1)if(typeof p=="string"?(i=p,c=null):typeof p=="number"&&(c=p,i=null),i){setTimeout(()=>{},2e3);try{process.kill(process.pid,i)}catch{process.kill(process.pid,"SIGTERM")}}else process.exit(c||0)}),process.send&&(process.removeAllListeners("message"),n.on("message",(c,i)=>{process.send?.(c,i)}),process.on("message",(c,i)=>{n.send(c,i)})),n}const x=o=>!!o&&typeof o=="object"&&typeof o.then=="function";export{v as foregroundChild,u as normalizeFgArgs};

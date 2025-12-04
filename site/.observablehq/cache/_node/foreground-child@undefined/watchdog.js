import{spawn as s}from"child_process";const o=String.raw`
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
`,i=r=>{let t=!1;const e=s(process.execPath,["-e",o,String(r.pid)],{stdio:"ignore"});return e.on("exit",()=>t=!0),r.on("exit",()=>{t||e.kill("SIGKILL")}),e};export{i as watchdog};

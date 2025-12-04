import o from"node:os";const e=o.homedir();function r(t){if(typeof t!="string")throw new TypeError(`Expected a string, got ${typeof t}`);return e?t.replace(/^~(?=$|\/|\\)/,e):t}export{r as default};

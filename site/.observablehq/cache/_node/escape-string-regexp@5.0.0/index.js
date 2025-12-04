function e(r){if(typeof r!="string")throw new TypeError("Expected a string");return r.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}export{e as default};

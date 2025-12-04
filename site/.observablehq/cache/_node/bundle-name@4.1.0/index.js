import{runAppleScript as p}from"../run-applescript@7.1.0/index.js";async function e(t){return p(`tell application "Finder" to set app_path to application file id "${t}" as string
tell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`)}export{e as default};

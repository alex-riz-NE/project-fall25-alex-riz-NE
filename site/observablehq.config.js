export default {
  title: "Stroke PIM Study",
  pages: [
    { name: "Home", path: "index.md" }
  ],
  base: "/project-fall25-alex-riz-NE/",
  output: "dist",

  // ⛔ Prevent bundling node_modules assets
  ignore: [
    "node_modules/**"
  ]
};
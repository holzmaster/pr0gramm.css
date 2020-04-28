const fs = require("fs");
const hljs = require("highlightjs");
const child_process = require("child_process");
const outdent = require("outdent");

console.log("Bundling CSS...");
const npmOutput = child_process.execSync("npm run compile:prod", { encoding: "utf-8" });
console.log(npmOutput);

const indexTemplate = fs.readFileSync("index.html", { encoding: "utf-8" });

console.log("Replacing variables...");

const correctedCss = indexTemplate
	.replace("build/pr0gramm.css", "pr0gramm.min.css")
	.replace("node_modules/highlightjs/styles/vs2015.css", "vs2015.css");

console.log("Highlighting code...");

const demoPattern = /\{\{(.+?);\n*(.+?)\n*\}\}/gis;

const withDemoCode = correctedCss.replace(demoPattern, (_, language, codeToHighlight) => {
	const normalizedCode = outdent.string(codeToHighlight).trim();
	return hljs.highlight(language, normalizedCode).value;
});

console.log("Writing out files...");

fs.copyFileSync("node_modules/highlightjs/styles/vs2015.css", "build/vs2015.css");
fs.writeFileSync("build/index.html", withDemoCode);

console.log("...done!");

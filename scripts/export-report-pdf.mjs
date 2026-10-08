import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const out = path.join(root, "COMP101_Project1", "Report", "COMP101_Project1_Report.pdf");
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];
const chrome = chromeCandidates.find((p) => fs.existsSync(p));
if (!chrome) throw new Error("Chrome/Edge not found");

fs.mkdirSync(path.dirname(out), { recursive: true });
if (fs.existsSync(out)) fs.unlinkSync(out);

const url = "http://127.0.0.1:3000/report";
const args = [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-extensions",
  "--no-pdf-header-footer",
  `--print-to-pdf=${out}`,
  url,
];

await new Promise((resolve, reject) => {
  const child = spawn(chrome, args, { stdio: "inherit" });
  child.on("error", reject);
  child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`Chrome exit ${code}`))));
});

if (!fs.existsSync(out) || fs.statSync(out).size < 1000) {
  throw new Error(`PDF was not created at ${out}`);
}

console.log("Wrote", out, fs.statSync(out).size, "bytes");
console.log(pathToFileURL(out).href);

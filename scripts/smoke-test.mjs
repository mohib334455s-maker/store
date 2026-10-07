import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const port = Number(process.env.SMOKE_PORT || 3025);
const base = `http://127.0.0.1:${port}`;

const child = spawn("npx", ["next", "dev", "-p", String(port)], {
  cwd: process.cwd(),
  shell: true,
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env },
});

let ready = false;
child.stdout.on("data", (buf) => {
  const text = buf.toString();
  process.stdout.write(text);
  if (text.includes("Ready")) ready = true;
});
child.stderr.on("data", (buf) => process.stderr.write(buf.toString()));

const started = Date.now();
while (!ready && Date.now() - started < 90000) {
  await sleep(500);
}

if (!ready) {
  child.kill();
  console.error("Server did not become ready");
  process.exit(1);
}

const urls = ["/", "/shop", "/shop/PL-TRV-002", "/report", "/presentation", "/api/health", "/login"];
let failed = 0;

for (const path of urls) {
  try {
    const res = await fetch(base + path);
    const text = await res.text();
    const marks = [];
    if (text.includes("Peakline")) marks.push("Peakline");
    if (text.includes("Out of Stock")) marks.push("OOS");
    if (text.includes("DXB-TRK-12345")) marks.push("TRACK");
    console.log(`${path} -> ${res.status} len=${text.length} ${marks.join(",")}`);
    if (!res.ok && res.status !== 307 && res.status !== 302) failed += 1;
  } catch (error) {
    failed += 1;
    console.log(`${path} FAIL ${error.message}`);
  }
}

child.kill();
process.exit(failed ? 1 : 0);

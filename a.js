// replit_auto_toggle_humanlike.js
import WebSocket from "ws";

// ---------------- CONFIG ----------------
const REPL_URL = "wss://eval.spock.platform.replit.com/wsv2/v2.public.Q2dZSTllMzl4Z1lTQmdpVWl2N0dCaUlGYzNCdlkyc3dBRHJqQWdva1pEVmlZV0prTjJVdFlqWTBaUzAwWXpjNUxUaGtZelV0WkdVeE5UZzFaR013WkdVMkVnTnVhWGdhRjNKbGNHeHBkQzF5WlhCc0xXWnBiR1Z6TFhOd2IyTnJJaHRGZUhSeVlXeGhjbWRsVFdWbGExZHZjbVJ3Y205alpYTnpiM0lxRDJGaVpHVnNjbWh0WVc1aFltUXhORUpSQ2hoeVpYQnNhWFF0Y21Wd2JDMWliRzlqYTNNdGMzQnZZMnNTRm5KbGNHeHBkQzF5WlhCc0xXMWxkR0V0YzNCdlkyc2FIWEpsY0d4cGRDMXRZWEpuWVhKcGJtVXRZbXh2WTJ0ekxYTndiMk5yU2djSWdxZndFeEFCVUFCYURtbHVkR1Z1ZEY5emRIVmtaVzUwYW45N0luSnZiM1JQY21sbmFXNVNaWEJzVW1Wc1pXRnpaVWxrSWpvaU1qRTJNR1prTnpRdE5EQXpaUzAwTjJVMkxXSmpPR1l0TWpsbVptVTRNR1ptTkRBMElpd2ljbTl2ZEU5eWFXZHBibEpsY0d4VmNtd2lPaUl2UUhKbGNHeHBkQzlRZVhSb2IyNGlMQ0pzWVc1bmRXRm5aWE1pT2xzaWNIbDBhRzl1SWwxOWVBQlNKQWdCRUlDQWdJQUlHUUFBQUFBQUFQQS9JUUFBQUFBQUFQQS9LSUNBZ0lBSU1BRTRBR0FBYWhZSWdxZndFeElQWVdKa1pXeHlhRzFoYm1GaVpERTBnZ0VDS2dDYUFRb0tDREF1TUM0eE9USTNvQUVBTji2QoftbCCwmmrmZrJAD9cm_iZyJ9VZXLpLY8HiWPuddcrwK2X9TwLB6IXdzlUgOCFrtdgt3_R5esU7WAiCAA.Q2dad2NtOWtPak1pQ25KbGNHeHBkQzVqYjIwPQ";
const SESSION_COOKIE = process.env.SESSION_COOKIE;

const STOP_START_PAUSE_SECONDS = 3;
const MIN_MINUTES = 9.2;
const MAX_MINUTES = 14.7;
const INITIAL_WAIT_SECONDS = 2;
// ---------------------------------------------------------------

// Sleep utility
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Send run command
function runCode(ws) {
  const msg = {
    cmd: "run",
    data: {
      language: "python3",
      args: ["python3", "main.py"]
    }
  };
  ws.send(JSON.stringify(msg));
  console.log(">> Sent run command");
}

// Send stop command
function stopCode(ws) {
  const msg = { cmd: "stop" };
  ws.send(JSON.stringify(msg));
  console.log(">> Sent stop command");
}

// ---------------- MAIN LOOP ----------------
async function main() {
  if (!SESSION_COOKIE) {
    console.error("Error: لازم تضيف SESSION_COOKIE كمتغير بيئة.");
    process.exit(1);
  }

  console.log(`>>> started. waiting ${INITIAL_WAIT_SECONDS}s ...`);
  await sleep(INITIAL_WAIT_SECONDS * 1000);

  while (true) {
    try {
      const ws = new WebSocket(REPL_URL, {
        headers: { "Cookie": SESSION_COOKIE }
      });

      ws.on("open", async () => {
        console.log(">> Connected to Replit WebSocket");

        stopCode(ws);
        await sleep(STOP_START_PAUSE_SECONDS * 1000);
        runCode(ws);

        ws.close();
      });

      ws.on("error", (err) => {
        console.error("Error:", err.message);
      });

    } catch (err) {
      console.error("Error:", err.message);
    }

    // Wait random 2–4 min
    let waitSec = (Math.random() * (MAX_MINUTES - MIN_MINUTES) + MIN_MINUTES) * 60;
    waitSec += Math.random() * 15 - 5; // jitter
    console.log(`[${new Date().toISOString()}] Sleeping for ~${(waitSec/60).toFixed(2)} minutes ...`);
    await sleep(waitSec * 1000);
  }
}

main();

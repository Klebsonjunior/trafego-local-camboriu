from __future__ import annotations

import json
import time
from urllib.request import urlopen

import websocket

PREVIEW = "http://localhost:3000/"

def get_json(url: str):
    with urlopen(url) as response:
        return json.loads(response.read())

pages = get_json("http://localhost:9222/json")
target = next((page for page in pages if page.get("type") == "page"), None)
if not target:
    raise RuntimeError("No Chromium page available")

socket = websocket.create_connection(target["webSocketDebuggerUrl"], suppress_origin=True)
message_id = 0

def command(method: str, params: dict | None = None):
    global message_id
    message_id += 1
    socket.send(json.dumps({"id": message_id, "method": method, "params": params or {}}))
    while True:
        message = json.loads(socket.recv())
        if message.get("id") == message_id:
            return message

command("Page.enable")
command("Runtime.enable")
command("Page.navigate", {"url": PREVIEW})
time.sleep(1.5)

script = r"""
(async () => {
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const report = { ctas: [], questions: [], consentBlocked: false, finalState: "not-submitted" };
  const buttons = [...document.querySelectorAll("button")].filter((button) => {
    const text = button.textContent?.trim() || "";
    return [
      "Quero anunciar", "Quero atrair mais clientes", "Falar sobre meu negócio",
      "Quero saber se é para mim", "Quero entender meu cenário", "Abrir diagnóstico rápido"
    ].some((label) => text.includes(label));
  });
  for (const button of buttons) {
    button.click();
    await wait(120);
    const opened = Boolean(document.querySelector(".chat-backdrop"));
    report.ctas.push({ label: button.textContent.trim(), opened });
    document.querySelector(".chat-close")?.click();
    await wait(80);
  }
  const firstCta = [...document.querySelectorAll("button")].find((button) => button.textContent?.includes("Quero atrair mais clientes"));
  firstCta?.click();
  await wait(120);
  const setInput = (value) => {
    const input = document.querySelector(".chat-form input");
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.closest("form")?.querySelector("button")?.click();
    return true;
  };
  report.questions.push({ step: 1, label: document.querySelector(".chat-question h2")?.textContent?.trim(), advanced: setInput("Ana da Loja") });
  await wait(100);
  report.questions.push({ step: 2, label: document.querySelector(".chat-question h2")?.textContent?.trim(), advanced: setInput("47999999999") });
  await wait(100);
  report.questions.push({ step: 3, label: document.querySelector(".chat-question h2")?.textContent?.trim(), advanced: setInput("Loja Exemplo") });
  await wait(100);
  const choose = (text) => {
    const option = [...document.querySelectorAll(".chat-options button")].find((button) => button.textContent?.includes(text));
    option?.click();
    return Boolean(option);
  };
  report.questions.push({ step: 4, label: document.querySelector(".chat-question h2")?.textContent?.trim(), advanced: setInput("Camboriú") });
  await wait(100);
  report.questions.push({ step: 5, label: document.querySelector(".chat-question h2")?.textContent?.trim(), advanced: choose("Ainda não") });
  await wait(100);
  report.questions.push({ step: 6, label: document.querySelector(".chat-question h2")?.textContent?.trim(), advanced: choose("Receber mais conversas") });
  await wait(100);
  report.questions.push({ step: 7, label: document.querySelector(".chat-question h2")?.textContent?.trim(), advanced: false });
  report.consentBlocked = [...document.querySelectorAll(".chat-options button")].every((button) => button.disabled);
  report.finalState = document.querySelector(".chat-success") ? "submitted" : "awaiting-consent";
  document.querySelector(".chat-close")?.click();
  return report;
})()
"""
result = command("Runtime.evaluate", {"expression": script, "awaitPromise": True, "returnByValue": True})
print(json.dumps(result.get("result", {}).get("result", {}).get("value", result), ensure_ascii=False, indent=2))
socket.close()

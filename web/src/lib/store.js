import { writable, get, derived } from "svelte/store"

export const SYSTEM = "system"
export const ASSISTANT = "assistant"
export const USER = "user"

// input string
export const input = writable("")

// response string
export const resp = writable("")

// messages
export const messages = writable([])

// request abort controller
export var controller = writable(null)

// error message
export var error = writable("")

// dark mode
export var darkmode = writable(false)

// mode
let temperature = 0.01
let top_p = 0.7

export var mode = writable("balanced")
mode.subscribe(m => {
  switch (m) {
    case "creative":
      temperature = 0.9
      top_p = 0.5
      break
    case "balanced":
      temperature = 0.5
      top_p = 0.6
      break
    case "accurate":
      temperature = 0.1
      top_p = 0.7
      break
  }
})

export const lastMessage = derived(messages, $messages => $messages[$messages.length - 1])

export async function sendGLM(opt) {
  if (get(controller)) return
  let inputValue = get(input).trim()

  const isInit = get(messages).length === 0

  const iMsg = { role: isInit ? "系统" : "用户", content: inputValue }

  const oMsg = { role: "助手", content: "" }
  messages.update(m => [...m, iMsg, oMsg])

  // reset
  input.set("")
  error.set("")

  controller.set(new AbortController());
  const { signal } = get(controller);


  const query = get(messages).reduce((q, item) => q + `${item.role}: ${item.content}\n`, "")
  console.log("query:", get(messages), query)

  try {
    const response = await fetch("http://localhost:8189/gpt-glm/chat", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, max_length: 4096, top_p: 0.7, temperature: 0.9 }), // body data type must match "Content-Type" header
      signal
    })
    const res = await response.json()
    oMsg.content += res.response
    messages.update(m => m)
  } catch (e) {
    console.error(e)
    error.set(e.toString())
  } finally {
    controller.set(null)
  }
}

export async function send(opt) {
  if (get(controller)) return
  let inputValue = get(input).trim()

  const isInit = get(messages).length === 0

  // console.log(isInit, inputValue)
  if (inputValue === "" && isInit) {
    return
  }

  // console.log(response.ok, response.statusText)
  let oMsg
  if (opt && opt["error_continue"] === true) {
    oMsg = get(messages)[get(messages).length - 1]
    // console.log("CONCAT")
  } else {
    oMsg = { role: "assistant", content: "" }
    if (inputValue !== "") {
      const iMsg = { role: isInit ? "system" : "user", content: inputValue }
      messages.update(m => [...m, iMsg, oMsg])
    } else {
      messages.update(m => [...m, oMsg])
    }
  }


  // reset
  input.set("")
  error.set("")

  controller.set(new AbortController());
  const { signal } = get(controller);

  let response
  try {
    const url = import.meta.env.MODE === "development" ? import.meta.env.GPTW_DEV_API : (document.URL.replace(/\/$/, "") + import.meta.env.GPTW_API)
    response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
        "Connection": "keep-alive",
      },
      body: JSON.stringify({ top_p, temperature, messages: [...get(messages)] }), // body data type must match "Content-Type" header
      signal
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.msg)
    }

    const reader = response.body.getReader();
    const dec = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const incoming = dec.decode(value)
      if (incoming.includes("ERROR>>>")) {
        console.warn(incoming)
        error.set(incoming)
        break
      }
      oMsg.content += incoming
      messages.update(m => m)
    }
  } catch (e) {
    console.error(e)
    error.set(`<${response && response.status ? response.status : ""}> <error ${e.toString()}>`)
  } finally {
    controller.set(null)
  }
}

export function abort() {
  get(controller).abort();
  removeLastEmptyResponse();
}

export function removeLastEmptyResponse() {
  const msg = get(lastMessage)
  // if content of the assistant is empty, remove it
  if (msg.role === ASSISTANT && msg.content === "") {
    messages.update(messages => {
      messages.pop()
      return messages
    })
  }
}

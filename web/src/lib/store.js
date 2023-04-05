import { get, writable } from "svelte/store";


export const darkmode = writable(false)



if (window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches) {
  darkmode.set(true)
}

// input value in textarea
export const input = writable("")

// state of the sending status
export const state = writable("idle")

// all messages
export const messages = writable([])

// error text
export const error = writable("")

export async function send() {
  let content = get(input)
  if (content === "") {
    return
  }

  // if it's the first message, then set the role to system
  let role = get(messages).length === 0 ? "system" : "user"
  messages.update(m => [...m, { role: role, content: content }, { role: "assistant", content: "" }])

  // clear input value
  input.set("")

  // do chat
  await chat()
}

let controller = new AbortController()
let signal = controller.signal
let top_p = 0.7
let temperature = 0.1

// chat with server
async function chat() {
  state.set("loading")
  let response

  try {
    // using absolue url if in development mode, using relative url in production mode
    const url = import.meta.env.MODE === "development" ? "http://localhost:8081/api/chat" : "./api/chat"
    response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
        "Connection": "keep-alive",
      },
      body: JSON.stringify({ top_p, temperature, messages: get(messages) }), // body data type must match "Content-Type" header
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
        error.set(incoming)
        break
      }
      messages.update(m => { m[m.length - 1].content += incoming; return m })
    }
  } catch (e) {
    console.error(e)
    error.set(`<${response && response.status ? response.status : ""}> <error ${e.toString()}>`)
  } finally {
    state.set("idle")
  }
}

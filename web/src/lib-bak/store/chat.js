import { get } from 'svelte/store'
import { state, error } from './store.js'
import { updateLastMessage, currentSession } from './session.js'

let controller = new AbortController()
let signal = controller.signal
let top_p = 0.7
let temperature = 0.1

// chat with server
export async function chat() {
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
      body: JSON.stringify({ top_p, temperature, messages: get(currentSession).messages }), // body data type must match "Content-Type" header
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

      updateLastMessage(incoming)
    }
  } catch (e) {
    error.set(`<${response && response.status ? response.status : ""}> <error ${e.toString()}>`)
    console.error(e, get(error))
  } finally {
    state.set("idle")
  }
}

import { writable, get } from "svelte/store"

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

export async function send(opt) {
  console.log(opt)
  if (get(controller)) return

  let inputValue = get(input).trim()

  const isInit = get(messages).length === 0
  const iMsg = { role: isInit ? "system" : "user", content: inputValue }

  // console.log(response.ok, response.statusText)
  let oMsg
  if (opt && opt["error_continue"] === true) {
    oMsg = get(messages)[get(messages).length - 1]
    console.log("CONCAT")
  } else {
    oMsg = { role: "assistant", content: "" }
    messages.update(m => [...m, iMsg, oMsg])
  }


  // reset
  input.set("")
  error.set("")

  controller.set(new AbortController());
  const { signal } = get(controller);

  try {
    const response = await fetch(import.meta.env.VITE_API_URL, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
        "Connection": "keep-alive",
      },
      body: JSON.stringify({ messages: [...get(messages)] }), // body data type must match "Content-Type" header
      signal
    })

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
    error.set(e.toString())
  } finally {
    controller.set(null)
  }
}

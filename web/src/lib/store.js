import { writable, get } from "svelte/store"

// input string
export const input = writable("")

// response string
export const resp = writable("")

// messages
export const messages = writable([])

// request abort controller
export var controller = writable(null)

export async function send() {
  let inputValue = get(input)

  const isInit = get(messages).length === 0
  const iMsg = { role: isInit ? "system" : "user", content: inputValue }

  // console.log(response.ok, response.statusText)
  const oMsg = { role: "assistant", content: "" }
  messages.update(m => [...m, iMsg, oMsg])

  // reset
  input.set("")

  controller.set(new AbortController());
  const { signal } = get(controller);

  try {
    const response = await fetch(import.meta.env.VITE_API_URL, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
	  mode:"cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
        "Connection": "keep-alive",
      },
      body: JSON.stringify({ messages: [...get(messages), iMsg] }), // body data type must match "Content-Type" header
      signal
    })

    const reader = response.body.getReader();
    const dec = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const incoming = dec.decode(value)
      if (incoming.includes("Error>>>")) {
        console.warn(incoming)
        if (incoming.includes("too many empty messages")) {
          oMsg.notFinished = true
          messages.update(m => m)
        }
        break
      }
      oMsg.content += incoming
      messages.update(m => m)
    }
  } catch (e) {
    console.error(e)
  } finally {
    controller.set(null)
  }
}

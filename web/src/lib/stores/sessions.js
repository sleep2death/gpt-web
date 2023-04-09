import { derived, writable, get } from "svelte/store";

const stored = localStorage.sessions ? JSON.parse(localStorage.sessions) : undefined
export const sessions = writable(stored || [])

sessions.subscribe(sess => {
  localStorage.sessions = JSON.stringify(sess)
})

function newSession(label) {
  const id = Date.now()
  const sess = { label: label, id: id, messages: [] }

  return sess
}

export const currentSessionId = writable(0)
export const currentSession = derived([currentSessionId, sessions], ($values) => {
  for (let s of $values[1]) {
    if (s.id === $values[0]) {
      return s
    }
  }
  return undefined
})

export function addMessages(messages) {
  let sess = get(currentSession)
  if (!sess) {
    sess = newSession(messages[0].content)

    currentSessionId.set(sess.id)
    sessions.update(s => [...s, sess])

    // make the first message's role to "system"
    messages[0].role = "system"
  }

  sess.messages.push(...messages)
  sessions.update(m => m)
}

export function updateLastMessage(incoming) {
  const cur = get(currentSession)
  cur.messages[cur.messages.length - 1].content += incoming
  sessions.update(m => m)
}

export function startNewSession() {
  currentSessionId.set(0)
}

export function selectSession(id) {
  for (let s of get(sessions)) {
    if (s.id === id) {
      currentSessionId.set(id)
      break
    }
  }
}

export function deleteSession(id) {
  sessions.update(arr => arr.filter(sess => sess.id !== id))
}

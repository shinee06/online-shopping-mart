const normalizeMessage = (message) => {
  if (typeof message !== 'string' || !message.trim()) {
    throw new TypeError('Enter a message before sending it')
  }
  if (message.trim().length > 2000) {
    throw new RangeError('Messages must be 2000 characters or fewer')
  }
  return message.trim()
}

const createMessage = (content, role = 'user') => {
  if (!['user', 'assistant'].includes(role)) {
    throw new TypeError('Message role must be user or assistant')
  }
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    role,
    content: normalizeMessage(content),
    createdAt: new Date().toISOString()
  }
}

const ChatServlet = {
  createMessage,

  async sendMessage(content, responder) {
    const message = createMessage(content)
    if (typeof responder !== 'function') {
      throw new Error('A chat responder must be provided')
    }
    const response = await responder(message.content)
    const text = typeof response === 'string' ? response : response?.message
    return {
      userMessage: message,
      assistantMessage: createMessage(text, 'assistant')
    }
  }
}

export default ChatServlet

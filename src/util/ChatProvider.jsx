import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import ChatServlet from '../controller/ChatServlet.jsx'

const ChatContext = createContext(null)

export const ChatProvider = ({ children, responder, initialMessages = [] }) => {
  const [messages, setMessages] = useState(initialMessages)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const sendMessage = useCallback(async (content) => {
    setError('')
    setPending(true)
    try {
      const result = await ChatServlet.sendMessage(content, responder)
      setMessages((current) => [
        ...current,
        result.userMessage,
        result.assistantMessage
      ])
      return result.assistantMessage
    } catch (sendError) {
      setError(sendError.message || 'Unable to send your message.')
      throw sendError
    } finally {
      setPending(false)
    }
  }, [responder])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError('')
  }, [])

  const value = useMemo(
    () => ({ messages, pending, error, sendMessage, clearMessages }),
    [messages, pending, error, sendMessage, clearMessages]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

// Kept alongside the provider so consumers can import the chat API from one place.
// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChat must be used inside a ChatProvider')
  return context
}

export default ChatProvider

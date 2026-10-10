import ChatProvider from './ChatProvider.jsx'

const mockResponder = async (message) => {
  const question = message.toLowerCase()

  if (question.includes('order')) {
    return 'You can review your recent purchases from the Orders page after signing in.'
  }
  if (question.includes('cart') || question.includes('checkout')) {
    return 'Open your cart to review quantities, then choose Checkout to enter your shipping details.'
  }
  if (question.includes('return') || question.includes('refund')) {
    return 'Please contact the store team with your order details for help with a return or refund.'
  }
  if (question.includes('product') || question.includes('search')) {
    return 'Use the Shop page search field to find products by name.'
  }

  return 'I can help with products, your cart, checkout, and orders. What would you like to know?'
}

const MockChatProvider = ({ children, responder = mockResponder, initialMessages }) => (
  <ChatProvider responder={responder} initialMessages={initialMessages}>
    {children}
  </ChatProvider>
)

export default MockChatProvider

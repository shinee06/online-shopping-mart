import { useEffect } from 'react'

const AppContextListener = ({
  children,
  onStorageChange,
  onCartChange,
  onWishlistChange,
  onAuthChange
}) => {
  useEffect(() => {
    const handleStorage = (event) => {
      onStorageChange?.(event)

      if (event.key === 'cart') onCartChange?.(event)
      if (event.key === 'authToken' || event.key === 'user') onAuthChange?.(event)
    }

    const handleCartChange = (event) => onCartChange?.(event)
    const handleWishlistChange = (event) => onWishlistChange?.(event)
    const handleAuthChange = (event) => onAuthChange?.(event)

    window.addEventListener('storage', handleStorage)
    window.addEventListener('cartchange', handleCartChange)
    window.addEventListener('wishlistchange', handleWishlistChange)
    window.addEventListener('authchange', handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('cartchange', handleCartChange)
      window.removeEventListener('wishlistchange', handleWishlistChange)
      window.removeEventListener('authchange', handleAuthChange)
    }
  }, [onStorageChange, onCartChange, onWishlistChange, onAuthChange])

  return children ?? null
}

export default AppContextListener

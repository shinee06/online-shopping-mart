import { useEffect } from 'react'

const EncodingFilter = ({ children }) => {
  useEffect(() => {
    // Keep dynamically served documents aligned with the UTF-8 declaration in index.html.
    let charset = document.head.querySelector('meta[charset]')
    if (!charset) {
      charset = document.createElement('meta')
      charset.setAttribute('charset', 'UTF-8')
      document.head.prepend(charset)
    } else {
      charset.setAttribute('charset', 'UTF-8')
    }
  }, [])

  return children ?? null
}

export default EncodingFilter

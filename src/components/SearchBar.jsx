import { useId } from 'react'

const SearchBar = ({
  value = '',
  onChange = () => {},
  onSubmit,
  placeholder = 'Search products',
  label = 'Search products',
  className = ''
}) => {
  const inputId = useId()
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.(value)
  }

  return (
    <form className={`search-bar ${className}`.trim()} role="search" onSubmit={handleSubmit}>
      <label className="search-bar-label" htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}

export default SearchBar

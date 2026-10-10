const iconPaths = {
  laptop: <><rect x="7" y="9" width="34" height="24" rx="3" /><path d="M4 38h40l-3 4H7l-3-4Z" /><path d="M12 14h24v14H12z" /></>,
  mobile: <><rect x="14" y="5" width="20" height="38" rx="4" /><path d="M20 10h8m-7 27h6" /></>,
  headphones: <><path d="M8 26v-5a16 16 0 0 1 32 0v5" /><rect x="6" y="24" width="9" height="15" rx="4" /><rect x="33" y="24" width="9" height="15" rx="4" /></>,
  watch: <><path d="m18 9 2-5h8l2 5m-12 30 2 5h8l2-5" /><rect x="13" y="9" width="22" height="30" rx="7" /><circle cx="24" cy="24" r="7" /><path d="M24 19v5l4 2" /></>,
  camera: <><path d="M7 15h8l3-5h12l3 5h8v25H7z" /><circle cx="24" cy="27" r="8" /><circle cx="36" cy="21" r="1" fill="currentColor" /></>,
  television: <><rect x="5" y="9" width="38" height="26" rx="3" /><path d="m17 43 7-8 7 8m-7-8v8" /></>,
  accessories: <><path d="M15 8h18l3 8v23H12V16l3-8Z" /><path d="M18 16v-3a6 6 0 0 1 12 0v3m-6 8v9m-4-5 4 5 4-5" /></>
}

const CategoryIcon = ({ name }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {iconPaths[name] || iconPaths.accessories}
  </svg>
)

export default CategoryIcon

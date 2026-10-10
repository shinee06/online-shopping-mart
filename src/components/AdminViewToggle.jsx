const AdminViewToggle = ({ value, onChange, label = 'Choose list layout' }) => (
  <div className="admin-view-toggle" role="group" aria-label={label}>
    <button type="button" className={value === 'list' ? 'active' : ''} aria-pressed={value === 'list'} aria-label="List view, horizontal rows" title="List view" onClick={() => onChange('list')}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5h10M7 10h10M7 15h10" /><circle cx="3.5" cy="5" r=".7" /><circle cx="3.5" cy="10" r=".7" /><circle cx="3.5" cy="15" r=".7" /></svg><span>List</span>
    </button>
    <button type="button" className={value === 'grid' ? 'active' : ''} aria-pressed={value === 'grid'} aria-label="Grid view, vertical cards" title="Grid view" onClick={() => onChange('grid')}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="2.5" width="6" height="6" rx="1" /><rect x="11.5" y="2.5" width="6" height="6" rx="1" /><rect x="2.5" y="11.5" width="6" height="6" rx="1" /><rect x="11.5" y="11.5" width="6" height="6" rx="1" /></svg><span>Grid</span>
    </button>
  </div>
)

export default AdminViewToggle

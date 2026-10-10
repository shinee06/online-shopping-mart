import { Outlet } from 'react-router-dom'
import AdminHeader from './AdminHeader.jsx'
import AdminSidebar from './AdminSidebar.jsx'

const AdminLayout = ({ title, user, onLogout }) => (
  <div className="admin-layout">
    <AdminSidebar />
    <div className="admin-layout-main">
      <AdminHeader title={title} user={user} onLogout={onLogout} />
      <main className="admin-layout-content">
        <Outlet />
      </main>
    </div>
  </div>
)

export default AdminLayout

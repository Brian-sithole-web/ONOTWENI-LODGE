import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../admin/AdminSidebar';
import { Navbar } from './Navbar';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <div className="pt-20 lg:flex">
        <AdminSidebar />
        <div className="min-w-0 flex-1 p-4 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

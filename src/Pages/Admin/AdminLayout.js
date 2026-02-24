import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../Components/AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="d-flex">
            {/* Left Side: Fixed Sidebar */}
            <AdminSidebar />

            {/* Right Side: Dynamic Content Area */}
            <div className="admin-main-content" style={{ 
                flexGrow: 1, 
                backgroundColor: '#f1f5f9', 
                minHeight: '100vh',
                padding: '30px' 
            }}>
                <div className="container-fluid">
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
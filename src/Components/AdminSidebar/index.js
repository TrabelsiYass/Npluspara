import { 
    MdArticle, 
    MdCategory, 
    MdDashboard, 
    MdFlashOn, 
    MdLayers, 
    MdShoppingBag, 
    MdReceiptLong // Added icon for orders
} from "react-icons/md"; 
import { Link, useLocation } from 'react-router-dom';
import './index.css';

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: <MdDashboard />, label: 'Tableau de bord' },
        { path: '/admin/categories', icon: <MdCategory />, label: 'Catégories' },
        { path: '/admin/sub-categories', icon: <MdLayers />, label: 'Sous-Catégories' },
        { path: '/admin/products', icon: <MdShoppingBag />, label: 'Produits' },
        { path: '/admin/commandes', icon: <MdReceiptLong />, label: 'Commandes' }, // New Entry
        { path: '/admin/extra', icon: <MdFlashOn />, label: 'Extras' },
        { path: '/admin/blog', icon: <MdArticle />, label: 'Blog / Mag' },
    ];

    return (
        <div className="admin-sidebar shadow">
            <div className="p-4">
                <h4 className="text-success fw-bold">NPLUSPARA ADMIN</h4>
            </div>
            <nav className="mt-3">
                {menuItems.map((item) => (
                    <Link 
                        key={item.path}
                        to={item.path} 
                        className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        {item.icon} <span className="ms-2">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default AdminSidebar;
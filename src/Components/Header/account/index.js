import { Button, Drawer, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { BsFillBasket2Fill } from "react-icons/bs";
import { FaSignOutAlt, FaUserCircle, FaUserTie } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../Client';
import Cart from '../../../Pages/Cart';
import { useMyContext } from '../../../Pages/MyContext';
import './index.css';

const AccountIcons = ({ session }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const openMenu = Boolean(anchorEl);

    const { cartItems } = useMyContext();
    const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        handleCloseMenu();
        // Optionnel : force une redirection propre vers home
        navigate('/', { replace: true });
    };

    const goToProfile = () => {
        handleCloseMenu();
        navigate('/profile');
    };

    return (
        <>
            <div className="accountContainer d-flex align-items-center">
                <div className='cartTab d-flex align-items-center'>
                    
                    {/* Logique conditionnelle basée sur la session transmise par App.jsx */}
                    {session ? (
                        <>
                            <Button 
                                className='accounticon' 
                                onClick={handleOpenMenu}
                                id="user-button"
                            >
                                {/* Icône changeante si connecté */}
                                <FaUserCircle style={{ color: '#629C38', fontSize: '22px' }} />
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleCloseMenu}
                                disableScrollLock={true} // Empêche le saut de page au clic
                                PaperProps={{
                                    sx: { mt: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '12px' }
                                }}
                            >
                                <MenuItem onClick={goToProfile} className="gap-2">
                                    <FaUserTie /> Mon Profil
                                </MenuItem>
                                <MenuItem onClick={handleLogout} className="gap-2 text-danger">
                                    <FaSignOutAlt /> Déconnexion
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Link to="/login">
                            <Button className='accounticon'>
                                <FaUserTie style={{ fontSize: '20px' }} />
                            </Button>
                        </Link>
                    )}

                    {/* Panier */}
                    <div className='position-relative ml-2'>
                        <Button className='basketicon' onClick={() => setIsCartOpen(true)}>
                            <BsFillBasket2Fill />
                        </Button>
                        
                        {totalQty > 0 && (
                            <span className='count d-flex align-items-center justify-content-center'>
                                {totalQty}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <Drawer 
                anchor="right" 
                open={isCartOpen} 
                onClose={() => setIsCartOpen(false)}
                PaperProps={{
                    sx: { width: { xs: '100%', sm: '450px' } }
                }}
            >
                <Cart closeCart={() => setIsCartOpen(false)} />
            </Drawer>
        </>
    );
}

export default AccountIcons;
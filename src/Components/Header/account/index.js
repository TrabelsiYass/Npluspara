import { Button, Drawer, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { BsFillBasket2Fill } from "react-icons/bs";
import { FaSignOutAlt, FaUserCircle, FaUserTie } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../Client';
import Cart from '../../../Pages/Cart';
import { useMyContext } from '../../../Pages/MyContext'; // Import du contexte
import './index.css';

const AccountIcons = ({ session }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const openMenu = Boolean(anchorEl);

    // 🔥 On récupère cartItems depuis le contexte global
    const { cartItems } = useMyContext();

    // Calcul du nombre total d'articles (somme des quantités)
    const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        handleCloseMenu();
        navigate('/');
    };

    return (
        <>
            <div className="accountContainer d-flex align-items-center">
                <div className='cartTab d-flex align-items-center'>
                    
                    {/* Logique conditionnelle pour l'icône de compte */}
                    {session ? (
                        <>
                            <Button 
                                className='accounticon' 
                                onClick={handleOpenMenu}
                                id="user-button"
                            >
                                <FaUserCircle style={{ color: '#00a896' }} />
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleCloseMenu}
                                PaperProps={{
                                    sx: { mt: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '12px' }
                                }}
                            >
                                <MenuItem onClick={() => { navigate('/profile'); handleCloseMenu(); }} className="gap-2">
                                    <FaUserTie /> Mon Profil
                                </MenuItem>
                                <MenuItem onClick={handleLogout} className="gap-2 text-danger">
                                    <FaSignOutAlt /> Déconnexion
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Link to="/login">
                            <Button className='accounticon'><FaUserTie /></Button>
                        </Link>
                    )}

                    {/* Panier avec badge dynamique */}
                    <div className='position-relative ml-2'>
                        <Button className='basketicon' onClick={() => setIsCartOpen(true)}>
                            <BsFillBasket2Fill />
                        </Button>
                        
                        {/* 🔥 Le badge ne s'affiche que si totalQty > 0 */}
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
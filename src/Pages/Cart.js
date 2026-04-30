import { Button, Divider, IconButton } from '@mui/material';
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useMyContext } from './MyContext';
import { useNavigate } from 'react-router-dom';

const Cart = ({ closeCart }) => {
    const { cartItems, updateQty, removeItem } = useMyContext();
    const navigate = useNavigate() ;

    const handleCheckout = () => {
        closeCart();
        navigate('/paiement');
    }

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const shipping = cartItems.length > 0 ? 7.000 : 0;
    const total = subtotal + shipping;

    return (
        <div className="cart-wrapper" style={{ width: '450px', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
            <div className="p-3 d-flex justify-content-between align-items-center border-bottom">
                <h5 className="m-0" style={{ fontWeight: 600 }}>Votre Panier ({cartItems.length})</h5>
                <IconButton onClick={closeCart} size="small"><IoMdClose /></IconButton>
            </div>

            <div className="cart-content flex-grow-1 p-3" style={{ overflowY: 'auto' }}>
                {cartItems.length === 0 ? (
                    <div className="text-center mt-5 text-muted">Votre panier est vide</div>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.id}>
                            <div className="cart-item d-flex mb-4">
                                <img src={item.img} alt={item.name} style={{ width: '80px', height: '100px', borderRadius: '8px', objectFit: 'cover' }} />
                                <div className="flex-grow-1 ms-3">
                                    <div className="d-flex justify-content-between">
                                        <h6 className="mb-0" style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</h6>
                                        <span style={{ fontWeight: 600 }}>{(item.price * item.qty).toFixed(3)}</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                        <div className="quantity-box d-flex align-items-center border rounded bg-light">
                                            <button className="border-0 bg-transparent px-2" onClick={() => updateQty(item.id, -1)}><HiOutlineMinus size={14}/></button>
                                            <span className="px-2 fw-bold">{item.qty}</span>
                                            <button className="border-0 bg-transparent px-2" onClick={() => updateQty(item.id, 1)}><HiOutlinePlus size={14}/></button>
                                        </div>
                                        <IconButton size="small" color="error" onClick={() => removeItem(item.id)}><RiDeleteBin6Line size={18} /></IconButton>
                                    </div>
                                </div>
                            </div>
                            <Divider className="mb-4" />
                        </div>
                    ))
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="cart-footer p-3 border-top bg-light">
                    <div className="d-flex justify-content-between mb-1 small text-muted">
                        <span>Sous-total</span>
                        <span>{subtotal.toFixed(3)} TND</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <h5 className="mb-0 fw-bold">Total</h5>
                        <h5 className="mb-0 fw-bold" style={{ color: '#629C38' }}>{total.toFixed(3)} TND</h5>
                    </div>
                    <Button
                        onClick={handleCheckout}
                        variant="contained" 
                        fullWidth 
                        style={{ backgroundColor: '#629C38', borderRadius: '8px', padding: '10px' }}>
                        Passer à la caisse
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Cart;
import { Button, CircularProgress, Dialog, Rating } from '@mui/material';
import { useState } from 'react';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdCheck, MdClose } from 'react-icons/md';
import { useMyContext } from '../../Pages/MyContext';
import ProductZoom from '../ProductZoom/index';
import QuantityBox from '../QuantityBox/index';
import './index.css';

const ProductModal = ({ product, closeProductModal }) => {
    const { addToCart } = useMyContext();
    const [selectedQty, setSelectedQty] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    if (!product) return null;

    const handleAddToCart = async () => {
        setIsAdding(true);
        await addToCart(product, selectedQty);
        setIsAdding(false);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <Dialog open={true} className='ProductModal' maxWidth="md" onClose={closeProductModal}>
            <Button className='close_' onClick={closeProductModal}><MdClose /></Button>

            <div className='modal-container p-4'>
                {/* --- CATÉGORIES RÉVÉLÉES --- */}
                <div className="product-breadcrumb mb-2 text-uppercase" style={{fontSize: '12px', color: '#888', letterSpacing: '1px'}}>
                    <span>{product.category_name}</span>
                    {product.sub_category_name && <><span className="mx-2">/</span><span>{product.sub_category_name}</span></>}
                </div>

                <h4 className='product-title mb-1'>{product.name}</h4>
                
                <div className='d-flex align-items-center mb-3'>
                    <span className='me-3 brand-label'>Marque : <b>{product.brand}</b></span>
                    <Rating value={4} size="small" readOnly />
                </div>

                <hr />
                
                <div className='row mt-4'>
                    <div className='col-md-5'>
                        <ProductZoom image={product.image_url} />
                    </div>

                    <div className='col-md-7'>
                        <div className='d-flex info align-items-center mb-3'>
                            <span className='newPrice text-success fs-4 fw-bold'>
                                {Number(product.new_price || product.price).toFixed(3)} TND
                            </span>
                            {product.old_price && (
                                <span className='oldPrice ms-3 text-decoration-line-through text-muted'>
                                    {Number(product.old_price).toFixed(3)} TND
                                </span>
                            )}
                        </div>

                        <span className='badge bg-success mb-3'>EN STOCK</span>
                        
                        <p className='description-text text-muted'>
                            {product.description || `Détails complets du produit ${product.name} par ${product.brand}.`}
                        </p>

                        <div className='d-flex align-items-center mt-4'>
                            <QuantityBox quantity={selectedQty} setQuantity={setSelectedQty} />
                            
                            <Button 
                                className={`btn-green btn-big btn-round ms-3 ${isAdded ? 'btn-success' : ''}`}
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                variant="contained"
                            >
                                {isAdding ? <CircularProgress size={20} color="inherit" /> : 
                                 isAdded ? <MdCheck className="me-2"/> : <AiOutlineShoppingCart className="me-2" />}
                                {isAdding ? 'AJOUT...' : isAdded ? 'AJOUTÉ !' : 'AJOUTER AU PANIER'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

export default ProductModal;
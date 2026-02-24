import { Button, CircularProgress, Rating, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { MdCheck } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../Client';
import ProductZoom from "../Components/ProductZoom/index";
import QuantityBox from '../Components/QuantityBox/index';
import RelatedProduct from '../Components/RelatedProducts/index';
import { useMyContext } from '../Pages/MyContext';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activeTabs, setActiveTabs] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const { addToCart } = useMyContext();

    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await supabase.from('products').select('*').eq('id', id).single();
            if (data) {
                setProduct(data);
                checkWishlist(data.id);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const checkWishlist = async (prodId) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase.from('wishlist')
                .select('*').eq('user_id', user.id).eq('product_id', prodId).maybeSingle();
            if (data) setIsAddedToWishlist(true);
        }
    };

    const handleWishlist = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return alert("Veuillez vous connecter");
        if (!isAddedToWishlist) {
            setIsAddedToWishlist(true);
            await supabase.from('wishlist').insert([{ user_id: user.id, product_id: product.id }]);
        } else {
            setIsAddedToWishlist(false);
            await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', product.id);
        }
    };

    const handleAddToCart = async () => {
        setIsAdding(true);
        await addToCart(product, quantity);
        setIsAdding(false);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (!product) return <div className="loader-box"><CircularProgress size={50} style={{color: '#2ecc71'}} /></div>;

    return (
        <section className="productDetails section">
            <div className="container">
                {/* Navigation de secours (Back Button) */}
                <div className="row mb-4">
                    <div className="col-12">
                        <Button className="btn-back" onClick={() => navigate(-1)}>
                            <FaArrowLeft className="me-2" /> Retour à la boutique
                        </Button>
                    </div>
                </div>

                <div className="row">
                    {/* Colonne Gauche: Image avec fond gris comme dans ProductItem */}
                    <div className="col-md-5">
                        <div className="details-img-container">
                            <ProductZoom image={product.image_url} />
                        </div>
                    </div>

                    {/* Colonne Droite: Infos */}
                    <div className="col-md-7 ps-md-5">
                        <div className="brand-badge">{product.brand || 'Premium Quality'}</div>
                        <h2 className="product-hd">{product.name}</h2>
                        
                        <div className="d-flex align-items-center mb-4 mt-2">
                            <Rating value={4} size="small" readOnly />
                            <span className="ms-2 reviews-text">(12 Avis clients)</span>
                        </div>

                        <div className="price-section mb-4">
                            <span className="newPrice">{Number(product.new_price || product.price).toFixed(3)} TND</span>
                            {product.old_price && <span className="oldPrice ms-3">{Number(product.old_price).toFixed(3)} TND</span>}
                        </div>

                        <div className={`stock-label ${product.stock <= 0 ? 'out-stock' : 'in-stock'}`}>
                            <span className="dot"></span> 
                            {product.stock <= 0 ? "Rupture de stock" : "En Stock"}
                        </div>

                        <p className="short-desc mt-4">
                            {product.description}
                        </p>

                        <div className='d-flex align-items-end mt-5 action-row'>
                            <div className="qty-box-wrapper">
                                <span className="d-block mb-2 fw-bold text-uppercase" style={{fontSize: '11px'}}>Quantité</span>
                                <QuantityBox quantity={quantity} setQuantity={setQuantity} />
                            </div>
                            
                            <Button 
                                className={`add-to-cart-big ms-3 ${isAdded ? 'success' : ''}`}
                                onClick={handleAddToCart}
                                disabled={isAdding || product.stock <= 0} // disable if out of stock
                            >
                                {isAdding ? <CircularProgress size={20} color="inherit" /> : 
                                isAdded ? <><MdCheck className="me-2" /> AJOUTÉ AU PANIER</> : 
                                <><FaShoppingCart className="me-2" /> AJOUTER AU PANIER</>}
                            </Button>

                            <Tooltip title="Favoris" placement="top">
                                <Button className={`wish-btn-circle ms-3 ${isAddedToWishlist ? 'active' : ''}`} onClick={handleWishlist}>
                                    {isAddedToWishlist ? <FaHeart color="#ff4d4d" /> : <FaRegHeart />}
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                {/* --- TABS --- */}
                <div className='card mt-5 detailsPageTabs'>
                    <div className='customTabs'>
                        <ul className='list list-inline tab-header'>
                            <li className='list-inline-item'>
                                <Button className={activeTabs === 0 ? 'active' : ''} onClick={() => setActiveTabs(0)}>Description</Button>
                            </li>
                            <li className='list-inline-item'>
                                <Button className={activeTabs === 1 ? 'active' : ''} onClick={() => setActiveTabs(1)}>Fiche Technique</Button>
                            </li>
                            <li className='list-inline-item'>
                                <Button className={activeTabs === 2 ? 'active' : ''} onClick={() => setActiveTabs(2)}>Avis</Button>
                            </li>
                        </ul>
                        
                        <div className='tabContent'>
                            {activeTabs === 0 && <p className="p-4">{product.description}</p>}
                            {activeTabs === 1 && (
                                <div className="p-4">
                                    <table className='table table-bordered'>
                                        <tbody>
                                            <tr><td>Catégorie</td><td>{product.category_name}</td></tr>
                                            <tr><td>Marque</td><td>{product.brand}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='mt-5'>
                    <RelatedProduct category={product.category_name} currentProductId={product.id} />
                </div>
            </div>
        </section>
    );
}

export default ProductDetails;
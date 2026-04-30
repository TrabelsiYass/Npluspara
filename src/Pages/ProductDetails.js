import { Button, CircularProgress, Rating, Tabs, Tab, Box, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { 
    FaArrowLeft, FaRegHeart, FaShoppingCart, FaShieldAlt, 
    FaTruck, FaBoxOpen, FaCertificate, FaHeadset, FaRegEye,
    FaGem
} from "react-icons/fa";
import { MdVerified, MdOutlineLocalOffer, MdSecurity, MdCheck } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../Client';
import RelatedProduct from '../Components/RelatedProducts/index';
import { useMyContext } from '../Pages/MyContext';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const { addToCart } = useMyContext();

    const handleAddToCart = async () => {
        if (product.stock <= 0) return;
        
        setIsAdding(true);
        try {
            // quantity is already defined in your state
            await addToCart(product, quantity); 
            
            setIsAdding(false);
            setIsAdded(true);
            
            // Reset the "Added" checkmark after 2 seconds
            setTimeout(() => setIsAdded(false), 2000);
        } catch (error) {
            console.error("Erreur lors de l'ajout au panier:", error);
            setIsAdding(false);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await supabase.from('products').select('*').eq('id', id).single();
            if (data) setProduct(data);
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) return <div className="loader-container"><CircularProgress color="success" /></div>;

    return (
        <section className="product-page-wrapper">
            <div className="container py-5">
                
                {/* 1. TOP UTILITY BAR */}
                <div className="top-utility-bar d-flex justify-content-between align-items-center mb-4">
                <div className="breadcrumb-wrapper">
                    <Button className="btn-back" onClick={() => navigate(-1)}>
                        <FaArrowLeft /> <span>Retour</span>
                    </Button>
                    <div className="breadcrumb-nav">
                        Boutique / {product.category_name} / <span className="active">{product.name}</span>
                    </div>
                </div>
                    <div className="stock-indicator">
                        <span className={`pulse-dot ${product.stock > 0 ? 'green' : 'red'}`}></span>
                        {product.stock > 0 ? `${product.stock} exemplaires en stock` : 'Rupture de stock'}
                    </div>
                </div>

                <div className="row g-5">
                    {/* 2. IMAGE GALLERY CLUSTER */}
                    <div className="col-lg-6">
                        <div className="main-image-frame shadow-lg rounded-4 overflow-hidden mb-3">
                            <img src={product.image_url} alt={product.name} className="w-100 object-fit-cover" />
                        </div>
                        <div className="image-thumbnails-grid d-flex gap-2">
                            
                                <div className="thumb-item rounded-3 border">
                                    <img src={product.image_url} alt="view" className="w-100" style={{opacity: 0.6}}/>
                                    <div className="overlay-lock"><FaRegEye /></div>
                                </div>
                            
                        </div>
                    </div>

                    {/* 3. PRODUCT INFO & CONVERSION SIDEBAR */}
                    <div className="col-lg-6">
                        <div className="product-glass-card p-4 rounded-4 shadow-sm border">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <MdVerified className="text-primary" />
                                <span className="text-uppercase fw-bold text-muted small letter-spacing-1">{product.brand}</span>
                            </div>
                            
                            <h1 className="display-5 fw-bold mb-3">{product.name}</h1>
                            
                            <div className="rating-summary d-flex align-items-center gap-3 mb-4">
                                <Rating value={4.8} precision={0.1} readOnly />
                                <span className="fw-bold">4.8</span>
                                <span className="text-muted">| 15 commandes ce mois</span>
                            </div>

                            <Divider className="mb-4" />

                            <div className="pricing-block mb-4">
                                <div className="d-flex align-items-baseline gap-3">
                                    <span className="price-primary">{Number(product.new_price || product.price).toFixed(3)} TND</span>
                                    {product.old_price && <span className="price-secondary">{Number(product.old_price).toFixed(3)} TND</span>}
                                    {product.old_price && <span className="discount-pill">-{Math.round(((product.old_price - product.new_price)/product.old_price)*100)}%</span>}
                                </div>
                                <p className="text-success small mt-1"><MdOutlineLocalOffer /> Meilleur prix garanti en Tunisie</p>
                            </div>

                            <div className="short-highlight mb-4">
                                <h6 className="fw-bold">Points forts :</h6>
                                <ul className="list-unstyled custom-check-list">
                                    <li><MdCheck /> Qualité Premium contrôlée</li>
                                    <li><MdCheck /> Matériaux eco-responsables</li>
                                    <li><MdCheck /> Design exclusif {new Date().getFullYear()}</li>
                                </ul>
                            </div>

                            <div className="action-zone d-grid gap-3">
                                <Button 
                                    className={`cart-btn-luxury py-3 ${isAdded ? 'success-state' : ''}`} 
                                    disabled={product.stock <= 0 || isAdding}
                                    onClick={handleAddToCart} // THIS WAS MISSING
                                >
                                    {isAdding ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : isAdded ? (
                                        <>
                                            <MdCheck className="me-2" style={{ fontSize: '1.5rem' }} /> 
                                            PRODUIT AJOUTÉ !
                                        </>
                                    ) : (
                                        <>
                                            <FaShoppingCart className="me-2" /> 
                                            AJOUTER AU PANIER
                                        </>
                                    )}
                                </Button>

                                <Button variant="outlined" className="wishlist-btn-luxury py-2">
                                    <FaRegHeart className="me-2" /> AJOUTER AUX FAVORIS
                                </Button>
                            </div>

                            {/* 4. TRUST BADGE STRIP */}
                            <div className="trust-badges-strip mt-5 row g-0 border rounded overflow-hidden">
                                <div className="col-4 border-end p-3 text-center bg-light">
                                    <FaTruck className="text-primary mb-1" />
                                    <p className="m-0 tiny-text">Livraison Express</p>
                                </div>
                                <div className="col-4 border-end p-3 text-center bg-light">
                                    <MdSecurity className="text-primary mb-1" />
                                    <p className="m-0 tiny-text">Paiement Sécurisé</p>
                                </div>
                                <div className="col-4 p-3 text-center bg-light">
                                    <FaHeadset className="text-primary mb-1" />
                                    <p className="m-0 tiny-text">Support 24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. FULL-WIDTH SPECS & FEATURES GRID */}
                <div className="specs-master-container mt-5 p-5 rounded-5 bg-dark text-white">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <h2 className="display-6 fw-bold">Détails <br/><span className="text-success">Techniques</span></h2>
                            <p className="text-light-50">Chaque détail a été pensé pour offrir une expérience utilisateur inégalée.</p>
                        </div>
                        <div className="col-md-8">
                            <div className="row g-4">
                                {[
                                    {icon: <FaBoxOpen/>, t: "Emballage", d: "Coffret Premium"},
                                    {icon: <FaCertificate/>, t: "Garantie", d: "24 Mois Constructeur"},
                                    {icon: <FaGem/>, t: "Finition", d: "Élite Chrome"},
                                    {icon: <FaShieldAlt/>, t: "Protection", d: "Norme IP65"}
                                ].map((spec, i) => (
                                    <div key={i} className="col-sm-6">
                                        <div className="spec-card-dark p-3 border border-secondary rounded-4 d-flex align-items-center gap-3">
                                            <div className="spec-icon-box">{spec.icon}</div>
                                            <div>
                                                <div className="small text-muted">{spec.t}</div>
                                                <div className="fw-bold">{spec.d}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. TABBED CONTENT AREA */}
                <div className="detailed-tabs-wrapper mt-5 border rounded-4 bg-white shadow-sm overflow-hidden">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', background: '#f8f9fa' }}>
                        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
                            <Tab label="Description Complète" className="py-3" />
                            <Tab label="Fiche Technique" className="py-3" />
                            <Tab label="Livraison & Retours" className="py-3" />
                        </Tabs>
                    </Box>
                    <div className="tab-content p-5">
                        {tabValue === 0 && (
                            <div className="animate__animated animate__fadeIn">
                                <h4 className="fw-bold mb-4">L'excellence au bout des doigts</h4>
                                <p className="lead text-muted">{product.description}</p>
                                <p>Inspiré par les tendances mondiales de design, ce produit allie robustesse et élégance. Que vous soyez un professionnel exigeant ou un amateur de belles choses, il saura répondre à vos besoins les plus pointus.</p>
                            </div>
                        )}
                        {tabValue === 1 && (
                            <div className="table-responsive animate__animated animate__fadeIn">
                                <table className="table table-hover align-middle">
                                    <tbody>
                                        <tr><td className="fw-bold bg-light" style={{width: '30%'}}>Matériau</td><td>Acier Inoxydable & Polymères renforcés</td></tr>
                                        <tr><td className="fw-bold bg-light">Origine</td><td>Importé / Certifié CE</td></tr>
                                        <tr><td className="fw-bold bg-light">Dimensions</td><td>Standard (H: 20cm, L: 15cm)</td></tr>
                                        <tr><td className="fw-bold bg-light">Poids Net</td><td>450g</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-5 pt-5 border-top">
                    <RelatedProduct categoryId={product.cat_id} currentProductId={product.id} />
                </div>
            </div>
        </section>
    );
}

export default ProductDetails;
import { Button, CircularProgress, Rating } from "@mui/material";
import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdCheck } from "react-icons/md";
import { TfiFullscreen } from "react-icons/tfi";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../Client';
import { useMyContext } from '../../Pages/MyContext';
import ProductModal from '../ProductModal/index';
import './index.css';

const ProductItem = (props) => {
    const { item, itemView } = props;
    const [isOpenProductModal, setisOpenProductModal] = useState(false);
    const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    
    const navigate = useNavigate();
    const { addToCart } = useMyContext();

    const discount = item?.old_price && item?.new_price 
        ? Math.round(((item.old_price - item.new_price) / item.old_price) * 100) 
        : null;

    useEffect(() => {
        const checkWishlist = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && item) {
                const { data } = await supabase
                    .from('wishlist')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('product_id', item.id)
                    .maybeSingle();
                if (data) setIsAddedToWishlist(true);
            }
        };
        checkWishlist();
    }, [item]);

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        setIsAdding(true);
        try {
            await addToCart(item, 1);
            setIsAdding(false);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } catch (error) {
            setIsAdding(false);
        }
    };

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("Veuillez vous connecter pour ajouter des favoris");
            return;
        }

        if (!isAddedToWishlist) {
            setIsAddedToWishlist(true);
            const { error } = await supabase.from('wishlist').insert([{ user_id: user.id, product_id: item.id }]);
            if (error) setIsAddedToWishlist(false);
        } else {
            setIsAddedToWishlist(false);
            const { error } = await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', item.id);
            if (error) setIsAddedToWishlist(true);
        }
    };

    if (!item) return null;

    return (
        <>
            <div className={`productItem ${itemView}`}>
                <div className="imgWrapper">
                    <div className="img-container" onClick={() => navigate(`/product/${item.id}`)} style={{cursor: 'pointer'}}>
                        <img src={item.image_url} alt={item.name} className="w-100" />
                        {discount > 0 && <span className="badge">-{discount}%</span>}
                    </div>
                    
                    <div className="actions">
                        <Button onClick={(e) => { e.stopPropagation(); setisOpenProductModal(true); }} title="Aperçu rapide">
                            <TfiFullscreen />
                        </Button>
                        <Button 
                            title="Favoris" 
                            className={`${isAddedToWishlist ? 'active' : ''}`}
                            onClick={handleWishlist} 
                        >
                            {isAddedToWishlist ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                        </Button>
                    </div>
                </div>

                <div className="info_prod">

  {/* Brand */}
  <span className="brand-name">{item.brand}</span>

  {/* Name */}
  <h4
    className="product-title"
    onClick={() => navigate(`/product/${item.id}`)}
  >
    {item.name}
  </h4>

  {/* Short Description */}
  <p className="short-desc">
    {item.description?.substring(0, 70)}...
  </p>

  {/* Rating */}
  <div className="rating-row">
    <Rating value={4} size="small" readOnly />
    <span className="rating-text">(4.0)</span>
  </div>

  {/* Prices */}
  <div className="product-prices">
    <span className="newPrice">
      {Number(item.new_price || item.price).toFixed(3)} TND
    </span>

    {item.old_price && (
      <span className="oldPrice">
        {Number(item.old_price).toFixed(3)} TND
      </span>
    )}
  </div>

  {/* Stock */}
  <div className={`stock ${item.stock > 0 ? "in" : "out"}`}>
    {item.stock > 0 ? "En stock" : "Rupture de stock"}
  </div>

  {/* Add to Cart */}
  <button
    className={`add-to-cart-btn ${isAdded ? 'success' : ''}`}
    onClick={handleAddToCart}
    disabled={isAdding || item.stock === 0}
  >
    {isAdding ? (
      <CircularProgress size={16} color="inherit" />
    ) : isAdded ? (
      <MdCheck />
    ) : item.stock > 0 ? (
      "Ajouter"
    ) : (
      "Indisponible"
    )}
  </button>

</div>
            </div>

            {isOpenProductModal && (
                <ProductModal product={item} closeProductModal={() => setisOpenProductModal(false)} />
            )}
        </>
    );
}

export default ProductItem;
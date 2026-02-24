import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { IoArrowRedoOutline } from "react-icons/io5";
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { supabase } from '../../Client';
import ProductItem from "../ProductItem/index";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const RelatedProduct = ({ category, currentProductId }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category_name', category) // Filtre par catégorie
                    .neq('id', currentProductId)   // Exclut le produit actuel
                    .limit(10);                    // Limite à 10 résultats

                if (error) throw error;
                setRelatedProducts(data || []);
            } catch (error) {
                console.error("Erreur Related Products:", error.message);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchRelatedProducts();
        }
    }, [category, currentProductId]);

    if (loading) return <div className="text-center p-4"><CircularProgress size={30} /></div>;
    
    // Ne pas afficher la section s'il n'y a pas de produits similaires
    if (relatedProducts.length === 0) return null;

    return (
        <div className="relatedProductsWrapper mt-5">
            <div className="d-flex align-items-center mb-3">
                <div className="info w-75">
                    <h3 className="mb-0 hd">PRODUCTEURS SIMILAIRES</h3>
                </div>
                <Button className="ViewAllbtn ml-auto">
                    Voir Tout <IoArrowRedoOutline className="ms-1" />
                </Button>
            </div>

            <div className="product_row w-100">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    navigation={true}
                    breakpoints={{
                        480: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                        1400: { slidesPerView: 5 }
                    }}
                    modules={[Navigation]}
                    className="mySwiper"
                >
                    {relatedProducts.map((item) => (
                        <SwiperSlide key={item.id}>
                            <ProductItem item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>    
            </div>
        </div>
    );
}

export default RelatedProduct;
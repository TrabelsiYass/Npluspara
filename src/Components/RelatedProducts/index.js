import React, { useEffect, useState } from 'react';
import { CircularProgress } from "@mui/material";
import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { supabase } from '../../Client';
import ProductItem from "../ProductItem/index";

import 'swiper/css';
import 'swiper/css/navigation';

const RelatedProduct = ({ categoryId, currentProductId }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!categoryId) return;
            setLoading(true);
            try {
                // Fetch products from the main table sharing the same category ID
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('cat_id', categoryId) 
                    .neq('id', currentProductId) // Exclude current product
                    .limit(10);

                if (error) throw error;
                setRelatedProducts(data || []);
            } catch (err) {
                console.error("Related fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [categoryId, currentProductId]);

    if (loading) return <div className="text-center p-5"><CircularProgress size={30} /></div>;
    if (relatedProducts.length === 0) return null;

    return (
        <div className="relatedProductsWrapper mt-5">
            <h3 className="mb-4 fw-bold text-uppercase">Produits Similaires</h3>
            <Swiper
                slidesPerView={1}
                spaceBetween={20}
                navigation={true}
                autoplay={{ delay: 3500 }}
                breakpoints={{
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1400: { slidesPerView: 5 }
                }}
                modules={[Navigation, Autoplay]}
                className="relatedSwiper"
            >
                {relatedProducts.map((item) => (
                    <SwiperSlide key={item.id}>
                        <ProductItem item={item} />
                    </SwiperSlide>
                ))}
            </Swiper>    
        </div>
    );
}

export default RelatedProduct;
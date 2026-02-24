import { useEffect, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { supabase } from '../Client';
import ProductItem from '../Components/ProductItem';

import 'swiper/css';
import 'swiper/css/navigation';

const CheveuxSection = () => {
    const [hairProducts, setHairProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHairProducts = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('cheveux_table') 
                    .select('*')
                    .order('id', { ascending: true });

                if (error) throw error;
                setHairProducts(data || []);
            } catch (error) {
                console.error('Supabase Error:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHairProducts();
    }, []);

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center p-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2 text-muted">Récupération des soins capillaires...</p>
            </div>
        );
    }

    return (
        <section className="productRow">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="info">
                    <h3 className="mb-0 hd" style={{ 
                        color: '#27ae60', 
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        🌿 Soins Cheveux
                    </h3>
                    <p className="text-muted small mb-0">Découvrez nos meilleures solutions capillaires</p>
                </div>
            </div>

            <div className="product_row w-100">
                {hairProducts.length > 0 ? (
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={20}
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
                        {hairProducts.map((item) => (
                            <SwiperSlide key={item.id}>
                                <ProductItem item={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="alert alert-light text-center">
                        Aucun produit capillaire disponible pour le moment.
                    </div>
                )}
            </div>

            <style jsx>{`
                .mySwiper {
                    padding: 10px 5px;
                }
                :global(.swiper-button-next), :global(.swiper-button-prev) {
                    color: #27ae60 !important;
                }
            `}</style>
        </section>
    );
};

export default CheveuxSection;
import { useEffect, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { supabase } from '../Client'; // Verified your client file name
import ProductItem from '../Components/ProductItem';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const FlashSaleSection = () => {
    const [flashSales, setFlashSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;
    
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('top_promos')
                    .select('*');
                
                if (error) throw error;
                if (isMounted) setFlashSales(data || []);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Fetch Error:', error.message);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
    
        fetchData();
    
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2">Récupération des meilleures offres...</p>
            </div>
        );
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="info">
                    <h3 className="mb-0 hd" style={{ 
                        color: '#27ae60', 
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        ⚡ Vente Flash
                    </h3>
                    <p className="text-muted small mb-0">Offres limitées dans le temps</p>
                </div>
            </div>

            <div className="product_row w-100">
                {flashSales.length > 0 ? (
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
                        {flashSales.map((item) => (
                            <SwiperSlide key={item.id}>
                                {/* Added tableSource prop here */}
                                <ProductItem item={item} tableSource="top_promos" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="alert alert-light text-center">
                        Aucun produit en vente flash pour le moment.
                    </div>
                )}
            </div>

            <style jsx>{`
                .mySwiper {
                    padding: 10px 5px;
                }
                .swiper-button-next, .swiper-button-prev {
                    color: #27ae60 !important;
                }
            `}</style>
        </>
    );
};

export default FlashSaleSection;
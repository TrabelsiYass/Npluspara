import { useEffect, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { supabase } from '../Client';
import ProductItem from '../Components/ProductItem';

import 'swiper/css';
import 'swiper/css/navigation';

const CoffretSection = () => {
    const [coffrets, setCoffrets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchCoffrets = async () => {
        try {
            setLoading(true);
            
            // On sélectionne dans la table 'products'
            // On joint la table 'categories' pour filtrer sur le nom
            const { data, error } = await supabase
                .from('products') 
                .select(`
                    *,
                    categories!inner (
                        name
                    )
                `)
                .eq('categories.name', 'Coffrets') // Filtre précis sur le nom
                .order('id', { ascending: true });

            if (error) throw error;
            setCoffrets(data || []);
        } catch (error) {
            console.error('Supabase Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchCoffrets();
}, []);

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center p-5">
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-2">Chargement des coffrets cadeaux...</p>
            </div>
        );
    }

    return (
        <section className="coffret_section mb-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="info">
                    <h3 className="mb-0 hd" style={{ 
                        color: '#27ae60', 
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        🎁 Coffrets Cadeaux
                    </h3>
                    <p className="text-muted small mb-0">Le plaisir d'offrir ou de se faire plaisir</p>
                </div>
            </div>

            <div className="product_row w-100">
                {coffrets.length > 0 ? (
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
                        {coffrets.map((item) => (
                            <SwiperSlide key={item.id}>
                                {/* Pass category name down if needed */}
                                <ProductItem 
                                    item={item} 
                                    categoryName={item.categories?.name} 
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="alert alert-light text-center">
                        Aucun coffret disponible pour le moment.
                    </div>
                )}
            </div>

            <style jsx>{`
                .mySwiper { padding: 10px 5px; }
                :global(.swiper-button-next), :global(.swiper-button-prev) {
                    color: #27ae60 !important;
                }
            `}</style>
        </section>
    );
};

export default CoffretSection;
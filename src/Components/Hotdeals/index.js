import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { supabase } from '../../Client';
// Import your ProductItem component
import ProductItem from '../ProductItem/index'; 
import './HotDeals.css';

function HotDeals() {
    const swiperRef = useRef(null);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ days: 1, hours: 6, minutes: 51, seconds: 22 });

    useEffect(() => {
        const fetchHotDeals = async () => {
            try {
                // Fetching from HotDeals which joins with products
                const { data, error } = await supabase
                    .from('HotDeals')
                    .select(`id, products (*)`);
                
                if (error) throw error;
                
                // Map the data to get the nested product objects
                // We filter out nulls in case a linked product was deleted
                setDeals(data.map(d => d.products).filter(p => p !== null) || []);
            } catch (err) { 
                console.error("Supabase Error:", err.message); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchHotDeals();
    }, []);

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (deals.length === 0 && !loading) return null;

    return (
        <section className="hot-deals">
            <div className="container">
                <div className="deals-layout">
                    <div className="bons-plans-banner">
                        <div className="banner-content"></div>
                    </div>

                    <div className="deals-section">
                        <div className="deals-header">
                            <div className="deals-title">
                                <FaFire className="fire-icon" />
                                <span>Hot deal</span>
                            </div>
                            <div className="deals-nav">
                                <button onClick={() => swiperRef.current?.slidePrev()}>
                                    <FaChevronLeft /> Précédent
                                </button>
                                <button onClick={() => swiperRef.current?.slideNext()}>
                                    Suivant <FaChevronRight />
                                </button>
                            </div>
                        </div>

                        <div className="countdown-timer">
                            {['days', 'hours', 'minutes', 'seconds'].map((unit, idx) => (
                                <div className="time-box" key={idx}>
                                    <span className="time-value">{String(timeLeft[unit]).padStart(2, '0')}</span>
                                    <span className="time-label">{unit === 'minutes' ? 'min' : unit === 'seconds' ? 'sec' : unit}</span>
                                </div>
                            ))}
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-danger" role="status"></div>
                            </div>
                        ) : (
                            <Swiper
                                onBeforeInit={(swiper) => {
                                    swiperRef.current = swiper;
                                }}
                                slidesPerView={1}
                                spaceBetween={20}
                                navigation={false}
                                breakpoints={{
                                    480: { slidesPerView: 2 },
                                    768: { slidesPerView: 2 },
                                    1300: { slidesPerView: 3 }
                                }}
                                modules={[Navigation]}
                                className="mySwiper"
                            >
                                {deals.map((product) => (
                                    <SwiperSlide key={product.id}>
                                        {/* Using ProductItem and passing the product data */}
                                        <ProductItem item={product} tableSource="products" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HotDeals;
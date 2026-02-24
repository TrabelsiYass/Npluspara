import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { supabase } from '../../Client'; // Ensure this path is correct

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import './HotDeals.css';

function HotDeals() {
  const swiperRef = useRef(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 1, hours: 6, minutes: 51, seconds: 22 });

  // 1. Fetch Deals from Supabase
  useEffect(() => {
    const fetchHotDeals = async () => {
      try {
        const { data, error } = await supabase
          .from('HotDeals') // Name of your new table
          .select('*')
          .eq('is_active', true); // Only show active deals

        if (error) throw error;
        setDeals(data);
      } catch (error) {
        console.error('Error loading hot deals:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotDeals();
  }, []);

  // 2. Timer Logic (Remains the same)
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

  return (
    <section className="hot-deals">
      <div className="container">
        <div className="deals-layout">
          
          <div className="bons-plans-banner">
            <div className="banner-content">
            </div>
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
              {/* Timer Boxes stay exactly as your design */}
              {['days', 'hours', 'minutes', 'seconds'].map((unit, idx) => (
                <div className="time-box" key={idx}>
                  <span className="time-value">
                    {String(timeLeft[unit === 'minutes' ? 'minutes' : unit === 'seconds' ? 'seconds' : unit]).padStart(2, '0')}
                  </span>
                  <span className="time-label">{unit === 'minutes' ? 'min' : unit === 'seconds' ? 'sec' : unit}</span>
                </div>
              ))}
            </div>

            {loading ? (
              <p>Chargement des offres...</p>
            ) : (
              <Swiper
                modules={[Navigation]}
                onBeforeInit={(swiper) => { swiperRef.current = swiper; }}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{ 992: { slidesPerView: 3 } }}
                className="deals-swiper"
              >
                {deals.map(deal => (
                  <SwiperSlide key={deal.id}>
                    <div className="deal-card">
                      <div className="deal-image">
                        <img src={deal.image_url} alt={deal.name} />
                      </div>
                      <div className="deal-info">
                        <span className="deal-brand">{deal.brand}</span>
                        <h4 className="deal-name">{deal.name}</h4>
                        <div className="deal-prices">
                          <span className="current-price">
                            {Number(deal.new_price).toFixed(3)} TND
                          </span>
                          <span className="old-price">
                            {Number(deal.old_price).toFixed(3)} TND
                          </span>
                        </div>
                        <button className="add-to-cart">Ajouter au panier</button>
                      </div>
                    </div>
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
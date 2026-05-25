import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination'; 
import { Autoplay, Navigation, Pagination } from 'swiper/modules'; 
import { Swiper, SwiperSlide } from 'swiper/react';

// Desktop Banners
import banner1 from '../../assets/images/banner1.png';
import banner2 from '../../assets/images/banner3.jpeg';
import banner3 from '../../assets/images/banner4.jpeg';
import banner4 from '../../assets/images/banner5.png';

// Mobile Banners
import mobileview1 from '../../assets/images/mobilebanner1.png'; 
import mobileview2 from '../../assets/images/mobilebanner2.png';
import mobileview3 from '../../assets/images/mobilebanner3.png';
import mobileview4 from '../../assets/images/mobilebanner4.png';

import { Link } from 'react-router-dom';
import './index.css';

const HomeBanner = () => {
    // Array mapping ensures each desktop banner connects smoothly to its mobile version
    const banners = [
        { 
            id: 1, 
            desktop: banner1, 
            mobile: mobileview1, 
            alt: "Summer Promo",
            link: "/category/protection-solaire"
        },
        { 
            id: 2, 
            desktop: banner2, 
            mobile: mobileview2, 
            alt: "Compléments Alimentaires",
            link: "/category/aromatherapie-et-huiles-essentielles"
        },
        { 
            id: 3, 
            desktop: banner3, 
            mobile: mobileview3, 
            alt: "Anniversaire Promo",
            link: "/category/bons-plans"
        },
        { 
            id: 4, 
            desktop: banner4, 
            mobile: mobileview4, 
            alt: "Soins Bébé",
            link: "/category/maman-bebe/soins-du-bebe"
        },
    ];

    return (
        <section className="HomeBanner">
            <div className="container-fluid"> 
                <Swiper
                    slidesPerView={1}
                    spaceBetween={0} 
                    navigation={true}
                    loop={true} 
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Navigation, Autoplay, Pagination]}
                    className="mySwiper"
                >
                    {banners.map((banner) => (
                        <SwiperSlide key={banner.id}>
                            <div className='item'>
                                <Link to={banner.link} className='banner-link'>
                                <picture>
                                    {/* Displays mobile banner on viewports 576px wide or smaller */}
                                    <source media="(max-width: 576px)" srcSet={banner.mobile} />
                                    {/* Default desktop fallback layout */}
                                    <img 
                                        src={banner.desktop} 
                                        loading="lazy" 
                                        className='w-100' 
                                        alt={banner.alt} 
                                    />
                                </picture>
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

export default HomeBanner;
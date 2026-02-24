import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination'; // Added pagination CSS
import { Autoplay, Navigation, Pagination } from 'swiper/modules'; // Added Pagination
import { Swiper, SwiperSlide } from 'swiper/react';
import { default as banner3, default as banner4, default as banner5 } from '../../assets/images/Banneree.png';
import './index.css';

const HomeBanner = () => {
    return (
        <section className="HomeBanner">
            <div className="container-fluid"> {/* Use a container to keep it aligned */}
                <Swiper
                    slidesPerView={1}
                    spaceBetween={0} // Banners usually have 0 space for a seamless look
                    navigation={true}
                    loop={true} // Banners are better looped
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
                    
                        
                        <SwiperSlide >
                            <div className='item'>
                                <img src={banner3} className='w-100' alt="banner" />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide >
                            <div className='item'>
                                <img src={banner4} className='w-100' alt="banner" />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide >
                            <div className='item'>
                                <img src={banner5} className='w-100' alt="banner" />
                            </div>
                        </SwiperSlide>
                  
                </Swiper>
            </div>
        </section>
    );
}

export default HomeBanner;
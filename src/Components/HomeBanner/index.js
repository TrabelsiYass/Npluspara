import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination'; // Added pagination CSS
import { Autoplay, Navigation, Pagination } from 'swiper/modules'; // Added Pagination
import { Swiper, SwiperSlide } from 'swiper/react';
import banner1 from '../../assets/images/banner1.png';
import banner2 from '../../assets/images/banner3.jpeg';
import banner3 from '../../assets/images/banner4.jpeg';
import banner4 from '../../assets/images/banner5.png';
import banner5 from '../../assets/images/banner6.png';

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
                    
                        
                        
                        <SwiperSlide>
                            <div className='item'>
                                <img 
                                    src={banner1}
                                    loading="lazy" 
                                    className='w-100' 
                                    alt="banner1" 
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className='item'>
                                <img 
                                    src={banner2}
                                    loading="lazy" 
                                    className='w-100' 
                                    alt="banner1" 
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide >
                            <div className='item'>
                                <img src={banner3} loading="lazy" className='w-100' alt="banner" />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide >
                            <div className='item'>
                                <img src={banner4} loading="lazy" className='w-100' alt="banner" />
                            </div>
                        </SwiperSlide>

                         <SwiperSlide >
                            <div className='item'>
                                <img src={banner5}loading="lazy" className='w-100' alt="banner" />
                            </div>
                        </SwiperSlide>

                        
                  
                </Swiper>
            </div>
        </section>
    );
}

export default HomeBanner;
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination'; // Added pagination CSS
import { Autoplay, Navigation, Pagination } from 'swiper/modules'; // Added Pagination
import { Swiper, SwiperSlide } from 'swiper/react';

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
                                    src="https://i.postimg.cc/yYF4FYxT/banner1.png" 
                                    loading="lazy" 
                                    className='w-100' 
                                    alt="banner1" 
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className='item'>
                                <img 
                                    src="https://i.postimg.cc/qvLP5b8J/banner5.png"
                                    loading="lazy" 
                                    className='w-100' 
                                    alt="banner1" 
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide >
                            <div className='item'>
                                <img src="https://i.postimg.cc/CKx3TGNb/banner3.jpg" loading="lazy" className='w-100' alt="banner" />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide >
                            <div className='item'>
                                <img src="https://i.postimg.cc/R0pjMWs1/banner6.png" loading="lazy" className='w-100' alt="banner" />
                            </div>
                        </SwiperSlide>

                         <SwiperSlide >
                            <div className='item'>
                                <img src="https://i.postimg.cc/g02CFVD0/banner4.jpg" loading="lazy" className='w-100' alt="banner" />
                            </div>
                        </SwiperSlide>

                        
                  
                </Swiper>
            </div>
        </section>
    );
}

export default HomeBanner;
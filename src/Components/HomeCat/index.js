import './index.css'
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 
import 'swiper/css/navigation'; 
import { Navigation } from 'swiper/modules';
import cat_1 from '../../assets/images/cat_1.jpg';
import cat_2 from '../../assets/images/cat_2.jpg';
import cat_3 from '../../assets/images/cat_3.jpg';
import cat_4 from '../../assets/images/cat_4.jpg';
import cat_5 from '../../assets/images/cat_5.jpg';
import cat_6 from '../../assets/images/cat_6.jpg';
import cat_7 from '../../assets/images/cat_7.jpg';
import cat_8 from '../../assets/images/cat_8.jpg';
import cat_9 from '../../assets/images/cat_9.jpg';
import cat_11 from '../../assets/images/cat_11.jpg';
import cat_12 from '../../assets/images/cat_12.jpg';




const HomeCat = () => {
    return (
        <>
            <section className="homeCat">
                <div className="container">
                    <h3 className='mb-0 hd'> Featured Catégories</h3>
                    <Swiper slidesPerView={4}
                                        spaceBetween={8}
                                        navigation={true}      
                                        slidesPerGroup={1}
                                        breakpoints={{
                                            // when window width is >= 480px
                                            480: {
                                                slidesPerView: 4,
                                                spaceBetween: 10
                                            },
                                            // when window width is >= 768px
                                            768: {
                                                slidesPerView: 5,
                                                spaceBetween: 15
                                            },
                                            // when window width is >= 1024px
                                            1024: {
                                                slidesPerView: 8,
                                                spaceBetween: 15
                                            },
                                            // when window width is >= 1200px
                                            1200: {
                                                slidesPerView: 10,
                                                spaceBetween: 15
                                            }
                                        }}                          
                                        pagination={{
                                        clickable: true,
                                        }}
                                        modules={[Navigation]}
                                        className="mySwiper"
                                    >
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_1} alt='Applique Murale'/>
                                </div>
                                    <h6>Maison et Décoration</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_2} alt='Applique Murale'/>
                                </div>
                                    <h6>Arts de la Table & Cuisine</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_3} alt='Applique Murale'/>
                                </div>
                                    <h6>Bricolage & Quincaillerie</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_4} alt='Applique Murale'/>
                                </div>
                                    <h6>Jardinage</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_5} alt='Applique Murale'/>
                                </div>
                                    <h6>Électricité</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_6} alt='Applique Murale'/>
                                </div>
                                    <h6>Installation et Câblage</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_7} alt='Applique Murale'/>
                                </div>
                                    <h6>Appareils de Mesure</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_8} alt='Applique Murale'/>
                                </div>
                                    <h6>Lustres et Suspensions</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_9} alt='Applique Murale'/>
                                </div>
                                    <h6>Applique Murale</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_11} alt='Applique Murale'/>
                                </div>
                                    <h6>Lampes à Poser et Lampadaires</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_12} alt='Applique Murale'/>
                                </div>
                                    <h6>Spots et Éclairage Technique</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_1} alt='Applique Murale'/>
                                </div>
                                    <h6>Maison et Décoration</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_2} alt='Applique Murale'/>
                                </div>
                                    <h6>Arts de la Table & Cuisine</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_3} alt='Applique Murale'/>
                                </div>
                                    <h6>Bricolage & Quincaillerie</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_4} alt='Applique Murale'/>
                                </div>
                                    <h6>Jardinage</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_5} alt='Applique Murale'/>
                                </div>
                                    <h6>Électricité</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_6} alt='Applique Murale'/>
                                </div>
                                    <h6>Installation et Câblage</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_7} alt='Applique Murale'/>
                                </div>
                                    <h6>Appareils de Mesure</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_8} alt='Applique Murale'/>
                                </div>
                                    <h6>Lustres et Suspensions</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_9} alt='Applique Murale'/>
                                </div>
                                    <h6>Applique Murale</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_11} alt='Applique Murale'/>
                                </div>
                                    <h6>Lampes à Poser et Lampadaires</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                                <div className="item text-center">
                                <div className="img-box">
                                    <img src={cat_12} alt='Applique Murale'/>
                                </div>
                                    <h6>Spots et Éclairage Technique</h6>
                                </div>
                                 
                            </div> 
                            
                        </SwiperSlide>
                        

                    </Swiper>


                    
                </div>
            </section>
        
        </>
    )

}

export default HomeCat;
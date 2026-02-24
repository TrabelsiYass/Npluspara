import { Button } from "@mui/material";
import { useEffect, useState } from 'react'; // Added hooks
import { IoMailOutline } from "react-icons/io5";
import 'swiper/css';
import 'swiper/css/navigation';
import Newsletterphoto from '../assets/images/coupon.webp';
import { supabase } from '../Client'; // Import your client
import HomeBanner from "../Components/HomeBanner";
import HotDeals from "../Components/Hotdeals";
import CheveuxSection from "./Cheveux";
import FlashSaleSection from "./Flash";

import BlogSection from "./BlogPage";
import CoffretSection from "./Coffret";
import './Home.css';
import TopPromos from "./TopPromos";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts();
    }, []);

    async function getProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*');
        
        if (error) {
            console.error('Error fetching products:', error);
        } else {
            setProducts(data);
        }
        setLoading(false);
    }

    // Filter products for different sections
    const flashSales = products.filter(p => p.old_price > p.new_price);
    const winterProducts = products.filter(p => p.category_id === 1); // Example ID

    return (
        <>
            <HomeBanner />

            <HotDeals />

            <section className="homeProducts">
                <div className="container">
                    <div className="row">
                        <div className="col-md-2">
                            <div className="banner">
                                <div className="banner-inner">
                                    <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800' }}>
                                        TOP <br/> DEALS
                                    </h3>
                                    <div style={{ height: '2px', width: '30px', background: '#fff', margin: '15px 0' }}></div>
                                    <p style={{ color: '#fff', opacity: '0.9', fontSize: '14px' }}>
                                        Meilleures <br/> Offres
                                    </p>
                                    <button style={{ 
                                        marginTop: '20px', 
                                        background: '#fff', 
                                        color: '#27ae60', 
                                        border: 'none', 
                                        padding: '8px 15px', 
                                        borderRadius: '20px',
                                        fontWeight: 'bold',
                                        fontSize: '12px'
                                    }}>
                                        VOIR TOUT
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-10 productRow">
                            <FlashSaleSection />
                        </div>
                            
                    </div>

                    <br /><br />

                    <div className="row">
                        <div className="col-md-2">
                            <div className="banner">
                                <div className="banner-inner">
                                    <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800' }}>
                                        Cheveux
                                    </h3>
                                    <div style={{ height: '2px', width: '30px', background: '#fff', margin: '15px 0' }}></div>
                                    <p style={{ color: '#fff', opacity: '0.9', fontSize: '14px' }}>
                                        Meilleures <br/> Offres
                                    </p>
                                    <button style={{ 
                                        marginTop: '20px', 
                                        background: '#fff', 
                                        color: '#27ae60', 
                                        border: 'none', 
                                        padding: '8px 15px', 
                                        borderRadius: '20px',
                                        fontWeight: 'bold',
                                        fontSize: '12px'
                                    }}>
                                        VOIR TOUT
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-10 productRow">
                            
                            <CheveuxSection />
                                
                            
                        </div>
                    </div>

                    <br/><br/>

                    <div className="row">
                        <div className="col-md-2">
                            <div className="banner">
                                <div className="banner-inner">
                                    <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800' }}>
                                        Coffret
                                    </h3>
                                    <div style={{ height: '2px', width: '30px', background: '#fff', margin: '15px 0' }}></div>
                                    <p style={{ color: '#fff', opacity: '0.9', fontSize: '14px' }}>
                                        Meilleures <br/> Offres
                                    </p>
                                    <button style={{ 
                                        marginTop: '20px', 
                                        background: '#fff', 
                                        color: '#27ae60', 
                                        border: 'none', 
                                        padding: '8px 15px', 
                                        borderRadius: '20px',
                                        fontWeight: 'bold',
                                        fontSize: '12px'
                                    }}>
                                        VOIR TOUT
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-10 productRow">
                            
                            <CoffretSection />
                                
                            
                        </div>
                    </div>
                </div>
            </section>

            <TopPromos />

            <BlogSection />


            <section className="newLetterSection mt-3 mb-3 d-flex align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="text-white">20% discount for your first order</p>
                            <h4>join our newsletter and get ...</h4>
                            <p className="text-light">Join our email subscription now to get updates  <br /> on promotions and coupons.</p>
                        
                            <form>
                                <IoMailOutline />
                                <input type="text" placeholder="Your Email address"/>
                                <Button> Subscribe </Button>
                            </form>
                        
                        
                        </div>

                        <div className="col-md-6">
                            <img src={Newsletterphoto} alt="Newsletterphoto" />
                        </div>
                    </div>
                </div>
            </section>

            


            
        </>
        
    )
}

export default Home ;
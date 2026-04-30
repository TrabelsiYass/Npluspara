import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMailOutline } from "react-icons/io5";
import Newsletterphoto from '../assets/images/coupon.webp';
import { supabase } from '../Client';
import HomeBanner from "../Components/HomeBanner";
import HotDeals from "../Components/Hotdeals";
import CheveuxSection from "./Cheveux";
import FlashSaleSection from "./Flash";
import BlogSection from "./BlogPage";
import CoffretSection from "./Coffret";
import TopPromos from "./TopPromos";
import perple from '../assets/images/bonplan2.png';
import './Home.css';
import BrandCarousel from "./BrandCarousel";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;
    
        async function getProducts() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .abortSignal(controller.signal); // Pass the signal here!
    
                if (error) throw error;
                if (isMounted) setProducts(data || []);
            } catch (error) {
                // This is the manual catch, but the .env fix above 
                // is what will stop the white screen.
                if (error.name !== 'AbortError') {
                    console.error('Error fetching products:', error.message);
                }
            } finally {
              if (isMounted) setLoading(false);
            }
        }
    
        getProducts();
    
        return () => {
            isMounted = false;
            controller.abort(); // Cancel the request when component unmounts
        };
    }, []);

    const handleViewAll = (path) => {
        navigate(path);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <CircularProgress style={{ color: '#629C38' }} />
            </div>
        );
    }

    return (
        <>
            <HomeBanner />
            <HotDeals />

            <section className="homeProducts">
                <div className="container">
                    {/* Section 1: Flash Sales */}
                    <div className="row mb-5">
                        <div className="col-md-2 ">
                            <div className="banner">
                               
                                
                            </div>
                        </div>
                        <div className="col-md-10 productRow">
                            <FlashSaleSection />
                        </div>
                    </div>

                    {/* Section 2: Cheveux */}
                    <div className="row mb-5">
                        <div className="col-md-2">
                            <div className="banner cheveux-bg">
                                
                            </div>
                        </div>
                        <div className="col-md-10 productRow">
                            <CheveuxSection />
                        </div>
                    </div>

                    {/* Section 3: Coffrets */}
                    <div className="row mb-5">
                        <div className="col-md-2 d-none d-md-block">
                            <div className="banner coffret-bg">
                                <div className="banner-inner">
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-md-10 productRow">
                            <CoffretSection />
                        </div>
                    </div>
                </div>
            </section>

            <BrandCarousel />

            <TopPromos />
            <BlogSection />

            <section className="newLetterSection">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 newsletter-text">
                            <p className="promo-tag">20% de remise sur votre première commande</p>
                            <h4>Rejoignez notre newsletter...</h4>
                            <p className="desc">Inscrivez-vous pour recevoir les dernières promotions et coupons de réduction.</p>
                            <form className="newsletter-form">
                                <IoMailOutline />
                                <input type="email" placeholder="Votre adresse e-mail" required/>
                                <Button type="submit">S'abonner</Button>
                            </form>
                        </div>
                        <div className="col-md-6 d-none d-md-block text-right">
                            <img src={Newsletterphoto} alt="Newsletter Promo" className="newsletter-img" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
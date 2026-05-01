import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { IoMailOutline } from "react-icons/io5";
import { memo } from 'react';

// Assets & Context
import Newsletterphoto from '../assets/images/coupon.webp';
import { useMyContext } from "../Pages/MyContext";

// Sub-Components
import HomeBanner from "../Components/HomeBanner";
import HotDeals from "../Components/Hotdeals";
import CheveuxSection from "./Cheveux";
import FlashSaleSection from "./Flash";
import BlogSection from "./BlogPage";
import CoffretSection from "./Coffret";
import TopPromos from "./TopPromos";
import BrandCarousel from "./BrandCarousel";

// CSS
import './Home.css';

const Home = () => {
    // Access global products and loading state from context
    const { products, productsLoading } = useMyContext();
    const navigate = useNavigate();

    // Guard: Only show the full-screen loader if the context is fetching 
    // for the first time (i.e., we have no products in memory yet).
    if (productsLoading && products.length === 0) {
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
                                {/* Banner content or image if needed */}
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
                                {/* Banner content or image if needed */}
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
                                    {/* Banner content or image if needed */}
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

            {/* Newsletter Section */}
            <section className="newLetterSection">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 newsletter-text">
                            <p className="promo-tag">20% de remise sur votre première commande</p>
                            <h4>Rejoignez notre newsletter...</h4>
                            <p className="desc">Inscrivez-vous pour recevoir les dernières promotions et coupons de réduction.</p>
                            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                                <IoMailOutline />
                                <input type="email" placeholder="Votre adresse e-mail" required />
                                <Button type="submit">S'abonner</Button>
                            </form>
                        </div>
                        <div className="col-md-6 d-none d-md-block text-right">
                            <img 
                                src={Newsletterphoto} 
                                alt="Newsletter Promo" 
                                loading="lazy" 
                                className="newsletter-img" 
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

// memo prevents unnecessary re-renders when navigating back to Home
export default memo(Home);
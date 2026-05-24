import { Button, CircularProgress } from "@mui/material";
import { IoMailOutline } from "react-icons/io5";
import { memo, lazy, Suspense } from 'react'; // CHANGED: Added lazy and Suspense for component lazy-loading
import { Helmet } from 'react-helmet-async';
import Newsletterphoto from '../assets/images/coupon.webp';
import { useMyContext } from "../Pages/MyContext";
import './Home.css';
import HomeBanner from "../Components/HomeBanner";
import HotDeals from "../Components/Hotdeals";

// CHANGED: Converted below-the-fold rows into lazy-loaded components to prevent freezing
const CheveuxSection = lazy(() => import("./Cheveux"));
const FlashSaleSection = lazy(() => import("./Flash"));
const BlogSection = lazy(() => import("./BlogPage"));
const CoffretSection = lazy(() => import("./Coffret"));
const TopPromos = lazy(() => import("./TopPromos"));
const BrandCarousel = lazy(() => import("./BrandCarousel"));



const Home = () => {
    const { products, productsLoading } = useMyContext();

    if (productsLoading && products.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <CircularProgress style={{ color: '#629C38' }} />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>N Plus Para | Parapharmacie en ligne n°1 en Tunisie</title>
                <meta name="description" content="Découvrez N Plus Para, votre parapharmacie leader en Tunisie..." />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "OnlineStore",
                        "name": "N Plus Para",
                        "url": "https://npluspara.com",
                        "logo": "https://npluspara.com/logo512.jpg",
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": "+216 28 895 920",
                            "contactType": "customer service",
                            "areaServed": "TN",
                            "availableLanguage": "ARABIC"
                        },
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://npluspara.com/products?q={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    })}
                </script>
            </Helmet>

            <HomeBanner />
            <HotDeals />

            {/* CHANGED: Wrapped heavy subsections in Suspense to stop blocking the main thread during render */}
            <Suspense fallback={
                <div className="d-flex justify-content-center py-5">
                    <CircularProgress style={{ color: '#629C38' }} />
                </div>
            }>
                <section className="homeProducts">
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-md-2 ">
                                <div className="banner"></div>
                            </div>
                            <div className="col-md-10 productRow">
                                <FlashSaleSection />
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col-md-2">
                                <div className="banner cheveux-bg"></div>
                            </div>
                            <div className="col-md-10 productRow">
                                <CheveuxSection />
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col-md-2 d-none d-md-block">
                                <div className="banner coffret-bg">
                                    <div className="banner-inner"></div>
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
            </Suspense>

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

export default memo(Home);
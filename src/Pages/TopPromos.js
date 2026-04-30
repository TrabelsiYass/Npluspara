import { useEffect, useRef, useState } from 'react';
import { supabase } from '../Client';
import ProductItem from '../Components/ProductItem'; 
import './TopPromos.css';

const TopPromos = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const observer = useRef();

    useEffect(() => {
        const controller = new AbortController();

        const fetchPromos = async () => {
            try {
                setLoading(true);
                
                // Fetch products from Flash_products table
                const { data, error } = await supabase
                    .from('Flash_products')
                    .select('*');

                if (error) throw error;

                // Sort by the absolute value of the discount: (old - new)
                // Assuming your table has old_price and price columns
                const sortedByDiscount = (data || [])
                    .sort((a, b) => {
                        const discountA = (a.old_price || 0) - (a.price || 0);
                        const discountB = (b.old_price || 0) - (b.price || 0);
                        return discountB - discountA;
                    })
                    .slice(0, 16); // Take the top 16 best deals

                setProducts(sortedByDiscount);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Supabase Error:", err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPromos();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (products.length === 0) return;

        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.promo-wrapper');
        elements.forEach(el => observer.current.observe(el));

        return () => observer.current.disconnect();
    }, [products]);

    if (loading && products.length === 0) return null;

    return (
        <section className="top-promos-section py-5">
            <div className="container">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h2 className="hd mb-0" style={{ fontWeight: '800', color: '#27ae60' }}>
                        🔥 Meilleures Réductions
                    </h2>
                    <span className="badge bg-danger">Top 16 Offres</span>
                </div>
                
                <div className="promos-grid">
                    {products.map((item, index) => (
                        <div 
                            key={item.id} 
                            className="promo-wrapper"
                            style={{ transitionDelay: `${(index % 4) * 0.1}s` }}
                        >
                            {/* Pass tableSource as Flash_products */}
                            <ProductItem item={item} tableSource="Flash_products" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopPromos;
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../Client';
import ProductItem from '../Components/ProductItem'; // Reuse your existing component
import './TopPromos.css';

const TopPromos = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const observer = useRef();

    useEffect(() => {
        const fetchPromos = async () => {
            try {
                const { data, error } = await supabase
                    .from('top_promos')
                    .select('*')
                    .order('id', { ascending: true });
                if (error) throw error;
                setProducts(data || []);
            } catch (err) {
                console.error("Supabase Error:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPromos();
    }, []);

    useEffect(() => {
        // This handles the "Appear on Scroll" functionality
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

    if (loading) return null;

    return (
        <section className="top-promos-section py-5">
            <div className="container">
                <h2 className="hd mb-4">Nos top promos</h2>
                <div className="promos-grid">
                    {products.map((item, index) => (
                        <div 
                            key={item.id} 
                            className="promo-wrapper"
                            style={{ transitionDelay: `${(index % 4) * 0.1}s` }}
                        >
                            <ProductItem item={item} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopPromos;
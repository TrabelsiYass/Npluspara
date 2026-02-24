import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "../Client";

const MyContext = createContext();

export const MyProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [guestId, setGuestId] = useState(localStorage.getItem('guest_id') || null);

    // Initialisation du Guest ID unique
    useEffect(() => {
        if (!guestId) {
            const newId = uuidv4();
            localStorage.setItem('guest_id', newId);
            setGuestId(newId);
        }
    }, [guestId]);

    // Charger le panier depuis la DB au démarrage
    useEffect(() => {
        if (guestId) fetchCart();
    }, [guestId]);

    const fetchCart = async () => {
        try {
            const { data, error } = await supabase
                .from('cart')
                .select('qty, products(*)') 
                .eq('guest_id', guestId);
            
            if (error) throw error;

            if (data) {
                const formatted = data.map(item => ({
                    id: item.products.id,
                    name: item.products.name,
                    price: item.products.new_price,
                    img: item.products.image_url, 
                    qty: item.qty
                }));
                setCartItems(formatted);
            }
        } catch (err) {
            console.error("Erreur fetchCart:", err.message);
        }
    };

    const updateQty = async (productId, delta) => {
        const item = cartItems.find(i => i.id === productId);
        if (!item) return;
        const newQty = Math.max(1, item.qty + delta);

        const { error } = await supabase
            .from('cart')
            .update({ qty: newQty })
            .eq('guest_id', guestId)
            .eq('product_id', productId);

        if (!error) fetchCart();
    };

    const removeItem = async (productId) => {
        const { error } = await supabase
            .from('cart')
            .delete()
            .eq('guest_id', guestId)
            .eq('product_id', productId);

        if (!error) fetchCart();
    };

    const addToCart = async (product) => {
        const existing = cartItems.find(i => i.id === product.id);
        if (existing) {
            updateQty(product.id, 1);
        } else {
            const { error } = await supabase
                .from('cart')
                .insert([{ guest_id: guestId, product_id: product.id, qty: 1 }]);
            if (!error) fetchCart();
        }
    };

    return (
        <MyContext.Provider value={{ cartItems, updateQty, removeItem, addToCart }}>
            {children}
        </MyContext.Provider>
    );
};

export const useMyContext = () => useContext(MyContext);
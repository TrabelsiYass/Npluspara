import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlinePayments, MdOutlineDoubleArrow } from "react-icons/md";
import { useMyContext } from './MyContext';
import { supabase } from '../Client';
import './Paiement.css';

const Paiement = () => {
    const { cartItems, resertCart } = useMyContext(); 
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: ''
    });

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const shipping = 7.000;
    const total = subtotal + shipping;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOrder = async (paymentMethod) => {
        if (!formData.firstName || !formData.phone || !formData.address) {
            alert("Veuillez remplir les champs obligatoires.");
            return;
        }

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            const { data: orderData, error: orderError } = await supabase
                .from('commandes')
                .insert([{
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city || '',
                    total_amount: total,
                    payment_method: paymentMethod,
                    status: 'PENDING',
                    profile_id: user ? user.id : null
                }])
                .select();

            if (orderError) throw orderError;

            const newOrderId = orderData[0].id;

            const itemsToInsert = cartItems.map(item => ({
                commande_id: newOrderId,
                product_id: item.id,
                product_name: item.name,
                price: item.price,
                quantity: item.qty
            }));

            const { error: itemsError } = await supabase
                .from('commande_items')
                .insert(itemsToInsert);

            if (itemsError) throw itemsError;

            if (resertCart) await resertCart();

            alert("Commande confirmée ✅");
            window.location.href = "/";

        } catch (err) {
            console.error(err);
            alert("Erreur: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="checkout-wrapper">

                <div className="modern-card">

                    <Typography className="product-hd text-center mb-4">
                        Finaliser votre commande
                    </Typography>

                    {/* CART */}
                    <div className="order-preview">
    <Typography className="brand-badge mb-3">
        Votre panier
    </Typography>

    {cartItems.map((item) => (
        <div key={item.id} className="item-row">

            <div className="item-left">
                
                <div>
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Quantité: {item.qty}</p>
                </div>
            </div>

            <div className="item-right">
                {(item.price * item.qty).toFixed(3)} TND
            </div>

        </div>
    ))}

    {/* SUMMARY */}
    <div className="summary-box">
        <div>
            <span>Sous-total</span>
            <span>{subtotal.toFixed(3)} TND</span>
        </div>

        <div>
            <span>Livraison</span>
            <span>{shipping.toFixed(3)} TND</span>
        </div>

        <div className="total-row">
            <span>Total</span>
            <span>{total.toFixed(3)} TND</span>
        </div>
    </div>
</div>

                    {/* FORM */}
                    <Typography className="form-section-title">
                        <HiOutlineLocationMarker /> Informations de livraison
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth required label="Prénom" name="firstName" onChange={handleChange} className="checkout-input" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth required label="Nom" name="lastName" onChange={handleChange} className="checkout-input" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Email" name="email" onChange={handleChange} className="checkout-input" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth required label="Téléphone" name="phone" onChange={handleChange} className="checkout-input" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth required multiline rows={2} label="Adresse" name="address" onChange={handleChange} className="checkout-input" />
                        </Grid>
                    </Grid>

                    {/* BUTTONS */}
                    <Box className="btn-group">

                        <Button 
                            className="btn-cash"
                            disabled={loading}
                            onClick={() => handleOrder('CASH')}
                            startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <MdOutlineDoubleArrow />}
                        >
                            {loading ? "Traitement..." : "Paiement à la livraison"}
                        </Button>

                        <Button 
                            className="btn-online"
                            disabled={loading}
                            onClick={() => handleOrder('ONLINE')}
                            startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <MdOutlinePayments />}
                        >
                            {loading ? "Connexion..." : "Payer en ligne"}
                        </Button>

                    </Box>

                </div>
            </div>
        </div>
    );
};

export default Paiement;
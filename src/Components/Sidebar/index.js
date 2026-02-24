import { Button, Checkbox, FormControlLabel, IconButton, Slider } from '@mui/material';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { supabase } from '../../Client';
import "./index.css";

const Sidebar = ({ setFilters, closeSidebar, categorySlug, subCategorySlug, isOpen }) => {
    const [brands, setBrands] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [price, setPrice] = useState([0, 2000]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedSubCatId, setSelectedSubCatId] = useState('');

    useEffect(() => {
        let active = true;
        
        const getFilterData = async () => {
            if (!categorySlug) return;

            // 1. Fetch Sub-Categories for the current category
            const { data: subData } = await supabase
                .from('sub_categories')
                .select('id, name, slug, categories!inner(slug)')
                .eq('categories.slug', categorySlug);

            if (subData && active) {
                setSubCategories(subData);

                // Sync with URL: if a subCategorySlug exists in URL, check that box
                if (subCategorySlug) {
                    const currentSub = subData.find(s => s.slug === subCategorySlug);
                    if (currentSub) setSelectedSubCatId(currentSub.id);
                } else {
                    setSelectedSubCatId('');
                }
            }

            // 2. Fetch unique brands available in this category
            const { data: productData } = await supabase
                .from('products')
                .select('brand, categories!inner(slug)')
                .eq('categories.slug', categorySlug);

            if (productData && active) {
                const uniqueBrands = [...new Set(productData.map(item => item.brand).filter(Boolean))].sort();
                setBrands(uniqueBrands);
            }
        };

        getFilterData();
        return () => { active = false; };
    }, [categorySlug, subCategorySlug]);

    const handleApply = () => {
        setFilters(prev => ({
            ...prev,
            brand: selectedBrand,
            subCategoryId: selectedSubCatId,
            priceRange: price
        }));
        // Close sidebar only on mobile after applying
        if (window.innerWidth < 992 && closeSidebar) closeSidebar();
    };

    const handleReset = () => {
        setSelectedBrand('');
        setSelectedSubCatId('');
        setPrice([0, 2000]);
        setFilters({ brand: '', subCategoryId: '', priceRange: [0, 2000] });
        if (window.innerWidth < 992 && closeSidebar) closeSidebar();
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div className={`sidebarOverlay ${isOpen ? "show" : ""}`} onClick={closeSidebar}></div>
            
            <div className={`sidebarWrapper ${isOpen ? "open" : ""}`}>
                <div className="sidebar_sticky">
                    <div className="mobileHeader d-lg-none d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold m-0">Filtrer par</h5>
                        <IconButton className="closeBtn" onClick={closeSidebar}><MdClose /></IconButton>
                    </div>

                    <div className="sidebar_inner">
                        {/* Sub-Categories Section */}
                        <div className="filterBox">
                            <h6 className="fw-bold text-uppercase border-bottom pb-2">Sous-Catégories</h6>
                            <div className="scroll">
                                <ul className="p-0 m-0">
                                    {subCategories.map(sub => (
                                        <li key={sub.id}>
                                            <FormControlLabel
                                                className="w-100"
                                                control={
                                                    <Checkbox 
                                                        size="small" 
                                                        color="success"
                                                        checked={selectedSubCatId === sub.id} 
                                                        onChange={() => setSelectedSubCatId(sub.id === selectedSubCatId ? '' : sub.id)} 
                                                    />
                                                }
                                                label={sub.name}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Brands Section */}
                        <div className="filterBox">
                            <h6 className="fw-bold text-uppercase border-bottom pb-2">Marques</h6>
                            <div className="scroll">
                                <ul className="p-0 m-0">
                                    {brands.map(brand => (
                                        <li key={brand}>
                                            <FormControlLabel
                                                className="w-100"
                                                control={
                                                    <Checkbox 
                                                        size="small" 
                                                        color="success"
                                                        checked={selectedBrand === brand} 
                                                        onChange={() => setSelectedBrand(brand === selectedBrand ? '' : brand)} 
                                                    />
                                                }
                                                label={brand}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="filterBox">
                            <h6 className="fw-bold text-uppercase border-bottom pb-2">Prix (TND)</h6>
                            <div className="px-2 mt-4">
                                <Slider 
                                    value={price} 
                                    onChange={(e, newValue) => setPrice(newValue)} 
                                    valueLabelDisplay="on" 
                                    min={0} 
                                    max={2000} 
                                    sx={{ 
                                        color: '#27ae60',
                                        '& .MuiSlider-valueLabel': { backgroundColor: '#27ae60' }
                                    }}
                                />
                                <div className="d-flex justify-content-between mt-2">
                                    <small className="fw-bold">{price[0]} TND</small>
                                    <small className="fw-bold">{price[1]} TND</small>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-grid gap-2 mt-4">
                            <Button 
                                variant="contained" 
                                className="rounded-pill py-2 shadow-none" 
                                style={{ backgroundColor: '#27ae60' }}
                                onClick={handleApply}
                            >
                                Appliquer les filtres
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="inherit" 
                                size="small" 
                                className="rounded-pill"
                                onClick={handleReset}
                            >
                                Réinitialiser
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
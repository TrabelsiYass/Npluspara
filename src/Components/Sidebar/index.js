import { Checkbox, FormControlLabel, IconButton, Slider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { MdClose, MdRestartAlt } from 'react-icons/md';
import { supabase } from '../../Client';
import "./index.css";

const Sidebar = ({ setFilters, closeSidebar, categorySlug, subCategorySlug, isOpen }) => {
    const [brands, setBrands] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [price, setPrice] = useState([0, 2000]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSubCatIds, setSelectedSubCatIds] = useState([]);

    // Fetch initial filter data
    useEffect(() => {
        let active = true;
        const getFilterData = async () => {
            if (!categorySlug) return;

            const { data: subData } = await supabase
                .from('sub_categories')
                .select('id, name, slug, categories!inner(slug)')
                .eq('categories.slug', categorySlug);

            if (subData && active) {
                setSubCategories(subData);
                if (subCategorySlug) {
                    const currentSub = subData.find(s => s.slug === subCategorySlug);
                    if (currentSub) setSelectedSubCatIds([currentSub.id]);
                }
            }

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

    // AUTO-UPDATE: This triggers the live display of products
    useEffect(() => {
        setFilters({
            brand: selectedBrands,
            subCategoryId: selectedSubCatIds,
            priceRange: price
        });
    }, [selectedBrands, selectedSubCatIds, price, setFilters]);

    const handleToggleBrand = (brand) => {
        setSelectedBrands(prev => 
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const handleToggleSubCat = (id) => {
        setSelectedSubCatIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleReset = () => {
        setSelectedBrands([]);
        setSelectedSubCatIds([]);
        setPrice([0, 2000]);
    };

    return (
        <>
            <div className={`sidebarOverlay ${isOpen ? "show" : ""}`} onClick={closeSidebar}></div>
            
            <aside className={`sidebarWrapper ${isOpen ? "open" : ""}`}>
                <div className="sidebarHeader">
                    <Typography variant="h6" className="fw-bold m-0" style={{color: '#1e293b'}}>Filtrer</Typography>
                    <div className="d-flex align-items-center gap-1">
                        <IconButton size="small" onClick={handleReset} title="Reset">
                            <MdRestartAlt size={20} />
                        </IconButton>
                        <IconButton className="d-lg-none" onClick={closeSidebar}>
                            <MdClose />
                        </IconButton>
                    </div>
                </div>

                <div className="sidebar_inner">
                    <div className="filterBox">
                        <Typography className="filterTitle">Sous-Catégories</Typography>
                        <div className="customScroll">
                            {subCategories.map(sub => (
                                <FormControlLabel
                                    key={sub.id}
                                    className="filterItem"
                                    control={
                                        <Checkbox 
                                            size="small" 
                                            color="success"
                                            checked={selectedSubCatIds.includes(sub.id)} 
                                            onChange={() => handleToggleSubCat(sub.id)} 
                                        />
                                    }
                                    label={sub.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="filterBox">
                        <Typography className="filterTitle">Marques</Typography>
                        <div className="customScroll">
                            {brands.map(brand => (
                                <FormControlLabel
                                    key={brand}
                                    className="filterItem"
                                    control={
                                        <Checkbox 
                                            size="small" 
                                            color="success"
                                            checked={selectedBrands.includes(brand)} 
                                            onChange={() => handleToggleBrand(brand)} 
                                        />
                                    }
                                    label={brand}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="filterBox border-0">
                        <Typography className="filterTitle">Prix (TND)</Typography>
                        <div className="px-3 mt-4">
                            <Slider 
                                value={price} 
                                onChange={(e, newValue) => setPrice(newValue)} 
                                valueLabelDisplay="auto" 
                                min={0} 
                                max={2000} 
                                sx={{ 
                                    color: '#629C38',
                                    '& .MuiSlider-thumb': { height: 18, width: 18, backgroundColor: '#fff', border: '2px solid currentColor' }
                                }}
                            />
                            <div className="d-flex justify-content-between mt-2">
                                <span className="priceTag">{price[0]} TND</span>
                                <span className="priceTag">{price[1]} TND</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
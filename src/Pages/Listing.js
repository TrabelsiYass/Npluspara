import {
  CircularProgress,
  FormControl,
  MenuItem,
  Pagination,
  Button,
  useMediaQuery,
  Select
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../Client";
import ProductItem from "../Components/ProductItem";
import Sidebar from "../Components/Sidebar";
import "./Listing.css";
import { MdFilterList } from 'react-icons/md';

const Listing = () => {
  const { categorySlug, subCategorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:992px)');

  const itemsPerPage = 15;

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");

  const [filters, setFilters] = useState({
    brand: [],
    subCategoryId: [],
    priceRange: [0, 2000]
  });

  const categoryBanners = {
    "maman-bebe": "/assets/images/banner1.png",
    "soins-de-visage": "/assets/images/banner2.png",
    "soins-du-corps": "/assets/images/banner3.png",
    "soins-capillaires": "/assets/images/banner4.png",
    "hygiene": "/assets/images/banner5.png",
    "protection-solaire": "/assets/images/banner6.png",
    "micronutrion-phytotherapie": "/assets/images/banner7.png",
    "orthopedie": "/assets/images/banner8.png",
    "materiel-de-diagnostic": "/assets/images/banner9.png",
    "aromatherapie-et-huiles-essentielles": "/assets/images/banner10.png",
    "parfumerie-et-maquillage": "/assets/images/banner11.png",
    "accessoires": "/assets/images/banner12.png",
    "divers": "/assets/images/banner13.png",
    "promotions": "/assets/images/banner14.png",
    "nouveautes": "/assets/images/banner15.png",
    "coffrets": "/assets/images/banner16.png",
    "bons-plans": "/assets/images/banner17.png",
    "default": "/assets/images/banner.png",
    "search": "/assets/images/banner.png" 
  };

  const getBannerStyle = () => {
    let backgroundUrl = categoryBanners.default;

    if (searchQuery) {
      backgroundUrl = categoryBanners.search;
    } else if (categorySlug && categoryBanners[categorySlug]) {
      backgroundUrl = categoryBanners[categorySlug];
    }

    return {
      backgroundImage: ` url(${backgroundUrl})`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center',
      height: isMobile ? '180px' : '260px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '16px',
      color: '#fff',
      marginBottom: '30px',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    };
  };

  const fetchProducts = useCallback(async (signal) => {
    if (!categorySlug && !searchQuery) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .abortSignal(signal);

      // 1. Search vs Category Logic
      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      } else {
        let targetId = null;
        let isSub = false;

        if (subCategorySlug) {
          const { data } = await supabase
            .from("sub_categories")
            .select("id")
            .eq("slug", subCategorySlug)
            .maybeSingle();
          if (data) { targetId = data.id; isSub = true; }
        } else {
          const { data } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", categorySlug)
            .maybeSingle();
          if (data) targetId = data.id;
        }

        if (!targetId) {
          setProducts([]);
          setLoading(false);
          return;
        }

        query = isSub ? query.eq("sous_cat_id", targetId) : query.eq("cat_id", targetId);
      }

      // 2. Filters
      if (filters.subCategoryId.length > 0) {
        query = query.in("sous_cat_id", filters.subCategoryId);
      }
      if (filters.brand.length > 0) {
        query = query.in("brand", filters.brand);
      }
      query = query.gte("new_price", filters.priceRange[0]).lte("new_price", filters.priceRange[1]);

      // 3. Sorting
      if (sort === "price_asc") query = query.order("new_price", { ascending: true });
      else if (sort === "price_desc") query = query.order("new_price", { ascending: false });
      else query = query.order("id", { ascending: false });

      // 4. Pagination
      const { data, count, error } = await query.range(
        (page - 1) * itemsPerPage,
        page * itemsPerPage - 1
      );

      if (error) throw error;
      setProducts(data || []);
      setTotalProducts(count || 0);

    } catch (err) {
      if (err.name !== 'AbortError' && !err.message.includes('aborted')) {
        console.error("Supabase Error:", err.message);
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [categorySlug, subCategorySlug, searchQuery, page, filters, sort]);

  useEffect(() => { setPage(1); }, [filters, sort, categorySlug, subCategorySlug, searchQuery]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);

  return (
    <>
    <section className="listing_page">
      <div className="container">
        
        {/* Dynamic Banner */}
        <div className="category_banner" style={getBannerStyle()}>
          <h2 style={{ 
            fontWeight: '800', 
            fontSize: isMobile ? '1.5rem' : '2.5rem', 
            textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
            textTransform: 'uppercase',
            margin: 0,
            padding: '0 20px'
          }}>
            {searchQuery 
              ? `Résultats pour : "${searchQuery}"` 
              : ""
            }
          </h2>
          {searchQuery && (
             <p style={{ marginTop: '10px', fontWeight: '500' }}>{totalProducts} produits trouvés</p>
          )}
        </div>

        

        <div className="listing_wrapper">
          <Sidebar
            isOpen={isSidebarOpen}
            closeSidebar={() => setIsSidebarOpen(false)}
            setFilters={setFilters}
            categorySlug={categorySlug}
            subCategorySlug={subCategorySlug}
          />

          <div className="content_area">
            <div className="listing_topbar">
              <div className="results_count">
                <strong>{totalProducts}</strong> produits trouvés
              </div>

              <FormControl size="small" style={{ minWidth: '160px' }}>
                <Select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-white"
                >
                  <MenuItem value="newest">Plus récents</MenuItem>
                  <MenuItem value="price_asc">Prix croissant</MenuItem>
                  <MenuItem value="price_desc">Prix décroissant</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="products_grid">
              {loading ? (
                <div className="loader"><CircularProgress color="success" /></div>
              ) : products.length > 0 ? (
                products.map((item) => (
                  /* PASSED tableSource HERE */
                  <ProductItem key={item.id} item={item} tableSource="products" />
                ))
              ) : (
                <div className="no_products">Aucun produit trouvé.</div>
              )}
            </div>

            {totalProducts > itemsPerPage && (
              <div className="pagination_wrapper">
                <Pagination
                  count={Math.ceil(totalProducts / itemsPerPage)}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="success"
                  size="large"
                />
              </div>
            )}
          </div>
        </div>
        
      </div>
    </section>
    {isMobile && (
          <Button 
            variant="contained" 
            
            sx={{
              display: { xs: 'flex', md: 'none' },
              position: 'fixed',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 999999,
              backgroundColor: '#629C38',
              borderRadius: '50px',
              px: 3,
              py: 1.5
            }}
            startIcon={<MdFilterList />}
            onClick={() => setIsSidebarOpen(true)}
          >
            Filtrer
          </Button>
        )}
    </>
  );
};

export default Listing;
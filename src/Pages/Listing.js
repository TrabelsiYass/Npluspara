import {
    CircularProgress,
    FormControl,
    MenuItem,
    Pagination,
    Select
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../Client";
import ProductItem from "../Components/ProductItem";
import Sidebar from "../Components/Sidebar";
import "./Listing.css";

const Listing = () => {
  const { categorySlug, subCategorySlug } = useParams();

  const itemsPerPage = 14;

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");

  const [filters, setFilters] = useState({
    brand: "",
    subCategoryId: "",
    priceRange: [0, 2000]
  });

  const fetchProducts = useCallback(async () => {
    if (!categorySlug) return;
    setLoading(true);

    try {
      let targetId = null;
      let isSub = false;

      if (subCategorySlug) {
        const { data } = await supabase
          .from("sub_categories")
          .select("id")
          .eq("slug", subCategorySlug)
          .maybeSingle();
        if (data) {
          targetId = data.id;
          isSub = true;
        }
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

      let query = supabase.from("products").select("*", { count: "exact" });

      query = isSub
        ? query.eq("sous_cat_id", targetId)
        : query.eq("cat_id", targetId);

      if (filters.subCategoryId) {
        query = query.eq("sous_cat_id", filters.subCategoryId);
      }

      if (filters.brand) {
        query = query.eq("brand", filters.brand);
      }

      query = query
        .gte("new_price", filters.priceRange[0])
        .lte("new_price", filters.priceRange[1]);

      // 🔥 SORTING
      if (sort === "price_asc") {
        query = query.order("new_price", { ascending: true });
      } else if (sort === "price_desc") {
        query = query.order("new_price", { ascending: false });
      } else {
        query = query.order("id", { ascending: false });
      }

      const { data, count, error } = await query.range(
        (page - 1) * itemsPerPage,
        page * itemsPerPage - 1
      );

      if (error) throw error;

      setProducts(data || []);
      setTotalProducts(count || 0);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, subCategorySlug, page, filters, sort]);

  useEffect(() => {
    setPage(1);
  }, [filters, sort, categorySlug, subCategorySlug]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <section className="listing_page">
      <div className="container">
        <div className="listing_wrapper">

          <Sidebar
            setFilters={setFilters}
            categorySlug={categorySlug}
            subCategorySlug={subCategorySlug}
          />

          <div className="content_area">

            {/* Top Bar */}
            <div className="listing_topbar">
              <div className="results_count">
                {totalProducts} produits trouvés
              </div>

              <FormControl size="small">
                <Select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <MenuItem value="newest">Plus récents</MenuItem>
                  <MenuItem value="price_asc">Prix croissant</MenuItem>
                  <MenuItem value="price_desc">Prix décroissant</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Products */}
            <div className="products_grid">
              {loading ? (
                <div className="loader">
                  <CircularProgress color="success" />
                </div>
              ) : products.length > 0 ? (
                products.map((item) => (
                  <ProductItem key={item.id} item={item} />
                ))
              ) : (
                <div className="no_products">
                  Aucun produit trouvé
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalProducts > itemsPerPage && (
              <div className="pagination_wrapper">
                <Pagination
                  count={Math.ceil(totalProducts / itemsPerPage)}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="success"
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default Listing;
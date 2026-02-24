import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../Client";
import "./index.css";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState(null); 
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchNavData = async () => {
      const { data } = await supabase
        .from('categories')
        .select('id, name, slug, sub_categories(id, name, slug)');
      if (data) setCategories(data);
    };
    fetchNavData();
  }, []);

  // On sépare la redirection de l'affichage du menu mobile
  const handleToggleCategory = (e, name) => {
    if (window.innerWidth < 768) {
      // On n'arrête pas la propagation pour que le Link fonctionne
      setActive(active === name ? null : name);
    }
  };

  const closeMenu = () => {
    setMobileOpen(false);
    setActive(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className={`navbar-menu ${mobileOpen ? "open" : ""}`}>
          {categories.map((cat) => {
            const hasSubCats = cat.sub_categories?.length > 0;
            const catPath = cat.slug || cat.id;

            return (
              <div
                key={cat.id}
                className={`nav-item ${active === cat.name ? "active" : ""}`}
              >
                <div className="nav-link d-flex align-items-center">
                  {/* Maintenant, TOUTES les catégories sont des Links */}
                  <Link 
                    to={`/category/${catPath}`} 
                    onClick={closeMenu}
                    className="category-main-link"
                  >
                    {cat.name}
                  </Link>
                  
                  {/* Le chevron sert de déclencheur pour le sous-menu sur mobile */}
                  {hasSubCats && (
                    <ChevronDown 
                      size={18} 
                      className="arrow" 
                      onClick={(e) => {
                        e.preventDefault(); // Empêche la redirection si on clique JUSTE sur la flèche
                        handleToggleCategory(e, cat.name);
                      }} 
                    />
                  )}
                </div>

                {hasSubCats && (
                  <div className={`dropdown ${active === cat.name ? "show" : ""}`}>
                    {cat.sub_categories.map((sub) => {
                      const subPath = sub.slug || sub.id;
                      return (
                        <Link 
                          key={sub.id} 
                          to={`/category/${catPath}/${subPath}`}
                          onClick={closeMenu}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
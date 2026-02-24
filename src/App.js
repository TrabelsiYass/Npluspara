import "bootstrap/dist/css/bootstrap.min.css";
import { lazy, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import './App.css';
import { supabase } from './Client'; // Import du client Supabase

// Components & Pages
import Footer from "./Components/Footer/index";
import Header from "./Components/Header/index";
import ProtectedRoute from './Components/ProtectedRoot';
import AdminBlog from './Pages/Admin/AdminBlog';
import AdminCategories from "./Pages/Admin/AdminCategories";
import AdminFlashVente from "./Pages/Admin/AdminFlashVente";
import AdminLayout from "./Pages/Admin/AdminLayout";
import AdminProducts from "./Pages/Admin/AdminProducts";
import AdminStats from './Pages/Admin/AdminStats';
import AdminSubCategories from "./Pages/Admin/AdminSubCategories";
import Contact from "./Pages/Contact";
import Home from "./Pages/Home";
import Listing from "./Pages/Listing";
import Login from "./Pages/Login";
import LoginAdmin from './Pages/LoginAdmin';
import { MyProvider } from "./Pages/MyContext";
import ProductDetails from "./Pages/ProductDetails";
import Profile from './Pages/Profile';
import ScrollToTop from "./Pages/Scroll";
import WhoWeAre from "./Pages/WhoWeAre";



// Lazy loading pour le blog
const BlogPage = lazy(() => import('./Pages/BlogPage'));
const BlogPostDetail = lazy(() => import('./Pages/BlogPostDetail'));

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // Vérification initiale
  const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      setSession(null);
    } else {
      setSession(session);
    }
    setLoading(false);
  };

  checkSession();

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
    setLoading(false);
  });

  return () => subscription.unsubscribe();
}, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <MyProvider>
        <Routes>
          {/* --- ROUTES PUBLIQUES (Storefront) --- */}
          {/* On passe la session au Header pour afficher dynamiquement "Connexion" ou "Profil" */}
          <Route element={<><Header session={session} /><Outlet /><Footer /></>}>
            <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
            <Route path="/profile" element={session ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/" element={<Home />} />
            <Route path="/category/:categorySlug" element={<Listing />} />
            <Route path="/category/:categorySlug/:subCategorySlug" element={<Listing />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* Rediriger vers l'accueil si déjà connecté, sinon afficher Login */}
            
            
            <Route path="/whoweare" element={<WhoWeAre />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostDetail />} />
          </Route>

          {/* --- ROUTE LOGIN ADMIN (Hors Layout) --- */}
          <Route path="/admin-login" element={<LoginAdmin />} />

          {/* --- ROUTES ADMIN SÉCURISÉES --- */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminStats />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="sub-categories" element={<AdminSubCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="extra" element={<AdminFlashVente />} />
            <Route path="blog" element={<AdminBlog />} />
          </Route>

        </Routes>
      </MyProvider>
    </BrowserRouter>
  );
}

export default App;
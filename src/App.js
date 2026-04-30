import "bootstrap/dist/css/bootstrap.min.css";
import { lazy, useEffect, useState, Suspense } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import './App.css';
import { supabase } from './Client';

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
import { CircularProgress } from "@mui/material";
import ResetPassword from "./Pages/ResetPassword";
import Paiement from "./Pages/Paiement";
import Commandes from "./Pages/Admin/Commandes";
// App.js - Add this near your other imports
import FancyPreloader from './Components/FancyPreloader/index';

const BlogPage = lazy(() => import('./Pages/BlogPage'));
const BlogPostDetail = lazy(() => import('./Pages/BlogPostDetail'));

function App() {
  // Use 'undefined' to represent the "Checking..." state
  const [session, setSession] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Check: Get session from storage/cookies immediately
    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setLoading(false);
    };

    initializeAuth();

    // 2. Real-time Listener: Updates when user logs in or out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * IMPORTANT: This guard prevents the app from showing an "empty" 
   * logged-out state while Supabase is still thinking.
   */
  if (loading || session === undefined) {
    return <FancyPreloader />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <MyProvider>
        <Suspense fallback={
          <div className="d-flex justify-content-center align-items-center p-5">
            <CircularProgress color="success" />
          </div>
        }>
          <Routes>
            {/* Main Layout */}
            <Route element={<><Header session={session} /><Outlet /><Footer /></>}>
              <Route path="/" element={<Home />} />
              
              {/* AUTH LOGIC: Redirects users based on session state */}
              <Route 
                path="/login" 
                element={!session ? <Login /> : <Navigate to="/" replace />} 
              />
              
              <Route 
                path="/profile" 
                element={session ? <Profile /> : <Navigate to="/login" replace />} 
              />
              
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/products" element={<Listing />} />
              <Route path="/category/:categorySlug" element={<Listing />} />
              <Route path="/category/:categorySlug/:subCategorySlug" element={<Listing />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/paiement" element={<Paiement />} />
              <Route path="/whoweare" element={<WhoWeAre />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostDetail />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin-login" element={<LoginAdmin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminStats />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="sub-categories" element={<AdminSubCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="extra" element={<AdminFlashVente />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="commandes" element={<Commandes />} />
            </Route>

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </MyProvider>
    </BrowserRouter>
  );
}

export default App;
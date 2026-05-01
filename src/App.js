import "bootstrap/dist/css/bootstrap.min.css";
import { lazy, useEffect, useState, Suspense } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import './App.css';
import { supabase } from './Client';

// Core Components (Imported normally for immediate display)
import Footer from "./Components/Footer/index";
import Header from "./Components/Header/index";
import FancyPreloader from './Components/FancyPreloader/index';
import Home from "./Pages/Home";
import { MyProvider } from "./Pages/MyContext";
import ScrollToTop from "./Pages/Scroll";
import { CircularProgress } from "@mui/material";

// --- LAZY LOADED PAGES ---
const Listing = lazy(() => import("./Pages/Listing"));
const ProductDetails = lazy(() => import("./Pages/ProductDetails"));
const Login = lazy(() => import("./Pages/Login"));
const Profile = lazy(() => import('./Pages/Profile'));
const WhoWeAre = lazy(() => import("./Pages/WhoWeAre"));
const Contact = lazy(() => import("./Pages/Contact"));
const BlogPage = lazy(() => import('./Pages/BlogPage'));
const BlogPostDetail = lazy(() => import('./Pages/BlogPostDetail'));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));
const Paiement = lazy(() => import("./Pages/Paiement"));

// Admin Pages
const ProtectedRoute = lazy(() => import('./Components/ProtectedRoot'));
const LoginAdmin = lazy(() => import('./Pages/LoginAdmin'));
const AdminLayout = lazy(() => import("./Pages/Admin/AdminLayout"));
const AdminStats = lazy(() => import('./Pages/Admin/AdminStats'));
const AdminProducts = lazy(() => import("./Pages/Admin/AdminProducts"));
const AdminCategories = lazy(() => import("./Pages/Admin/AdminCategories"));
const AdminSubCategories = lazy(() => import("./Pages/Admin/AdminSubCategories"));
const AdminFlashVente = lazy(() => import("./Pages/Admin/AdminFlashVente"));
const AdminBlog = lazy(() => import('./Pages/Admin/AdminBlog'));
const Commandes = lazy(() => import("./Pages/Admin/Commandes"));

function App() {
  const [session, setSession] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 1. Get current session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);

        // 2. MANUALLY STAY LONGER:
        // Increased to 3500ms (3.5 seconds) to ensure a premium feel 
        // and allow the background MyProvider data to fetch.
        setTimeout(() => {
          setLoading(false);
        }, 7000); 

      } catch (error) {
        console.error("Initialization error:", error);
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Global Guard: The app only proceeds once 'loading' is false
  if (loading || session === undefined) {
    return <FancyPreloader />;
  }

  return (
    <BrowserRouter>
      {/* This class handles the fade-in transition from the preloader */}
      <div className="app-fade-in">
        <ScrollToTop />
        <MyProvider>
          <Suspense fallback={
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
              <CircularProgress color="success" thickness={4} size={50} />
            </div>
          }>
            <Routes>
              {/* Main Client Layout */}
              <Route element={
                <>
                  <Header session={session} />
                  <main style={{ minHeight: '80vh' }}>
                    <Outlet />
                  </main>
                  <Footer />
                </>
              }>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={!session ? <Login /> : <Navigate to="/" replace />} />
                <Route path="/profile" element={session ? <Profile /> : <Navigate to="/login" replace />} />
                <Route path="/products" element={<Listing />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/category/:categorySlug" element={<Listing />} />
                <Route path="/category/:categorySlug/:subCategorySlug" element={<Listing />} />
                <Route path="/paiement" element={<Paiement />} />
                <Route path="/whoweare" element={<WhoWeAre />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogPostDetail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              {/* Admin Panel Routes */}
              <Route path="/admin-login" element={<LoginAdmin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminStats />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="sub-categories" element={<AdminSubCategories />} />
                <Route path="extra" element={<AdminFlashVente />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="commandes" element={<Commandes />} />
              </Route>

              {/* Fallback for unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </MyProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Car, Category, DealershipSettings, GuideArticle, Testimonial } from './types';
import { storage } from './services/storage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CookieConsent } from './components/CookieConsent';

import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';
import { CarDetailPage } from './pages/CarDetailPage';
import { SellYourCarPage } from './pages/SellYourCarPage';
import { RequestACarPage } from './pages/RequestACarPage';
import { GuidesPage } from './pages/GuidesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { SavedCarsPage } from './pages/SavedCarsPage';
import { LegalPage } from './pages/LegalPage';
import { SitemapViewPage } from './pages/SitemapViewPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { AdminLogin } from './admin/AdminLogin';
import { AdminPortal } from './admin/AdminPortal';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'ZiG'>('USD');

  // Core Data
  const [cars, setCars] = useState<Car[]>(storage.getCars());
  const [categories, setCategories] = useState<Category[]>(storage.getCategories());
  const [posts, setPosts] = useState<GuideArticle[]>(storage.getPosts());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(storage.getTestimonials());
  const [settings, setSettings] = useState<DealershipSettings>(storage.getSettings());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(storage.isAdminLoggedIn());

  // Listen for storage events across tabs or local updates
  useEffect(() => {
    const handleCarsUpdate = () => setCars(storage.getCars());
    const handleCategoriesUpdate = () => setCategories(storage.getCategories());
    const handlePostsUpdate = () => setPosts(storage.getPosts());
    const handleSettingsUpdate = () => setSettings(storage.getSettings());
    const handleAuthChange = () => setIsAdminLoggedIn(storage.isAdminLoggedIn());

    window.addEventListener('mrd_cars_updated', handleCarsUpdate);
    window.addEventListener('mrd_categories_updated', handleCategoriesUpdate);
    window.addEventListener('mrd_posts_updated', handlePostsUpdate);
    window.addEventListener('mrd_settings_updated', handleSettingsUpdate);
    window.addEventListener('mrd_admin_auth_changed', handleAuthChange);

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('mrd_cars_updated', handleCarsUpdate);
      window.removeEventListener('mrd_categories_updated', handleCategoriesUpdate);
      window.removeEventListener('mrd_posts_updated', handlePostsUpdate);
      window.removeEventListener('mrd_settings_updated', handleSettingsUpdate);
      window.removeEventListener('mrd_admin_auth_changed', handleAuthChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCar = (car: Car) => {
    navigate(`/cars/${car.slug}`);
  };

  const toggleCurrency = () => {
    setCurrencyMode((prev) => (prev === 'USD' ? 'ZiG' : 'USD'));
  };

  // Route Parsing
  const renderRoute = () => {
    // 1. Admin Portal Route
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      if (!isAdminLoggedIn) {
        return (
          <AdminLogin
            onSuccess={() => setIsAdminLoggedIn(true)}
            onBackToSite={() => navigate('/')}
          />
        );
      }
      return (
        <AdminPortal
          onLogout={() => {
            setIsAdminLoggedIn(false);
            navigate('/');
          }}
          onNavigateSite={() => navigate('/')}
        />
      );
    }

    // 2. Sitemap and Robots
    if (currentPath === '/sitemap.xml') {
      return (
        <SitemapViewPage
          type="sitemap"
          cars={cars}
          categories={categories}
          posts={posts}
          onNavigate={navigate}
        />
      );
    }
    if (currentPath === '/robots.txt') {
      return (
        <SitemapViewPage
          type="robots"
          cars={cars}
          categories={categories}
          posts={posts}
          onNavigate={navigate}
        />
      );
    }

    // 3. Home Route
    if (currentPath === '/' || currentPath === '') {
      return (
        <HomePage
          cars={cars}
          categories={categories}
          testimonials={testimonials}
          settings={settings}
          currencyMode={currencyMode}
          onNavigate={navigate}
          onSelectCar={handleSelectCar}
        />
      );
    }

    // 4. Inventory Base & Category Routes
    if (currentPath === '/inventory') {
      return (
        <InventoryPage
          cars={cars}
          categories={categories}
          settings={settings}
          currencyMode={currencyMode}
          onNavigate={navigate}
          onSelectCar={handleSelectCar}
        />
      );
    }

    if (currentPath.startsWith('/inventory/')) {
      const categorySlug = currentPath.replace('/inventory/', '').split('?')[0];
      return (
        <InventoryPage
          cars={cars}
          categories={categories}
          settings={settings}
          currencyMode={currencyMode}
          onNavigate={navigate}
          onSelectCar={handleSelectCar}
          initialCategorySlug={categorySlug}
        />
      );
    }

    // 5. Brand Route (/brands/:makeSlug)
    if (currentPath.startsWith('/brands/')) {
      const makeSlug = currentPath.replace('/brands/', '').split('?')[0];
      return (
        <InventoryPage
          cars={cars}
          categories={categories}
          settings={settings}
          currencyMode={currencyMode}
          onNavigate={navigate}
          onSelectCar={handleSelectCar}
          initialMakeSlug={makeSlug}
        />
      );
    }

    // 6. Car Detail Route (/cars/:slug)
    if (currentPath.startsWith('/cars/')) {
      const slug = currentPath.replace('/cars/', '').split('?')[0];
      const matchedCar = storage.getCarBySlug(slug);
      if (matchedCar) {
        return (
          <CarDetailPage
            car={matchedCar}
            allCars={cars}
            categories={categories}
            settings={settings}
            currencyMode={currencyMode}
            onNavigate={navigate}
            onSelectCar={handleSelectCar}
          />
        );
      }
      return (
        <NotFoundPage
          cars={cars}
          settings={settings}
          currencyMode={currencyMode}
          onNavigate={navigate}
          onSelectCar={handleSelectCar}
        />
      );
    }

    // 7. Sell / Trade-in Route
    if (currentPath === '/sell-your-car') {
      return <SellYourCarPage settings={settings} onNavigate={navigate} />;
    }

    // 8. Request a Car Route
    if (currentPath === '/request-a-car') {
      return <RequestACarPage settings={settings} onNavigate={navigate} />;
    }

    // 9. Guides Hub and Individual Article
    if (currentPath === '/guides') {
      return <GuidesPage articles={posts} settings={settings} onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/guides/')) {
      const slug = currentPath.replace('/guides/', '').split('?')[0];
      return (
        <GuidesPage
          articles={posts}
          selectedSlug={slug}
          settings={settings}
          onNavigate={navigate}
        />
      );
    }

    // 10. About & Contact
    if (currentPath === '/about') {
      return <AboutPage settings={settings} onNavigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage settings={settings} onNavigate={navigate} />;
    }

    // 11. Saved Wishlist
    if (currentPath === '/saved') {
      return (
        <SavedCarsPage
          allCars={cars}
          settings={settings}
          currencyMode={currencyMode}
          onNavigate={navigate}
          onSelectCar={handleSelectCar}
        />
      );
    }

    // 12. Privacy and Terms
    if (currentPath === '/privacy') {
      return <LegalPage type="privacy" settings={settings} onNavigate={navigate} />;
    }
    if (currentPath === '/terms') {
      return <LegalPage type="terms" settings={settings} onNavigate={navigate} />;
    }

    // 13. Default 404
    return (
      <NotFoundPage
        cars={cars}
        settings={settings}
        currencyMode={currencyMode}
        onNavigate={navigate}
        onSelectCar={handleSelectCar}
      />
    );
  };

  const isAdminView = currentPath === '/admin' || currentPath.startsWith('/admin/');

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Global Header (Excluded on Admin view for distraction-free backend) */}
      {!isAdminView && (
        <Header
          currentPath={currentPath}
          onNavigate={navigate}
          settings={settings}
          currencyMode={currencyMode}
          onToggleCurrency={toggleCurrency}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1">{renderRoute()}</main>

      {/* Global Footer & Floaters (Excluded on Admin view) */}
      {!isAdminView && (
        <>
          <Footer
            settings={settings}
            categories={categories}
            onNavigate={navigate}
          />
          <FloatingWhatsApp settings={settings} />
          <CookieConsent />
        </>
      )}
    </div>
  );
}

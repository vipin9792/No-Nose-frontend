import { memo, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
const Home = lazy(() => import('./component/Home'));
const About = lazy(() => import('./component/About'));

const Contact = lazy(() => import('./component/Contact'));
import Header from './component/Header';
import Footer from './component/Footer';
const StoryPage = lazy(() => import('./component/StoryPage'));
const CategoryPage = lazy(() => import('./component/CategoryPage'));
const Dashboard2 = lazy(() => import('./component/Dashboard2'));

const AppContent = () => {
  const location = useLocation();

  // Routes jahan header/footer hide karna hai
  const hideHeaderFooterRoutes = ['/Dashboard2'];

  // check kare current path me header/footer dikhana hai ya nahi
  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}

      <Suspense fallback={null}>
        <Routes>
        
          <Route path="/Dashboard2" element={<Dashboard2 />} />
          
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/storypage" element={<StoryPage />} />
          <Route path="/categorypage" element={<CategoryPage />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>

      {!shouldHideHeaderFooter && <Footer />}
      
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default memo(App);
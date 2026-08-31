import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Overview from '@/components/Overview';
import About from '@/components/About';
import Services from '@/components/Services';
import Statistics from '@/components/Statistics';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import LoginPage from '@/components/LoginPage';
import AdminDashboard from '@/components/admin/AdminDashboard';

type Route = 'home' | 'login' | 'admin';

export default function App() {
  const [route, setRoute] = useState<Route>('home');

  useEffect(() => {
    if (route === 'login' || route === 'admin') {
      window.scrollTo({ top: 0 });
    }
  }, [route]);

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {route === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Navbar onLogin={() => setRoute('login')} />
            <main>
              <Hero />
              <Overview />
              <About />
              <Services />
              <Statistics />
              <Contact />
            </main>
            <Footer />
          </motion.div>
        )}

        {route === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoginPage
              onBack={() => setRoute('home')}
              onLogin={() => setRoute('admin')}
            />
          </motion.div>
        )}

        {route === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminDashboard onLogout={() => setRoute('login')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
